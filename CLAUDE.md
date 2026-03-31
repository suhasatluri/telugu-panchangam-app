# CLAUDE.md — Telugu Panchangam App

> This file is read by Claude Code at the start of every session.
> It contains everything needed to work on this project without prior context.
> Keep it accurate. Update it when architecture changes.

---

## Project Identity

| Field | Value |
|---|---|
| **Name** | Telugu Panchangam App — తెలుగు పంచాంగం |
| **Repository** | `github.com/suhasatluri/telugu-panchangam-app` |
| **Live URL** | `telugu-panchangam.pages.dev` (Cloudflare Pages) |
| **Purpose** | Free, open-source Telugu Panchangam — any city, any date, no limit |
| **Owner** | Suhas Atluri — Melbourne, Australia |
| **Licence** | MIT |

---

## Mission (Read This First)

This is not a commercial app. It is a gift to the Telugu-speaking community worldwide — diaspora in Australia, USA, UK, Singapore, and families in Andhra Pradesh and Telangana.

**The app is visual and time-based.** It shows the sky. It shows the time. It honours the tradition. It makes no predictions and sells nothing.

**What this app is:**
- A visual, time-based Panchangam calendar
- Accurate sunrise/moonrise/phase for any city worldwide
- Free forever — no ads, no login, no subscriptions
- Open source — MIT licence, welcoming community contributions
- unlimited years of accurate Panchangam (any date)

**What this app is NOT:**
- An astrology or horoscope platform
- A Jathakam or birth chart generator
- A Dasha, Porutham or compatibility tool
- A commercial product or subscription service

Every feature decision must be checked against this mission. If a proposed feature could be interpreted as predictive astrology — it does not belong in v1.

---

## Tech Stack

```
Framework:      Next.js 14 (App Router, TypeScript)
Styling:        Tailwind CSS — custom Lotus Dawn theme
Fonts:          Noto Sans Telugu, Playfair Display, Lora (Google Fonts)
Engine:         @ishubhamx/panchangam-js (MIT) + Telugu layer (our code)
Astronomy:      suncalc — sunrise/moonrise/phase per lat/lng
Geocoding:      OpenCage API (proxied — never expose key to client)
Cache/DB:       Cloudflare D1 (SQLite) + Cloudflare KV
Deployment:     Cloudflare Pages + Workers
Analytics:      Cloudflare Analytics (no cookies, no tracking scripts)
CI/CD:          GitHub Actions → auto-deploy to Cloudflare on push to main
Node version:   18.x
Package mgr:    npm
```

---

## Design Theme — Lotus Dawn

The visual identity is locked. Do not change colours or fonts without explicit instruction.

```css
/* Core palette — use these CSS variable names throughout */
--bg:           #FFF6EE   /* warm cream background */
--header-grad:  linear-gradient(135deg, #D4603A, #E8875A, #D4A547)
--text-primary: #1A0800   /* near-black warm */
--text-secondary: #6B3010  /* deep warm brown */
--accent:       #C04020   /* burnt orange */
--label:        #8B4020   /* terracotta label colour */
--gold:         #A07000   /* festival / Purnima gold */
--danger:       #8B0000   /* Rahukalam / inauspicious red */
--auspicious:   #167040   /* Tarabalam green */

/* Fonts */
Telugu script:  'Noto Sans Telugu', sans-serif
Headings/dates: 'Playfair Display', serif (italic for Sanskrit terms)
Body/labels:    'Lora', serif
```

**Tailwind config key:** `tailwind.config.ts` extends with these as named colours. Always use `text-accent`, `bg-cream` etc — never raw hex values in components.

---

## Repository Structure

