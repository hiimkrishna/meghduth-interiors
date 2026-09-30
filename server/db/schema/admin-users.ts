// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
// admin_users — কলাম: id (uuid, pk) | email (unique) | password_hash | full_name | role | is_active | created_at | updated_at
export const ADMIN_USERS_TABLE = "admin_users" as const;

// প্রশাসক সারি — চুক্তিতে নেই, সরাসরি সংজ্ঞা।
export interface AdminUserRow {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
