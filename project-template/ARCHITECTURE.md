# জেনারেল প্রজেক্ট আর্কিটেকচার ব্লুপ্রিন্ট
> SkillSync AI (Fastify + Drizzle + PostgreSQL + Next.js) থেকে শেখা পাঠ দিয়ে বানানো।
> উদ্দেশ্য: ভবিষ্যতে **যেকোনো স্ট্যাক, যেকোনো ধরনের রেপো** (monorepo / আলাদা frontend-backend / Next.js fullstack) দিয়ে নতুন প্রোডাক্ট বানানোর সময় এই একটা ফাইলই রেফারেন্স হিসেবে ব্যবহার করা।
> দৃষ্টিভঙ্গি: সিনিয়র আর্কিটেক্ট — স্কেলেবল, নির্ভরযোগ্য, সিকিউর।

---

## ১. এই আর্কিটেকচারের নাম কী, আর কেন এটা সহজ লাগে

**নাম: ফিচার-ভিত্তিক ভার্টিক্যাল স্লাইস আর্কিটেকচার**
(আরেক নাম: মডুলার মনোলিথ / স্ক্রিমিং আর্কিটেকচার — ফোল্ডার দেখলেই ব্যবসার ফিচারের নাম চোখে পড়ে, ফ্রেমওয়ার্কের নাম না।)

এটা MVC না, লেয়ার্ড n-tier না, মাইক্রোসার্ভিসও না। প্রতিটা ফিচার (যেমন jobs, applications, resumes) **উপর থেকে নিচ পর্যন্ত একটা স্বয়ংসম্পূর্ণ টুকরা** — রুট থেকে ডাটাবেজ পর্যন্ত সব এক ফোল্ডারে। তাই প্রজেক্ট যত বড়ই হোক, তোমাকে একবারে শুধু একটা ফোল্ডার খুললেই হয়। বাগ খুঁজতেও একটাই দিক: `UI → hook → service → api → route → controller → service → repository → DB`।

**যে ৫টা সিদ্ধান্ত সব প্রজেক্টে ধরে রাখবে:**

| # | সিদ্ধান্ত | কেন কাজ করে |
|---|----------|--------------|
| ১ | ফিচার অনুযায়ী ফোল্ডার — ব্যাকএন্ডে `modules/<feature>/`, ফ্রন্টএন্ডে `features/<domain>/<feature>/` | নতুন ডেভ এক ফোল্ডার খুলেই পুরো ছবি পায়, ১০ ফোল্ডারে ঘুরতে হয় না |
| ২ | একমুখী ফ্লো — কোনো লেয়ার টপকানো নিষেধ | বাগ হলে ঠিক কোন স্তরে তাকাবে সেটা আগে থেকেই জানা |
| ৩ | চিকন কন্ট্রোলার, মোটা সার্ভিস, বোকা রেপোজিটরি | HTTP-এর কথা কন্ট্রোলারে, ব্যবসার নিয়ম সার্ভিসে, SQL শুধু রেপোজিটরিতে — টেস্ট করা সহজ |
| ৪ | একটাই API ক্লায়েন্ট (`lib/api.ts` বা সমতুল্য) | টোকেন, টাইমআউট, এরর — সব এক জায়গায়। কম্পোনেন্টে কখনো সরাসরি fetch না |
| ৫ | সার্ভারেই অথরাইজেশন বাধ্যতামূলক | ফ্রন্টএন্ডের রোল-চেক শুধু দেখানোর জন্য। আসল গেট ব্যাকএন্ডের প্রতিটা রুটে |

---

## ২. যেকোনো স্ট্যাকে ব্যবহার — রেপো সাজানোর ৩টা ধরন

তোমার প্রজেক্ট যেমনই হোক, নিচের ৩টা ধরনের যেকোনো একটা বেছে নাও। ভেতরের ফিচার-স্লাইস নিয়ম সবখানে এক।

### ধরন A — Monorepo (SkillSync-এর মতো, সুপারিশকৃত)

