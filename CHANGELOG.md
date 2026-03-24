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
- SVG animated moon phase visualisation — all 8 phases
- Moonrise and moonset times on daily view
- Moon illumination percentage

---

## [0.3.0] — Planned: Phase 3

### Added
- Festival Tracker — full year view for any year — no limit
- Festival countdown — days until next festival
- Muhurtam Finder — auspicious window search within date range
- City search with typeahead (OpenCage geocoding)
- Tier 1 festivals: all 16 major Telugu festivals, algorithmically calculated
- Tier 2 festivals: Telangana and AP regional festivals
- Tier 3 festivals: National fixed-date observances
- Adhika Masa (intercalary month) detection and labelling

---

## [0.2.0] — Planned: Phase 2

### Added
- Month calendar view — 7-column grid, Sunday to Saturday
- Tithi shown on each day cell
- Moon phase emoji icon per day
- Amavasya and Purnima days highlighted
- Festival badges on relevant days
- Day detail modal — full Panchangam on click
- Telugu/English language toggle (persisted in localStorage)
- Year/month navigation — any date, no limit
- Lotus Dawn theme — full Tailwind CSS implementation

---

## [0.1.0] — Planned: Phase 1

### Added
- GitHub repository — public, MIT licence
- Project scaffold — Next.js 14, TypeScript, Tailwind CSS, Cloudflare Workers
- Full documentation set: CLAUDE.md, ARCHITECTURE.md, ALGORITHM.md, API.md, DEPLOYMENT.md, CONTRIBUTING.md
- Calculation engine: Tithi, Nakshatra, Yoga, Karana, Vara
- Samvatsaram (60-year cycle) mapper
- Telugu Masa (lunar month) calculator including Adhika Masa
- Rahukalam, Gulika Kalam, Yamagandam from weekday + local sunrise
- Sunrise/sunset/moonrise/moonset via SunCalc
- Moon phase calculation and naming (Telugu + English)
- Venkatrama regression test suite (Jan–Jun 2026 validation)
- 200-day accuracy validation against Drik Panchang
- Public API: /api/panchangam, /api/panchangam/month
- Cloudflare D1 + KV cache layer
- GitHub Actions CI — tests on every push and PR
