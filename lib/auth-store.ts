// অ্যাডমিন সেশন স্টোর — টোকেন httpOnly কুকিতে রাখা হয় (লিখা/পড়া সার্ভার-সাইড)।
// ক্লায়েন্ট থেকে শুধু পড়া যাবে (টোকেনের মান নয়, কেবল me-এন্ডপয়েন্ট থেকে)।

export const ACCESS_TOKEN_COOKIE = "meghdut_admin_access";
export const REFRESH_TOKEN_COOKIE = "meghdut_admin_refresh";
export const ADMIN_EMAIL_COOKIE = "meghdut_admin_email";

export function getAccessTokenCookie(): string {
  return ACCESS_TOKEN_COOKIE;
}

export function getRefreshTokenCookie(): string {
  return REFRESH_TOKEN_COOKIE;
}

export function getEmailCookie(): string {
  return ADMIN_EMAIL_COOKIE;
}

// সার্ভার-সাইড কুকি অপশন — strict CSRF protection
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days for refresh
};

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 15 * 60, // 15 minutes
};

// ক্লায়েন্ট থেকে শুধু ইমেইল পড়া যায় (localStorage-এ রাখা থাকে) — টোকেন কখনো ক্লায়েন্টে থাকে না।
export function getStoredAdminEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("meghdut_admin_email");
}

export function setStoredAdminEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("meghdut_admin_email", email);
}

export function clearAdminEmail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("meghdut_admin_email");
}