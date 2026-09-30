// চুক্তি থেকে পুনঃরপ্তানি — নতুন নিয়ম মানেই contracts-এ আগে।
export {
  inboxEmailSchema,
  markSeenSchema,
  inboxSyncResultSchema,
  inboxEmailsPageSchema,
} from "@/packages/contracts/src/inbox.schema";
export type {
  InboxEmail,
  MarkSeen,
  InboxSyncResult,
  InboxEmailsPage,
} from "@/packages/contracts/src/inbox.schema";
