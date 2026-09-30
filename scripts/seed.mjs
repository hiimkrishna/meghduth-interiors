// পূর্ণ বীজ — admin_users + সব কনটেন্ট টেবিল (idempotent)।
// plain JS (tsx/jiti ছাড়া: node scripts/seed.mjs)। চালাতে DATABASE_URL লাগে।
// হ্যাশ আকার server/lib/password.ts-এর সাথে মিলিয়ে: scrypt$salt$hash।
import { randomBytes, scryptSync } from "node:crypto";
import postgres from "postgres";

const url = process.env.DATABASE_URL ?? "";
if (url === "") {
  console.error("DATABASE_URL নেই (.env দেখো)");
  process.exit(1);
}
const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";
if (email === "" || password.length < 8) {
  console.error("ADMIN_EMAIL ও কমপক্ষে ৮ অক্ষরের ADMIN_PASSWORD দরকার");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const passwordHash = `scrypt$${salt}$${hash}`;

// server/db/seed-data.ts-এর JS প্রতিচ্ছবি (TS আমদানি ছাড়া)।
const siteSettingsSeed = {
  siteName: "Meghdut Design Studio",
  phone: "+880 1700-000000",
  email: "hello@meghdutdesign.com",
  address: "Dhaka, Bangladesh",
  socials: [],
};

const navigationsSeed = [
  { id: 1, label: "Home", href: "/", order: 0, visible: true },
  { id: 2, label: "About", href: "/about", order: 1, visible: true },
  { id: 3, label: "Services", href: "/services", order: 2, visible: true },
  { id: 4, label: "Projects", href: "/projects", order: 3, visible: true },
  { id: 5, label: "Team", href: "/team", order: 4, visible: true },
  { id: 6, label: "Contact", href: "/contact", order: 5, visible: true },
];

const heroSlidesSeed = [
  {
    id: 1,
    imageKey: "/images/hero/hero1.jpeg",
    badge: "Interior Design",
    title: "Designing Spaces That Inspire.",
    description: "Elegant interiors crafted to reflect your lifestyle and elevate everyday living.",
    order: 0,
    published: true,
  },
  {
    id: 2,
    imageKey: "/images/hero/hero2.jpeg",
    badge: "Architecture",
    title: "Architecture With Purpose.",
    description: "Timeless architectural solutions that blend aesthetics, functionality, and innovation.",
    order: 1,
    published: true,
  },
];

const servicesSeed = [
  { slug: "residential", title: "Residential Interior Design", description: "Creating elegant homes that reflect your personality, lifestyle, and comfort.", order: 0, published: true },
  { slug: "commercial", title: "Commercial Interior Design", description: "Designing inspiring workspaces and commercial environments.", order: 1, published: true },
  { slug: "renovation", title: "Renovation & Remodeling", description: "Transforming existing spaces with thoughtful planning and execution.", order: 2, published: true },
  { slug: "space-planning", title: "Space Planning", description: "Optimizing layouts to balance beauty, movement, and functionality.", order: 3, published: true },
];

const testimonialsSeed = [
  { id: 1, name: "Sarah Ahmed", designation: "Residential Client", text: "Meghdut transformed our apartment into a space that feels luxurious yet incredibly comfortable. Every detail was thoughtfully executed.", rating: 5, imageKey: "/images/testimonials/client-1.jpg", status: "approved", published: true },
  { id: 2, name: "Arif Hasan", designation: "Commercial Client", text: "Their professionalism and design expertise exceeded our expectations. The office now truly reflects our brand identity.", rating: 5, imageKey: "/images/testimonials/client-2.jpg", status: "approved", published: true },
  { id: 3, name: "Nusrat Jahan", designation: "Homeowner", text: "From concept to execution, the entire experience was seamless. We couldn't be happier with the result.", rating: 5, imageKey: "/images/testimonials/client-3.jpg", status: "approved", published: true },
];

const projectsSeed = [];
const teamSeed = [];

const sql = postgres(url);
try {
  await sql`
    insert into admin_users (email, name, password_hash, role, suspended, token_version)
    values (${email}, 'Admin', ${passwordHash}, 'admin', false, 0)
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      updated_at = now()
  `;
  console.log(`বীজ সফল: ${email}`);

  // site_settings — এক সারি (id=1), থাকলে ছোঁবে না।
  await sql`
    insert into site_settings (id, site_name, phone, email, address, socials, version)
    values (1, ${siteSettingsSeed.siteName}, ${siteSettingsSeed.phone}, ${siteSettingsSeed.email}, ${siteSettingsSeed.address}, ${sql.json(siteSettingsSeed.socials)}, 1)
    on conflict (id) do nothing
  `;

  // navigations — id ভিত্তিতে idempotent।
  for (const n of navigationsSeed) {
    await sql`
      insert into navigations (id, label, href, "order", visible)
      values (${n.id}, ${n.label}, ${n.href}, ${n.order}, ${n.visible})
      on conflict (id) do nothing
    `;
  }

  // hero_slides — id ভিত্তিতে idempotent।
  for (const h of heroSlidesSeed) {
    await sql`
      insert into hero_slides (id, image_key, badge, title, description, "order", published)
      values (${h.id}, ${h.imageKey}, ${h.badge}, ${h.title}, ${h.description}, ${h.order}, ${h.published})
      on conflict (id) do nothing
    `;
  }

  // services — slug অনন্য, idempotent।
  for (const s of servicesSeed) {
    await sql`
      insert into services (slug, title, description, "order", published)
      values (${s.slug}, ${s.title}, ${s.description}, ${s.order}, ${s.published})
      on conflict (slug) do nothing
    `;
  }

  // projects — বীজ খালি, ভবিষ্যতে এলে id/slug ভিত্তিতে ঢোকাবে।
  for (const p of projectsSeed) {
    await sql`
      insert into projects (slug, title, category, "order", published)
      values (${p.slug}, ${p.title}, ${p.category}, ${p.order}, ${p.published})
      on conflict (slug) do nothing
    `;
  }

  // team_members — বীজ খালি; থাকলে id ভিত্তিতে।
  for (const m of teamSeed) {
    await sql`
      insert into team_members (id, name, designation, "order", published)
      values (${m.id}, ${m.name}, ${m.designation}, ${m.order}, ${m.published})
      on conflict (id) do nothing
    `;
  }

  // testimonials — id ভিত্তিতে idempotent।
  for (const t of testimonialsSeed) {
    await sql`
      insert into testimonials (id, name, designation, text, rating, image_key, status, published)
      values (${t.id}, ${t.name}, ${t.designation}, ${t.text}, ${t.rating}, ${t.imageKey}, ${t.status}, ${t.published})
      on conflict (id) do nothing
    `;
  }

  // সিকোয়েন্স পুনঃসঙ্গতি — উপরে স্পষ্ট id ঢুকেছে, তাই serial সিকোয়েন্স max(id)-এর
  // পেছনে পড়ে থাকে। না ঘোরালে পরের অ্যাডমিন-তৈরি (insert) "duplicate key"-এ 500 খায়।
  // শুধু serial টেবিলে চালাও — uuid টেবিলে pg_get_serial_sequence NULL দেয়, তখন no-op।
  for (const t of ["navigations", "hero_slides", "team_members", "testimonials"]) {
    await sql.unsafe(`
      SELECT setval(s.seq, COALESCE(m.max_id, 0))
      FROM (SELECT pg_get_serial_sequence('${t}', 'id') AS seq) s
      JOIN (SELECT max(id) AS max_id FROM "${t}") m ON true
      WHERE s.seq IS NOT NULL
    `);
  }

  console.log("কনটেন্ট বীজ সফল");
} finally {
  await sql.end();
}