```text
my-project/
├── backend/src/
│   ├── app.ts                   # সব প্লাগিন + রুট এখানেই (Strict TS — JS নিষেধ)
│   ├── server.ts                # শুধু listen() + graceful shutdown
│   ├── config.ts                # env যাচাই — process.env ছড়ানো নিষেধ
│   ├── plugins/                 # auth, error-handler
│   ├── modules/<feature>/       # ভার্টিক্যাল স্লাইস (৩ নম্বর অংশ দেখো)
│   ├── db/schema/               # প্রতি টেবিলে এক ফাইল (.ts)
│   └── utils/                   # খাঁটি হেলপার (otp, mailer, storage)
├── frontend/src/
│   ├── app/                     # শুধু রুট, পাতলা পেজ
│   ├── features/<domain>/<feature>/  # ভার্টিক্যাল স্লাইস (৪ নম্বর অংশ দেখো)
│   ├── components/ui/           # ডিজাইন সিস্টেম
│   └── lib/api.ts               # একমাত্র HTTP স্তর
├── packages/contracts/          # ⭐ দুই পাশের közös চুক্তি (Zod schema) — ৫ নম্বর অংশ
└── ARCHITECTURE.md              # এই ফাইল
```

### ধরন B — আলাদা Frontend / Backend রেপো

একই জিনিস, শুধু দুইটা রেপো। তখন `packages/contracts` তৃতীয় একটা ছোট npm প্যাকেজ হয় (দুই রেপোই সেটা install করে)। নিয়ম বদলায় না — শুধু কন্ট্রাক্ট প্যাকেজের ভার্সন পিন করে রাখবে (`"contracts": "1.4.0"`) যাতে ফ্রন্টএন্ড-ব্যাকএন্ড আলাদা গতিতে এগোলেও চুক্তি না ভাঙে।

### ধরন C — Next.js ফুলস্ট্যাক (এক রেপো, API Routes / Server Actions)

```text
my-project/src/
├── app/                         # পেজ + Route Handler (শুধু HTTP স্তর)
├── features/<domain>/<feature>/ # UI স্লাইস (আগের মতোই)
├── server/modules/<feature>/    # ব্যাকএন্ড স্লাইস (service + repository + schemas)
├── server/db/schema/            # টেবিল
└── packages/contracts/          # Zod চুক্তি
```

**মনে রাখার কথা:** Route Handler / Server Action = কন্ট্রোলার মাত্র। ব্যবসার নিয়ম সেখানে লেখা নিষেধ — সব `server/modules/<feature>/*.service.ts`-এ যাবে। নইলে ফুলস্ট্যাকের সুবিধা উল্টো জট বানাবে।

### স্ট্যাক ম্যাপিং (ভূমিকা বদলায় না, শুধু নাম বদলায়)

| ব্লুপ্রিন্টের ভূমিকা | Fastify (Strict TS) | Express | NestJS | Django/DRF | Next.js Route Handler |
|---|---|---|---|---|---|
| রুট | `*.routes.ts` | router | controller | urls/views | `route.ts` |
| কন্ট্রোলার | `*.controller.ts` | controller fn | controller | view | handler fn |
| সার্ভিস | `*.service.ts` | service | provider | service layer | `server/...service` |
| রেপোজিটরি | `*.repository.ts` | model query | repository | manager | db query fn |
| স্কিমা | `*.schemas.ts` (Zod) | zod/joi | DTO+pipe | serializer | zod schema |
| অথ | `plugins/auth.ts` | middleware | guard | permission | middleware |

**অটল নিয়ম:** `routes → controller → service → repository → db`। কোনো স্তর টপকানো যাবে না, উল্টোদিকে import নিষেধ।

---

## ৩. ব্যাকএন্ড মডিউল চুক্তি (প্রতিটা ফিচার হুবহু একরকম দেখাবে)

