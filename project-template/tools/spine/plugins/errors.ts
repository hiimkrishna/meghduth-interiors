// Central error — কন্ট্রোলারে try/catch লেখা নিষেধ, শুধু throw করো।
// ব্যবহার: backend/src/plugins/errors.ts হিসেবে কপি করো, app.ts-এ একবার:
//   import { errorHandler } from "./plugins/errors.js";
//   app.setErrorHandler(errorHandler);
// কোডগুলো packages/contracts-এর ERROR_CODES-এর সাথে মিলিয়ে রাখো।
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export class AppError extends Error {
  code: string;
  statusCode: number;
  constructor(code: string, statusCode: number, message: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const BadRequest = (message = "Bad request"): AppError =>
  new AppError("VALIDATION_ERROR", 400, message);
export const Unauthorized = (message = "Unauthorized"): AppError =>
  new AppError("UNAUTHORIZED", 401, message);
export const Forbidden = (message = "Forbidden"): AppError =>
  new AppError("FORBIDDEN", 403, message);
export const NotFound = (message = "Not found"): AppError =>
  new AppError("NOT_FOUND", 404, message);
export const Conflict = (message = "Conflict"): AppError =>
  new AppError("CONFLICT", 409, message);

const STATUS_BY_CODE: Record<string, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  UNPROCESSABLE: 422,
};

interface CodedError {
  code?: string;
  statusCode?: number;
}

export const errorHandler = (
  err: FastifyError & CodedError,
  req: FastifyRequest,
  reply: FastifyReply,
): FastifyReply => {
  // Fastify schema-validation এরর (zod provider সহ)।
  if (err.validation !== undefined || err.code === "FST_ERR_VALIDATION") {
    return reply.code(400).send({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      reqId: req.id,
    });
  }
  const status: number = err.statusCode ?? STATUS_BY_CODE[err.code ?? ""] ?? 500;
  req.log.error({ reqId: req.id, err });
  // 500-তে ভেতরের কথা বাইরে যাবে না — লগে থাকবে, ইউজার পাবে generic।
  if (status >= 500) {
    return reply.code(500).send({
      success: false,
      message: "Internal error",
      code: "INTERNAL",
      reqId: req.id,
    });
  }
  return reply.code(status).send({
    success: false,
    message: err.message,
    code: err.code ?? "ERROR",
    reqId: req.id,
  });
};
