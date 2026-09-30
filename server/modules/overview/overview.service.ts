import type { Overview } from "@/packages/contracts/src/overview.schema";
import { overviewSchema } from "@/packages/contracts/src/overview.schema";
import { findAllLeads } from "@/server/modules/leads/leads.repository";
import { listInboxEmails } from "@/server/modules/inbox/inbox.repository";
import { findAllTestimonials } from "@/server/modules/testimonials/testimonials.repository";
import { findAllServices } from "@/server/modules/services/services.repository";
import { findAllProjects } from "@/server/modules/projects/projects.repository";
import { findAllTeamMembers } from "@/server/modules/team/team.repository";
import { findAllHeroSlides } from "@/server/modules/hero-slides/hero-slides.repository";
import { AppError } from "@/server/lib/response";

// ওভারভিউ — ড্যাশবোর্ডের এক-কল বিশ্লেষণ। ছোট CMS, তাই JS-এ গণনা; N+1 নয়, ৮ রিড।
function toIso(value: unknown, fallback: string): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value !== "") return value;
  return fallback;
}

export async function getOverview(): Promise<Overview> {
  const [leads, inboxPage, testimonials, services, projects, team, heroSlides] =
    await Promise.all([
      findAllLeads().catch(() => []),
      listInboxEmails({ page: 1, limit: 100 }).catch(() => null),
      findAllTestimonials().catch(() => []),
      findAllServices().catch(() => []),
      findAllProjects().catch(() => []),
      findAllTeamMembers().catch(() => []),
      findAllHeroSlides().catch(() => []),
    ]);

  const funnel = { NEW: 0, CONTACTED: 0, QUOTED: 0, WON: 0, LOST: 0 };
  for (const lead of leads) {
    const s = lead.status;
    if (s === "NEW" || s === "CONTACTED" || s === "QUOTED" || s === "WON" || s === "LOST") {
      funnel[s] += 1;
    }
  }
  const decided = funnel.WON + funnel.LOST;
  const winRate = decided === 0 ? 0 : Math.round((funnel.WON / decided) * 100);

  // দিনভিত্তিক লিড — শেষ ১৪ দিন, খালি দিনে শূন্য (এরিয়া চার্ট)।
  const dayKey = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const byDay = new Map<string, number>();
  for (const lead of leads) {
    const raw = lead.createdAt;
    const d = raw instanceof Date ? raw : new Date(String(raw ?? ""));
    if (Number.isNaN(d.getTime())) continue;
    const k = dayKey(d);
    byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  const leadsByDay: Array<{ date: string; label: string; count: number }> = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const k = dayKey(d);
    leadsByDay.push({
      date: k,
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: byDay.get(k) ?? 0,
    });
  }

  const sortedLeads = [...leads].sort((a, b) => {
    const ta = a.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(String(a.createdAt ?? 0));
    const tb = b.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(String(b.createdAt ?? 0));
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });

  const inboxItems = inboxPage?.items ?? [];
  const sortedInbox = [...inboxItems].sort((a, b) => {
    const ta = a.receivedAt instanceof Date ? a.receivedAt.getTime() : Date.parse(String(a.receivedAt ?? 0));
    const tb = b.receivedAt instanceof Date ? b.receivedAt.getTime() : Date.parse(String(b.receivedAt ?? 0));
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });

  const pendingTestimonials = testimonials.filter((t) => t.status === "pending").length;

  const result: Overview = {
    attention: {
      unreadInbox: inboxPage?.unread ?? inboxItems.filter((m) => !m.seen).length,
      newLeads: funnel.NEW,
      pendingTestimonials,
    },
    content: {
      services: {
        total: services.length,
        published: services.filter((s) => s.published === true).length,
      },
      projects: {
        total: projects.length,
        published: projects.filter((p) => p.published === true).length,
        featured: projects.filter((p) => p.featured === true).length,
      },
      team: { total: team.length },
      heroSlides: {
        total: heroSlides.length,
        published: heroSlides.filter((h) => h.published === true).length,
      },
      testimonials: {
        total: testimonials.length,
        approved: testimonials.filter((t) => t.status === "approved").length,
        pending: pendingTestimonials,
        hidden: testimonials.filter((t) => t.status === "hidden").length,
      },
    },
    funnel: { ...funnel, winRate },
    leadsByDay,
    recentLeads: sortedLeads.slice(0, 5).map((l) => ({
      id: l.id,
      name: l.name,
      subject: l.subject ?? "",
      status: l.status,
      createdAt: toIso(l.createdAt, ""),
    })),
    recentInbox: sortedInbox.slice(0, 5).map((m) => ({
      id: m.id,
      from: m.from,
      subject: m.subject,
      receivedAt: toIso(m.receivedAt, ""),
      seen: m.seen,
    })),
  };

  const parsed = overviewSchema.safeParse(result);
  if (!parsed.success) throw new AppError("INTERNAL", 500, "Internal error");
  return parsed.data;
}
