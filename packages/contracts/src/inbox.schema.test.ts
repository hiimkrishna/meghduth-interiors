import { describe, it, expect } from "vitest";
import { inboxEmailSchema, replyEmailSchema, inboxEmailsPageSchema } from "./inbox.schema";

describe("Inbox Schema", () => {
  it("validates a valid inbox email", () => {
    const validEmail = {
      id: 1,
      messageId: "<test@example.com>",
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Test Subject",
      snippet: "Test snippet",
      body: "Test body content",
      receivedAt: new Date().toISOString(),
      seen: false,
      replied: false,
    };

    const result = inboxEmailSchema.safeParse(validEmail);
    expect(result.success).toBe(true);
  });

  it("validates inbox email with date object", () => {
    const validEmail = {
      id: 1,
      messageId: "<test@example.com>",
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Test Subject",
      snippet: "Test snippet",
      body: "Test body content",
      receivedAt: new Date(),
      seen: false,
      replied: false,
    };

    const result = inboxEmailSchema.safeParse(validEmail);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const invalidEmail = {
      id: 1,
      // missing messageId, from, etc.
    };

    const result = inboxEmailSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
  });

  it("validates reply email body", () => {
    const validReply = { body: "This is a reply message" };
    const result = replyEmailSchema.safeParse(validReply);
    expect(result.success).toBe(true);
  });

  it("rejects empty reply body", () => {
    const invalidReply = { body: "" };
    const result = replyEmailSchema.safeParse(invalidReply);
    expect(result.success).toBe(false);
  });

  it("rejects reply body too long", () => {
    const invalidReply = { body: "a".repeat(5001) };
    const result = replyEmailSchema.safeParse(invalidReply);
    expect(result.success).toBe(false);
  });

  it("validates inbox emails page", () => {
    const validPage = {
      items: [
        {
          id: 1,
          messageId: "<test1@example.com>",
          from: "sender1@example.com",
          to: "recipient@example.com",
          subject: "Test 1",
          snippet: "Snippet 1",
          body: "Body 1",
          receivedAt: new Date().toISOString(),
          seen: false,
          replied: false,
        },
      ],
      unread: 1,
    };

    const result = inboxEmailsPageSchema.safeParse(validPage);
    expect(result.success).toBe(true);
  });
});