```text
modules/jobs/
├── job.types.ts       # ডোমেন টাইপ (Job, JobPage, PageMeta) — contracts-এ তোলার আগে এখানে।
├── job.routes.ts      # URL + মেথড + অথ + স্কিমা শুধু। কোনো লজিক না।
├── job.controller.ts  # req → zod parse → service → reply। try/catch না (central handler দেখবে)।
├── job.service.ts     # ব্যবসার নিয়ম: মালিকানা, স্টেট মেশিন, লেনদেন।
├── job.repository.ts  # শুধু DB কোয়েরি। ব্যবসার নিয়ম এখানে নিষেধ।
├── job.schemas.ts     # Zod স্কিমা (body/query/params) — contracts থেকে import।
└── job.test.ts        # কমপক্ষে happy-path + ১টা করে 401/403/404 টেস্ট।
```

```ts
// job.routes.ts — static রুট আগে, dynamic (/:id) সবার শেষে!
const r = app.withTypeProvider<ZodTypeProvider>();
r.get("/recruiter", { preHandler: [app.authenticate], schema: { querystring: listQuerySchema } }, getMyJobs);
r.post("/",          { preHandler: [app.authenticate], schema: { body: createJobSchema } }, createJob);
r.get("/:id",        { schema: { params: idParamSchema } }, getJob); // dynamic সবসময় শেষে
```

```ts
// job.controller.ts — চিকন (parse-ই টাইপ দেয়, cast নিষেধ)
export const createJob = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
  const data = createJobSchema.parse(req.body);
  const job: Job = await createJobService(req.user.userId, data); // পরিচয় body থেকে না, JWT থেকে
  return reply.code(201).send({ success: true, data: job });
};
```

```ts
// job.service.ts — মাথা এখানে
export const createJobService = async (recruiterId: string, data: CreateJob): Promise<Job> => {
  if (data.salaryMax !== undefined && data.salaryMin !== undefined && data.salaryMax < data.salaryMin)
    throw new BadRequest("salary range invalid");
  // মালিকানা + স্টেট + ডিডাপ চেক এখানে, তারপর transaction-এ insert
};
```

---

## ৪. ফ্রন্টএন্ড ফিচার চুক্তি

```text
features/candidate/jobs/
├── jobs-page.tsx            # hook + component জোড়া দেয়। লজিক কম।
├── components/              # শুধু দেখানো (JobCard, JobList — .tsx, props interface সহ)
├── hooks/use-jobs.ts        # data + loading + error + action — সব async state এখানে (টাইপড)
├── services/jobs.service.ts # শুধু api.get/post। একটাই নির্দিষ্ট shape ফেরত দেবে।
└── utils/                   # ফরম্যাটার, কনস্ট্যান্ট (API কল নিষেধ)
```

**নিয়ম:**
১. পেজ → hook → service → `lib/api`। কম্পোনেন্ট সরাসরি `api` ধরবে না।
২. ব্যাকএন্ডের shape যেমনই হোক, service **একটাই** canonical shape বানাবে — ১০টা কম্পোনেন্টে if-else না।
৩. লিস্টে সবসময় `key={item.id}` (index বা name দিয়ে key নিষেধ)।
৪. ফর্মে `react-hook-form + zodResolver` (contracts-এর একই schema) — ভ্যালিডেশন দুইবার লেখা নিষেধ।

---

## ৫. দুই পাশের közös চুক্তি — ⭐ সবচেয়ে জরুরি অংশ

SkillSync-এর সবচেয়ে বড় শিক্ষা: চুক্তি মুখে রাখলে `res.data ?? res.jobs ?? []` লিখতে হয়। তাই **একটাই সত্যের উৎস** রাখো:

```text
packages/contracts/
├── envelope.ts            # { success, data, message, meta } — একটাই response আকৃতি
├── error-codes.ts         # VALIDATION_ERROR, UNAUTHORIZED, ... — enum + HTTP ম্যাপ
├── pagination.ts          # { page, limit, sort } + { total, page } — সব লিস্টে এক
├── common.ts              # id, email, password — বারবার লেখা নিষেধ
├── auth.schema.ts         # register/login (প্রায় সব প্রোডাক্টে এক)
├── <feature>.schema.ts    # যেমন job.schema.ts (Zod) — ব্যাকএন্ড + ফ্রন্টএন্ড দুজনেই import করে
├── index.ts               # একটাই দরজা (@my/contracts)
└── tsconfig.json          # strict + noUncheckedIndexedAccess (বাধ্যতামূলক)
```

