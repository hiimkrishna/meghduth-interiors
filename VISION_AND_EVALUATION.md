# মেঘদূত ডিজাইন — ভিশন ও ঘাটতি বিশ্লেষণ

> উৎস: `Desktop/project-template/ARCHITECTURE.md` — ফিচার-ভিত্তিক ভার্টিকাল স্লাইস স্থাপত্য
> প্রজেক্ট: `meghduth-designs` — বর্তমানে স্ট্যাটিক Next.js ওয়েবসাইট
> এই ফাইলের উদ্দেশ্য: ভবিষ্যৎ হেডলেস সিএমএস রূপান্তরের জন্য একটাই সত্যের উৎস। এই ফাইল পড়ে সামনে কাজ এগোবে।
> শেষ হালনাগাদ: ২০২৬-০৯-১২

---

## ১. প্রকল্প ভিশন

### ১.১ মূল ভিশন
মেঘদূতের বর্তমান স্ট্যাটিক ওয়েবসাইটকে **Next.js ভিত্তিক সম্পূর্ণ হেডলেস সিএমএস**-এ রূপান্তর করা।

### ১.২ মালিকের ঘোষণা — হুবহু সংরক্ষিত
১. সব ডায়নামিক কনটেন্ট শেষ পর্যন্ত ব্যাকএন্ড থেকে নিয়ন্ত্রিত হবে।
২. সব তথ্য আসল কোনো ডাটাবেজে সংরক্ষিত হবে।
৩. অ্যাডমিন কখনো ওয়েবসাইটের কোডে হাত দেবে না।
৪. ওয়েবসাইটকে টেমপ্লেট হিসেবে ধরতে হবে। এই টেমপ্লেটে কী তথ্য আসবে বা যাবে, তা অ্যাডমিন ব্যাকএন্ডে বসে সিএমএস থেকে নিয়ন্ত্রণ করবে।
৫. তারপর ব্যাকএন্ড থেকে তথ্য ডাটাবেজে যাবে। ফ্রন্টএন্ড শুধু ডাটাবেজ থেকে তথ্য এনে উপযুক্ত জায়গায় লোড করবে।
৬. প্রায় সব কম্পোনেন্ট ডায়নামিক করে দিতে হবে, যাতে ফ্রন্টএন্ডে শুধু কঙ্কাল থাকে, আর কিছু না।
৭. তথ্যের নিয়ন্ত্রণ সম্পূর্ণ ব্যাকএন্ড ও ডাটাবেজে থাকবে।
৮. অ্যাডমিন ছাড়া কেউ যেন আসল তথ্যের নাগাল কোনোভাবে না পায়।

### ১.৩ সাফল্যের সংজ্ঞা
- অ্যাডমিন কোড না ছুঁয়ে হিরো স্লাইড বদলাতে পারে।
- সেবা যোগ, লুকানো, ক্রম বদলাতে পারে।
- প্রজেক্ট যোগ, প্রকাশ-অপ্রকাশ করতে পারে।
- দলের সদস্য যোগ-বিয়োগ করতে পারে।
- মতামত অনুমোদন বা লুকাতে পারে।
- নেভিগেশন, ফুটার, যোগাযোগ তথ্য, সাইট সেটিংস বদলাতে পারে।
- যোগাযোগ ফরম জমা হলে লিড ডাটাবেজে জমা হয় ও অ্যাডমিনে দেখা যায়।
- ফ্রন্টএন্ডে কোনো আসল তথ্য হার্ডকোড থাকে না। শুধু কঙ্কাল, লোডিং, শূন্য ও ত্রুটি অবস্থা থাকে।
- পাবলিক এপিআই শুধু পড়ার জন্য। লেখা, বদল, মোছা — শুধু অ্যাডমিন টোকেনে।

### ১.৪ পরিধির বাইরে — আপাতত নয়
- অনলাইন পেমেন্ট।
- বহু ভাষা — প্রথম সংস্করণে বাংলা বা ইংরেজি একটাই।
- মোবাইল অ্যাপ।
- জটিল অ্যানালিটিক্স ড্যাশবোর্ড।
- স্বয়ংক্রিয় ইমেইল প্রচারণা।

---

## ২. লক্ষ্য স্থাপত্য — ধরন C: Next.js ফুলস্ট্যাক

