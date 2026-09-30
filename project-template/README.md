# প্রজেক্ট টেমপ্লেট (Strict TS only — কোনো JS নয়)

ARCHITECTURE.md-এর চালানো যায় এমন অংশ। নতুন প্রজেক্ট এক কমান্ডে শুরু করো —
ফোল্ডার হাতে কপি করা লাগে না। জেনারেটর নিজে plain node-এ চলে (`gen.mjs`),
কিন্তু যা বানায় সব `.ts`/`.tsx`।

প্রিসেট (concrete stack): **Fastify + Drizzle + PostgreSQL + React/Next + Zod**।
নীতি (ARCHITECTURE.md) সব স্ট্যাকের; কোড-টেমপ্লেট এই প্রিসেটের।
অন্য স্ট্যাকে (Express/Django/...) নীতি এক রেখে সমতুল্য ফাইল বানাও।

## সবচেয়ে দ্রুত শুরু (১ কমান্ড)

  node project-template/tools/gen.mjs init my-app

এতে তৈরি হয়: `packages/` + `tools/` (কপি) + চালানো যায় এমন `backend/` কঙ্কাল
(app/server/db/users/.env নোট) + `frontend/` কঙ্কাল (`lib/api.ts` সহ) +
root `package.json` (workspaces) + `.gitignore` + QUICKSTART `README.md`।

## ভেতরে কী আছে

```text
project-template/
├── ARCHITECTURE.md             # রেফারেন্স (নতুন সংস্করণ এলে এখানে আবার কপি করো)
├── packages/contracts/         # দুই পাশের közös চুক্তি (Zod + strict TS)
│   └── src/
│       ├── error-codes.ts      # সব এরর কোড + HTTP ম্যাপ
│       ├── pagination.ts       # ?page&limit + meta (সব লিস্টে এক)
│       ├── envelope.ts         # { success, data, meta } / { success:false, code }
│       ├── common.ts           # id, email, password — বারবার লেখা লাগে না
│       ├── auth.schema.ts      # register/login (প্রায় সব প্রোডাক্টে এক)
│       ├── example.task.schema.ts  # ⭐ উদাহরণ: নতুন ফিচার এটা কপি করে বানাও
│       └── index.ts            # একটাই দরজা (@my/contracts)
└── tools/
    ├── gen.mjs                 # স্ক্যাফোল্ড জেনারেটর (আউটপুট সব TS) — init/module/table/feature
    └── spine/ (.ts)            # Day-1 মেরুদণ্ড
        ├── .env.example        # env নমুনা
        ├── config.ts           # fail-fast env
        ├── plugins/errors.ts + plugins/response.ts  # error-handler + reply.ok
        └── frontend/lib/api.ts # একমাত্র HTTP স্তর (env-ভিত্তিক base URL)
```

## নতুন প্রজেক্টে ব্যবহার (৪ ধাপ)

**ধাপ ১ — কপি:**
```bash
cp -r project-template/packages project-template/tools new-project/
cp project-template/ARCHITECTURE.md new-project/
# package নাম বদলে নাও: @my/contracts → @tomar-project/contracts
# আলাদা frontend/backend রেপো হলে contracts-এর version পিন করো (দুই রেপো একই version)
```

**ধাপ ২ — contracts build:**
```bash
cd new-project/packages/contracts
npm install        # zod + typescript আসবে
npm run build      # dist/ তৈরি — ব্যাকএন্ড/ফ্রন্টএন্ড এটাই import করে
npx tsc --noEmit   # strict চেক — সবুজ মানে চুক্তি ঠিক
```

**ধাপ ৩ — spine + dependency (সব TS):**
```bash
cd new-project
cp tools/spine/config.ts backend/src/config.ts
cp tools/spine/plugins/*.ts backend/src/plugins/
cp tools/spine/.env.example backend/.env   # ভেতরের মান বসাও (commit নিষেধ)
npm --prefix backend i fastify fastify-plugin fastify-type-provider-zod drizzle-orm zod
npm --prefix backend i -D typescript @types/node
npm --prefix frontend i zod
# backend/src/app.ts-এ একবার (zod রানটাইম validation-এর জন্য বাধ্যতামূলক):
#   import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
#   app.setValidatorCompiler(validatorCompiler);
#   app.setSerializerCompiler(serializerCompiler);
# backend + frontend দুটোতেই strict tsconfig রাখো:
# { "strict": true, "noUncheckedIndexedAccess": true, "noEmit": true }
# frontend-এ @/ alias না থাকলে tsconfig-এ paths বসাও (Next.js-এ ডিফল্ট থাকে)
```

**ধাপ ৪ — প্রথম ফিচার জেনারেট (সব .ts/.tsx):**
```bash
node tools/gen.mjs table tasks           # DB টেবিল স্টাব (.ts)
node tools/gen.mjs module tasks          # backend: ৭ ফাইল (types সহ, সব .ts)
node tools/gen.mjs feature admin tasks   # frontend: page.tsx + hook/service/list (.ts/.tsx)
```

## নতুন ফিচার যোগ করার নিয়ম (প্রতিবার একই)

১. `example.task.schema.ts` কপি করে `<feature>.schema.ts` বানাও (enum + transition ম্যাপসহ)
২. `node tools/gen.mjs table <name>` → কলাম মিলিয়ে migration চালাও
৩. `node tools/gen.mjs module <name>` → `schemas.ts`-এর zod schema contracts-এর schema দিয়ে বদলে দাও
৪. ফ্রন্টএন্ড ফর্মে একই schema (`zodResolver`) লাগাও — validation এক জায়গা থেকে আসবে
৫. `npx tsc --noEmit` (backend + frontend দুটোতেই) + টেস্ট সবুজ করে PR দাও
৬. `any` টাইপ PR-এ নিষেধ — জানা না থাকলে `unknown` + narrowing লেখো
