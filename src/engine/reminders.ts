import { calculateDayPanchangam } from "./panchangam";
import type { Location } from "./types";

export interface AmavasyaInfo {
  date: string;
  masa: { te: string; en: string };
  sunriseTime: string;
  isMahalaya: boolean;
  isSomavati: boolean;
  tithi: { te: string; en: string };
  daysFromNow: number;
}

export interface EkadashiInfo {
  date: string;
  masa: { te: string; en: string };
  paksha: string;
  sunriseTime: string;
  tithi: { te: string; en: string };
  daysFromNow: number;
}

/** Format ISO time string to HH:MM */
function formatTime(iso: string): string {
  if (!iso) return "--:--";
  const match = iso.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "--:--";
}

/** Add days to a YYYY-MM-DD string */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, "0");
  const nd = String(dt.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

/** Count days between two YYYY-MM-DD strings */
function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const f = new Date(fy, fm - 1, fd);
  const t = new Date(ty, tm - 1, td);
  return Math.round((t.getTime() - f.getTime()) / 86400000);
}

/**
 * Find upcoming Amavasyas from a given date.
 * Walks forward day by day, collecting days where tithi.number === 30.
 */
export function getUpcomingAmavasyas(
  fromDate: string,
  count: number,
  lat: number,
  lng: number,
  tz: string
): AmavasyaInfo[] {
  const location: Location = { lat, lng, tz };
  const results: AmavasyaInfo[] = [];
  let current = fromDate;

  for (let i = 0; i < 120 && results.length < count; i++) {
    const p = calculateDayPanchangam(current, location);

    if (p.tithi.number === 30) {
      // Ashvina is masa number 7
      const isMahalaya =
        p.masa.number === 7 && p.paksha.value === "krishna";
      const isSomavati = p.vara.number === 1; // Monday

      results.push({
        date: current,
        masa: { te: p.masa.te, en: p.masa.en },
        sunriseTime: formatTime(p.sunrise),
        isMahalaya,
        isSomavati,
        tithi: { te: p.tithi.te, en: p.tithi.en },
        daysFromNow: daysBetween(fromDate, current),
      });
    }

    current = addDays(current, 1);
  }

  return results;
}

/**
 * Find upcoming Ekadashis from a given date.
 * Collects days where tithi.number === 11 (Shukla) or 26 (Krishna).
 */
export function getUpcomingEkadashis(
  fromDate: string,
  count: number,
  lat: number,
  lng: number,
  tz: string
): EkadashiInfo[] {
  const location: Location = { lat, lng, tz };
  const results: EkadashiInfo[] = [];
  let current = fromDate;

  for (let i = 0; i < 120 && results.length < count; i++) {
    const p = calculateDayPanchangam(current, location);

    if (p.tithi.number === 11 || p.tithi.number === 26) {
      results.push({
        date: current,
        masa: { te: p.masa.te, en: p.masa.en },
        paksha: p.paksha.value,
        sunriseTime: formatTime(p.sunrise),
        tithi: { te: p.tithi.te, en: p.tithi.en },
        daysFromNow: daysBetween(fromDate, current),
      });
    }

    current = addDays(current, 1);
  }

  return results;
}

// ─────────────────────────────────────────────
// Tithi Anniversary Finder
// ─────────────────────────────────────────────

export interface TithiIdentity {
  masaNumber: number;
  masa: { te: string; en: string };
  paksha: "shukla" | "krishna";
  tithiNumber: number;
  tithi: { te: string; en: string };
  samvatsaram: { te: string; en: string };
  description: string;
}

export interface AnniversaryOccurrence {
  year: number;
  date: string;
  gregorianFormatted: string;
  teluguFormatted: string;
  sunriseTime: string;
  daysFromNow: number;
  samvatsaram: { te: string; en: string };
  isCurrentYear: boolean;
}

export interface TithiAnniversaryResult {
  originalDate: string;
  originalCity: string;
  tithiIdentity: TithiIdentity;
  occurrences: AnniversaryOccurrence[];
}

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Get the Tithi identity for a specific date and location.
 */
export function getTithiForDate(
  date: string,
  lat: number,
  lng: number,
  tz: string
): TithiIdentity {
  const location: Location = { lat, lng, tz };
  const p = calculateDayPanchangam(date, location);

  const tithiInPaksha =
    p.paksha.value === "shukla"
      ? p.tithi.number
      : p.tithi.number - 15;

  const description = `${p.masa.en} ${p.paksha.value === "shukla" ? "Shukla" : "Krishna"} ${p.tithi.en}`;

  return {
    masaNumber: p.masa.number,
    masa: { te: p.masa.te, en: p.masa.en },
    paksha: p.paksha.value,
    tithiNumber: tithiInPaksha,
    tithi: { te: p.tithi.te, en: p.tithi.en },
    samvatsaram: { te: p.samvatsaram.te, en: p.samvatsaram.en },
    description,
  };
}