`ARCHITECTURE.md`-এর তিন ধরনের মধ্যে **ধরন C** নির্বাচিত। কারণ একটাই রেপোতে পাবলিক সাইট + অ্যাডমিন + এপিআই রাখা সবচেয়ে সরল।

```text
meghdut-cms/
├── app/
│   ├── (public)/                    # হোম, সেবা, প্রজেক্ট, দল, যোগাযোগ — শুধু পড়া
│   ├── (admin)/admin/               # সিএমএস — লগইন বাধ্যতামূলক
│   └── api/v1/.../route.ts          # শুধু HTTP স্তর = কন্ট্রোলার
├── features/<domain>/<feature>/     # পেজ → hook → service → lib/api
├── server/modules/<feature>/        # service + repository + schemas
├── server/db/schema/                # প্রতি টেবিলে এক ফাইল
├── packages/contracts/              # Zod চুক্তি — দুই পাশেই এক
└── ARCHITECTURE.md
```

### ২.১ অটল নিয়ম
১. ফিচার অনুযায়ী ফোল্ডার — ব্যাকএন্ডে `server/modules/<feature>/`, ফ্রন্টএন্ডে `features/<domain>/<feature>/`।
২. একমুখী প্রবাহ — কোনো স্তর টপকানো নিষেধ:
   `পেজ → hook → service → lib/api → route → controller → service → repository → DB`
৩. চিকন কন্ট্রোলার, মোটা সার্ভিস, বোকা রেপোজিটরি।
৪. একটাই এপিআই ক্লায়েন্ট `lib/api.ts`। কম্পোনেন্টে সরাসরি `fetch` নিষেধ।
৫. অনুমোদন সার্ভারে বাধ্যতামূলক। ফ্রন্টএন্ড পরীক্ষা শুধু দেখানোর জন্য।
৬. নতুন ফিল্ড মানেই আগে `contracts`-এ। চুক্তি ছাড়া বৈধতা PR গ্রহণ নিষেধ।
৭. পরিচয় `JWT` থেকে, বডি থেকে নয়।
৮. তালিকায় সবসময় `key={item.id}`। সূচক বা নাম দিয়ে চাবি নিষেধ।
৯. ফরমে `react-hook-form + zodResolver` — একই স্কিমা।

### ২.২ প্রস্তাবিত তথ্য মডেল
| টেবিল | উদ্দেশ্য | মন্তব্য |
|---|---|---|
| `admin_users` | অ্যাডমিন লগইন | `tokenVersion` সহ, স্থগিত করলে টোকেন বাতিল |
| `site_settings` | সাইট নাম, লোগো, ফোন, ইমেইল, ঠিকানা, সামাজিক লিংক | এক সারি, সংস্করণ সহ |
| `navigations` | মেনু | `label, href, order, visible` |
| `hero_slides` | হোম হিরো | `badge, title, description, imageKey, order, published` |
| `services` | সেবা তালিকা | `slug, title, description, imageKey, order, published` |
| `projects` | প্রজেক্ট | `slug, title, category, location, year, featured, order, published` |
| `project_images` | প্রজেক্টের ছবি | `projectId, imageKey, alt, order` |
| `team_members` | দল | `name, designation, bio, imageKey, order, published` |
| `testimonials` | মতামত | `name, designation, text, rating, imageKey, approved, published` |
| `about_page` + `process_steps` | পরিচিতি পেজ | `eyebrow, title, description`, ধাপ তালিকা |
| `media_assets` | সব ছবি-ফাইল | `key, mime, size, alt, width, height` |
| `leads_inquiries` | যোগাযোগ ফরম | অবস্থা যন্ত্র সহ — নিচে দেখো |

লিড অবস্থা যন্ত্র:
```text
NEW → CONTACTED → QUOTED → WON
  ↘ LOST (যেকোনো ধাপ থেকে)
```
অবৈধ লাফে `422`।

### ২.৩ প্রস্তাবিত পাবলিক এপিআই — শুধু পড়া
```text
GET /api/v1/site-settings
GET /api/v1/navigations
GET /api/v1/hero-slides
GET /api/v1/services
GET /api/v1/services/:slug
GET /api/v1/projects?page&limit&category
GET /api/v1/projects/:slug
GET /api/v1/team
GET /api/v1/testimonials
POST /api/v1/leads              # হার-সীমা সহ, জনসাধারণের জন্য খোলা
```

