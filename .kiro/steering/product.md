# Product Steering — Maya, AI Tour Leader Copilot

## What this is
A web app for small open-trip tour leaders/operators (the exact job of Angga,
tour leader for Singapore & Malaysia open trips as @opentrip_maya). Built for
Kiroween 2026 (AWS/Kiro, Devpost), category **Frankenstein**.

## Who it serves
- **Tour leaders** who run small group open trips and need to plan, publish,
  answer questions, and run departure day without a big back office.
- **Travellers** who want a clear trip page, price, meeting point, and a
  one-tap WhatsApp contact.

## Language
- UI is bilingual: **Bahasa Indonesia (default) + English** toggle.
- All user-facing copy defaults to Bahasa Indonesia; English is a translation,
  never the source of truth for prices or schedules.

## Brand
- Open Trip Maya: navy blue (#0B2447 / #102A43 family) + gold (#F2B705 / #D4A017).
- Tone: warm, practical, honest. Never invent prices, dates, or inclusions.
- WhatsApp is the primary conversion channel: +62 812-2829-0989
  (wa.me/6281228290989).

## Non-negotiables
1. **Real package data only.** Prices, schedules, inclusions, and meeting
   points come from `src/lib/packages.ts`, which mirrors Angga's real 2027
   packages. Never fabricate a price or a date.
2. **No login.** All personal state lives in the browser's localStorage.
3. **No paid APIs required.** The app must be fully useful with zero API keys.
   Gemini (optional, `GEMINI_API_KEY`) only enhances the Q&A; the local
   knowledge base is the fallback and the default.
4. **Free maps.** Leaflet + OpenStreetMap only. No Google Maps key.
5. **Privacy.** No tracking, no analytics, no cookies beyond localStorage.
