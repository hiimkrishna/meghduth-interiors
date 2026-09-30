import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ভূমিকা enum — শুধু এই তিনটি মান বৈধ।
export const adminRoleEnum = pgEnum("admin_role", ["admin", "editor", "viewer"]);
// মতামত অবস্থা — contracts-এর TESTIMONIAL_STATUSES-এর সাথে বাঁধা।
export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "hidden",
]);
// লিড অবস্থা — contracts-এর LEAD_STATUSES-এর সাথে বাঁধা।
export const leadStatusEnum = pgEnum("lead_status", [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "WON",
  "LOST",
]);

// প্রশাসক — লগইন/টোকেন ঘূর্ণনের ভিত্তি।
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: adminRoleEnum("role").default("admin").notNull(),
  suspended: boolean("suspended").default(false).notNull(),
  tokenVersion: integer("token_version").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("admin_users_email_idx").on(table.email),
}));

export type AdminUserRow = typeof adminUsers.$inferSelect;
export type NewAdminUserRow = typeof adminUsers.$inferInsert;

// সাইট সেটিংস — এক সারি, সংস্করণসহ।
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 160 }).notNull(),
  logoKey: varchar("logo_key", { length: 512 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  address: varchar("address", { length: 500 }),
  mapEmbedUrl: varchar("map_embed_url", { length: 2000 }),
  footerDescription: text("footer_description"),
  copyrightText: varchar("copyright_text", { length: 255 }),
  socials: jsonb("socials")
    .$type<Array<{ label: string; href: string }>>()
    .default([])
    .notNull(),
  version: integer("version").default(1).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// নেভিগেশন — দৃশ্যমানতা ও ক্রমসহ।
export const navigations = pgTable("navigations", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 80 }).notNull(),
  href: varchar("href", { length: 500 }).notNull(),
  displayOrder: integer("order").default(0).notNull(),
  visible: boolean("visible").default(true).notNull(),
  showInFooter: boolean("show_in_footer").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index("navigations_visible_idx").on(table.visible),
  showInFooterIdx: index("navigations_show_in_footer_idx").on(table.showInFooter),
  displayOrderIdx: index("navigations_display_order_idx").on(table.displayOrder),
}));

// হিরো স্লাইড — প্রকাশিতগুলোই পাবলিক।
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageKey: varchar("image_key", { length: 512 }).notNull(),
  badge: varchar("badge", { length: 120 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  displayOrder: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  publishedIdx: index("hero_slides_published_idx").on(table.published),
  displayOrderIdx: index("hero_slides_display_order_idx").on(table.displayOrder),
}));

// সেবা — slug অনন্য।
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 160 }).unique().notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  imageKey: varchar("image_key", { length: 512 }),
  displayOrder: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("services_slug_idx").on(table.slug),
  publishedIdx: index("services_published_idx").on(table.published),
  displayOrderIdx: index("services_display_order_idx").on(table.displayOrder),
}));

// সেবার গ্যালারি ছবি — এক সেবার অনেক ছবি।
export const serviceImages = pgTable("service_images", {
  id: serial("id").primaryKey(),
  serviceId: uuid("service_id")
    .references(() => services.id)
    .notNull(),
  imageKey: varchar("image_key", { length: 512 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  displayOrder: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// প্রজেক্ট — slug অনন্য, ফিচার্ড পতাকাসহ।
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 160 }).unique().notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  location: varchar("location", { length: 200 }),
  year: varchar("year", { length: 16 }),
  description: text("description"),
  imageKey: varchar("image_key", { length: 512 }),
  featured: boolean("featured").default(false).notNull(),
  displayOrder: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("projects_slug_idx").on(table.slug),
  publishedIdx: index("projects_published_idx").on(table.published),
  featuredIdx: index("projects_featured_idx").on(table.featured),
  displayOrderIdx: index("projects_display_order_idx").on(table.displayOrder),
  categoryIdx: index("projects_category_idx").on(table.category),
}));

// প্রজেক্ট ছবি — প্রজেক্ট প্রতি একাধিক।
export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  imageKey: varchar("image_key", { length: 512 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  displayOrder: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  projectIdIdx: index("project_images_project_id_idx").on(table.projectId),
  displayOrderIdx: index("project_images_display_order_idx").on(table.displayOrder),
}));

// দলের সদস্য — ক্রম ও প্রকাশনাসহ।
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  designation: varchar("designation", { length: 160 }).notNull(),
  bio: text("bio"),
  imageKey: varchar("image_key", { length: 512 }),
  displayOrder: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  publishedIdx: index("team_members_published_idx").on(table.published),
  displayOrderIdx: index("team_members_display_order_idx").on(table.displayOrder),
}));

// মতামত — অবস্থা enum-এ বাঁধা।
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  designation: varchar("designation", { length: 200 }),
  text: varchar("text", { length: 2000 }).notNull(),
  rating: integer("rating").default(5).notNull(),
  imageKey: varchar("image_key", { length: 512 }),
  status: testimonialStatusEnum("status").default("pending").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("testimonials_status_idx").on(table.status),
  publishedIdx: index("testimonials_published_idx").on(table.published),
}));

// মিডিয়া সম্পদ — key অনন্য।
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 512 }).unique().notNull(),
  url: text("url").notNull(),
  mime: varchar("mime", { length: 128 }),
  size: integer("size"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: index("media_assets_key_idx").on(table.key),
}));

