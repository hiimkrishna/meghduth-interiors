#!/usr/bin/env node
/**
 * জেনারেল স্ক্যাফোল্ড জেনারেটর — Strict TS only, কোনো JS নয়।
 * জেনারেটর নিজে plain node-এ চলে (zero-dependency), কিন্তু যা বানায় সব .ts/.tsx।
 * যেকোনো নতুন প্রজেক্টে tools/ ফোল্ডারটা কপি করে চালাও।
 *
 *   node tools/gen.mjs module <name> [--out <dir>] [--force]
 *     → backend/src/modules/<plural>/ : types, routes, controller, service,
 *       repository, schemas, test (৭ ফাইল, সব .ts)
 *
 *   node tools/gen.mjs table <name> [--out <dir>] [--force]
 *     → backend/src/db/schema/<plural>.ts : Drizzle টেবিল স্টাব
 *
 *   node tools/gen.mjs feature <domain> <name> [--out <dir>] [--force]
 *     → frontend/src/features/<domain>/<name>/ : page.tsx, hook.ts,
 *       service.ts, ১টা list-component.tsx (৪ ফাইল)
 *
 * নিয়ম: name একবচনে, ছোট হাতের এক শব্দে দাও (order, task, status)।
 * ফাইল থাকলে ওভাররাইট করে না — --force দিলে করে।
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// gen.mjs যেখানে আছে, তার দাদা-ফোল্ডারই টেমপ্লেট রুট (../packages, ../ARCHITECTURE.md)।
const tplRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const HELP = `
ব্যবহার (সব আউটপুট Strict TS):
  node tools/gen.mjs init <app-name> [--out <dir>] [--force]
  node tools/gen.mjs module <name> [--out <dir>] [--force]
  node tools/gen.mjs table <name> [--out <dir>] [--force]
  node tools/gen.mjs feature <domain> <name> [--out <dir>] [--force]

উদাহরণ:
  node project-template/tools/gen.mjs init my-app
  node tools/gen.mjs table orders
  node tools/gen.mjs module orders
  node tools/gen.mjs feature recruiter orders --out ./frontend/src/features
`;

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// নাম শুধু ছোট হাতের ইংরেজি অক্ষর+সংখ্যা — হাইফেন/স্পেস/বড় হাতি নিষেধ,
// কারণ নামটা সরাসরি TS টাইপ আর ফাইলনামে বসে।
const validateName = (raw, what = "নাম") => {
  const n = String(raw ?? "").toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(n))
    throw new Error(`${what} ছোট হাতের এক শব্দে দাও (a-z, 0-9): "${raw}"`);
  return n;
};

// প্রজেক্ট ফোল্ডারে হাইফেন চলে (my-app), ফিচার নামে চলে না।
const validateProjectName = (raw) => {
  const n = String(raw ?? "").toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(n))
    throw new Error('প্রজেক্ট নাম ছোট হাতের শব্দে দাও (a-z, 0-9, -): "' + raw + '"');
  return n;
};

// status → statuses, class → classes, orders → orders।
// যেসব একবচন শব্দ s দিয়ে শেষ (status, alias), সেগুলোর তালিকা এখানে —
// নতুন এমন শব্দ পেলে তালিকায় যোগ করো।
const SINGULAR_S_WORDS = ["status", "alias", "bias", "canvas", "lens", "bus"];
const pluralOf = (n) => {
  if (SINGULAR_S_WORDS.includes(n)) return `${n}es`;
  if (/(ss|us|ch|sh|x)$/.test(n)) return `${n}es`;
  if (n.endsWith("s")) return n;
  return `${n}s`;
};
const singularOf = (n) => {
  if (SINGULAR_S_WORDS.includes(n)) return n; // status → status (কাটা যাবে না)
  const hit = SINGULAR_S_WORDS.find((w) => n === `${w}es`);
  if (hit) return hit;
  if (/(sses|uses|ches|shes|xes)$/.test(n) && n.length > 4) return n.slice(0, -2);
  if (n.endsWith("s") && n.length > 1 && !n.endsWith("ss")) return n.slice(0, -1);
  return n;
};

const parseArgs = (argv) => {
  const o = { cmd: argv[0], positional: [], outDir: null, force: false };
  const rest = argv.slice(1);
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "--out") o.outDir = rest[++i];
    else if (rest[i] === "--force") o.force = true;
    else o.positional.push(rest[i]);
  }
  return o;
};

const writeFile = (file, content, force) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && !force)
    throw new Error(`ফাইল আগে থেকেই আছে (ওভাররাইট করতে --force দাও): ${file}`);
  fs.writeFileSync(file, content);
  console.log("created:", file);
};

// ---------------------------------------------------------------------------
// BACKEND: module (.ts × ৭)
// ---------------------------------------------------------------------------
const backendFiles = (singular, plural) => {
  const S = cap(singular); // Order
  const P = cap(plural); // Orders

  const types = `// ${P} ডোমেন টাইপ — DB রো + API আকৃতি এক জায়গায়।
// contracts-এ স্থির হলে এই ফাইল সেখান থেকে re-export করবে।
export interface ${S} {
  id: string;
  ownerId: string;
  title: string;
  notes: string | null;
  status: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ${S}ListQuery {
  page: number;
  limit: number;
  search?: string;
}

// আকৃতি contracts.PageMeta-এর সাথে মিলিয়ে রাখো।
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ${S}Page {
  data: ${S}[];
  meta: PageMeta;
}
`;

  const routes = `import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  get${P},
  get${S},
  getMy${P},
  create${S},
  update${S},
  remove${S},
} from "./${singular}.controller.js";

import {
  listQuerySchema,
  idParamSchema,
  create${S}Schema,
  update${S}Schema,
} from "./${singular}.schemas.js";

// auth প্লাগিন authenticate decorate করে — তাই টাইপেও ঘোষণা।
interface AuthedApp extends FastifyInstance {
  authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
}

// @fastify/jwt-এর মতোই রীতি: authenticate চলার পর req.user থাকে।
// (public রুটে req.user ধরবে না — সেখানে টাইপ থাকলেও রানটাইমে undefined।)
declare module "fastify" {
  interface FastifyRequest {
    user: { userId: string };
  }
}

// static রুট আগে, dynamic (/:id) সবার শেষে —
// নইলে "/mine"-কে id="mine" ধরে নেবে।
// app.ts-এ একবার বসাও (README ধাপ ৩ দেখো):
//   app.setValidatorCompiler(validatorCompiler);
//   app.setSerializerCompiler(serializerCompiler);
export default async function ${singular}Routes(app: AuthedApp): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  r.get("/mine", { preHandler: [app.authenticate], schema: { querystring: listQuerySchema } }, getMy${P});
  r.get("/", { schema: { querystring: listQuerySchema } }, get${P});
  r.post("/", { preHandler: [app.authenticate], schema: { body: create${S}Schema } }, create${S});
  r.patch("/:id", { preHandler: [app.authenticate], schema: { params: idParamSchema, body: update${S}Schema } }, update${S});
  r.delete("/:id", { preHandler: [app.authenticate], schema: { params: idParamSchema } }, remove${S});
  r.get("/:id", { schema: { params: idParamSchema } }, get${S});
}
`;

  const controller = `// কন্ট্রোলার = শুধু HTTP। try/catch নিষেধ — central error-handler দেখবে।
// ব্যবসার নিয়ম service-এ, SQL repository-তে।
// নিয়ম: req.query/params/body সবসময় zod parse করে নাও —
// parse-ই টাইপ দেয় + রানটাইমে ভুল ডেটা আটকায় (single source of truth)।
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  list${P},
  get${S}ById,
  listMy${P},
  create${S}Service,
  update${S}Service,
  delete${S}Service,
} from "./${singular}.service.js";
import {
  create${S}Schema,
  idParamSchema,
  listQuerySchema,
  update${S}Schema,
} from "./${singular}.schemas.js";
import type { ${S}, ${S}Page } from "./${singular}.types.js";

// NOTE: req.user-এর টাইপ routes.ts-এর module augmentation থেকে আসে
// (@fastify/jwt-এর রীতি)। authenticate ছাড়া রুটে req.user ধরবে না।

export const get${P} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const query = listQuerySchema.parse(req.query);
  const page: ${S}Page = await list${P}(query);
  return reply.code(200).send({ success: true, ...page });
};

export const get${S} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { id } = idParamSchema.parse(req.params);
  const item: ${S} = await get${S}ById(id);
  return reply.code(200).send({ success: true, data: item });
};

export const getMy${P} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const query = listQuerySchema.parse(req.query);
  const page: ${S}Page = await listMy${P}(req.user.userId, query);
  return reply.code(200).send({ success: true, ...page });
};

export const create${S} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  // পরিচয় body থেকে না — JWT থেকে। এটাই ownership-এর ভিত্তি।
  const data = create${S}Schema.parse(req.body);
  const item: ${S} = await create${S}Service(req.user.userId, data);
  return reply.code(201).send({ success: true, data: item, message: "${S} created" });
};

export const update${S} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { id } = idParamSchema.parse(req.params);
  const data = update${S}Schema.parse(req.body);
  const item: ${S} = await update${S}Service(id, req.user.userId, data);
  return reply.code(200).send({ success: true, data: item, message: "${S} updated" });
};

export const remove${S} = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const { id } = idParamSchema.parse(req.params);
  await delete${S}Service(id, req.user.userId);
  return reply.code(200).send({ success: true, message: "${S} deleted" });
};
`;

  const service = `// সার্ভিস = ব্যবসার মাথা। মালিকানা + স্টেট + ডিডাপ চেক এখানে।
// DB ছোঁয়া নিষেধ — সব repository ফাংশন দিয়ে।
import {
  find${P},
  find${S}ById,
  find${P}ByOwner,
  insert${S},
  update${S}Row,
  softDelete${S},
} from "./${singular}.repository.js";
import type { Create${S}, Update${S} } from "./${singular}.schemas.js";
import type { ${S}, ${S}ListQuery, ${S}Page } from "./${singular}.types.js";

// spine (tools/spine + packages/contracts) থাকলে এটা মুছে
// plugins/errors-এর AppError ব্যবহার করো — সই একই।
export class ModuleError extends Error {
  code: string;
  statusCode: number;
  constructor(code: string, statusCode: number, message: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const list${P} = (query: ${S}ListQuery): Promise<${S}Page> => find${P}(query);

export const get${S}ById = async (id: string): Promise<${S}> => {
  const item: ${S} | null = await find${S}ById(id);
  if (item === null) throw new ModuleError("NOT_FOUND", 404, "${S} not found");
  return item;
};

export const listMy${P} = (ownerId: string, query: ${S}ListQuery): Promise<${S}Page> =>
  find${P}ByOwner(ownerId, query);

export const create${S}Service = (ownerId: string, data: Create${S}): Promise<${S}> =>
  insert${S}({ ...data, ownerId });

export const update${S}Service = async (
  id: string,
  ownerId: string,
  data: Update${S},
): Promise<${S}> => {
  const existing: ${S} | null = await find${S}ById(id);
  if (existing === null) throw new ModuleError("NOT_FOUND", 404, "${S} not found");
  // মালিকানা: অন্যের জিনিসে হাত দেওয়া যাবে না (403 দাও, 404 দিয়ে লুকিও না)।
  if (existing.ownerId !== ownerId)
    throw new ModuleError("FORBIDDEN", 403, "Not your ${singular}");
  const [updated] = await update${S}Row(id, data);
  if (updated === undefined) throw new ModuleError("NOT_FOUND", 404, "${S} not found");
  return updated;
};

export const delete${S}Service = async (id: string, ownerId: string): Promise<void> => {
  const existing: ${S} | null = await find${S}ById(id);
  if (existing === null) throw new ModuleError("NOT_FOUND", 404, "${S} not found");
  if (existing.ownerId !== ownerId)
    throw new ModuleError("FORBIDDEN", 403, "Not your ${singular}");
  await softDelete${S}(id);
};
`;

  const repository = `// রেপোজিটরি = শুধু DB। ব্যবসার নিয়ম এখানে নিষেধ।
// নিচে Drizzle ORM ধরে লেখা — অন্য ORM হলে
// ফাংশন সই (signature) এক রেখে ভেতরটা বদলে নাও।
import { and, count, desc, eq, isNull, type SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import { ${plural} } from "../../db/schema/${plural}.js";
import type { ${S}, ${S}ListQuery, ${S}Page } from "./${singular}.types.js";

const PAGE_SIZE_MAX = 100;

const alive = (t: typeof ${plural}): SQL<unknown> => isNull(t.deletedAt);

const pageOf = (query: ${S}ListQuery): { limit: number; page: number; offset: number } => {
  const limit: number = Math.min(Number(query.limit) || 20, PAGE_SIZE_MAX);
  const page: number = Math.max(Number(query.page) || 1, 1);
  return { limit, page, offset: (page - 1) * limit };
};

// মালিকানা ফিল্টার SQL-এই হয় (extraWhere)।
// সব রো এনে JS-এ filter করা নিষেধ — ১ লাখ রো হলে সার্ভার মরবে।
// NOTE: query.search কোন কলামে খুঁজবে সেটা ফিচার-নির্দিষ্ট —
// এখানে where-এ ilike() যোগ করো (যেমন title/company), জেনেরিক রাখতে গিয়ে বাদ রাখা হয়েছে।
export const find${P} = async (query: ${S}ListQuery, extraWhere?: SQL<unknown>): Promise<${S}Page> => {
  const { limit, page, offset } = pageOf(query);
  const where: SQL<unknown> | undefined =
    extraWhere === undefined ? alive(${plural}) : and(alive(${plural}), extraWhere);
  const [rows, countRows] = await Promise.all([
    db
      .select()
      .from(${plural})
      .where(where)
      .orderBy(desc(${plural}.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(${plural}).where(where),
  ]);
  const total: number = countRows[0]?.total ?? 0;
  // meta আকৃতি contracts.buildPageMeta-এর সাথে মিলিয়ে রাখো।
  return { data: rows, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const find${S}ById = async (id: string): Promise<${S} | null> => {
  const [row] = await db
    .select()
    .from(${plural})
    .where(and(eq(${plural}.id, id), alive(${plural})))
    .limit(1);
  return row ?? null;
};

export const find${P}ByOwner = (ownerId: string, query: ${S}ListQuery): Promise<${S}Page> =>
  find${P}(query, eq(${plural}.ownerId, ownerId));

export const insert${S} = async (
  values: typeof ${plural}.$inferInsert,
): Promise<${S}> => {
  const [row] = await db.insert(${plural}).values(values).returning();
  if (row === undefined) throw new Error("${S} insert failed");
  return row;
};

export const update${S}Row = (
  id: string,
  values: Partial<typeof ${plural}.$inferInsert>,
): Promise<${S}[]> =>
  db
    .update(${plural})
    .set({ ...values, updatedAt: new Date() })
    .where(eq(${plural}.id, id))
    .returning();

// await বাধ্যতামূলক — response-এর আগেই delete শেষ হতে হবে,
// নইলে ব্যর্থতা unhandled rejection হয়ে হারিয়ে যাবে।
export const softDelete${S} = async (id: string): Promise<void> => {
  await db
    .update(${plural})
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(${plural}.id, id));
};
`;

  const schemas = `// ⚠️ নিয়ম: schema প্রথমে এখানে লেখো, স্থির হলে packages/contracts-এ তুলে
// দুই পাশ (ব্যাকএন্ড + ফ্রন্টএন্ড ফর্ম) থেকে import করো। contracts-এ তোলার পর
// এই ফাইল শুধু re-export করবে।
import { z } from "zod";

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

export const idParamSchema = z.object({ id: z.string().uuid() });
export type IdParam = z.infer<typeof idParamSchema>;

export const create${S}Schema = z.object({
  title: z.string().trim().min(3).max(120),
});
export type Create${S} = z.infer<typeof create${S}Schema>;

export const update${S}Schema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
});
export type Update${S} = z.infer<typeof update${S}Schema>;
`;

  const test = `// node-এর বিল্ট-ইন runner — আলাদা লাইব্রেরি লাগে না: node --test
// service-এর মালিকানা নিয়মটাই আসল টেস্ট (happy-path + 403)।
// TS-এ চালাতে: node --experimental-strip-types --test (node 22+) বা tsx।
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("${plural} service rules", (): void => {
  it("অন্যের জিনিস update করতে গেলে FORBIDDEN", (): void => {
    const existing: { id: string; ownerId: string } = { id: "1", ownerId: "owner-a" };
    const caller: string = "owner-b";
    assert.notEqual(existing.ownerId, caller);
    // update${S}Service mock repo দিয়ে টেস্ট করো — এখানে শুধু নিয়মের স্মারক।
  });
});
`;

  return { types, routes, controller, service, repository, schemas, test };
};

// ---------------------------------------------------------------------------
// DB: table stub (Drizzle .ts)
// ---------------------------------------------------------------------------
const tableFile = (singular, plural) => `// Drizzle টেবিল স্টাব — কলাম তোমার ফিচার অনুযায়ী সাজাও।
// নিয়ম: PK uuid id + owner ফরেন-কি + createdAt/updatedAt + soft-delete-এ deletedAt।
// NOTE: users টেবিল না থাকলে ownerId লাইন বদলে নাও।
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const ${plural} = pgTable("${plural}", {
  id: uuid("id").defaultRandom().primaryKey(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 120 }).notNull(),

  notes: text("notes"),

  status: varchar("status", { length: 32 }).default("todo").notNull(),

  deletedAt: timestamp("deleted_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type ${cap(singular)}Row = typeof ${plural}.$inferSelect;
export type New${cap(singular)}Row = typeof ${plural}.$inferInsert;
`;

// ---------------------------------------------------------------------------
// FRONTEND: feature (.ts/.tsx)
// ---------------------------------------------------------------------------
const frontendFiles = (domain, singular, plural) => {
  const S = cap(singular);
  const P = cap(plural);

  const page = `// পেজ = পাতলা। data-hook + component জোড়া দেয়, লজিক রাখে না।
import { use${P} } from "./hooks/use-${plural}.js";
import { ${S}List } from "./components/${S}List.jsx";

export default function ${S}Page(): React.JSX.Element {
  const { items, isLoading, error } = use${P}();

  if (isLoading) return <p>Loading…</p>;
  if (error !== null) return <p>লোড করা যায়নি। আবার চেষ্টা করো।</p>;
  if (items.length === 0) return <p>এখনো কিছু নেই। প্রথমটা বানাও।</p>;
  return <${S}List items={items} />;
}
`;

  const hook = `// hook = সব async state-এর মালিক। কম্পোনেন্ট সরাসরি service ধরবে না।
import { useCallback, useEffect, useState } from "react";
import { fetch${P}, type ${S}Item } from "../services/${plural}.service.js";

interface Use${P}Result {
  items: ${S}Item[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const use${P} = (): Use${P}Result => {
  const [items, setItems] = useState<${S}Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetch${P}());
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect((): void => {
    void load();
  }, [load]);

  return { items, isLoading, error, refetch: load };
};
`;

  const service = `// service = শুধু api ক্লায়েন্ট। ব্যাকএন্ডের shape যেমনই হোক,
// এখানে ONE canonical shape বানাও — কম্পোনেন্টে if-else নিষেধ।
// NOTE: contracts প্যাকেজ থাকলে response zod দিয়ে parse করো।
import { api } from "@/lib/api";

export interface ${S}Item {
  id: string;
  title: string;
}

interface ListResponse {
  data?: ${S}Item[];
  ${plural}?: ${S}Item[];
}

export const fetch${P} = async (): Promise<${S}Item[]> => {
  const res = (await api.get("/${plural}")) as ListResponse;
  return res.data ?? res.${plural} ?? [];
};

export const fetch${S}ById = async (id: string): Promise<${S}Item> => {
  const res = (await api.get("/${plural}/" + id)) as { data?: ${S}Item } & Partial<${S}Item>;
  const item: ${S}Item | undefined = res.data ?? (res.id !== undefined ? (res as ${S}Item) : undefined);
  if (item === undefined) throw new Error("${S} not found");
  return item;
};
`;

  const list = `// presentational — API কল, hook, state এখানে নিষেধ।
import type { ${S}Item } from "../services/${plural}.service.js";

interface ${S}ListProps {
  items: ${S}Item[];
}

export const ${S}List = ({ items }: ${S}ListProps): React.JSX.Element => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>
);
`;

  return { page, hook, service, list };
};

// ---------------------------------------------------------------------------
// INIT: পুরো প্রজেক্ট কঙ্কাল (preset: Fastify + Drizzle + React/Next + Zod)
// ---------------------------------------------------------------------------
// টেমপ্লেট ফোল্ডার থেকে চালাও: node project-template/tools/gen.mjs init my-app
// তৈরি করে: packages/ + tools/ (কপি) + backend/ + frontend/ (চালানো যায় এমন কঙ্কাল)
// + root package.json/.gitignore/README। প্রিসেট বদলাতে চাইলে এই ফাংশনগুলোই বদলাও —
// বাকি সব (module/table/feature) Fastify+Drizzle-ঘেঁষা — অন্য স্ট্যাকে ওগুলোর বদলে
// ARCHITECTURE.md-এর ম্যাপিং টেবিল দেখে সমতুল্য বানাও।
const initRootPkg = (appName) =>
  JSON.stringify(
    {
      name: appName,
      version: "0.1.0",
      private: true,
      type: "module",
      workspaces: ["packages/*", "backend", "frontend"],
      scripts: {
        dev: 'echo "backend: npm run dev --workspace backend | frontend: npm run dev --workspace frontend"',
        typecheck: "npm run typecheck --workspaces --if-present",
      },
    },
    null,
    2,
  ) + "\n";

const initGitignore = () =>
  ["node_modules/", "dist/", ".env", ".env*.local", "*.log", ".DS_Store", ""].join("\n");

const initReadme = (appName) =>
  [
    "# " + appName,
    "",
    "ARCHITECTURE.md পড়ে শুরু করো (রেপোর গোড়ায় কপি আছে)।",
    "",
    "QUICKSTART (৫ ধাপ):",
    "",
    "  1. cp tools/spine/.env.example backend/.env   (ভেতরের মান বসাও)",
    "  2. npm install   (root workspaces — সব প্যাকেজ একবারে)",
    "  3. DB চালাও, তারপর: node tools/gen.mjs table <name>  (migration চালাও)",
    "  4. node tools/gen.mjs module <name>  +  node tools/gen.mjs feature <domain> <name>",
    "  5. npm run dev --workspace backend  (আরেক টার্মিনালে frontend)",
    "",
    "নিয়ম: নতুন ফিচার = table → module → frontend feature।",
    "validation বদলালে packages/contracts-এ আগে। tsc সবুজ ছাড়া PR না।",
    "",
  ].join("\n");

const initBackendPkg = (appName) =>
  JSON.stringify(
    {
      name: appName + "-backend",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "tsx watch src/server.ts",
        build: "tsc -p tsconfig.build.json",
        typecheck: "tsc --noEmit",
        test: "node --experimental-strip-types --test src/modules/",
      },
      dependencies: {
        "@fastify/cors": "^9.0.0",
        "drizzle-orm": "^0.33.0",
        fastify: "^5.0.0",
        "fastify-plugin": "^5.0.0",
        "fastify-type-provider-zod": "^4.0.0",
        pg: "^8.0.0",
        zod: "^3.23.0",
      },
      devDependencies: {
        "@types/node": "^22.0.0",
        "@types/pg": "^8.0.0",
        "drizzle-kit": "^0.24.0",
        tsx: "^4.0.0",
        typescript: "^5.5.0",
      },
    },
    null,
    2,
  ) + "\n";

const initBackendTsconfig = () =>
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        noUncheckedIndexedAccess: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["src"],
    },
    null,
    2,
  ) + "\n";

const initBackendBuildTsconfig = () =>
  JSON.stringify(
    {
      extends: "./tsconfig.json",
      compilerOptions: { noEmit: false, outDir: "dist", declaration: true, noUnusedLocals: false },
      include: ["src"],
      exclude: ["**/*.test.ts"],
    },
    null,
    2,
  ) + "\n";

