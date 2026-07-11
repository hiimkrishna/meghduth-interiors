import services from "@/data/services";


const footerData = {
  description:
    "Creating timeless interiors that blend elegance, functionality, and your personal story.",

  columns: [
    {
      title: "Services",
      links: services.map((service) => ({
        label: service.title,
        href: service.href,
      })),
    },

    {
      title: "Company",
      links: [
        {
          label: "About Us",
          href: "/about",
        },
        {
          label: "Projects",
          href: "/projects",
        },
        {
          label: "Contact",
          href: "/contact",
        },
      ],
    },
  ],

  contact: {
    phone: "+880 1XXX XXXXXX",
    email: "hello@meghdut.com",
    address: "Dhaka, Bangladesh",
  },

  socials: [
    {
      label: "Instagram",
      href: "#",
    },
    {
      label: "Facebook",
      href: "#",
    },
    {
      label: "LinkedIn",
      href: "#",
    },
  ],

  copyright:
    "© 2026 Meghdut Design Studio. All rights reserved.",
};

export default footerData;