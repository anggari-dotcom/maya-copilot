# Tech Steering — Maya, AI Tour Leader Copilot

## Stack
- **Next.js 16 (App Router) + React 19 + TypeScript** (strict).
- **Tailwind CSS v4** (`@tailwindcss/turbopack`). Theme tokens in
  `src/app/globals.css` via `@theme` (brand navy/gold).
- **Leaflet + react-leaflet** for maps (OpenStreetMap tiles, no key).
- **No backend database.** State in localStorage; shareable trip pages encode
  their data in the URL (base64 JSON in a query param).
- **Optional AI:** Google Gemini (`@google/generative-ai`) behind
  `src/app/api/ask/route.ts`, active only when `GEMINI_API_KEY` is set.
  Without a key the route returns a local-KB answer.

## Conventions
- All copy in `src/lib/i18n.tsx` (`LangProvider`, `useLang()`, `t` dict).
  Never hard-code UI strings outside the dictionary.
- Package truth lives in `src/lib/packages.ts`. Components import from there;
  never duplicate prices/dates in components.
- Client components that touch `window`/`localStorage`/Leaflet must be
  `"use client"` and, for Leaflet, loaded with `next/dynamic` (`ssr: false`).
- Routes: `/` (home), `/itinerary` (generator), `/trip` (builder),
  `/trip/view` (shareable page, reads `?d=`), `/tanya` (Q&A),
  `/hari-h` (departure-day mode), `/api/ask` (Q&A API).
- Keep pages server-rendered where possible; interactivity is client islands.

## Quality bar
- `npm run build` must pass with zero TypeScript errors.
- Every feature must be exercised end-to-end (dev server + HTTP fetch of the
  rendered page) before it is marked done in PROGRESS.md.
- Mobile-first: the primary user is on a phone/tablet.