```
telugu-panchangam-app/
├── CLAUDE.md                    ← You are here
├── README.md
├── ARCHITECTURE.md
├── ALGORITHM.md
├── API.md
├── DEPLOYMENT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── prompts.md                   ← Claude Code prompts used in development
├── decisions/                   ← Architecture Decision Records
│   ├── 001-calculation-engine.md
│   ├── 002-cloudflare-d1-not-supabase.md
│   ├── 003-open-api-no-keys.md
│   └── 004-lotus-dawn-theme.md
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── page.tsx             ← Home — today's Panchangam
│   │   ├── layout.tsx
│   │   ├── [year]/
│   │   │   └── [month]/
│   │   │       ├── page.tsx     ← Month grid view
│   │   │       └── [day]/
│   │   │           └── page.tsx ← Day detail view
│   │   ├── reminders/
│   │   │   └── page.tsx         ← పితృ స్మరణ — Ancestor Remembrance
│   │   ├── festivals/
│   │   │   └── page.tsx         ← పండుగలు — Festival Tracker
│   │   ├── muhurtam/
│   │   │   └── page.tsx         ← ముహూర్తం — Muhurtam Finder
│   │   ├── nakshatra/
│   │   │   └── page.tsx         ← జన్మ నక్షత్రం — Nakshatra Finder
│   │   └── api/
│   │       ├── panchangam/
│   │       │   └── route.ts     ← GET /api/panchangam
│   │       ├── panchangam/month/
│   │       │   └── route.ts     ← GET /api/panchangam/month
│   │       ├── festivals/
│   │       │   └── route.ts     ← GET /api/festivals
│   │       ├── muhurtam/
│   │       │   └── route.ts     ← GET /api/muhurtam
│   │       ├── nakshatra/
│   │       │   └── route.ts     ← GET /api/nakshatra
│   │       ├── geocode/
│   │       │   └── route.ts     ← GET /api/geocode (proxies OpenCage)
│   │       └── reminders/
│   │           ├── route.ts     ← GET/POST /api/reminders
│   │           └── unsubscribe/
│   │               └── route.ts ← GET /api/reminders/unsubscribe
│   ├── engine/                  ← Pure TypeScript calculation core
│   │   ├── index.ts             ← Public exports
│   │   ├── panchangam.ts        ← Orchestrator — main entry point
│   │   ├── astronomy.ts         ← Sun/Moon longitudes (VSOP87 via lib)
│   │   ├── tithi.ts             ← Tithi + Paksha
│   │   ├── nakshatra.ts         ← 27 Nakshatras + Pada
│   │   ├── yoga.ts              ← 27 Yogas
│   │   ├── karana.ts            ← 11 Karanas
│   │   ├── samvatsaram.ts       ← 60-year Telugu year cycle
│   │   ├── masa.ts              ← Telugu lunar month + Adhika Masa
│   │   ├── rahukalam.ts         ← Inauspicious periods
│   │   ├── reminders.ts         ← Upcoming Amavasya/Ekadashi finder
│   │   ├── festivals.ts         ← Full-year festival calculation engine
│   │   ├── festivalMatcher.ts   ← Per-day festival matcher (used by panchangam.ts)
│   │   ├── muhurtam.ts          ← Auspicious time window calculator
│   │   ├── moonphase.ts         ← Moon phase + illumination
│   │   ├── sunrise.ts           ← SunCalc wrapper
│   │   ├── timezone.ts          ← Timezone utilities
│   │   └── types.ts             ← Engine-specific TypeScript types
│   ├── components/
│   │   ├── CalendarGrid.tsx
│   │   ├── DayDetail.tsx
│   │   ├── MoonPhase.tsx        ← SVG animated moon
│   │   ├── CitySearch.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── TimeNav.tsx
│   │   ├── NavBar.tsx            ← Persistent navigation bar
│   │   ├── AppHeader.tsx         ← Sunrise gradient header
│   │   ├── AncestorReminder.tsx  ← పితృ స్మరణ reminder form + list
│   │   ├── TithiAnniversary.tsx  ← తిథి వార్షికం — Tithi Anniversary Finder
│   │   ├── FestivalTracker.tsx   ← పండుగలు — Festival list + filters
│   │   ├── MuhurtamFinder.tsx    ← ముహూర్తం — Auspicious window finder
│   │   └── NakshatraFinder.tsx   ← జన్మ నక్షత్రం — Birth star finder
│   ├── data/
│   │   ├── samvatsaram.json     ← 60 year names TE + EN
│   │   ├── nakshatra.json       ← 27 Nakshatra names + attributes
│   │   ├── tithi.json           ← 30 Tithi names TE + EN
│   │   ├── yoga.json            ← 27 Yoga names TE + EN
│   │   ├── karana.json          ← 11 Karana names TE + EN
│   │   └── masa.json            ← 12 Masa names TE + EN
│   ├── lib/
│   │   ├── i18n.ts              ← All UI strings TE + EN
│   │   ├── cache.ts             ← localStorage helpers (city, lang)
│   │   └── emailTemplates.ts    ← Bilingual HTML email templates
│   ├── hooks/
│   │   └── usePanchangam.ts
│   └── types/                   ← (empty — types live in engine/types.ts)
├── validation/
│   ├── check-output.ts          ← Engine output checker
│   ├── fixtures/
│   │   └── march2026.json       ← Reference data for March 2026
│   └── regression.test.ts       ← Engine vs Venkatrama assertions
├── jest.config.js               ← Jest test configuration
├── next.config.mjs              ← Next.js config (ESM)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Coding Conventions

### TypeScript
- Strict mode enabled — no `any` types, ever
- All engine functions must have explicit return types
- Use `zod` for runtime validation of API inputs
- Errors thrown from engine functions must be typed

### Naming
```typescript
// Files: kebab-case
tithi-calculator.ts

// React components: PascalCase
CalendarGrid.tsx

// Functions: camelCase
calculateTithi()

// Constants: SCREAMING_SNAKE_CASE
LAHIRI_AYANAMSA_EPOCH