```ts
// job.schema.ts (উদাহরণ — যেকোনো স্ট্যাকে একই ধারণা)
export const createJobSchema = z.object({
  title: z.string().min(3).max(120),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
}).refine(d => d.salaryMax === undefined || d.salaryMin === undefined || d.salaryMax >= d.salaryMin,
  { message: "salary range invalid" });
export type CreateJob = z.infer<typeof createJobSchema>; // টাইপ ফ্রি!
```

**কেন এটা loophole বন্ধ করে:** ব্যাকএন্ডে `fastify-type-provider-zod` (বা সমতুল্য), ফ্রন্টএন্ডে `zodResolver` — দুজনেই একই ফাইল থেকে ভ্যালিডেশন পায়। রুল বদলালে এক জায়গায় বদলায়, কম্পাইল টাইমেই ভাঙা ধরা পড়ে।

---

## ৬. গর্ত (Loophole) → কীভাবে ঠিক করবে → যাতে আর না আসে

> প্রতিটা সারিতে তিনটা কথা: **গর্তটা কী → ঠিক করার উপায় → ভবিষ্যতে আটকানোর নিয়ম।**

| # | গর্ত (SkillSync-এ প্রমাণসহ) | কীভাবে ঠিক করবে | যাতে আর না আসে (approach) |
|---|---|---|---|
| L1 | **Strict TypeScript নেই** — JS-এ চুক্তি ভাঙা কম্পাইলে ধরা পড়ে না (`jobs.service.js`-এ ৩ রকম shape চেক) | নতুন প্রজেক্ট Day 1 থেকে `strict:true` + `noUncheckedIndexedAccess`। contracts প্যাকেজে সব DTO-র টাইপ | CI-তে `tsc --noEmit` বাধ্যতামূলক করো। `any` পেলেই lint fail। রিভিউতে টাইপ ছাড়া PR মার্জ নিষেধ |
| L2 | **Central Zod validation নেই** — Fastify JSON-schema আর ফ্রন্টএন্ডে আলাদা নিয়ম | §৫-এর `packages/contracts` বানাও। ব্যাকএন্ড provider + ফ্রন্টএন্ড resolver দুটোই সেখান থেকে | নিয়ম: **নতুন ফিল্ড মানেই contracts-এ আগে**। contracts ছাড়া validation PR গ্রহণ নিষেধ |
| L3 | **Central error handler নেই** — প্রতি কন্ট্রোলারে একই try/catch (`job.controller.js`-এ ৮ বার) | একটা `errorHandler` + `AppError{ code, status }` ক্লাস। কন্ট্রোলারে কোনো try/catch না | টেমপ্লেটে try/catch রাখবেই না। `reply.code(500).send` সরাসরি লেখা lint-এ নিষেধ করো |
| L4 | **Auth শুধু পরিচয় দেখে, সজীবতা দেখে না** — `authorize()` শুধু role মেলায় (`plugins/auth.js`)। suspend হওয়ার পরও পুরনো JWT চলে | short access token (15m) + refresh rotation + `users.tokenVersion`। suspend/role-change মানেই version বাড়াও → পুরনো token অটো বাতিল | নিয়ম: **mutating রুটে authenticate + authorize + liveness তিনটাই**। auth টেস্টে suspend→access-blocked কেস বাধ্যতামূলক |
| L5 | **Response আকৃতি অসামঞ্জস্য** — কোথাও `{jobs}`, কোথাও `{data}` | §৫-এর envelope + `reply.ok(data)` হেলপার সব রুটে | Response-schema টেস্টে `success+data` কী আছে assert করো। নতুন আকৃতি আনলে contracts-এ আগে |
| L6 | **Env হার্ডকোড + খোলা CORS** — `localhost:5000` কোডে, `origin:true` সার্ভারে | URL সব env থেকে (`API_URL`, `CORS_ORIGIN` allowlist)। `origin:true` + credential একসাথে নিষেধ | `config.ts` বুটের সময় env যাচাই করে মরবে (fail fast)। `tools/spine/.env.example` টেমপ্লেটে আছে — `.env.example` ছাড়া রেপো অসম্পূর্ণ ধরো |
| L7 | **কোথাও repository নেই** — `applications/`-এ repo ফাইলই নেই | প্রতিটা মডিউলে repository বাধ্যতামূলক, service সরাসরি `db` ধরবে না (tx inject হবে repo দিয়ে) | ফোল্ডার টেমপ্লেট/generator-এ ৭ ফাইল ফিক্সড (types সহ)। repo ছাড়া মডিউল PR-এ fail |
| L8 | **ভারী কাজ request-এর ভেতরে** — OCR/AI inline (৬৪৬ লাইনের service + 60s timeout) | `POST → {status:processing}` + queue/worker (BullMQ/pg-boss) + `GET /:id` দিয়ে poll। request <300ms | নিয়ম: **৫০০ms-এর বেশি কাজ মানেই queue**। রিভিউতে slow-call দেখলেই worker-এ পাঠাও |
| L9 | **লোকাল ডিস্কে upload** — মাল্টি-ইনস্ট্যান্সে টেকে না | `storage.save()` abstraction — dev-এ local, prod-এ S3/R2। DB-তে শুধু key, পরিবেশন signed URL-এ | API stateless রাখো — কোনো local path DB-তে বা কোডে হার্ডকোড নিষেধ |
| L10 | **Pagination নেই** — `limit(50)` হার্ডকোড | Day 1 থেকে `?page&limit&sort` + `meta{total,page}` সব লিস্টে | লিস্ট রুটের টেমপ্লেটে pagination বিল্ট-ইন। `meta` ছাড়া লিস্ট PR fail |
| L11 | **Status খোলা string** — varchar-এ টাইপোই নতুন স্টেট হয় | enum + transition ম্যাপ (যেমন `APPLIED→REVIEWING→SHORTLISTED→INTERVIEW→HIRED`, যেকোনো→REJECTED)। অবৈধ লাফে 422 | স্টেট মেশিন টেবিল-টেস্ট হিসেবে লেখো। string status সরাসরি DB-তে লেখা নিষেধ |
| L12 | **হার্ডকোড কনস্ট্যান্ট, rate-limit/helmet/request-id নেই** — 48h window কোডে, JWT secret যাচাই ছাড়া | সব tunable `config.js`-এ (env override)। helmet + auth-রুটে strict rate-limit + reqId লগ | বুট-চেক + security চেকলিস্ট (৮ নম্বর অংশ) ছাড়া deploy নিষেধ |
| L13 | **Observability/test ফাঁকা** — log-এ reqId নেই, health নেই, টেস্ট DB কৌশল নেই | pino JSON + reqId, `/healthz` (alive) + `/readyz` (DB ping), seed + test-factory | Definition of Done-এ ঢোকাও: test + log + health ছাড়া ফিচার done না |

