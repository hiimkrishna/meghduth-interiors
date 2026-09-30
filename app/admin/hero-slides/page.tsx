import { redirect } from "next/navigation";

// হিরো স্লাইড এখন Homepage ট্যাবের ভেতরে — পুরনো ঠিকানা সেখানে পাঠায়।
export default function AdminHeroSlidesRedirect(): never {
  redirect("/admin/homepage");
}
