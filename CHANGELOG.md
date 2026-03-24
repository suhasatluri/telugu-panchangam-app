# Changelog — Telugu Panchangam App

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned for v1.0.0
- PWA manifest and service worker
- Cloudflare Pages production deployment
- Full public API launch
- README with live demo link

---

## [0.4.0] — Planned: Phase 4

### Added
- Nakshatra Finder — Janma Nakshatra and Raasi from birth date/time/city
- Tarabalam indicator (Auspicious / Neutral / Inauspicious)

---

## [0.3.0] — Planned: Phase 3

### Added
- Festival Tracker — full year view for any year — no limit
- Festival countdown — days until next festival
- Muhurtam Finder — auspicious window search within date range
- Tier 1 festivals: all 16 major Telugu festivals, algorithmically calculated
- Tier 2 festivals: Telangana and AP regional festivals
- Tier 3 festivals: National fixed-date observances
- Adhika Masa (intercalary month) detection and labelling

---

## [0.2.0] — 2026-03-25: Phase 2

### Added
- Month calendar view — 7-column grid, Sunday to Saturday
- Telugu Tithi names on each day cell (font-noto-telugu)
- Moon phase emoji icon per day
- Amavasya (dark bg), Purnima (gold bg), Ekadashi (green tint) highlighting
- Festival badges on relevant days
- Day detail view — full Panchangam for any date
- All 5 Pancha Anga cards with staggered entrance animations
- SVG moon phase visual with pulse animation, illumination bar
- Rahukalam, Gulika Kalam, Yamagandam with danger-coloured left border
- Navigation bar — prev/next day/month, Month/Day tabs, Today button, date jump input
- Telugu/English language toggle (persisted in localStorage)
- City search with typeahead (OpenCage geocoding, server-side proxy)
- Lotus Dawn theme — full Tailwind CSS implementation
- CSS-only animations: fadeUp, slideIn, moonPulse, todayPulse, hover states
- Hover tooltips on calendar day cells (full tithi in Telugu + English)
- API routes: /api/panchangam, /api/panchangam/month, /api/geocode
- i18n strings for all UI labels (Telugu + English)
- పితృ స్మరణ (Ancestor Remembrance) feature:
  - Upcoming Amavasyas list with Mahalaya/Somavati badges
  - Reminder form: name, email, tithi types, personal note
  - Confirmation email via Resend (bilingual, Lotus Dawn themed)
  - One-click unsubscribe page
  - engine/reminders.ts: getUpcomingAmavasyas/Ekadashis
  - emailTemplates.ts: 3 bilingual HTML email templates
  - API: POST /api/reminders, GET /api/reminders, GET /api/reminders/unsubscribe
- Google Fonts: Noto Sans Telugu, Playfair Display, Lora

---

## [0.1.0] — 2026-03-24: Phase 1

### Added
- GitHub repository — public, MIT licence
- Project scaffold — Next.js 14, TypeScript, Tailwind CSS
- Full documentation set: CLAUDE.md, ARCHITECTURE.md, ALGORITHM.md, API.md, DEPLOYMENT.md, CONTRIBUTING.md
- Calculation engine (src/engine/): 13 modules wrapping @ishubhamx/panchangam-js
  - Tithi, Nakshatra, Yoga, Karana, Vara with bilingual Telugu/English names
  - Samvatsaram (60-year Jupiter cycle) mapper
  - Telugu Masa (Amanta lunar month) calculator including Adhika Masa
  - Ritu (season) and Ayana (solstice period) calculation
  - Rahukalam, Gulika Kalam, Yamagandam from weekday + actual local sunrise
  - Sunrise/sunset/moonrise/moonset via SunCalc
  - Moon phase calculation and naming (Telugu + English)
  - Timezone-agnostic ISO 8601 formatting
- Bilingual data files: tithi.json, nakshatra.json, yoga.json, karana.json, masa.json, samvatsaram.json
- Venkatrama 2026 regression test suite — 26 assertions validated against printed calendar
- 75 total tests across 9 suites — all passing
