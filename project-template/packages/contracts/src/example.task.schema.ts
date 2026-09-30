import { z } from "zod";
import { idParamSchema, nonEmptyString } from "./common.js";

// ⭐ উদাহরণ ফিচার (task) — নতুন ফিচার বানানোর সময় এই ফাইলটা কপি করে
// নাম বদলে নাও। এতে ৩টা প্যাটার্ন একসাথে দেখানো আছে:
// 1) create/update schema  2) enum status  3) transition ম্যাপ (স্টেট মেশিন)।

// স্ট্যাটাস খোলা string না — enum। টাইপো করলে কম্পাইলেই ধরা পড়বে।
export const TASK_STATUSES = ["todo", "doing", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const taskStatusSchema = z.enum(TASK_STATUSES);

// কোন স্ট্যাটাস থেকে কোথায় যাওয়া যায় — এই ম্যাপই নিয়ম।
// অবৈধ লাফ (যেমন done → todo) service 422 দিয়ে আটকাবে।
export const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ["doing"],
  doing: ["todo", "done"],
  done: [],
};

export const canTransitionTask = (from: TaskStatus, to: TaskStatus): boolean =>
  TASK_TRANSITIONS[from].includes(to);

export const createTaskSchema = z.object({
  title: nonEmptyString(120),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: nonEmptyString(120).optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  status: taskStatusSchema.optional(),
});

export type UpdateTask = z.infer<typeof updateTaskSchema>;

export const taskIdParamSchema = idParamSchema;
