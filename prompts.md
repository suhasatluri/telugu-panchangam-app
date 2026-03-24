# Claude Code Prompts — Telugu Panchangam App

> All prompts used to build this project with Claude Code.
> Paste these into Claude Code sessions to reproduce or continue the work.
> Each prompt maps to one or more git commits.

---

## Phase 1 — Engine + Validation

### Prompt 1: Initial scaffold and full engine build

```
We are starting Phase 1 of the Telugu Panchangam App.

Read CLAUDE.md first — it contains the full project context.

Phase 1 goal: Scaffold the Next.js project and build the
calculation engine, then validate it against the Venkatrama
calendar data.

Please do the following in order:

1. SCAFFOLD — Set up Next.js 14 with TypeScript, Tailwind CSS,
   and the Lotus Dawn design tokens from CLAUDE.md

2. DEPENDENCIES — Install:
   @ishubhamx/panchangam-js
   suncalc
   date-fns-tz
   @types/suncalc

3. ENGINE — Build the calculation engine in src/engine/:
   - panchangam.ts  (orchestrator)
   - astronomy.ts   (VSOP87 wrapper)
   - tithi.ts       (+ test)
   - nakshatra.ts   (+ test)
   - yoga.ts        (+ test)
   - karana.ts      (+ test)
   - samvatsaram.ts (+ test)
   - masa.ts        (+ test)
   - rahukalam.ts   (+ test)
   - sunrise.ts     (suncalc wrapper)
   - moonphase.ts
   - timezone.ts
   - types.ts       (all shared TypeScript interfaces)

4. VALIDATE — Create validation/fixtures/march2026.json
   with test cases extracted from the Venkatrama calendar
   images (January–June 2026) and write regression tests
   in validation/regression.test.ts

5. API ROUTE — Build /api/panchangam route handler
   with Cloudflare D1 cache check and engine fallback

6. TEST — Run all tests. Every engine module must pass
   before Phase 1 is complete.

The no-limit date range is intentional — VSOP87 has no
expiry date. Do not add MIN_YEAR or MAX_YEAR constants.

Commit after each step with conventional commit format.
```

**Commits produced:**
- `e9d36dd` feat: scaffold Next.js 14 with Lotus Dawn theme
- `65dc56b` feat: install dependencies and configure Jest
- `e1a6ffe` feat: build calculation engine with bilingual Telugu/English support
- `07fced0` test: add Venkatrama 2026 regression tests and validation fixtures
- `022a864` feat: add /api/panchangam route handler with zod validation

---

## Phase 2 — Calendar UI

### Prompt 2: Full calendar UI build

```
Read CLAUDE.md first. Phase 1 is complete.

75 tests passing. 26 Venkatrama regression tests green.
Engine is validated and accurate.

We are now building Phase 2 — the Calendar UI.

The design system is Lotus Dawn. All tokens are already
in tailwind.config.ts. Use only these classes:
  bg-cream         text-primary      text-secondary
  text-accent      text-label        text-gold
  text-danger      text-auspicious   bg-header-grad
  font-noto-telugu font-playfair     font-lora

Google Fonts to add to layout.tsx:
  Noto Sans Telugu (weights 300, 400, 600, 700)
  Playfair Display (weights 400, 600, 700 + italic)
  Lora (weights 400, 600 + italic)

Default city: Melbourne, Australia
  lat: -37.8136, lng: 144.9631, tz: Australia/Melbourne

Build in this exact order, committing after each step:

STEP 1 — src/lib/i18n.ts
  All UI strings in Telugu and English.

STEP 2 — src/lib/cache.ts
  localStorage helpers for city and language.

STEP 3 — src/app/api/panchangam/route.ts
  Add CORS headers and Cache-Control.

STEP 4 — src/app/api/panchangam/month/route.ts
  Month endpoint returning lightweight day summaries.

STEP 5 — src/components/MoonPhase.tsx
  SVG moon phase visual component.

STEP 6 — src/components/LanguageToggle.tsx
  తె | EN toggle button.

STEP 7 — src/components/TimeNav.tsx
  Month and year navigation.

STEP 8 — src/components/CitySearch.tsx
  City typeahead calling /api/geocode.

STEP 9 — src/components/CalendarGrid.tsx
  Venkatrama-style 7-column month calendar.

STEP 10 — src/components/DayDetail.tsx
  Full Panchangam panel for one day.

STEP 11 — src/app/[year]/[month]/[day]/page.tsx
  Day detail page.

STEP 12 — src/app/[year]/[month]/page.tsx
  Month calendar page.

STEP 13 — src/app/page.tsx (Home)
  Redirects to today's date.

STEP 14 — src/app/layout.tsx
  Root layout with Google Fonts and AppHeader.

STEP 15 — src/app/globals.css
  Base styles only.

Commit after each component. All commits in conventional format.
```

**Commits produced:**
- `b6140c9` feat: add i18n strings for all UI labels
- `57e5ab8` feat: add localStorage helpers for city and language
- `1176789` feat: add /api/panchangam/month endpoint and CORS headers
- `7c6b8ab` feat: add MoonPhase SVG, LanguageToggle, TimeNav, CitySearch
- `521ad13` feat: add CalendarGrid month view and DayDetail panchangam panel
- `6917435` feat: Phase 2 complete — calendar UI with Lotus Dawn theme

---

### Prompt 3: OpenCage API key + geocode route