### ২.৪ প্রস্তাবিত অ্যাডমিন এপিআই — প্রমাণীকরণ বাধ্যতামূলক
```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET/POST /api/v1/admin/hero-slides
PATCH/DELETE /api/v1/admin/hero-slides/:id
... সেবা, প্রজেক্ট, দল, মতামত, নেভিগেশন, সেটিংস — একই ধাঁচে
GET/PATCH /api/v1/admin/leads
GET/PATCH /api/v1/admin/leads/:id
POST /api/v1/admin/media           # আপলোড → অবজেক্ট স্টোরেজ
```

সব রেসপন্স এক আকৃতিতে:
```json
{ "success": true, "data": {}, "meta": { "total": 0, "page": 1 } }
```

---

## ৩. বর্তমান অবস্থা তালিকা — কী কী আছে

### ৩.১ পেজ — ৬টি
`app/page.js` হোম, `app/about/page.jsx`, `app/services/page.js`, `app/projects/page.js`, `app/team/page.js`, `app/contact/page.js`

### ৩.২ কম্পোনেন্ট — ৪০+ ফাইল
`home/hero`, `home/featured-projects`, `home/testimonials`, `home/cta`, `home/AboutMeghdut`, `home/ServicesPreview`, `home/WhyChooseMeghdut`, `about/*`, `services/*`, `projects/*`, `team/*`, `contact/*`, `layout/Navbar`, `layout/footer`, `common/*`, `ui/*`

### ৩.৩ তথ্য ফাইল — ১৩টি + ৩টি বিক্ষিপ্ত
`data/heroSlides.js`, `data/services.js`, `data/testimonials.js`, `data/aboutData.js`, `data/contactPageData.js`, `data/projectsPageData.js`, `data/servicesPageData.js`, `data/teamData.js`, `data/teamPageData.js`, `data/about.js`, `data/contactData.js`, `data/projects.js`, `data/team.js` + `components/home/cta/ctaData.js` + `components/layout/footer/footerData.js` + `components/home/featured-projects/projects.js` + `constants/navigation.js`

### ৩.৪ যা নেই — সম্পূর্ণ অনুপস্থিত
- কোনো `route.ts` এপিআই নেই।
- কোনো ডাটাবেজ, `Drizzle`, অভিপ্রয়াণ নেই।
- কোনো `packages/contracts`, `Zod`, `TypeScript strict` নেই।
- কোনো `lib/api.ts` নেই।
- কোনো লগইন, ভূমিকা, টোকেন নেই।
- কোনো অ্যাডমিন প্যানেল নেই।
- কোনো `config.ts`, `.env.example`, `healthz` নেই।
- কোনো পরীক্ষা, লগে `request-id`, ব্যাকআপ নেই।

---

## ৪. ঘাটতি বিশ্লেষণ — টেমপ্লেটের সাথে তুলনা

> প্রতিটি সারিতে তিন কথা: **ঘাটতি কী → কেন ঝুঁকি → কীভাবে ঠিক হবে।**

### G1. Strict TypeScript নেই — L1 ভঙ্গ
- **ঘাটতি:** পুরো কোড `.js/.jsx`। `tsconfig` কঠোর নয়। `jsconfig.json`-এ শুধু `@/*` উপনাম।
- **ঝুঁকি:** চুক্তি ভাঙা কম্পাইলে ধরা পড়ে না। ভবিষ্যতে ব্যাকএন্ড-ফ্রন্টএন্ড আকৃতি মিলবে না।
- **প্রমাণ:** `package.json`-এ `typescript`, `zod` নেই।
- **সমাধান:** Day 1 থেকে `strict + noUncheckedIndexedAccess`। `any` পেলেই lint ব্যর্থ। `tsc --noEmit` CI-তে বাধ্যতামূলক।

### G2. কেন্দ্রীয় Zod বৈধতা নেই — L2 ভঙ্গ
- **ঘাটতি:** `packages/contracts` নেই। বৈধতা কোথাও নেই।
- **ঝুঁকি:** ফরমে এক নিয়ম, সার্ভারে আরেক নিয়ম হবে।
- **প্রমাণ:** `ContactForm.jsx`-এ কোনো বৈধতা নেই।
- **সমাধান:** `auth, hero, service, project, team, testimonial, lead, site-settings` স্কিমা `contracts`-এ। ব্যাকএন্ড provider + ফ্রন্টএন্ড `zodResolver` একই ফাইল থেকে।

