import { NextResponse } from "next/server";
import type { PageMeta } from "@/packages/contracts/src/pagination";

// নিয়ন্ত্রকে try/catch লেখা নিষেধ — শুধু ok()/fail() জবাব দাও।
export function ok<T>(data: T, message?: string, meta?: PageMeta, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message !== undefined ? { message } : {}),
      ...(meta !== undefined ? { meta } : {}),
    },
    { status },
  );
}

export class AppError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const BadRequest = (message = "Invalid request"): AppError =>
  new AppError("VALIDATION_ERROR", 400, message);
export const Unauthorized = (message = "Unauthorized"): AppError =>
  new AppError("UNAUTHORIZED", 401, message);
export const Forbidden = (message = "Forbidden"): AppError =>
  new AppError("FORBIDDEN", 403, message);
export const NotFound = (message = "Not found"): AppError =>
  new AppError("NOT_FOUND", 404, message);
export const Conflict = (message = "Conflict"): AppError =>
  new AppError("CONFLICT", 409, message);
export const Unprocessable = (message = "Invalid status transition"): AppError =>
  new AppError("UNPROCESSABLE", 422, message);

export function fail(err: unknown, reqId?: string): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, message: err.message, code: err.code, ...(reqId ? { reqId } : {}) },
      { status: err.status },
    );
  }
  // অপ্রত্যাশিত ত্রুটি — ক্লায়েন্টে জেনেরিক বার্তা, আসল কারণ সার্ভার লগে (reqId দিয়ে মেলাও)।
  // লগ না থাকলে পরের "Internal error"-এর কারণ আবার অন্ধকারে থাকবে।
  console.error("Internal error", {
    reqId: reqId ?? null,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  return NextResponse.json(
    { success: false, message: "Internal error", code: "INTERNAL", ...(reqId ? { reqId } : {}) },
    { status: 500 },
  );
}

export function withReqId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
