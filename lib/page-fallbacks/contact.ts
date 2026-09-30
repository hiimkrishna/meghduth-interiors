// Contact-মালিকানাধীন কনটেন্টের কোড-ফলব্যাক — এক ঠিকানা।
// সাইট পেজ + অ্যাডমিন এডিটর দুজনেই এখান থেকে নেয়; DB-সারি থাকলে তা জেতে।
// (আগে app/(site)/contact/page.tsx ও ctaData.ts-এ ছড়িয়ে ছিল।)

export const contactHeroFallback = {
  image: "/images/hero/hero1.jpeg",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "Contact" }],
  eyebrow: "CONTACT US",
  title: "Let's Bring Your Vision To Life.",
  description:
    "Whether you're planning a new home, renovating an existing space, or designing a commercial environment, we'd love to hear about your project.",
};

export const contactInfoFallback = {
  eyebrow: "GET IN TOUCH",
  title: "We're Here To Help.",
  description:
    "Reach out to discuss your ideas, request a consultation, or ask any questions about our services.",
  details: [
    { icon: "MapPin", title: "Studio", value: "Dhaka, Bangladesh" },
    { icon: "Phone", title: "Phone", value: "+880 1700-000000" },
    { icon: "Mail", title: "Email", value: "hello@meghduthdesign.com" },
    {
      icon: "Clock3",
      title: "Working Hours",
      value: "Sat – Thu | 9:00 AM – 6:00 PM",
    },
  ],
};

export const contactLocationFallback = {
  eyebrow: "VISIT OUR STUDIO",
  title: "Find Us.",
  description:
    "Schedule a consultation and visit our studio to discuss your project in person.",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.1230789555783!2d90.38833846956604!3d23.872155098661718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c410d2ac4dbf%3A0x682cf2c9fb2b67c0!2s12%20Rd%2010%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1784665302662!5m2!1sen!2sbd",
  address: "Dhaka, Bangladesh",
};

export const contactCtaFallback = {
  badge: "Start Your Project",
  title: "Transform Your Space Into Something Timeless.",
  description:
    "Let our design experts create a space that reflects your personality, lifestyle, and vision.",
  buttonText: "Free Consultation",
  background: "/images/cta/cta-bg.webp",
};