### G3. কেন্দ্রীয় এরর হ্যান্ডলার নেই — L3 ভঙ্গ
- **ঘাটতি:** `plugins/errors.ts`, `reply.ok()` নেই। `envelope` নেই।
- **ঝুঁকি:** প্রতিটি রুটে আলাদা try/catch, রেসপন্স আকৃতি আলাদা।
- **সমাধান:** একটা `AppError{code,status}` + কেন্দ্রীয় হ্যান্ডলার। কন্ট্রোলারে try/catch নিষেধ।

### G4. প্রমাণীকরণ ও জীবন্ততা নেই — L4 ভঙ্গ
- **ঘাটতি:** `authenticate + authorize + liveness` তিনটাই নেই।
- **ঝুঁকি:** যে কেউ অ্যাডমিন এপিআই ডাকতে পারবে। স্থগিত অ্যাডমিনের টোকেন চলতে থাকবে।
- **সমাধান:** স্বল্পমেয়াদি অ্যাক্সেস + রিফ্রেশ ঘূর্ণন + `tokenVersion`। বদলকারী রুটে তিন পরীক্ষা বাধ্যতামূলক।

### G5. রেসপন্স আকৃতি অসামঞ্জস্য — L5
- **ঘাটতি:** কোনো `envelope` নেই। তথ্য ফাইলের আকৃতি ভিন্ন ভিন্ন।
- **উদাহরণ:** `heroSlides: {id, image, badge, title}`, `projectsPageData.projects: {id, title, category, image, href}`, `featured-projects/projects: {id, title, category, location, year, large}` — একই প্রজেক্ট তিন রূপে।
- **সমাধান:** `envelope.ts` + সব তালিকায় `meta{total,page,limit}`।

### G6. Env হার্ডকোড প্রবণতা + খোলা ভবিষ্যৎ — L6
- **ঘাটতি:** `config.ts` নেই, `.env.example` নেই। গুগল ম্যাপ `embed` সরাসরি `contactPageData.js`-এ পোতা।
- **ঝুঁকি:** চাবি কোডে ছড়াবে, CORS পরে `origin:true` হয়ে যাবে।
- **সমাধান:** সব URL ও গোপন মান env থেকে। বুটে env যাচাই করে মরবে।

### G7. Repository স্তর নেই — L7
- **ঘাটতি:** `modules/` কাঠামোই নেই। ৭ ফাইলের টেমপ্লেট নেই।
- **সমাধান:** প্রতি ফিচারে `types/routes/controller/service/repository/schemas/test` — ৭ ফাইল বাধ্যতামূলক। service সরাসরি `db` ধরবে না।

### G8. যোগাযোগ ফরম অকার্যকর — কার্যকরী ত্রুটি
- **ঘাটতি:** `ContactForm.jsx`-এ `state`, `onSubmit`, বৈধতা, এপিআই কল — কিছু নেই। `Button href="#"`।
- **ঝুঁকি:** লিড হারাবে। ব্যবসায়িক ক্ষতি।
- **সমাধান:** মাইলফলক ৫-এ `POST /leads` + সারি + অ্যাডমিন তালিকা।

### G9. লোকাল ডিস্কে ছবি — L9
- **ঘাটতি:** সব `public/images/`-এ স্থির। `storage.save()` বিমূর্ততা নেই।
- **প্রমাণ:** `testimonials.js`-এ `/images/testimonials/client-*.jpg` পথ আছে, ডিস্কে ফোল্ডার নেই — ছবি ভাঙা।
- **সমাধান:** উন্নয়নে স্থানীয়, উৎপাদনে `S3/R2`। DB-তে শুধু চাবি, পরিবেশন স্বাক্ষরিত ঠিকানায়।

### G10. পেজিনেশন নেই — L10
- **ঘাটতি:** সব তালিকা একবারে রেন্ডার। `page/limit/meta` নেই।
- **সমাধান:** Day 1 থেকে সব তালিকায় `?page&limit&sort` + `meta`।

### G11. অবস্থা খোলা স্ট্রিং হবে — L11 আগাম সতর্কতা
- **ঘাটতি:** এখন অবস্থা নেই, ভবিষ্যতে `published`, `approved`, লিড অবস্থা খোলা স্ট্রিং হলে টাইপোই নতুন অবস্থা হবে।
- **সমাধান:** `enum + transition` মানচিত্র + টেবিল পরীক্ষা। সরাসরি স্ট্রিং DB-তে নিষেধ।

