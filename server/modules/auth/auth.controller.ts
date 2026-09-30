import { fail, ok, withReqId, AppError, BadRequest } from "@/server/lib/response";
import { ZodError } from "zod";
import { loginSchema, refreshSchema } from "./auth.schemas";
import { loginService, logoutService, refreshService } from "./auth.service";
import { verifyToken } from "@/server/lib/jwt";
import { clearAuthCookies, getCookieValue, setAuthCookies, ACCESS_COOKIE, REFRESH_COOKIE } from "@/server/lib/auth-cookies";

// চিকন নিয়ন্ত্রক — বৈধতা + সেবা + envelope। টোকেন httpOnly কুকিতে, দেহে শুধু {user}।
export async function loginController(body: unknown, res: Response): Promise<Response> {
  const reqId = withReqId();
  try {
    const input = loginSchema.parse(body);
    const result = await loginService(input);
    const res = ok({ user: result.user }, "Login successful");
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res;
  } catch (err) {
    if (err instanceof ZodError) return fail(BadRequest("Invalid request"), reqId);
    return fail(err, reqId);
  }
}

export async function refreshController(body: unknown, req: Request, res: Response): Promise<Response> {
  const reqId = withReqId();
  try {
    // কুকি-প্রথম, দেহ-ফলব্যাক (পুরনো ক্লায়েন্ট-সামঞ্জস্য)।
    const fromCookie: string | null = getCookieValue(req, REFRESH_COOKIE);
    const fromBody: string | null =
      typeof body === "object" && body !== null && "refreshToken" in body
        ? (() => {
            const parsed = refreshSchema.safeParse(body);
            return parsed.success ? parsed.data.refreshToken : null;
          })()
        : null;
    const token: string | null = fromCookie ?? fromBody;
    if (token === null || token === "") throw new AppError("UNAUTHORIZED", 401, "Invalid token");
    const result = await refreshService(token);
    const res = ok({ user: result.user }, "Token refreshed");
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res;
  } catch (err) {
    if (err instanceof ZodError) return fail(BadRequest("Invalid request"), reqId);
    return fail(err, reqId);
  }
}

// কুকি-প্রথম (meghdut_at) + Bearer-ফলব্যাক। claims.kind==="access" বাধ্যতামূলক।
export async function logoutController(authHeader: string | null, req: Request, res: Response): Promise<Response> {
  const reqId = withReqId();
  try {
    const fromCookie: string | null = getCookieValue(req, "meghdut_admin_access");
    const fromBearer: string | null =
      authHeader !== null && authHeader.startsWith("Bearer ")
        ? (() => {
            const t = authHeader.slice("Bearer ".length).trim();
            return t === "" ? null : t;
          })()
        : null;
    const token: string | null = fromCookie ?? fromBearer;
    if (token === null) throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
    let claims;
    try {
      claims = await verifyToken(token);
    } catch {
      throw new AppError("UNAUTHORIZED", 401, "Invalid token");
    }
    if (claims.kind !== "access") throw new AppError("UNAUTHORIZED", 401, "Invalid token");
    await logoutService(claims.sub);
    const res = ok({ loggedOut: true }, "Logged out");
    clearAuthCookies(res);
    return res;
  } catch (err) {
    return fail(err, reqId);
  }
}
