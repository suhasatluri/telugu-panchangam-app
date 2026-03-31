# Changelog — Telugu Panchangam App

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [0.5.0] — 2026-03-31: Phase 5

### Added
- PWA manifest (manifest.json) with Lotus Dawn theme colours
- Service worker (sw.js) — cache-first for geocoding, network-first for panchangam/festivals
- ServiceWorkerRegistration client component
- Apple mobile web app meta tags in layout
- @cloudflare/next-on-pages adapter for Cloudflare Pages deployment
- `export const runtime = 'edge'` on all API routes and root layout
- D1 cache layer in /api/panchangam (read + write-through)
- D1 persistence for /api/reminders POST (reminder storage)
- src/lib/cloudflare.ts — getDB() and getKV() helpers for Cloudflare bindings
- GitHub Actions deploy workflow (.github/workflows/deploy.yml)
- Cloudflare Pages project created and first production deployment
- nodejs_compat_v2 compatibility flag for full Node.js API support
- .npmrc with legacy-peer-deps=true for build compatibility

### Fixed
- API routes now read env vars via getEnvVar() (Cloudflare request context) instead of process.env
- City search works worldwide — OPENCAGE_API_KEY secret set on CF Pages production
- Reminders route reads RESEND_API_KEY and RESEND_FROM_EMAIL from CF context

### Changed
- next.config.mjs: dynamic import of setupDevPlatform (dev only)
- wrangler.toml: pages_build_output_dir, nodejs_compat_v2 flag
- README + API.md: live URL updated to telugu-panchangam-app.pages.dev

---

## [0.4.0] — 2026-03-31: Phase 4

### Added
- Nakshatra Finder — Janma Nakshatra from exact birth date, time, and city
- Raasi (zodiac sign) mapping for all 27 Nakshatras × 4 Padas
- Tarabalam daily indicator (9 Tara qualities: Janma through Parama Mitra)
- `/api/nakshatra` API route with zod validation + disclaimer
- `/nakshatra` page with birth details form, 3-card result layout
- MoonPhase SVG enhanced with glow filter (intensity scales with illumination)
- MoonPhase now supports bilingual phase label below the moon visual
- Nakshatra link added to AppHeader quick links

---

## [0.3.0] — 2026-03-31: Phase 3

### Added
- Festival engine — `getFestivalsForYear()` scans all 365 days of any year
- Per-day festival matcher — `matchFestivalsForDay()` wired into `calculateDayPanchangam()`
- Tier 1 festivals: Ugadi, Sri Rama Navami, Hanuman Jayanti, Sankranti cluster, Sivaratri, Krishna Janmashtami, Vinayaka Chaturthi, Vijayadasami, Deepavali, Karthika Purnima, Holi, Akshaya Tritiya, Varalakshmi Vratam, all Ekadashis/Amavasyas/Purnimas
- Tier 2 festivals: Bathukamma (9-day), Bonalu, Karthika Somavaram, Nagula Chavithi
- Tier 3 festivals: Republic Day, Independence Day, Gandhi Jayanti, Telangana/AP Formation Days, Christmas
- Next-tithi matching for Ugadi (March 19) and Maha Sivaratri (Feb 15) — matches Venkatrama
- Festival badges on CalendarGrid — tiered colour dots (gold/accent/muted) with overflow count
- `/festivals` page — year nav, filter pills (All/Major/Regional/Ekadashi/Amavasya), next festival banner
- `/api/festivals` API route
- Muhurtam engine — `getMuhurtamWindows()` with Nakshatra/Yoga/Tithi quality rules, Rahukalam/Yamagandam exclusion
- `/muhurtam` page — date picker, day range selector, quality-badged window cards
- `/api/muhurtam` API route
- Festival + Muhurtam + Reminders quick links added to AppHeader

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
