// একমাত্র HTTP স্তর — কম্পোনেন্ট বা পেজে সরাসরি fetch নিষেধ। সবাই এটা দিয়ে যাবে।
// ভিত্তি ঠিকানা কোডে নয় — পরিবেশে: NEXT_PUBLIC_API_URL=https://example.com/api/v1
// প্রমাণ httpOnly কুকিতে যায় (credentials:"include"), Authorization-হেডার নেই।
import type { PageMeta } from "@/packages/contracts/src/pagination";
import type { ErrorEnvelope } from "@/packages/contracts/src/envelope";
import {
  clearAdminEmail,
  getStoredAdminEmail,
} from "./auth-store";

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
const REQUEST_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  status: number;
  code?: string;
  data: unknown;
  constructor(message: string, status: number, data?: unknown, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

interface Envelope<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PageMeta;
}

const parseBody = async (res: Response): Promise<unknown> => {
  const text: string = await res.text();
  if (text === "") return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
};

interface ErrorPayload {
  message?: string;
  code?: string;
}

// নীরব নবায়ন — একসাথে অনেক 401 এলে একটাই refresh কল (single-flight)।
// কুকি-ভিত্তিক: দেহে টোকেন পাঠাই না, সার্ভার meghdut_rt কুকি থেকে ঘোরায়।
let refreshInFlight: Promise<boolean> | null = null;

const NO_REFRESH_PREFIXES = ["/auth/login", "/auth/refresh"];

const shouldAttemptRefresh = (path: string): boolean =>
  typeof window !== "undefined" &&
  !NO_REFRESH_PREFIXES.some((p) => path === p || path.startsWith(p + "?") || path.startsWith(p + "/")) &&
  getStoredAdminEmail() !== null;

async function tryRefresh(): Promise<boolean> {
  if (refreshInFlight !== null) return refreshInFlight;
  refreshInFlight = (async (): Promise<boolean> => {
    try {
      const res = await fetch(API_BASE_URL + "/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok || typeof data !== "object" || data === null) return false;
      const envelope = data as { success?: boolean; data?: { user?: { email?: string } } };
      return envelope.success === true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

const request = async <T>(path: string, init?: RequestInit, retried = false): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res: Response = await fetch(API_BASE_URL + path, {
      ...init,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.body !== undefined && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(init?.headers ?? {}),
      },
    });
    const data: unknown = await parseBody(res);
    if (!res.ok) {
      // মেয়াদোত্তীর্ণ access → একবার নীরবে নবায়ন করে আবার চেষ্টা করো।
      if (res.status === 401 && !retried && shouldAttemptRefresh(path)) {
        const refreshed = await tryRefresh();
        if (refreshed) return request<T>(path, init, true);
        clearAdminEmail();
      }
      const payload: ErrorPayload =
        typeof data === "object" && data !== null
          ? (data as ErrorPayload)
          : {};
      const envelope = data as Partial<ErrorEnvelope>;
      throw new ApiError(
        payload.message ?? "অনুরোধ ব্যর্থ হয়েছে: " + res.status,
        res.status,
        data,
        envelope.code,
      );
    }
    const envelope = data as Envelope<T>;
    if (
      typeof envelope === "object" &&
      envelope !== null &&
      "success" in envelope &&
      "data" in envelope
    ) {
      return envelope.data as T;
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === "AbortError")
      throw new ApiError("সময় শেষ হয়েছে", 408);
    throw new ApiError(err instanceof Error ? err.message : "নেটওয়ার্ক ত্রুটি", 0);
  } finally {
    clearTimeout(timer);
  }
};

const withBody = (body: unknown): string | FormData | undefined => {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
};

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> => {
    const qs = query
      ? "?" +
        Object.entries(query)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(String(v)))
          .join("&")
      : "";
    return request<T>(path + qs, { method: "GET" });
  },
  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "POST", body: withBody(body) }),
  patch: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "PATCH", body: withBody(body) }),
  put: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "PUT", body: withBody(body) }),
  del: <T>(path: string): Promise<T> => request<T>(path, { method: "DELETE" }),
};
