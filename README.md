<div align="center">

# తెలుగు పంచాంగం
## Telugu Panchangam App

*Visual. Time-based. Free forever. For the community.*

[![MIT Licence](https://img.shields.io/badge/licence-MIT-orange.svg)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/deployed-Cloudflare%20Pages-orange)](https://telugu-panchangam.pages.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**[Live App](https://telugu-panchangam.pages.dev)** · **[API Docs](API.md)** · **[Report a Bug](https://github.com/suhasatluri/telugu-panchangam-app/issues)**

</div>

---

## What Is This?

A free, open-source Telugu Panchangam calendar for any city in the world, for any date — past, present, or future. The sky has no expiry date, and neither does this app.

**It is not an astrology app.** It shows the sky as it is — sunrise, sunset, moonrise, moonset, moon phases — alongside the five traditional Panchanga elements that generations of Telugu families have used to mark their days.

No ads. No login. No subscriptions. Free forever.

---

## Features

| Feature | Description |
|---|---|
| 📅 Daily Panchangam | Tithi, Nakshatra, Yoga, Karana, Vara with precise end times |
| 🌅 Sky Timings | Sunrise, sunset, moonrise, moonset — city-specific |
| 🌗 Moon Phases | SVG-animated phases, all 30 Tithis, illumination percentage |
| 🗓️ Month Calendar | Venkatrama-style grid with moon phases and festival badges |
| 🎉 Festival Tracker | 40+ Telugu and Hindu festivals — any year, any century |
| 🕐 Muhurtam Finder | Auspicious windows within any date range |
| ⭐ Nakshatra Finder | Janma Nakshatra from birth date, time, city — time-based only |
| 🌍 Any City Worldwide | Sunrise-anchored timings, not Indian Standard Time |
| 🔤 Telugu + English | Full bilingual toggle — Noto Sans Telugu throughout |
| 📱 PWA | Installable on Android and iPhone, works offline |
| 🔌 Public API | Free, no key required — embed in your website |

---

## Quick Start

### Use the App
Visit [telugu-panchangam.pages.dev](https://telugu-panchangam.pages.dev)

### Use the API

```bash
# Today's Panchangam for Melbourne
curl "https://telugu-panchangam.pages.dev/api/panchangam?date=2026-03-23&lat=-37.8136&lng=144.9631&tz=Australia/Melbourne"
```

Full API documentation: [API.md](API.md)

### Run Locally

```bash
git clone https://github.com/suhasatluri/telugu-panchangam-app.git
cd telugu-panchangam-app
npm install
cp .env.example .env.local
# Add your OpenCage API key to .env.local
npm run dev
# Open http://localhost:3000
```

### Deploy Your Own Instance

See [DEPLOYMENT.md](DEPLOYMENT.md) for full Cloudflare Pages setup instructions.

---

## Tech Stack

```
Next.js 14 (App Router + TypeScript)
Tailwind CSS — Lotus Dawn theme
@ishubhamx/panchangam-js — calculation engine (MIT)
suncalc — sunrise/moonrise/phase
Cloudflare Pages + Workers + D1 + KV
```

---

## Documentation

| Document | Description |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Master project brief — start here |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design and decisions |
| [ALGORITHM.md](ALGORITHM.md) | Complete Panchangam calculation methodology |
| [API.md](API.md) | Full API reference |
| [DEPLOYMENT.md](DEPLOYMENT.md) | How to deploy your own instance |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [decisions/](decisions/) | Architecture Decision Records |

---

## Accuracy

The calculation engine is validated against the **Venkatrama & Co. published calendar (Eluru)**, January–June 2026 — one of the most trusted Telugu Panchangam publishers for over a century.

Additional validation: 200 consecutive days cross-referenced against Drik Panchang with 100% accuracy.

If you find a discrepancy between this app and your trusted local Panchangam, please [open an issue](https://github.com/suhasatluri/telugu-panchangam-app/issues/new?template=festival_correction.md) — accuracy is the most important thing we maintain.

---

## Contributing

Contributions are welcome from developers, traditional scholars, Telugu speakers, and community members. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licence

MIT — see [LICENSE](LICENSE).

Free to use, fork, embed, and build upon. If you build something with it, we would love to know.

---

## Acknowledgements

- **Venkatrama & Co., Eluru** — the gold standard of Telugu Panchangam publishing since 1841
- **@ishubhamx** — for the open-source panchangam-js calculation library
- **The Telugu diaspora worldwide** — for keeping the tradition alive

---

<div align="center">

*తెలుగు వారందరికీ అంకితం*

*Dedicated to all Telugu people, everywhere.*

</div>
