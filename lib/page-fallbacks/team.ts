// Team-মালিকানাধীন কনটেন্টের কোড-ফলব্যাক — এক ঠিকানা।
// সাইট পেজ + অ্যাডমিন এডিটর দুজনেই এখান থেকে নেয়; DB-সারি থাকলে তা জেতে।

export const teamHeroFallback = {
  image: "/images/hero/hero2.jpeg",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "Team" }],
  eyebrow: "OUR TEAM",
  title: "The Creative Minds Behind Every Space.",
  description:
    "Meet the architects, designers, and creative professionals who transform ideas into timeless spaces with passion, precision, and purpose.",
};

export const teamIntroFallback = {
  eyebrow: "MEET THE TEAM",
  title: "Designing Together, Creating Excellence.",
  description:
    "Every successful project is the result of collaboration, creativity, and a shared commitment to exceptional design.",
};

export const teamJoinFallback = {
  eyebrow: "WORK WITH US",
  title: "Let's Create Something Exceptional Together.",
  description:
    "Whether you're planning your dream home, a commercial space, or a complete renovation, our team is ready to bring your vision to life.",
  image: "/images/why-meghdut.jpeg",
  imageAlt: "Meghduth Design Studio",
  button: { label: "Contact Us", href: "/contact" },
  reverse: true,
};
