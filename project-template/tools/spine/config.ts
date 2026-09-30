// env যাচাই — সার্ভার বুটের আগেই ভুল env-তে মরবে (fail fast)।
// ব্যবহার: backend/src/config.ts হিসেবে কপি করো, server.ts-এর একদম উপরে import করো।
// .env.example-এ এই চাবিগুলোর নমুনা রাখো।
const getEnv = (key: string): string => {
  const v: string | undefined = process.env[key];
  if (v === undefined || v.length < 8) throw new Error(`Missing/weak env: ${key} (.env দেখো)`);
  return v;
};

const jwtSecret: string = getEnv("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error(
    "JWT_SECRET কমপক্ষে ৩২ অক্ষরের হতে হবে " +
      "(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")",
  );
}

interface AppConfig {
  env: string;
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  corsOrigin: string[];
  isProd: boolean;
}

export const config: AppConfig = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 5000,
  jwtSecret,
  databaseUrl: getEnv("DATABASE_URL"),
  corsOrigin: getEnv("CORS_ORIGIN")
    .split(",")
    .map((s: string): string => s.trim()),
  isProd: process.env.NODE_ENV === "production",
};
