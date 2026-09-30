import type { HeroSlide } from "@/packages/contracts/src/hero.schema";
import type { ServiceItem } from "@/packages/contracts/src/service.schema";
import type { Project } from "@/packages/contracts/src/project.schema";
import type { TeamMember } from "@/packages/contracts/src/team.schema";
import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";
import type { NavigationItem, SiteSettings } from "@/packages/contracts/src/site.schema";

// অস্থায়ী বীজ — বর্তমান data/*.js-এর পরিষ্কার রূপ।
// মাইলফলক ২-এ এগুলো PostgreSQL বীজে যাবে। আকৃতি contracts-এর সাথে বাঁধা।
export const heroSlidesSeed: HeroSlide[] = [
  {
    id: 1,
    image: "/images/hero/hero1.jpeg",
    badge: "Interior Design",
    title: "Designing Spaces That Inspire.",
    description:
      "Elegant interiors crafted to reflect your lifestyle and elevate everyday living.",
    order: 0,
    published: true,
  },
  {
    id: 2,
    image: "/images/hero/hero2.jpeg",
    badge: "Architecture",
    title: "Architecture With Purpose.",
    description:
      "Timeless architectural solutions that blend aesthetics, functionality, and innovation.",
    order: 1,
    published: true,
  },
];

export const servicesSeed: ServiceItem[] = [
  {
    id: "01",
    slug: "residential",
    title: "Residential Interior Design",
    description: "Creating elegant homes that reflect your personality, lifestyle, and comfort.",
    order: 0,
    published: true,
  },
  {
    id: "02",
    slug: "commercial",
    title: "Commercial Interior Design",
    description: "Designing inspiring workspaces and commercial environments.",
    order: 1,
    published: true,
  },
  {
    id: "03",
    slug: "renovation",
    title: "Renovation & Remodeling",
    description: "Transforming existing spaces with thoughtful planning and execution.",
    order: 2,
    published: true,
  },
  {
    id: "04",
    slug: "space-planning",
    title: "Space Planning",
    description: "Optimizing layouts to balance beauty, movement, and functionality.",
    order: 3,
    published: true,
  },
];

export const projectsSeed: Project[] = [];

export const teamSeed: TeamMember[] = [];

export const testimonialsSeed: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Ahmed",
    designation: "Residential Client",
    text: "Meghdut transformed our apartment into a space that feels luxurious yet incredibly comfortable. Every detail was thoughtfully executed.",
    rating: 5,
    imageKey: "/images/testimonials/client-1.jpg",
    status: "approved",
    published: true,
  },
  {
    id: 2,
    name: "Arif Hasan",
    designation: "Commercial Client",
    text: "Their professionalism and design expertise exceeded our expectations. The office now truly reflects our brand identity.",
    rating: 5,
    imageKey: "/images/testimonials/client-2.jpg",
    status: "approved",
    published: true,
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    designation: "Homeowner",
    text: "From concept to execution, the entire experience was seamless. We couldn't be happier with the result.",
    rating: 5,
    imageKey: "/images/testimonials/client-3.jpg",
    status: "approved",
    published: true,
  },
];

export const navigationsSeed: NavigationItem[] = [
  { id: 1, label: "Home", title: "Home", href: "/", order: 0, visible: true },
  { id: 2, label: "About", title: "About", href: "/about", order: 1, visible: true },
  { id: 3, label: "Services", title: "Services", href: "/services", order: 2, visible: true },
  { id: 4, label: "Projects", title: "Projects", href: "/projects", order: 3, visible: true },
  { id: 5, label: "Team", title: "Team", href: "/team", order: 4, visible: true },
  { id: 6, label: "Contact", title: "Contact", href: "/contact", order: 5, visible: true },
];

export const siteSettingsSeed: SiteSettings = {
  siteName: "Meghduth Design Studio",
  phone: "+880 1700-000000",
  email: "hello@meghduthdesign.com",
  address: "Dhaka, Bangladesh",
  socials: [],
};