---

## ৭. নতুন প্রোডাক্ট শুরু করার ধাপ (যেকোনো স্ট্যাকে একই)

```text
ধাপ ০ — এক কমান্ডে কঙ্কাল বানাও (হাতে কপি নিষেধ):
        `node project-template/tools/gen.mjs init my-app`
        (ভেতরে: `packages/contracts` = রেডিমেড Zod চুক্তি, `tools/` = জেনারেটর+spine,
         চালানো যায় এমন `backend/` + `frontend/` কঙ্কাল, root QUICKSTART README।
         ব্যবহারবিধি `project-template/README.md`-এ। এটাই spec।)
ধাপ ১ — রেপো ধরন বেছে নাও (A/B/C) + contracts প্যাকেজ বানাও।
ধাপ ২ — মেরুদণ্ড আগে: config (fail-fast) → auth → error-handler → envelope → users টেবিল → auth মডিউল।
ধাপ ৩ — ONE ফিচার দিয়ে E2E প্রমাণ করো (migration → repo → service → controller → route → service → hook → পেজে আসল data)।
ধাপ ৪ — দ্বিতীয় ফিচার প্রথমটাকে কপি-পেস্ট-রিনেম করে বানাও। না পারলে abstraction ভুল — এখনই ঠিক করো।
ধাপ ৫ — ৫ নম্বর ফিচারের আগেই spine: pagination, rate-limit+helmet, storage abstraction, queue।
ধাপ ৬ — মাইক্রোসার্ভিসে তখনই ভাঙবে যখন কোনো মডিউলের আলাদা deploy/scale/team লাগবে। তার আগে মডুলার মনোলিথই সেরা।
```