/**
 * Approximate Gregorian midpoint for each Telugu masa within a given
 * CALENDAR year. The actual span of a masa drifts ±15 days year-to-year
 * due to lunar/solar misalignment, so a ±20 day window centred on this
 * point reliably contains every Tithi for that masa.
 *
 * NOTE on year semantics: the `year` argument is the Gregorian calendar
 * year — NOT the Telugu samvatsaram. So Magha and Phalguna for `year =
 * 2026` are searched in Jan/Feb 2026 (which actually belong to the
 * Krodhi samvatsaram), not Jan/Feb 2027. This matches user expectation
 * of "show me my Telugu birthday for 2026, 2027, ..." — they expect a
 * date that lands in the matching calendar year, not a date that
 * matches the same samvatsaram cycle.
 */
const MASA_MIDPOINT: Array<{ month: number; day: number }> = [
  { month: 4, day: 4 },    // 1  Chaitra      (Mar 20 – Apr 18)
  { month: 5, day: 4 },    // 2  Vaishakha    (Apr 19 – May 18)
  { month: 6, day: 3 },    // 3  Jyeshtha     (May 19 – Jun 17)
  { month: 7, day: 3 },    // 4  Ashadha      (Jun 18 – Jul 17)
  { month: 8, day: 2 },    // 5  Shravana     (Jul 18 – Aug 16)
  { month: 9, day: 1 },    // 6  Bhadrapada   (Aug 17 – Sep 15)
  { month: 10, day: 1 },   // 7  Ashvina      (Sep 16 – Oct 15)
  { month: 10, day: 31 },  // 8  Kartika      (Oct 16 – Nov 13)
  { month: 11, day: 30 },  // 9  Margashira   (Nov 14 – Dec 13)
  { month: 12, day: 30 },  // 10 Pushya       (Dec 14 – Jan 12 next yr)
  { month: 1, day: 29 },   // 11 Magha        (Jan 13 – Feb 11) — same calendar year
  { month: 2, day: 28 },   // 12 Phalguna     (Feb 12 – Mar 19) — same calendar year
];

function estimateMasaMidpoint(masaNumber: number, year: number): string {
  const m = MASA_MIDPOINT[masaNumber - 1];
  return `${year}-${String(m.month).padStart(2, "0")}-${String(m.day).padStart(2, "0")}`;
}

/**
 * Find when a specific Tithi falls across multiple years.
 */
export function findTithiAnniversaries(
  tithiIdentity: TithiIdentity,
  fromYear: number,
  toYear: number,
  lat: number,
  lng: number,
  tz: string,
  todayDate: string
): AnniversaryOccurrence[] {
  const location: Location = { lat, lng, tz };
  const currentYear = new Date().getFullYear();
  const results: AnniversaryOccurrence[] = [];

  const targetTithiNumber =
    tithiIdentity.paksha === "shukla"
      ? tithiIdentity.tithiNumber
      : tithiIdentity.tithiNumber + 15;

  for (let year = fromYear; year <= toYear; year++) {
    // Centre the scan on the empirical Gregorian midpoint of the target
    // masa. ±35 days = 71-day window.
    //
    // History of this constant:
    //   75  → legacy "month-01 + 75" approach (correct but slow)
    //   41  → ±20 (too tight, missed Magha 2027)
    //   51  → ±25 (too tight, missed Chaitra Krishna Dashami in late-Ugadi
    //         years like 2027/2029 where the day lands ~May 1)
    //   71  → ±35 (current)
    //
    // The Metonic cycle drifts the actual masa start by up to ±18 days
    // year-to-year. Combined with a masa span of ~30 days, a Tithi at
    // either end of its masa needs ~35 days of slack to be reliably
    // caught in every year of a 5-year search.
    const midpoint = estimateMasaMidpoint(tithiIdentity.masaNumber, year);
    const searchStart = addDays(midpoint, -35);

    let found = false;
    let current = searchStart;

    for (let i = 0; i < 71 && !found; i++) {
      try {
        const p = calculateDayPanchangam(current, location);

        if (
          p.masa.number === tithiIdentity.masaNumber &&
          !p.masa.isAdhika &&
          p.paksha.value === tithiIdentity.paksha &&
          p.tithi.number === targetTithiNumber
        ) {
          const [cy, cm, cd] = current.split("-").map(Number);
          const gregorianFormatted = `${cd} ${GREGORIAN_MONTHS[cm - 1]} ${cy}`;
          const teluguFormatted = `${p.masa.te} ${p.paksha.te} ${p.tithi.te}`;

          results.push({
            year,
            date: current,
            gregorianFormatted,
            teluguFormatted,
            sunriseTime: formatTime(p.sunrise),
            daysFromNow: daysBetween(todayDate, current),
            samvatsaram: { te: p.samvatsaram.te, en: p.samvatsaram.en },
            isCurrentYear: year === currentYear,
          });
          found = true;
        }
      } catch {
        // Skip errors for edge case dates (Kshaya Masa etc.)
      }

      current = addDays(current, 1);
    }
  }

  return results.sort((a, b) => a.year - b.year);
}