### G12. হার্ডকোড ধ্রুবক, নিরাপত্তা হেডার নেই — L12
- **ঘাটতি:** `helmet`, `rate-limit`, `request-id` নেই। ফোন-ইমেইল হার্ডকোড ও অসঙ্গত।
- **প্রমাণ:** `contactPageData`: `+880 1700-000000 / hello@meghdutdesign.com` বনাম `footerData`: `+880 1XXX XXXXXX / hello@meghdut.com`।
- **সমাধান:** সব টিউনেবল `config`-এ। auth/lead রুটে কঠোর হার-সীমা।

### G13. পর্যবেক্ষণ ও পরীক্ষা ফাঁকা — L13
- **ঘাটতি:** লগে `reqId` নেই, `healthz/readyz` নেই, বীজ নেই, পরীক্ষা নেই।
- **সমাধান:** `pino JSON + reqId`, `/healthz` জীবিত, `/readyz` DB পিং, বীজ + কারখানা। পরীক্ষা ছাড়া ফিচার done নয়।

### G14. তথ্য দ্বিরুক্তি মানচিত্র — সবচেয়ে জরুরি পরিষ্কার
| বিষয় | জায়গা ১ | জায়গা ২ | জায়গা ৩ | সিদ্ধান্ত |
|---|---|---|---|---|
| প্রজেক্ট | `data/projects.js` ফাঁকা | `featured-projects/projects.js` ৪টি | `projectsPageData` ৪টি ভিন্ন | `projects` টেবিল একটাই সত্য |
| সেবা | `data/services.js` ৪টি | `servicesPageData.services` ৪টি ভিন্ন বর্ণনা | `footerData` আমদানি করে | `services` টেবিল একটাই |
| দল | `data/team.js` ফাঁকা | `data/teamData.js` | `data/teamPageData.members` | `team_members` টেবিল |
| পরিচিতি | `data/about.js` | `data/aboutData.js` | — | `about_page` টেবিল |
| যোগাযোগ | `data/contactData.js` | `data/contactPageData.js` | — | `site_settings + leads` |
| হিরো | `data/heroSlides.js` ২টি | — | — | `hero_slides` টেবিল |
| মতামত | `data/testimonials.js` ৩টি | ছবি পথ ভাঙা | — | `testimonials` টেবিল + অনুমোদন |

### G15. ফ্রন্টএন্ড স্তর টপকানো — §৪ ভঙ্গ
- `Hero.jsx` সরাসরি `data/heroSlides` ধরে।
- `FeaturedProjects.jsx` সরাসরি `./projects` ধরে।
- `Navbar.jsx` সরাসরি `constants/navigation` ধরে।
- মাঝে `hook/service/api` নেই। ভবিষ্যতে এগুলো `useHeroSlides`, `hero.service`, `lib/api` দিয়ে বদলাতে হবে।

### G16. নিষেধ তালিকা থেকে বর্তমান লঙ্ঘন
- কম্পোনেন্ট থেকে সরাসরি তথ্য আমদানি — আছে।
- `key={item.title}` — `Navbar.jsx`-এ আছে, `key={id}` করতে হবে।
- ফরমে বৈধতা ছাড়া জমা ভান — `ContactForm`-এ আছে।
- ভাঙা ছবি পথ — `testimonials`-এ আছে।
- ফুটারের পরোক্ষ নির্ভরতা — `footerData → services` আছে।

---

## ৫. কর্মপরিকল্পনা — মাইলফলক

### মাইলফলক ০ — প্রস্তুতি ও হিমায়ন — ২ দিন
- সুযোগ তালিকা চূড়ান্ত। `data/` হিমায়িত। `TypeScript strict` চালু।
- সমাপ্তি: সুযোগে স্বাক্ষর।

### মাইলফলক ১ — মেরুদণ্ড — ৫–৬ দিন
- `contracts`, `config fail-fast`, এরর হ্যান্ডলার, `envelope`, `users` টেবিল, auth মডিউল, `lib/api`, `healthz/readyz`।
- সমাপ্তি: `tsc --noEmit` সবুজ + লগইন চক্র পরীক্ষিত।

### মাইলফলক ২ — মডেল ও বীজ — ৪–৫ দিন
- সব টেবিল + সূচক + enum। পুরনো তথ্য পরিষ্কার করে বীজ। ভাঙা পথ, ভুল ফোন-ইমেইল এক করা। স্টোরেজ বিমূর্ততা।
- সমাপ্তি: খালি DB থেকে বীজে পূর্ণ সাইট চলে।