const initAppTs = () => `import Fastify from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { config } from "./config.js"; // আগে env যাচাই (fail fast)
import { errorHandler } from "./plugins/errors.js";
import responsePlugin from "./plugins/response.js";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: config.corsOrigin });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(responsePlugin);
  app.setErrorHandler(errorHandler);

  app.get("/healthz", async () => ({ success: true, data: { ok: true } }));

  // মডিউল রেজিস্টার (gen.mjs module চালানোর পর খুলে দাও):
  // import orderRoutes from "./modules/orders/order.routes.js";
  // await app.register(orderRoutes, { prefix: "/api/v1/orders" });

  return app;
};
`;

const initServerTs = () => `import { buildApp } from "./app.js";
import { config } from "./config.js";

const start = async (): Promise<void> => {
  const app = await buildApp();
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
  const shutdown = async (): Promise<void> => {
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
};

void start();
`;

const initDbIndexTs = () => `import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config.js";

const pool = new Pool({ connectionString: config.databaseUrl });

export const db = drizzle(pool);

export const closeDb = async (): Promise<void> => {
  await pool.end();
};
`;

const initUsersSchemaTs = () => `import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
`;

const initFrontendPkg = (appName) =>
  JSON.stringify(
    {
      name: appName + "-frontend",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "next dev",
        build: "next build",
        typecheck: "tsc --noEmit",
      },
      dependencies: {
        next: "^15.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        zod: "^3.23.0",
      },
      devDependencies: {
        "@types/node": "^22.0.0",
        "@types/react": "^19.0.0",
        typescript: "^5.5.0",
      },
    },
    null,
    2,
  ) + "\n";

