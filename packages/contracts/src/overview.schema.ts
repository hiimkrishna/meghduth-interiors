import { z } from "zod";

// অ্যাডমিন ওভারভিউ — ড্যাশবোর্ডের এক-কল বিশ্লেষণ।
// ফানেল অবস্থা Lead/leadStatusEnum-এর সাথে বাঁধা (NEW/CONTACTED/QUOTED/WON/LOST)।

export const overviewContentSchema = z.object({
  services: z.object({ total: z.number(), published: z.number() }),
  projects: z.object({ total: z.number(), published: z.number(), featured: z.number() }),
  team: z.object({ total: z.number() }),
  heroSlides: z.object({ total: z.number(), published: z.number() }),
  testimonials: z.object({
    total: z.number(),
    approved: z.number(),
    pending: z.number(),
    hidden: z.number(),
  }),
});

export const overviewFunnelSchema = z.object({
  NEW: z.number(),
  CONTACTED: z.number(),
  QUOTED: z.number(),
  WON: z.number(),
  LOST: z.number(),
  winRate: z.number(),
});

export const overviewRecentLeadSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  subject: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const overviewRecentInboxSchema = z.object({
  id: z.number(),
  from: z.string(),
  subject: z.string(),
  receivedAt: z.string(),
  seen: z.boolean(),
});

export const overviewDaySchema = z.object({
  date: z.string(),
  label: z.string(),
  count: z.number(),
});

export const overviewSchema = z.object({
  attention: z.object({
    unreadInbox: z.number(),
    newLeads: z.number(),
    pendingTestimonials: z.number(),
  }),
  content: overviewContentSchema,
  funnel: overviewFunnelSchema,
  leadsByDay: z.array(overviewDaySchema),
  recentLeads: z.array(overviewRecentLeadSchema),
  recentInbox: z.array(overviewRecentInboxSchema),
});

export type Overview = z.infer<typeof overviewSchema>;
export type OverviewFunnel = z.infer<typeof overviewFunnelSchema>;