// অফিস-মেইল ইনবক্স — IMAP থেকে সিঙ্ক করা মেইলের স্থানীয় ছায়া।
export const inboxEmails = pgTable("inbox_emails", {
    id: serial("id").primaryKey(),
    messageId: varchar("message_id", { length: 512 }).unique().notNull(),
    fromAddr: varchar("from_addr", { length: 512 }).notNull(),
    toAddr: varchar("to_addr", { length: 512 }).notNull().default(""),
    subject: varchar("subject", { length: 1000 }).notNull().default(""),
    snippet: varchar("snippet", { length: 500 }).notNull().default(""),
    body: text("body").notNull().default(""),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
    seen: boolean("seen").default(false).notNull(),
    replied: boolean("replied").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }, (table) => ({
    receivedAtIdx: index("inbox_emails_received_at_idx").on(table.receivedAt),
    seenIdx: index("inbox_emails_seen_idx").on(table.seen),
    messageIdIdx: index("inbox_emails_message_id_idx").on(table.messageId),
  }));

export type InboxEmailRow = typeof inboxEmails.$inferSelect;
export type NewInboxEmailRow = typeof inboxEmails.$inferInsert;

// লিড/অনুসন্ধান — অবস্থা যন্ত্র NEW থেকে শুরু।
export const leadsInquiries = pgTable("leads_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  source: varchar("source", { length: 32 }).default("contact-form").notNull(),
  status: leadStatusEnum("status").default("NEW").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("leads_status_idx").on(table.status),
  sourceIdx: index("leads_source_idx").on(table.source),
  createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
  emailIdx: index("leads_email_idx").on(table.email),
}));

// অ্যাডমিন অডিট লগ — কে কী করেছিল, কখন।
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .references(() => adminUsers.id)
    .notNull(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "create", "update", "delete", "login", "logout"
  resourceType: varchar("resource_type", { length: 100 }).notNull(), // e.g., "hero_slide", "service", "project"
  resourceId: varchar("resource_id", { length: 255 }),
  oldData: jsonb("old_data").$type<Record<string, unknown>>(),
  newData: jsonb("new_data").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  adminIdIdx: index("admin_audit_logs_admin_id_idx").on(table.adminId),
  actionIdx: index("admin_audit_logs_action_idx").on(table.action),
  resourceTypeIdx: index("admin_audit_logs_resource_type_idx").on(table.resourceType),
  createdAtIdx: index("admin_audit_logs_created_at_idx").on(table.createdAt),
}));

export type AdminAuditLogRow = typeof adminAuditLogs.$inferSelect;
export type NewAdminAuditLogRow = typeof adminAuditLogs.$inferInsert;

// ইমেল ডেলিভারি ট্র্যাকিং — বাউন্স, ওপেন, ক্লিক, স্প্যাম রিপোর্ট।
export const emailDeliveryLogs = pgTable("email_delivery_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: varchar("message_id", { length: 255 }).notNull(), // SMTP message-id
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  fromEmail: varchar("from_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 1000 }),
  status: varchar("status", { length: 50 }).notNull(), // sent, delivered, bounced, opened, clicked, complained
  provider: varchar("provider", { length: 50 }), // postmark, sendgrid, smtp
  providerMessageId: varchar("provider_message_id", { length: 255 }),
  errorCode: varchar("error_code", { length: 100 }),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  complainedAt: timestamp("complained_at"),
}, (table) => ({
  messageIdIdx: index("email_delivery_logs_message_id_idx").on(table.messageId),
  toEmailIdx: index("email_delivery_logs_to_email_idx").on(table.toEmail),
  statusIdx: index("email_delivery_logs_status_idx").on(table.status),
  sentAtIdx: index("email_delivery_logs_sent_at_idx").on(table.sentAt),
}));

export type EmailDeliveryLogRow = typeof emailDeliveryLogs.$inferSelect;
export type NewEmailDeliveryLogRow = typeof emailDeliveryLogs.$inferInsert;

// ফিচার ফ্ল্যাগস — রানটাইম টগল।
export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(false).notNull(),
  rules: jsonb("rules").$type<Record<string, unknown>>().default({}).notNull(), // targeting rules
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: index("feature_flags_key_idx").on(table.key),
  enabledIdx: index("feature_flags_enabled_idx").on(table.enabled),
}));

export type FeatureFlagRow = typeof featureFlags.$inferSelect;
export type NewFeatureFlagRow = typeof featureFlags.$inferInsert;

// কন্টেন্ট ভার্সনিং — undo functionality।
export const contentVersions = pgTable("content_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceType: varchar("resource_type", { length: 100 }).notNull(), // hero_slide, service, project, etc.
  resourceId: varchar("resource_id", { length: 255 }).notNull(),
  version: integer("version").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  changedBy: uuid("changed_by").references(() => adminUsers.id),
  changedByEmail: varchar("changed_by_email", { length: 255 }).notNull(),
  changeType: varchar("change_type", { length: 50 }).notNull(), // create, update, delete
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  resourceIdx: index("content_versions_resource_idx").on(table.resourceType, table.resourceId),
  versionIdx: index("content_versions_version_idx").on(table.version),
  createdAtIdx: index("content_versions_created_at_idx").on(table.createdAt),
}));

export type ContentVersionRow = typeof contentVersions.$inferSelect;
export type NewContentVersionRow = typeof contentVersions.$inferInsert;

// পেজ-সেকশন কেন্দ্রীয় ভান্ডার — প্রতি (পেজ, সেকশন) এক সারি, তথ্য JSON।
// মালিক ট্যাব একবার লেখে (About → about.*, Contact → contact.*),
// ভোক্তা পেজ শুধু পড়ে (হোম WhyChoose ← about.whyChoose)। ডিলিট নেই, upsert।
export const pageSections = pgTable("page_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: varchar("page", { length: 32 }).notNull(),
  section: varchar("section", { length: 64 }).notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pageSectionIdx: index("page_sections_page_section_idx").on(table.page, table.section),
}));

export type PageSectionRow = typeof pageSections.$inferSelect;
export type NewPageSectionRow = typeof pageSections.$inferInsert;