### মাইলফলক ৩ — পাবলিক পড়া + কঙ্কাল — ৭–৮ দিন
- `GET` এপিআই + `page/limit/meta`। ফ্রন্টএন্ডে hook/service/api + skeleton/empty/error। `data/` আমদানি মুছে ফেলা। ISR।
- সমাপ্তি: `data/` মুছলেও সাইট চলে। এক ফিচারে শেষ-থেকে-শেষ প্রমাণ। প্রথম ফিচার: `hero-slides`।

### মাইলফলক ৪ — অ্যাডমিন সিএমএস — ৭–৯ দিন
- `/admin` CRUD, প্রকাশ, ক্রম, ছবি আপলোড, `react-hook-form + zodResolver`।
- সমাপ্তি: অ্যাডমিন একাই সব বদলাতে পারে।

### মাইলফলক ৫ — লিড পাইপলাইন — ৩ দিন
- `POST /leads` + হার-সীমা + সারি + অ্যাডমিন অবস্থা যন্ত্র।
- সমাপ্তি: ফরম → DB → অ্যাডমিন পূর্ণ চক্র।

### মাইলফলক ৬ — কঠোরীকরণ — ৪–৫ দিন
- `helmet`, হার-সীমা, CORS allowlist, টোকেন বাতিল, লগ, এসইও, সাইটম্যাপ, ব্যাকআপ। §৮ তালিকা।
- সমাপ্তি: তালিকা ছাড়া স্থাপন নিষেধ।

### মাইলফলক ৭ — কাটওভার — ২ দিন
- ছবি স্থানান্তর, পুনঃনির্দেশ, ধোঁয়া পরীক্ষা, প্রশিক্ষণ।
- সমাপ্তি: ডেভেলপার ছাড়া সাইট চলে।

**মোট অনুমান: ৩৪–৪০ কর্মদিবস, অর্থাৎ ৭–৮ সপ্তাহ।** পরিধি বাড়লে ২–৩ সপ্তাহ যোগ।

---

## ৬. সংজ্ঞা — কখন done

ফিচার done মানে:
```text
UI চলে + API চলে + DB-তে সঠিক তথ্য + প্রমাণীকরণ + অনুমোদন + ত্রুটি অবস্থা + রিফ্রেশে টিকে + চুক্তি মিলে + পরীক্ষা সবুজ
```

স্থাপনার আগে §৮ তালিকা:
- ব্যাকএন্ড: ৭ ফাইল, static রুট আগে, JWT থেকে পরিচয়, contracts বৈধতা, pagination, লেনদেন।
- ফ্রন্টএন্ড: page/hook/service, চার অবস্থা render, `zodResolver`, `key={id}`।
- উৎপাদন: CORS allowlist, স্বল্প JWT + ঘূর্ণন + বাতিল, অবজেক্ট স্টোরেজ + স্বাক্ষরিত URL, ধীর কাজ সারিতে, JSON লগ + health, ব্যাকআপ পরীক্ষিত।

---

## ৭. খোলা সিদ্ধান্ত — এগোনোর আগে লাগবে
১. রেপো ধরন C নিশ্চিত? — সুপারিশ: হ্যাঁ।
২. DB `PostgreSQL` + ছবি `S3/R2`? — সুপারিশ: হ্যাঁ।
৩. প্রথম শেষ-থেকে-শেষ ফিচার `hero-slides`? — সুপারিশ: হ্যাঁ।
৪. অ্যাডমিন কি একক ভূমিকা, না সম্পাদক-দর্শক ভাগ থাকবে?
৫. আসল ফোন-ইমেইল-ঠিকানা-ম্যাপ কোনটা চূড়ান্ত?

---

## ৮. পরের ধাপ
১. উপরের ৫টি সিদ্ধান্ত নিশ্চিত করা।
২. মাইলফলক ১ শুরু: `contracts` + `config` + `auth`।
৩. `hero-slides` দিয়ে প্রথম শেষ-থেকে-শেষ প্রমাণ।
৪. দ্বিতীয় ফিচার প্রথমটার কপি-রিনেমে বানানো। না পারলে বিমূর্ততা ঠিক করা।

> নিয়ম: মাইক্রোসার্ভিসে তখনই ভাঙা হবে যখন আলাদা deploy/scale/team লাগবে। তার আগে মডুলার মনোলিথই সেরা।
