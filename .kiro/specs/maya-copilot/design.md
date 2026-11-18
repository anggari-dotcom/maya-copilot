# Design — Maya, AI Tour Leader Copilot

## Architecture
Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4.
No database. State: localStorage (saved plans, checklists, headcount) +
URL-encoded state (shareable trip pages). Optional server route
`/api/ask` for Gemini (env-gated).

## Data model (`src/lib/packages.ts`)
```ts
type PackageId = "singapura" | "malaysia" | "dua-negara";
interface TripPackage {
  id: PackageId;
  name: string; subtitle: string;
  days: number; nights: number;
  priceIdr: number; priceLabel: string; priceNote?: string; // "Mulai ..."
  currency: "IDR";
  includes: string[]; excludes: string[];
  meetingPoint: { name: string; lat: number; lng: number; note: string };
  accommodation: string;
  transport: string;
  minPeople: number;
  downPaymentIdr?: number;      // undefined = "Tanya via WA"
  fullPaymentDeadline?: string; // e.g. "H-14"
  cancelPolicy?: string;
  itinerary: { day: number; title: string; stops: string[] }[];
  schedule2027: { label: string; note?: string }[]; // real dates
  earlyBird?: { dpIdr: number; until: string; trips: string };
}
```
FAQ items live next to the packages (`faq: { q, a, tags }[]`) and feed the
local Q&A matcher (`src/lib/qa.ts`: keyword/synonym scoring, returns the
best answer + source note).

## UI
- Brand: navy `#0B2447` (primary), gold `#F2B705` (accent), white bg,
  slate text. Rounded cards, generous spacing, big tap targets.
- Nav: logo "Maya ✈️ Copilot", links (Beranda, Itinerary, Buat Trip,
  Tanya, Hari-H), ID/EN toggle.
- i18n: `src/lib/i18n.tsx` — `LangProvider` + `useLang()` + dictionary;
  all UI strings via `t(key)`.

## Key decisions
- Shareable trip page without a backend: base64url JSON in `?d=`. Keeps the
  app deployable as a static-friendly Next.js app on Vercel free tier.
- Leaflet via `next/dynamic(..., { ssr: false })` in a client component;
  `leaflet/dist/leaflet.css` imported in that component.
- Gemini is an enhancement, never a dependency: the local KB answers first
  when no key is present, and the UI discloses the mode.