// Types/Interfaces: PascalCase
interface DayPanchangam {}
type TithiName = string
```

### Engine Rules (critical — read carefully)
- The engine is **pure functions only** — no side effects, no API calls
- Every calculation function takes `(julianDay: number, lat: number, lng: number)` or a subset
- All times returned as **ISO 8601 strings with timezone offset**
- Ayanamsa used: **Lahiri (Chitrapaksha)** — hardcoded, never configurable in v1
- Telugu month system: **Amanta** (new moon to new moon) — matches Venkatrama
- Paksha: Shukla starts at new moon, Krishna starts at full moon

### API Rules
- All API routes validate input with zod before processing
- All API routes return consistent error shape: `{ error: string, code: string }`
- Rate limiting handled by Cloudflare — not in application code
- **Never expose OpenCage API key to client** — always proxy through `/api/geocode`
- Cache key format: `panchangam:{date}:{lat_5dp}:{lng_5dp}:{tz}`

### Component Rules
- All components support `lang: 'te' | 'en'` prop
- Telugu text always uses `font-noto-telugu` Tailwind class
- Never hardcode Telugu strings in components — always from `i18n.ts`
- Moon phase visual: always use `<MoonPhase />` component — never inline SVG

### Testing
- Unit tests: `*.test.ts` co-located with source files
- Integration tests: `validation/regression.test.ts`
- Run tests: `npm test`
- Tests must pass before any PR is merged
- The Venkatrama 2026 data is **ground truth** — engine output must match it

---

## Environment Variables

```bash
# .env.local (never commit — in .gitignore)
OPENCAGE_API_KEY=          # City geocoding — never expose to client
CLOUDFLARE_D1_DATABASE_ID= # D1 database binding
CLOUDFLARE_KV_NAMESPACE=   # KV namespace binding
RESEND_API_KEY=            # Email sending via Resend — never expose to client
RESEND_FROM_EMAIL=         # Sender email address for reminders

# Set in Cloudflare Pages dashboard for production
# Set in wrangler.toml for local development
```

---

## Key Architectural Decisions (Summary)

Full rationale in `decisions/` folder. Summary:

| Decision | Choice | Reason |
|---|---|---|
| Calculation engine | @ishubhamx/panchangam-js + Telugu layer | MIT, 100% accuracy verified |
| No external Panchangam API | Pure JS engine | Works any date — no rate limits, free |
| Database | Cloudflare D1 + KV | Same edge network, ~2ms vs ~80ms (see 002-cloudflare-d1-not-supabase.md) |
| Deployment | Cloudflare Pages | Free, unlimited bandwidth, global |
| API access | Open, no keys | Mission: free for the people |
| Analytics | Cloudflare Analytics | Free, no cookies, no tracking |
| Ayanamsa | Lahiri only | Matches Venkatrama & all Telugu Panchangams |
| Telugu month | Amanta system | Matches Andhra Pradesh / Telangana tradition |
| Theme | Lotus Dawn | See decisions/004-lotus-dawn-theme.md |

---

## Validation Reference

The **Venkatrama & Co. calendar** (Eluru, January–June 2026) is the ground truth for all validation. Images are in `validation/venkatrama/`.

Key validated data points:
- March 19, 2026: Ugadi — Viswavasu → Parabhava Samvatsaram transition
- March 15, 2026: Amavasya
- March 27, 2026: Sri Rama Navami (Chaitra Shukla Navami)
- May 12, 2026: Hanuman Jayanti (Chaitra Purnima)
- February 15, 2026: Maha Sivaratri (Magha Krishna Chaturdashi)
- All Rahukalam timings must match Venkatrama table for Melbourne lat/lng

---

## Current Build Status

```
Phase 1 — Engine + Validation:  [x] Complete (75 tests, 26 Venkatrama assertions)
Phase 2 — Calendar UI:          [x] Complete (month grid, day detail, Lotus Dawn theme)
Phase 2.5 — Tithi Anniversary:  [x] Complete (తిథి వార్షికం finder)
Phase 2.5 — Ancestor Reminders: [x] Complete (పితృ స్మరణ with email notifications)
Phase 3 — Festivals + Muhurtam: [x] Complete (festival engine, muhurtam finder, calendar badges, API routes)
Phase 4 — Nakshatra + Moon:     [x] Complete (Janma Nakshatra finder, Tarabalam, Raasi, MoonPhase glow)
Phase 5 — PWA + Deploy:         [ ] Not started (will add public/manifest.json, sw.js)
```

Update this section after each phase completes.

---

## Common Tasks for Claude Code

```bash
# Run development server
npm run dev

# Run all tests
npm test

# Run only engine validation tests
npm test -- validation/regression.test.ts

# Type check
npm run typecheck

# Lint
npm run lint

# Build for production
npm run build

# Deploy to Cloudflare (requires wrangler auth)
npm run deploy
```

---

## Who to Ask

- Architecture questions → read `ARCHITECTURE.md` first
- Algorithm questions → read `ALGORITHM.md` first
- API questions → read `API.md` first
- Festival accuracy questions → check `validation/venkatrama/` images
- Deployment questions → read `DEPLOYMENT.md` first
