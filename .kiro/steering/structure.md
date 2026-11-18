# Structure Steering — Maya, AI Tour Leader Copilot

```
kiroween-maya-copilot/
├── .kiro/
│   ├── steering/          # product.md, tech.md, structure.md (this file)
│   └── specs/maya-copilot/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── src/
│   ├── app/
│   │   ├── layout.tsx     # nav + LangProvider + footer
│   │   ├── page.tsx       # home: 3 packages, feature cards
│   │   ├── globals.css    # Tailwind v4 theme (navy/gold)
│   │   ├── itinerary/page.tsx   # generator itinerary
│   │   ├── trip/page.tsx        # trip-page builder
│   │   ├── trip/view/page.tsx   # shareable trip page (?d=base64json)
│   │   ├── tanya/page.tsx       # AI Q&A (local KB + optional Gemini)
│   │   ├── hari-h/page.tsx      # departure-day mode (checklist, map, WA)
│   │   └── api/ask/route.ts     # Q&A API (Gemini if key present)
│   └── lib/
│       ├── packages.ts    # SOURCE OF TRUTH: real package data + FAQ
│       ├── i18n.tsx       # bilingual dictionary + LangProvider
│       └── qa.ts          # local knowledge-base matcher
├── public/                # static assets (logo, favicon)
├── PROGRESS.md            # build log (updated per feature)
├── README.md              # setup, deploy, submission notes
└── LICENSE                # MIT
```

## Rules
- New feature = new route + components under that route's folder. Shared UI
  goes in `src/components/` only if used by 2+ routes.
- Never edit `src/lib/packages.ts` data without a source (Angga's real
  packages). If a price/date is unknown, mark it `Tanya via WA`, never guess.
- Every change updates PROGRESS.md with what was done and how it was verified.
