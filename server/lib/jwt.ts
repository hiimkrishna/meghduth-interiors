import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const ISSUER = "meghdut";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

// গোপন কী — অলস পড়া (বিল্ডে ক্র্যাশ নয়)।
function getSecret(): Uint8Array {
  const secret: string = process.env.JWT_SECRET ?? "";
  if (secret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters long");
  return new TextEncoder().encode(secret);
}

export type TokenKind = "access" | "refresh";

export interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
  kind: TokenKind;
}

interface VerifyResult extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  tokenVersion?: number;
  kind?: TokenKind;
}

async function signToken(claims: TokenClaims, ttl: string): Promise<string> {
  return new SignJWT({ email: claims.email, role: claims.role, tokenVersion: claims.tokenVersion, kind: claims.kind })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getSecret());
}

// স্বল্পমেয়াদি প্রবেশ টোকেন (১৫ মিনিট)।
export async function signAccessToken(claims: Omit<TokenClaims, "kind">): Promise<string> {
  return signToken({ ...claims, kind: "access" }, ACCESS_TTL);
}

// দীর্ঘমেয়াদি নবায়ন টোকেন (৭ দিন)।
export async function signRefreshToken(claims: Omit<TokenClaims, "kind">): Promise<string> {
  return signToken({ ...claims, kind: "refresh" }, REFRESH_TTL);
}

// যাচাই — মেয়াদ/ইস্যুয়ার/স্বাক্ষর jose দেখে।
export async function verifyToken(token: string): Promise<TokenClaims> {
  const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
  const p = payload as VerifyResult;
  if (typeof p.sub !== "string" || p.sub === "") throw new Error("Invalid token");
  if (p.kind !== "access" && p.kind !== "refresh") throw new Error("Invalid token");
  if (typeof p.email !== "string" || typeof p.role !== "string") throw new Error("Invalid token");
  if (typeof p.tokenVersion !== "number") throw new Error("Invalid token");
  return { sub: p.sub, email: p.email, role: p.role, tokenVersion: p.tokenVersion, kind: p.kind };
}