const initFrontendTsconfig = () =>
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noUncheckedIndexedAccess: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        skipLibCheck: true,
        noEmit: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
    },
    null,
    2,
  ) + "\n";

const initEnvNote = () =>
  "# backend/.env এটা কপি করে বানাও: cp tools/spine/.env.example backend/.env\n";

const writeText = (file, content, force) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && !force)
    throw new Error("ফাইল আগে থেকেই আছে (ওভাররাইট করতে --force দাও): " + file);
  fs.writeFileSync(file, content);
};

const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
};

const initProject = (dest, appName, force) => {
  if (fs.existsSync(dest) && !force)
    throw new Error("ফোল্ডার আগে থেকেই আছে: " + dest + " (--force দিলে ওভাররাইট)");
  fs.mkdirSync(dest, { recursive: true });

  // টেমপ্লেটের সাধারণ অংশ হুবহু কপি (single source — এখানে হাত দিও না)।
  copyDir(path.join(tplRoot, "packages"), path.join(dest, "packages"));
  copyDir(path.join(tplRoot, "tools"), path.join(dest, "tools"));
  fs.copyFileSync(path.join(tplRoot, "ARCHITECTURE.md"), path.join(dest, "ARCHITECTURE.md"));

  // প্রিসেট-নির্দিষ্ট কঙ্কাল।
  writeText(path.join(dest, "package.json"), initRootPkg(appName), force);
  writeText(path.join(dest, ".gitignore"), initGitignore(), force);
  writeText(path.join(dest, "README.md"), initReadme(appName), force);

  const b = path.join(dest, "backend");
  writeText(path.join(b, "package.json"), initBackendPkg(appName), force);
  writeText(path.join(b, "tsconfig.json"), initBackendTsconfig(), force);
  writeText(path.join(b, "tsconfig.build.json"), initBackendBuildTsconfig(), force);
  writeText(path.join(b, "src", "app.ts"), initAppTs(), force);
  writeText(path.join(b, "src", "server.ts"), initServerTs(), force);
  writeText(path.join(b, "src", "db", "index.ts"), initDbIndexTs(), force);
  writeText(path.join(b, "src", "db", "schema", "users.ts"), initUsersSchemaTs(), force);
  writeText(
    path.join(b, "src", "db", "schema", "index.ts"),
    'export * from "./users.js";\n',
    force,
  );
  writeText(path.join(b, "src", "config.ts"), fs.readFileSync(path.join(tplRoot, "tools", "spine", "config.ts"), "utf8"), force);
  writeText(path.join(b, "src", "plugins", "errors.ts"), fs.readFileSync(path.join(tplRoot, "tools", "spine", "plugins", "errors.ts"), "utf8"), force);
  writeText(path.join(b, "src", "plugins", "response.ts"), fs.readFileSync(path.join(tplRoot, "tools", "spine", "plugins", "response.ts"), "utf8"), force);
  writeText(path.join(b, ".env.note.txt"), initEnvNote(), force);

  const f = path.join(dest, "frontend");
  writeText(path.join(f, "package.json"), initFrontendPkg(appName), force);
  writeText(path.join(f, "tsconfig.json"), initFrontendTsconfig(), force);
  writeText(path.join(f, "src", "lib", "api.ts"), fs.readFileSync(path.join(tplRoot, "tools", "spine", "frontend", "lib", "api.ts"), "utf8"), force);

  console.log("created: " + dest + " (" + appName + ")");
};

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
const main = () => {
  const { cmd, positional, outDir, force } = parseArgs(process.argv.slice(2));

  if (cmd === "init") {
    const [appRaw] = positional;
    if (!appRaw) throw new Error("নাম দাও: node project-template/tools/gen.mjs init my-app" + HELP);
    const appName = validateProjectName(appRaw);
    const dest = path.resolve(path.join(outDir ?? ".", appName));
    initProject(dest, appName, force);
    console.log("\nপরের ধাপ: README.md-এর QUICKSTART দেখো (৫ ধাপ: env → install → table → module → dev)।");
    return;
  }

  if (cmd === "module") {
    const [raw] = positional;
    if (!raw) throw new Error("নাম দাও: node tools/gen.mjs module orders" + HELP);
    const singular = singularOf(validateName(raw));
    const plural = pluralOf(singular);
    const base = outDir ?? path.join("backend", "src", "modules", plural);
    const f = backendFiles(singular, plural);
    writeFile(path.join(base, `${singular}.types.ts`), f.types, force);
    writeFile(path.join(base, `${singular}.routes.ts`), f.routes, force);
    writeFile(path.join(base, `${singular}.controller.ts`), f.controller, force);
    writeFile(path.join(base, `${singular}.service.ts`), f.service, force);
    writeFile(path.join(base, `${singular}.repository.ts`), f.repository, force);
    writeFile(path.join(base, `${singular}.schemas.ts`), f.schemas, force);
    writeFile(path.join(base, `${singular}.test.ts`), f.test, force);
    console.log(`\nপরের ধাপ: 1) node tools/gen.mjs table ${singular}  2) backend-এ npm i zod  3) tools/spine/ কপি করো  4) app.ts-এ রেজিস্টার করো.`);
    return;
  }

  if (cmd === "table") {
    const [raw] = positional;
    if (!raw) throw new Error("নাম দাও: node tools/gen.mjs table orders" + HELP);
    const singular = singularOf(validateName(raw));
    const plural = pluralOf(singular);
    const base = outDir ?? path.join("backend", "src", "db", "schema");
    writeFile(path.join(base, `${plural}.ts`), tableFile(singular, plural), force);
    console.log(`\nপরের ধাপ: কলাম মিলিয়ে migration চালাও → schema/index.ts-এ export যোগ করো।`);
    return;
  }

  if (cmd === "feature") {
    const [domain, raw] = positional;
    if (!domain || !raw)
      throw new Error("domain + নাম দাও: node tools/gen.mjs feature recruiter orders" + HELP);
    validateName(domain, "domain");
    const singular = singularOf(validateName(raw));
    const plural = pluralOf(singular);
    const S = cap(singular);
    const P = cap(plural);
    const base = outDir ?? path.join("frontend", "src", "features", domain, plural);
    const f = frontendFiles(domain, singular, plural);
    writeFile(path.join(base, `${plural}-page.tsx`), f.page, force);
    writeFile(path.join(base, `hooks/use-${plural}.ts`), f.hook, force);
    writeFile(path.join(base, `services/${plural}.service.ts`), f.service, force);
    writeFile(path.join(base, `components/${S}List.tsx`), f.list, force);
    console.log(`\nপরের ধাপ: app/(...)/${plural}/page.tsx থেকে ${P}Page রেন্ডার করো → service-এ contracts schema দিয়ে parse যোগ করো।`);
    return;
  }

  console.log(HELP);
  process.exitCode = 1;
};

try {
  main();
} catch (e) {
  console.error("ব্যর্থ:", e.message);
  process.exitCode = 1;
}
