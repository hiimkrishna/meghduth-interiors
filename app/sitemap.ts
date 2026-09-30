import { listPublishedServices } from "@/server/modules/services/services.service";
import { listPublishedProjects } from "@/server/modules/projects/projects.service";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meghduthdesign.com";

  const services = await listPublishedServices();
  const projects = await listPublishedProjects();

  const serviceUrls = services.items.map((service) => {
    return {
      url: baseUrl + "/services/" + service.slug,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  const projectUrls = projects.items.map((project) => {
    return {
      url: baseUrl + "/projects/" + project.slug,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: baseUrl + "/services", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: baseUrl + "/projects", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: baseUrl + "/team", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: baseUrl + "/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  return staticUrls.concat(serviceUrls, projectUrls);
}