---

## ৮. Bulletproof চেকলিস্ট (deploy-এর আগে)

**নতুন ব্যাকএন্ড ফিচার (সব .ts, JS নিষেধ):**
- [ ] types/routes/controller/service/repository/schemas + test — ৭ ফাইল
- [ ] static রুট `/:id`-এর আগে। `authenticate + authorize` প্রতিটা non-public রুটে
- [ ] পরিচয় `JWT থেকে`, body থেকে না। মালিকানা চেক service-এ (`ownerId = userId`)
- [ ] validation contracts থেকে। এরর central handler দিয়ে
- [ ] লিস্টে `page/limit/meta`। টাকা/সিট/apply-তে transaction + idempotency

**নতুন ফ্রন্টএন্ড ফিচার:**
- [ ] page/components/hooks/services/utils — HTTP শুধু service-এ, `lib/api` দিয়ে
- [ ] loading/empty/error/success-toast — চার অবস্থাই render হয়
- [ ] form = `react-hook-form + zodResolver(contracts schema)`। `key={id}`

**Production:**
- [ ] `origin:true` নেই, CORS allowlist। helmet + rate-limit (বিশেষ করে auth/OTP)
- [ ] JWT short + refresh rotate + suspend-এ revoke। secret দুর্বল হলে বুট fail
- [ ] upload object-storage + signed URL। slow কাজ queue + retry + DLQ
- [ ] reqId-সহ JSON log, `/healthz` + `/readyz`, backup-restore পরীক্ষিত, seed স্ক্রিপ্ট

---

## ৯. নিষেধের তালিকা (এগুলো করলেই গর্ত ফেরে)

- কম্পোনেন্ট থেকে সরাসরি `fetch` — নিষেধ
- body থেকে `userId/role` নেওয়া — নিষেধ
- service থেকে সরাসরি `db` import (repo না দিয়ে) — নিষেধ
- কন্ট্রোলারে try/catch কপি-পেস্ট — নিষেধ
- `origin: true` + credential, হার্ডকোড URL, হার্ডকোড limit — নিষেধ
- contracts না বদলে validation বদলানো — নিষেধ
- queue ছাড়া slow কাজ request-এ — নিষেধ
- `any` টাইপ — নিষেধ (জানা না থাকলে `unknown` + narrowing লেখো)
- `.js`/`.jsx` প্রোডাক্ট কোড — নিষেধ (Strict TS only; জেনারেটর `gen.mjs` নিজে টুল বলে ব্যতিক্রম)

---

## ১০. শেষ কথা

SkillSync-এর কঙ্কাল (ফিচার-স্লাইস + একমুখী ফ্লো + central api + server-auth) ১–১০ জনের টিম আর ~১ লাখ ইউজার পর্যন্ত দারুণ চলবে। দুর্বলতা শুধু মেরুদণ্ডে — এই ফাইলের §৫ (contracts) + §৬ (L1–L13 ফিক্স) + §৮ (চেকলিস্ট) পরের প্রজেক্টের Day 1-এ লাগিয়ে দিলেই সেটা শুরু থেকেই bulletproof হবে, পরে জোড়াতালি দিতে হবে না।
