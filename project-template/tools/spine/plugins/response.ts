// reply.ok(data) — একটাই response আকৃতি { success, data, message?, meta? }।
// ব্যবহার: backend/src/plugins/response.ts হিসেবে কপি করো, app.ts-এ একবার:
//   import responsePlugin from "./plugins/response.js";
//   await app.register(responsePlugin);
// তারপর কন্ট্রোলারে: return reply.ok(item, "Created", 201);
import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    ok<T>(data: T, message?: string, statusCode?: number, meta?: unknown): FastifyReply;
  }
}

export default fp(async (app: FastifyInstance): Promise<void> => {
  app.decorateReply(
    "ok",
    function <T>(this: FastifyReply, data: T, message?: string, statusCode = 200, meta?: unknown): FastifyReply {
      return this.code(statusCode).send({
        success: true,
        data,
        ...(message !== undefined ? { message } : {}),
        ...(meta !== undefined ? { meta } : {}),
      });
    },
  );
});
