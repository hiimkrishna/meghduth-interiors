// About-মালিকানাধীন কনটেন্টের কোড-ফলব্যাক — এক ঠিকানা।
// সাইট পেজ + অ্যাডমিন এডিটর দুজনেই এখান থেকে নেয়; DB-সারি থাকলে তা জেতে।
// (আগে app/(site)/about/page.tsx ও হোম সেকশনে ছড়িয়ে ছিল।)

export const aboutHeroFallback = {
  image: "/images/about/about-hero.webp",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "About" }],
  eyebrow: "ABOUT MEGHDUTH",
  title: "Crafting Timeless Spaces That Inspire Everyday Living.",
  description:
    "Meghduth Design Studio creates elegant residential and commercial interiors that seamlessly blend architecture, functionality, and refined aesthetics. Every project is designed to reflect your lifestyle while standing the test of time.",
};

export const aboutStoryFallback = {
  eyebrow: "OUR STORY",
  title: "Designing Beyond Aesthetics.",
  description:
    "Founded with a passion for meaningful design, Meghduth Design Studio believes that every space should evoke emotion while serving its purpose beautifully.",
  paragraphs: [
    "We approach each project with curiosity, collaboration, and meticulous attention to detail. From luxury residences to sophisticated commercial environments, our goal is to create spaces that feel effortless and timeless.",
    "Our process combines creativity with technical expertise, ensuring every design is visually striking, functional, and tailored to our clients' aspirations.",
  ],
  image: "/images/about-meghdut.jpeg",
  imageAlt: "Luxury interior by Meghduth Design Studio",
  reverse: false,
};

export const aboutPhilosophyFallback = {
  eyebrow: "OUR PHILOSOPHY",
  title: "Design Rooted In Purpose.",
  description:
    "We believe exceptional spaces are created by balancing aesthetics, functionality, and the people who live within them.",
  items: [
    {
      icon: "Compass",
      title: "Timeless Design",
      description:
        "We create elegant interiors that remain relevant beyond changing trends, ensuring lasting beauty and value.",
    },
    {
      icon: "Users",
      title: "Client-Centered",
      description:
        "Every project is uniquely tailored around your lifestyle, aspirations, and personal vision.",
    },
    {
      icon: "Diamond",
      title: "Attention To Detail",
      description:
        "From material selection to the smallest finishing touches, every detail is carefully refined.",
    },
  ],
};

export const aboutApproachFallback = {
  eyebrow: "OUR PROCESS",
  title: "A Thoughtful Journey From Vision To Reality.",
  description:
    "Every successful project follows a carefully planned process that ensures creativity, transparency, and exceptional execution.",
  steps: [
    {
      number: "01",
      title: "Discovery",
      description:
        "We begin by understanding your lifestyle, requirements, inspiration, budget, and long-term goals.",
      image: "/images/projects/project-1.jpeg",
      imageAlt: "Project discovery phase",
      reverse: false,
    },
    {
      number: "02",
      title: "Design Development",
      description:
        "Layouts, mood boards, material palettes, and 3D visualizations are created to transform ideas into reality.",
      image: "/images/projects/project-2.jpeg",
      imageAlt: "Interior design development",
      reverse: true,
    },
    {
      number: "03",
      title: "Execution",
      description:
        "We coordinate every stage of implementation, ensuring flawless craftsmanship and timely project delivery.",
      image: "/images/projects/project-3.jpeg",
      imageAlt: "Completed interior project",
      reverse: false,
    },
  ],
};

export const aboutTeamPreviewFallback = {
  eyebrow: "OUR TEAM",
  title: "Meet The Creative Minds Behind Meghduth.",
  description:
    "Behind every successful project is a passionate team of architects, designers, and creative thinkers dedicated to delivering exceptional spaces.",
  image: "/images/why-meghdut.jpeg",
  imageAlt: "Meghduth Design Studio team",
  button: { label: "Meet Our Team", href: "/team" },
};

export const aboutWhyChooseFallback = {
  eyebrow: "Why Choose Meghduth",
  title: "We create spaces that feel like home.",
  values: [
    {
      id: "01",
      title: "Personalized Design",
      description:
        "Every space begins with understanding your lifestyle, preferences, and vision.",
    },
    {
      id: "02",
      title: "Premium Materials",
      description:
        "We select high-quality materials that bring elegance and durability together.",
    },
    {
      id: "03",
      title: "Expert Execution",
      description:
        "Our team ensures flawless execution from concept to final installation.",
    },
  ],
};

export const aboutStatsFallback = {
  stats: [
    { number: "15+", label: "Years Experience" },
    { number: "120+", label: "Completed Projects" },
    { number: "98%", label: "Client Satisfaction" },
  ],
};
