# Hackathon log

- **Project:** Maya — AI Tour Leader Copilot
- **Event:** Kiroween 2026 (AWS/Kiro, Devpost)
- **What it does:** A copilot web app for an open-trip tour leader: itinerary generator, shareable trip pages, a Q&A assistant that answers from real package data, and a day-of-trip mode with checklist, headcount, map, and WhatsApp broadcast.
- **Live app:** https://maya-copilot.vercel.app
- **Repo:** https://github.com/anggari-dotcom/maya-copilot
- **Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4, Leaflet/OpenStreetMap, localStorage; no login, no tracking
- **AI models:** Gemini gemini-2.0-flash (optional, via GEMINI_API_KEY); without a key the Q&A answers from a local knowledge base built from the real package data
- **Built with Kiro:** the repo holds a `/.kiro` folder (steering: product, tech, structure; specs: requirements, design, tasks). Kiro CLI 3.3.0 was installed on the build machine; agentic Kiro sessions still need the owner's sign-in.
- **Started:** 2026-11-16T02:19:00Z
- **Last updated:** 2026-11-18T04:14:28Z

## Log

### 2026-11-16 - 6936188
Scaffolded the app with Next.js 16 + Tailwind v4 and set up the Kiro-native
`/.kiro` steering and specs. Added the real package data (Singapore 3D2N,
Malaysia 3D2N, 2 Countries 4D3N with 2027 schedules and FAQs), bilingual
ID/EN UI, home page, and the itinerary generator (package/custom, dates,
participants, budget, total price, 2027 schedule). Build passes
(`src/lib/packages.ts`, `src/lib/qa.ts`, `src/lib/i18n.tsx`, `.kiro/steering/`,
`.kiro/specs/maya-copilot/`).

### 2026-11-16 - 31119ef
Shipped all remaining features: trip builder with shareable pages and
WhatsApp sharing (`/trip`, `/trip/view`), the "Tanya Maya" Q&A
(`/tanya`, `POST /api/ask`, local knowledge base with optional Gemini),
and Hari-H mode (`/hari-h`) with checklist, headcount with a minimum-4
warning, Leaflet meeting-point map, and a WhatsApp broadcast generator.
Fixed a duplicated TripCard label and moved Leaflet marker icons local.
Verified every route returns 200 and the build passes with zero TypeScript
errors; added 11 screenshots and a PROGRESS log
(`src/lib/trip-share.ts`, `src/app/api/ask/route.ts`,
`src/app/hari-h/Map.tsx`, `src/components/TripCard.tsx`,
`screenshots/`).

### 2026-11-18 - a78d500
Switched Leaflet map marker icons to the Leaflet CDN so the public repo
snapshot stays complete even though it only contains text files
(`src/app/hari-h/Map.tsx`).

### 2026-11-18 - 5f315efe
Deployed the app to Vercel from the GitHub repo (imported in the Vercel
dashboard by the owner, after the connector token was denied project
access). Live at https://maya-copilot.vercel.app — verified all five routes
return 200 and POST /api/ask answers from the local knowledge base without
an API key. README and this log now link the live app.
