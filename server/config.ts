// পরিবেশ যাচাই — সার্ভার বুটের আগেই ভুল পরিবেশে থামবে।
// ব্যবহার: app/api/*/route.ts-এর একদম উপরে আমদানি করো।
const getEnv = (key: string, fallback?: string): string => {
  const v: string | undefined = process.env[key] ?? fallback;
  if (v === undefined || v.length === 0)
    throw new Error(`পরিবেশ চলক নেই: ${key} (.env.example দেখো)`);
  return v;
};

const getSecret = (key: string): string => {
  const raw: string | undefined = process.env[key];
  const v: string = raw ?? "";
  // fail-closed — খালি/ছোট হলে সব env-এ (dev-সহ) বুটে throw।
  if (v.length < 32)
    throw new Error(`${key} কমপক্ষে ৩২ অক্ষরের হতে হবে`);
  return v;
};

interface AppConfig {
  env: string;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigin: string[];
  isProd: boolean;
}

export const config: AppConfig = {
  env: process.env.NODE_ENV ?? "development",
  databaseUrl: getEnv("DATABASE_URL", ""),
  jwtSecret: getSecret("JWT_SECRET"),
  corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:3000")
    .split(",")
    .map((s: string): string => s.trim())
    .filter((s: string): boolean => s.length > 0),
  isProd: process.env.NODE_ENV === "production",
};

// fail-closed — prod-এ IMAP_TLS=false হলে বুটে throw (প্লেইন-টেক্সট পাসওয়ার্ড নয়)।
{
  const raw: string = (process.env.IMAP_TLS ?? "").trim().toLowerCase();
  const tlsOff: boolean =
    raw === "false" || raw === "0" || raw === "no" || raw === "off";
  if (tlsOff && process.env.NODE_ENV === "production") {
    throw new Error("IMAP_TLS=false is not allowed in production");
  }
}
