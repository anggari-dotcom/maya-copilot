# Requirements — Maya, AI Tour Leader Copilot (Kiroween 2026)

## Overview
Web app (Bahasa Indonesia + English, no login) that helps a small open-trip
tour leader plan trips, publish shareable trip pages, answer traveller
questions, and run departure day. Data: Angga's real 2027 packages.

## Functional requirements

### R1 — Itinerary generator (`/itinerary`)
- User picks a package (Singapore 3D2N / Malaysia 3D2N / 2 Negara 4D3N) or
  "custom", picks a departure date and a budget.
- Output: day-by-day plan with real itinerary stops, meeting point, price
  calculation (price × travellers), and the package's real 2027 schedule
  (nearest departures listed).
- Custom mode: pick destination + days + budget → plan built from the same
  stop library, clearly labelled as a draft estimate.
- "Save" stores the plan in localStorage; "Share" opens the trip builder
  pre-filled.

### R2 — Trip page builder (`/trip`) + shareable page (`/trip/view?d=...`)
- Builder: title, package, dates, price, meeting point, inclusions, notes.
- Generates a shareable link: `/trip/view?d=<base64url JSON>`.
- View page renders the trip nicely + WhatsApp CTA
  (`https://wa.me/6281228290989?text=...` prefilled) + copy-link button.
- Works with zero backend: all state in the URL.

### R3 — AI Q&A (`/tanya` + `POST /api/ask`)
- Chat UI in Bahasa Indonesia. Answers ONLY from the package knowledge base
  (`src/lib/packages.ts` + `src/lib/qa.ts`): inclusions, exclusions, prices,
  DP, meeting points, schedules, what to bring.
- If `GEMINI_API_KEY` is set, `/api/ask` may call Gemini with the KB as
  context; if not set (default), the local KB matcher answers. The UI must
  state which mode is active. Never hallucinate a price/date.

### R4 — Departure-day mode (`/hari-h`)
- Pick a trip (from saved plans or a package + date).
- Checklist (documents, tickets, cash, etc.) persisted in localStorage.
- Headcount counter (adults/children, confirmed vs pending).
- Leaflet map with meeting-point markers: Changi Airport (1.36, 103.99),
  KLIA (2.7456, 101.7099).
- WhatsApp broadcast generator: template + trip details → prefilled
  `wa.me` message text the leader can copy/send.

### R5 — Home (`/`)
- Hero, the 3 real packages with real prices, feature cards linking to the
  4 tools, Early Bird note (DP Rp500rb s.d. 30 Nov 2026, trip Jan 2027).
- Language toggle ID/EN in the nav.

## Non-functional requirements
- NFR1: `npm run build` passes; no TypeScript errors.
- NFR2: Works with zero API keys; no login; no tracking.
- NFR3: Mobile-first responsive; readable on a phone.
- NFR4: Real data only — `src/lib/packages.ts` is the single source of truth.
- NFR5: Repo contains `/.kiro` (specs + steering) as evidence of Kiro usage.
