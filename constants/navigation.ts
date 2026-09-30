// অস্থায়ী — মাইলফলক ২-এ DB বীজে যাবে
import type { NavigationItem } from "@/packages/contracts/src/site.schema";

// UI-তে আপাতত শুধু title+href লাগে; DB-তে label/order/visible যোগ হবে।
export type NavigationLink = Pick<NavigationItem, "href"> & {
  title: string;
};

const navigation: NavigationLink[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Team",
    href: "/team",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default navigation;
