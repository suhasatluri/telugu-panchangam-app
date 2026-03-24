# Contributing — Telugu Panchangam App

నమస్కారం! Welcome. We are glad you are here.

This is a community project built for the Telugu-speaking world. Every contribution — whether it is a bug report, a festival correction, a code improvement, or a translation — genuinely matters.

---

## Ways to Contribute

### 🐛 Report a Bug
Open an issue using the **Bug Report** template. Include the date, city, and what you expected vs what you saw.

### 📅 Report a Festival or Panchangam Error
Open an issue using the **Festival Correction** template. This is especially valuable — if you have access to a printed Venkatrama or other trusted Panchangam and see a discrepancy, please tell us. Include the date and the reference you are using.

### 💻 Write Code
See [Development Setup](#development-setup) below.

### 🌐 Improve Translations
All Telugu strings are in `src/data/` JSON files and `src/lib/i18n.ts`. If you see a Telugu translation that could be improved — more natural, more accurate, or using the correct regional spelling — please open a PR.

### 📖 Improve Documentation
Documentation PRs are always welcome. If anything in `ARCHITECTURE.md`, `ALGORITHM.md`, or `API.md` is unclear, please improve it.

### 🌆 Add a City
If your city is missing from the geocoding suggestions, open an issue. We will add it to the pre-loaded city list.

---

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Cloudflare account (free) for deployment testing
- Git

### Steps

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/telugu-panchangam-app
cd telugu-panchangam-app

# 2. Install dependencies
npm install

# 3. Copy the environment template
cp .env.example .env.local

# 4. Fill in .env.local
# OPENCAGE_API_KEY — get a free key at opencagedata.com (2,500 req/day free)
# Leave Cloudflare keys blank for local development — KV/D1 use local simulators

# 5. Start development server
npm run dev
# App runs at http://localhost:3000

# 6. Run tests
npm test
```

### Running Validation Tests

The Venkatrama calendar images in `validation/venkatrama/` are our ground truth:

```bash
# Run all validation tests
npm test -- validation/regression.test.ts

# Run a specific date
npm run validate -- --date=2026-03-19
```

---

## Project Structure for Contributors

```
src/engine/    ← The calculation core. Most impactful place to contribute.
src/data/      ← JSON data files — festival rules, Nakshatra names, etc.
src/lib/i18n.ts ← All UI strings in Telugu and English
validation/    ← Reference data and regression tests
docs/          ← Documentation (ALGORITHM.md is especially important)
```

---

## Pull Request Process

1. **Branch from `main`** with a descriptive name:
   - `fix/rahukalam-melbourne-dst`
   - `feat/add-adhika-masa-indicator`
   - `docs/clarify-ayanamsa-calculation`

2. **Write or update tests** for your change. PRs without tests for engine changes will not be merged.

3. **Run the full test suite** before submitting:
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

4. **Fill in the PR template** — describe what changed and why.

5. **One PR, one concern.** Don't mix a bug fix and a new feature.

### PR Review Criteria

- Does it match the project mission? (visual, time-based, no astrology)
- Is it tested?
- Does it pass the Venkatrama validation tests?
- Is the code readable and documented?

---

## Festival Correction Guidelines

Festival accuracy is the most important form of contribution. If you believe a festival date is wrong:

1. Open an issue with the **Festival Correction** template
2. Provide:
   - The date the app shows
   - The date you believe is correct
   - Your reference source (Venkatrama, Eenadu, another trusted Panchangam)
   - The city/timezone relevant to your observation
3. If you can confirm the Venkatrama calendar agrees with your correction, mention this — it is the fastest path to a fix

---

## Code of Conduct

This project follows a simple principle: **be respectful**.

- Be patient with questions — not everyone has the same background
- Be constructive in code reviews
- Remember the goal: this project exists to serve the community, not to win arguments

Festival date disputes are common in the Telugu Panchangam tradition — different publishers sometimes give different dates. When in doubt, **the Venkatrama & Co. calendar (Eluru)** is our primary reference for AP/Telangana conventions.

---

## Recognition

All contributors are listed in `CONTRIBUTORS.md`. Significant contributions are highlighted in release notes.

---

ధన్యవాదాలు — Thank you for contributing.