```
OPENCAGE_API_KEY=<key>
```

(Added to .env.local, then built /api/geocode route)

**Commit:** `d689f73` feat: add /api/geocode route proxying OpenCage API

---

### Prompt 4: Fix CitySearch page freeze

```
Read CLAUDE.md. Before changing anything, read the
existing code first.

Bug: page stops loading when a city is selected in CitySearch.

STEP 1 — DIAGNOSE FIRST:
Read these files and understand what they currently do:
  src/components/CitySearch.tsx
  src/lib/cache.ts
  src/app/api/geocode/route.ts

STEP 2 — IDENTIFY THE EXACT CAUSE
STEP 3 — FIX ONLY WHAT IS BROKEN
```

**Diagnosis:** `router.refresh()` on client-rendered pages loses component state.
**Fix:** Replaced with `window.location.reload()`.

---

### Prompt 5: Fix Telugu Tithi names in calendar grid

```
Read CLAUDE.md. Before changing anything, read the
existing code first.

In src/components/CalendarGrid.tsx, find where the
Tithi name is rendered on each day cell.

It is currently showing the English name (e.g. "Panchami").
It should show the Telugu name (e.g. "పంచమి") using
the font-noto-telugu class.

Make ONLY this change. Do not touch anything else.
```

**Commit:** `2e9eadc` fix: show Telugu Tithi names in calendar grid

---

### Prompt 6: Navigation bar + animations + UX improvements

```
Read CLAUDE.md. GOLDEN RULE: Read all existing files before
changing anything. Only modify what needs to change.

CHANGE 1 — Navigation bar (src/components/NavBar.tsx)
  Persistent bar below header with:
  - ← → arrows (prev/next day or month)
  - Month/Day tabs
  - Today button
  - Date jump input (DD MMM YYYY)

CHANGE 2 — Add NavBar to layout.tsx

CHANGE 3 — CSS animations (globals.css)
  a) Page fadeUp on load
  b) Staggered Pancha Anga card entrance
  c) Sky timing card stagger
  d) Rahukalam slideIn
  e) Moon phase moonPulse
  f) Calendar day cell hover lift + shadow
  g) Language toggle scale
  h) NavBar tab slide

CHANGE 4 — Improve DayDetail visual hierarchy
  a) Larger date heading + separator
  b) Anga cards hover lift
  c) Moon phase: Telugu above, English below, illumination bar
  d) Inauspicious cards: left border danger, bold time

CHANGE 5 — CalendarGrid day click feedback
  - Press animation + hover tooltip
```

**Commit:** `4eeef09` feat: navigation bar + animations + UX improvements

---

### Prompt 7: Fix reminders page 404 + NavBar NaN

```
Read CLAUDE.md. GOLDEN RULE: Read all existing files before
changing anything. Only fix what is broken.

BUG 1 — 404 on /reminders
  Check if page exists, create if missing.

BUG 2 — NavBar shows "25 Mar NaN"
  Fix parseRoute() to handle non-date paths like /reminders.
  Fall back to today's date when path segments aren't numbers.
```

**Commit:** `69b5889` fix: reminders page 404 + NavBar NaN on non-date routes

---

### Prompt 8: పితృ స్మరణ — Ancestor Remembrance feature

```
Read CLAUDE.md. GOLDEN RULE: Read all existing files before
changing anything. Only fix what is broken. Minimum changes only.

Build the full పితృ స్మరణ feature:

CREATE: src/engine/reminders.ts
  getUpcomingAmavasyas() and getUpcomingEkadashis()
  Walk forward day by day, collect matching tithis.

CREATE: src/lib/emailTemplates.ts
  Three bilingual HTML email templates:
  - confirmationEmail()
  - reminderEmail()
  - unsubscribeConfirmationEmail()
  Lotus Dawn colours, inline CSS, warm reverent tone.

CREATE: src/app/api/reminders/route.ts
  POST — create reminder + send confirmation via Resend
  GET — upcoming Amavasyas and Ekadashis

CREATE: src/app/api/reminders/unsubscribe/route.ts
  GET — HTML unsubscribe confirmation page

CREATE: src/components/AncestorReminder.tsx
  Section A: Upcoming Amavasya cards
  Section B: Reminder form
  Section C: Manage existing reminder

UPDATE: src/app/reminders/page.tsx
  Replace placeholder with full feature.
```

**Commit:** `056bf14` feat: పితృ స్మరణ complete — ancestor remembrance reminders

---

## Standing Rules

These rules apply to ALL prompts in this project:

```
GOLDEN RULE: Before making any changes, always read and
understand the existing code first. Only fix what is
actually broken. Do not rewrite, refactor, or improve
code that is working. Make the minimum change necessary
to fix the issue.
```

```
IMPORTANT RULE FOR THIS AND ALL FUTURE SESSIONS:
Before making any changes, always read and understand
the existing code first. Only fix what is actually broken.
Do not rewrite, refactor, or improve code that is working.
Make the minimum change necessary to fix the issue.
```

---

## Context Recovery Prompt

If Claude Code loses context mid-session:

```
Read CLAUDE.md — we are in Phase [N].
Continue from where we left off.
```

---

## Environment Variables (never commit)

```
OPENCAGE_API_KEY=          # Add to .env.local
RESEND_API_KEY=            # Add to .env.local
RESEND_FROM_EMAIL=         # Add to .env.local
```

---

*This file is maintained manually. Update after each major prompt session.*
