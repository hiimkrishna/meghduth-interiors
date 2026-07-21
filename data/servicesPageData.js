const servicesPageData = {
  hero: {
    image: "/images/hero/hero1.jpeg",

    breadcrumb: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Services",
      },
    ],

    eyebrow: "OUR SERVICES",

    title: "Design Solutions Tailored To Every Space.",

    description:
      "From elegant residences to sophisticated commercial environments, Meghdut Design Studio delivers thoughtful interior and architectural solutions designed around your lifestyle and vision.",
  },

  intro: {
    eyebrow: "WHAT WE OFFER",

    title: "Comprehensive Interior Design Services.",

    description:
      "We combine creativity, functionality, and craftsmanship to deliver spaces that are timeless, practical, and uniquely yours.",
  },

  services: [
    {
      id: "01",
      title: "Residential Interior Design",

      description:
        "Elegant homes thoughtfully designed to reflect your lifestyle, personality, and everyday comfort.",

      image: "/images/about-meghdut.jpeg",
    },

    {
      id: "02",
      title: "Commercial Interior Design",

      description:
        "Professional environments that inspire productivity while reinforcing your brand identity.",

      image: "/images/projects/project-2.jpeg",
    },

    {
      id: "03",
      title: "Renovation & Remodeling",

      description:
        "Transform existing spaces into refined environments through strategic planning and modern design.",

      image: "/images/projects/project-3.jpeg",
    },

    {
      id: "04",
      title: "Space Planning",

      description:
        "Optimized layouts that maximize functionality, movement, and visual harmony.",

      image: "/images/projects/project-4.jpeg",
    },
  ],

  process: {
    eyebrow: "OUR PROCESS",

    title: "From Vision To Reality.",

    description:
      "Every project follows a carefully structured process that keeps communication transparent while ensuring exceptional design and flawless execution.",

    steps: [
      {
        number: "01",
        icon: "MessageCircle",

        title: "Consultation & Discovery",

        description:
          "We begin with an in-depth consultation to understand your lifestyle, functional needs, aesthetic preferences, budget, and timeline.",

        highlight: "Understanding your vision.",
      },

      {
        number: "02",
        icon: "LayoutGrid",

        title: "Concept & Space Planning",

        description:
          "Our designers create layouts, mood boards, furniture arrangements, and material palettes to shape the overall direction of your project.",

        highlight: "Turning ideas into concepts.",
      },

      {
        number: "03",
        icon: "PencilRuler",

        title: "Design Development",

        description:
          "Detailed drawings, lighting plans, finishes, furniture selections, and technical specifications are finalized before implementation.",

        highlight: "Every detail carefully refined.",
      },

      {
        number: "04",
        icon: "Hammer",

        title: "Execution & Delivery",

        description:
          "We oversee construction, coordinate contractors, monitor quality, and ensure every finishing touch meets our standards before handover.",

        highlight: "Delivered with precision.",
      },
    ],
  },
};

export default servicesPageData;