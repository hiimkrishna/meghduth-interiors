import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { z } from "zod";
import { AppError } from "./response";
import { getDb } from "@/server/db/client";
import { emailDeliveryLogs } from "@/server/db/drizzle-schema";

// পাঠানো (SMTP) — অ্যাডমিন থেকে মেইলের উত্তর যায়।
// env: SMTP_HOST, SMTP_PORT (ডিফল্ট 587), SMTP_USER, SMTP_PASS,
//      SMTP_SECURE (465 হলে true), SMTP_FROM (ডিফল্ট SMTP_USER)।

export interface SendReplyInput {
  to: string;
  subject: string;
  body: string;
  inReplyTo?: string;
  fromName?: string;
  adminId?: string;
  adminEmail?: string;
}

let transporter: Transporter | null = null;

function readEnv(): {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
} | null {
  const host = (process.env.SMTP_HOST ?? "").trim();
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = process.env.SMTP_PASS ?? "";
  if (host === "" || user === "" || pass === "") return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure =
    (process.env.SMTP_SECURE ?? "").trim().toLowerCase() === "true" || port === 465;
  const from = (process.env.SMTP_FROM ?? "").trim() || user;
  return { host, port, user, pass, secure, from };
}

export function isSmtpConfigured(): boolean {
  return readEnv() !== null;
}

function getTransporter(): Transporter {
  const cfg = readEnv();
  if (cfg === null)
    throw new AppError("INTERNAL", 503, "Email sending is not configured");
  if (transporter !== null) return transporter;
  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  return transporter;
}

function generateMessageId(): string {
  return `<${crypto.randomUUID()}@meghduthdesign.com>`;
}

async function logEmailDelivery(
  messageId: string,
  toEmail: string,
  fromEmail: string,
  subject: string,
  status: "sent" | "delivered" | "bounced" | "opened" | "clicked" | "complained",
  providerMessageId?: string,
  errorCode?: string,
  errorMessage?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const db = getDb();
  if (!db) return;
  
  try {
    await db.insert(emailDeliveryLogs).values({
      messageId,
      toEmail,
      fromEmail,
      subject: subject.slice(0, 1000),
      status,
      provider: "smtp",
      providerMessageId,
      errorCode: errorCode ?? null,
      errorMessage: errorMessage ?? null,
      metadata: metadata ?? {},
      sentAt: status === "sent" ? new Date() : undefined,
      deliveredAt: status === "delivered" ? new Date() : undefined,
      openedAt: status === "opened" ? new Date() : undefined,
      clickedAt: status === "clicked" ? new Date() : undefined,
      complainedAt: status === "complained" ? new Date() : undefined,
    });
  } catch {
    // Log but don't fail the email send
    console.error("Failed to log email delivery:", { messageId, status });
  }
}

export async function sendReply(input: SendReplyInput): Promise<{ messageId: string }> {
  const cfg = readEnv();
  if (cfg === null)
    throw new AppError("INTERNAL", 503, "Email sending is not configured");
  
  const stripNewlines = (s: string): string => s.replace(/[\r\n]/g, "").trim();
  const toStripped: string = stripNewlines(input.to);
  const addrOnly: string = (() => {
    const m: RegExpMatchArray | null = toStripped.match(/<([^<>]+)>\s*$/);
    const inner: string | undefined = m?.[1]?.trim();
    return inner !== undefined && inner !== "" ? inner : toStripped;
  })();
  const toParsed = z.string().trim().min(1).max(320).email().safeParse(addrOnly);
  if (!toParsed.success || toStripped === "" || stripNewlines(input.body).trim() === "") {
    throw new AppError("VALIDATION_ERROR", 400, "Recipient and message are required");
  }
  
  const messageId = generateMessageId();
  const subject: string = stripNewlines(input.subject).slice(0, 1000);
  const fromName: string | undefined =
    input.fromName !== undefined ? stripNewlines(input.fromName).slice(0, 120) : undefined;

  try {
    const info = await getTransporter().sendMail({
      from: fromName ? `"${fromName}" <${cfg.from}>` : cfg.from,
      to: toStripped,
      subject,
      text: input.body,
      messageId,
      ...(input.inReplyTo ? { inReplyTo: input.inReplyTo, references: [input.inReplyTo] } : {}),
    });

    // Log successful send
    await logEmailDelivery(
      messageId,
      toStripped,
      cfg.from,
      subject,
      "sent",
      info.messageId,
      undefined,
      undefined,
      { adminId: input.adminId, adminEmail: input.adminEmail }
    );

    return { messageId: info.messageId };
  } catch (err) {
    // Log failure
    await logEmailDelivery(
      messageId,
      toStripped,
      cfg.from,
      subject,
      "bounced",
      undefined,
      "SMTP_ERROR",
      err instanceof Error ? err.message : "Unknown error",
      { adminId: input.adminId, adminEmail: input.adminEmail }
    );
    throw new AppError("INTERNAL", 500, "Failed to send email");
  }
}

// Webhook handler for email provider callbacks (Postmark, SendGrid, etc.)
export async function handleEmailWebhook(
  provider: "postmark" | "sendgrid" | "mailgun",
  payload: unknown
): Promise<void> {
  // Implementation depends on provider
  // This would parse the webhook payload and update emailDeliveryLogs
  const db = getDb();
  if (!db) return;
  
  // Example for Postmark bounce webhook
  if (provider === "postmark") {
    const data = payload as Record<string, unknown>;
    if (data.Type === "Bounce") {
      await logEmailDelivery(
        data.MessageID as string,
        data.Email as string,
        data.From as string,
        data.Subject as string,
        "bounced",
        data.MessageID as string,
        data.BounceCode as string,
        data.Description as string,
        data
      );
    }
    if (data.Type === "Open") {
      await logEmailDelivery(
        data.MessageID as string,
        data.Email as string,
        data.From as string,
        data.Subject as string,
        "opened",
        data.MessageID as string,
        undefined,
        undefined,
        data
      );
    }
    if (data.Type === "Click") {
      await logEmailDelivery(
        data.MessageID as string,
        data.Email as string,
        data.From as string,
        data.Subject as string,
        "clicked",
        data.MessageID as string,
        undefined,
        undefined,
        data
      );
    }
  }
}