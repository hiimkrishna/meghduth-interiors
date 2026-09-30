import type { ProjectCardItem } from "./ProjectCard";

// components/home/featured-projects/projects.js-এর টাইপকৃত প্রতিরূপ —
// FeaturedProjects সরাসরি এই seed ব্যবহার করত; এখন services/featured-projects.service.ts পড়ে।
const projects: ProjectCardItem[] = [
  {
    id: 1,
    slug: "modern-luxury-residence",
    title: "Modern Luxury Residence",
    category: "Residential",
    location: "Dhaka",
    year: "2025",
    imageKey: "/images/projects/project-1.jpeg",
    featured: true,
    large: true,
  },
  {
    id: 2,
    slug: "corporate-workspace",
    title: "Corporate Workspace",
    category: "Commercial",
    location: "Chattogram",
    year: "2024",
    imageKey: "/images/projects/project-2.jpeg",
    featured: false,
    large: false,
  },
  {
    id: 3,
    slug: "minimal-living-room",
    title: "Minimal Living Room",
    category: "Interior",
    location: "Dhaka",
    year: "2025",
    imageKey: "/images/projects/project-3.jpeg",
    featured: false,
    large: false,
  },
  {
    id: 4,
    slug: "luxury-villa",
    title: "Luxury Villa",
    category: "Architecture",
    location: "Sylhet",
    year: "2025",
    imageKey: "/images/projects/project-4.jpeg",
    featured: true,
    large: true,
  },
];

export default projects;
