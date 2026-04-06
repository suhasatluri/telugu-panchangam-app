# Changelog — Telugu Panchangam App

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.1] — 2026-04-06: Mobile hotfix

### Fixed
- AppHeader nav links: wrapped in a horizontally scrollable container with
  `flex-shrink-0` on each link and a trailing spacer so the last link
  (పితృ స్మరణ) is fully reachable on 375 px screens. The `?` button is
  now pinned outside the scroll region.
- DayDetail share button: replaced absolute positioning with a flex row
  (`<h1 flex-1>` + `<button flex-shrink-0>`). Share label is hidden below
  the `sm` breakpoint and the button has a 44 px touch target. No more
  overlap with the date heading on narrow phones.
- `next.config.mjs`: `setupDevPlatform` is now skipped when `process.env.CI`
  is set and the import is wrapped in `try/catch`. Stops Playwright e2e
  from crashing in CI with `Cannot find module 'wrangler'`.

### Added
- `.scrollbar-hide` cross-browser CSS utility in `globals.css`
- Playwright e2e suite (`@playwright/test`) with five viewports: 375, 390,
  430, 768, 1280 px, all running on chromium so CI only needs
  `playwright install chromium`
- `e2e/mobile.spec.ts` covering: date/share overlap, 2-column Pancha Anga,
  Telugu visibility, nav scroll, primary touch targets ≥ 40 px,
  CityWelcome first-visit prompt, screenshot capture
- `playwright.config.ts` with a `mobileChromium` shared base
- `package.json` scripts: `test:e2e`, `test:e2e:mobile`,
  `test:e2e:report`, `test:e2e:screenshots`
- GitHub Actions: new `e2e` job that runs after the unit-test job, installs
  chromium with deps, and uploads screenshots + HTML report as artifacts
  on failure

---

## [1.1.0] — 2026-04-06: UX improvements + polish

### Added
- LocationDisclaimer component — soft informational banner explaining that Tithi
  transitions may fall on different Gregorian dates than printed Indian Panchangams
  for users in non-Indian timezones; shown on day, month, festival pages and
  CityWelcome confirmation
- isNonIndianTimezone() and getOffsetDescription() helpers in engine/timezone.ts
- PrintableCalendar component + @media print styles — Venkatrama-style A4/Letter
  month print with Telugu Tithis, moon phases, festival names, city footer
- Print button on month view (🖨️ ముద్రించు)
- Full bilingual support on the reminder form: REMINDERS and TITHI_ANNIV i18n
  namespaces; AncestorReminder and TithiAnniversary use i18n for every label,
  placeholder, option, button and status message
- RemindersHeader client component for bilingual page title and intro
- Static OG image (1200×630, Lotus Dawn, Telugu script, feature pills)
- Dynamic OG images for day and month pages via next/og (edge runtime)
- Full OpenGraph + Twitter card metadata in root layout (locale, alternateLocale,
  siteName, robots, icons, metadataBase)
- generateMetadata for day pages — split into server page.tsx + DayPageClient
- useKeyboardShortcuts hook — ←/→ navigation, T M D F U N R S P ? shortcuts;
  disabled when typing in form fields and when a modal is open (except Escape)
- KeyboardShortcutsHelp bilingual modal with two-column key badges
- Toast component for share confirmation
- Subtle desktop-only ⌨️ hint button in NavBar
- Significant Ekadashi distinction: Vaikunta (Mukkoti), Nirjala, Devshayani,
  Prabodhini — bilingual significance text, gold styling on calendar grid,
  festival tracker and day detail
- significantEkadashis.ts shared module (avoids festivals/festivalMatcher cycle)
- Festival type: isSignificantEkadashi and significance fields
- 6 new engine tests for significant Ekadashis (107 tests total)
- PWA app icons: icon.svg master, real PNG icon-192/512, apple-icon-180,
  favicon-32 and favicon.ico generated with sharp
- manifest.json: full icon set with maskable purpose, screenshots, PWA shortcuts
  (Today / Festivals / Reminders)
- Tooltips on Pancha Anga cards — tap/hover any element for a bilingual explanation
- "What is Panchangam?" LearnModal — accessible from header, explains all 5 elements
- CityWelcome full-screen prompt — guides first-time visitors to select their city
- ErrorState and LoadingState reusable components — consistent UI for all async states
- Custom error page (error.tsx) and 404 page (not-found.tsx)
- src/lib/tooltips.ts — centralised tooltip content for all Panchanga elements

### Changed
- Regular Ekadashis demoted from tier 1 to tier 2; the four sacred Ekadashis
  promoted to tier 1 with custom names
- Sunrise tooltip mentions timezone-driven date differences
- Day page is now a server component with generateMetadata; client logic moved
  to DayPageClient

### Fixed
- Graceful error and loading states across all pages — no more raw error messages
- City selection prompt appears on first visit instead of defaulting silently
- Reminder form is fully bilingual — Telugu users can complete the form without
  reading a single English word
- PWA install icons are now real PNGs (not SVG-as-PNG placeholders), so Android
  and iOS Safari render the home-screen icon correctly

---

## [1.0.0] — 2026-04-06: Public launch milestone

The initial public release. Cuts a stable point at the end of Phase 5,
just before the v1.1.0 UX wave. See the per-phase entries below for the
detailed feature history.

### Highlights
- VSOP87 calculation engine — pure functions, no date limits
- 12 calendar/festival/finder pages (Today, month, day, festivals,
  muhurtam, nakshatra, reminders, tithi anniversary)
- Bilingual Telugu + English throughout (i18n module)
- Cloudflare Pages edge deployment with D1 cache and KV
- 75+ engine tests including 26 Venkatrama regression assertions
- Public API — free, no key required, 7 endpoints
- PWA manifest + service worker (icons later replaced with real PNGs in v1.1.0)
- Live at https://telugu-panchangam-app.pages.dev

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
