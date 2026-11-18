# Tasks — Maya, AI Tour Leader Copilot (Kiroween 2026)

Status: build week 17–23 Nov 2026. Mark each `[x]` when `npm run build`
passes AND the flow was exercised end-to-end.

- [x] Setup: Next.js 16 + TS + Tailwind v4 scaffold; `.kiro/` steering +
  spec; Kiro CLI 3.3.0 installed (auth pending — needs Angga's sign-in).
- [x] Data truth: `src/lib/packages.ts` (3 real packages, schedules, FAQ).
- [x] i18n: `src/lib/i18n.tsx` (ID/EN dictionary + provider).
- [x] Layout + home: nav, hero, package cards, feature cards.
- [x] Feature 1 — Itinerary generator (`/itinerary`).
- [x] Feature 2 — Trip builder (`/trip`) + shareable view (`/trip/view`).
- [x] Feature 3 — Q&A (`/tanya` + `/api/ask`, local KB + optional Gemini).
- [x] Feature 4 — Day-H mode (`/hari-h`: checklist, headcount, map, WA).
- [x] Polish: README, LICENSE (MIT), PROGRESS.md, screenshots, final build.
  (Perbaikan review: label ganda TripCard; ikon marker Leaflet lokal.
  Caveat: tile OSM abu-abu hanya di browser VM ini karena proxy tunnel;
  curl ke tile.openstreetmap.org = 200, akan normal setelah deploy.)
- [ ] Deploy: Vercel (Angga's account) — instructions in README.
- [ ] Submission: Devpost (Angga), demo video <3 min (Angga), GitHub public.

## Notes for the builder
- Kiro CLI is installed at `~/.local/bin/kiro-cli` (v3.3.0) but
  `kiro-cli whoami` reports "Not logged in". Agentic sessions need Angga to
  sign in (GitHub/Google/AWS Builder ID) or provide a KIRO_API_KEY (Pro+).
  Until then, build with the tools at hand and keep `.kiro/` specs/steering
  as the Kiro-native record of the design.
- Never invent prices/dates. Unknown = "Tanya via WA".
- Never create accounts (GitHub, Vercel, Devpost, Kiro, Google) — Angga's job.
