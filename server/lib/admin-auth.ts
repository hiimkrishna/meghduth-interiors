import { findAdminById } from "@/server/modules/auth/auth.repository";
import { AppError } from "@/server/lib/response";
import { verifyToken } from "@/server/lib/jwt";
import { ACCESS_COOKIE, getBearerToken, getCookieValue } from "@/server/lib/auth-cookies";

// প্রশাসক পরিচয় — টোকেন থেকে যাচাই করা নিরাপদ আকার।
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// কুকি-প্রথম (meghdut_at) + Bearer-ফলব্যাক (স্ক্রিপ্ট-সামঞ্জস্য)।
// টোকেন ছাড়া/ভুল → 401, স্থগিত/version-অমিল → 403, DB null → 503 (repo থেকে)।
export async function requireAdmin(req: Request): Promise<AdminUser> {
  const fromCookie: string | null = getCookieValue(req, ACCESS_COOKIE);
  const token: string | null = fromCookie ?? getBearerToken(req);
  if (token === null) {
    throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  }
  let claims;
  try {
    claims = await verifyToken(token);
  } catch {
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  if (claims.kind !== "access") {
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  const admin = await findAdminById(claims.sub);
  if (admin === null) {
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  if (admin.suspended) {
    throw new AppError("FORBIDDEN", 403, "Account suspended");
  }
  if (admin.tokenVersion !== claims.tokenVersion) {
    throw new AppError("FORBIDDEN", 403, "Token has been revoked");
  }
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}
