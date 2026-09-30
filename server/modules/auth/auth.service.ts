import type { LoginInput } from "./auth.schemas";
import { findAdminByEmail, findAdminById, incrementTokenVersion, rotateTokenVersion } from "./auth.repository";
import { verifyPassword } from "@/server/lib/password";
import { signAccessToken, signRefreshToken, verifyToken } from "@/server/lib/jwt";
import { AppError } from "@/server/lib/response";
import type { AuthResult, TokenPair } from "./auth.types";

// লগইন — স্থগিত 403, ভুল তথ্য 401।
export async function loginService(input: LoginInput): Promise<AuthResult> {
  const admin = await findAdminByEmail(input.email);
  if (admin === null) throw new AppError("UNAUTHORIZED", 401, "Incorrect email or password");
  if (admin.suspended) throw new AppError("FORBIDDEN", 403, "Account suspended");
  const valid = await verifyPassword(input.password, admin.passwordHash);
  if (!valid) throw new AppError("UNAUTHORIZED", 401, "Incorrect email or password");
  const claims = { sub: admin.id, email: admin.email, role: admin.role, tokenVersion: admin.tokenVersion };
  const accessToken = await signAccessToken(claims);
  const refreshToken = await signRefreshToken(claims);
  return { accessToken, refreshToken, user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } };
}

// নবায়ন — সংস্করণ মিললে পারমাণবিক ঘূর্ণন (পুরনো জোড়া বাতিল)।
// অমিল হলে পরিবার-বাতিল: version+1 বাড়িয়ে 401 (চুরি-যাওয়া রিফ্রেশ অকেজো)।
export async function refreshService(refreshToken: string): Promise<AuthResult> {
  let claims;
  try {
    claims = await verifyToken(refreshToken);
  } catch {
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  if (claims.kind !== "refresh") throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  const admin = await findAdminById(claims.sub);
  if (admin === null) throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  if (admin.suspended) throw new AppError("FORBIDDEN", 403, "Account suspended");
  if (admin.tokenVersion !== claims.tokenVersion) {
    await incrementTokenVersion(admin.id);
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  const next = await rotateTokenVersion(admin.id, claims.tokenVersion);
  if (next === null) {
    await incrementTokenVersion(admin.id);
    throw new AppError("UNAUTHORIZED", 401, "Invalid token");
  }
  const nextClaims = { sub: admin.id, email: admin.email, role: admin.role, tokenVersion: next };
  const accessToken = await signAccessToken(nextClaims);
  const newRefreshToken = await signRefreshToken(nextClaims);
  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}

// প্রস্থান — সংস্করণ বাড়িয়ে সব টোকেন বাতিল।
export async function logoutService(userId: string): Promise<TokenPair | null> {
  await incrementTokenVersion(userId);
  return null;
}
