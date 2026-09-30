// একমাত্র HTTP স্তর — কম্পোনেন্ট/পেজে সরাসরি fetch নিষেধ, সবাই এটা দিয়ে যাবে।
// ব্যবহার: frontend/src/lib/api.ts হিসেবে কপি করো।
// base URL কোডে না — env-এ: NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const REQUEST_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
};

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

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const token: string | null = getToken();
  try {
    const res: Response = await fetch(API_BASE_URL + path, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(token !== null ? { Authorization: "Bearer " + token } : {}),
        ...(init?.body !== undefined && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(init?.headers ?? {}),
      },
    });
    const data: unknown = await parseBody(res);
    if (!res.ok) {
      const payload: ErrorPayload =
        typeof data === "object" && data !== null ? (data as ErrorPayload) : {};
      throw new ApiError(payload.message ?? "Request failed: " + res.status, res.status, data);
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === "AbortError")
      throw new ApiError("Request timeout", 408);
    throw new ApiError(err instanceof Error ? err.message : "Network error", 0);
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
  get: <T>(path: string): Promise<T> => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "POST", body: withBody(body) }),
  patch: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "PATCH", body: withBody(body) }),
  put: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: "PUT", body: withBody(body) }),
  del: <T>(path: string): Promise<T> => request<T>(path, { method: "DELETE" }),
};
