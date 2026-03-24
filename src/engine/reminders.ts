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
 * Estimate the Gregorian date where a given Telugu masa approximately starts.
 * Chaitra(1)≈Mar, Vaisakha(2)≈Apr, ..., Pushya(10)≈Dec, Magha(11)≈Jan+1, Phalguna(12)≈Feb+1
 */
function estimateMasaStart(masaNumber: number, year: number): string {
  // Masa 1(Chaitra)→month 3(Mar), Masa 2→4, ..., Masa 10→12, Masa 11→1, Masa 12→2
  const gregMonth = ((masaNumber + 1) % 12) + 1;
  const gregYear = gregMonth <= 2 ? year + 1 : year;
  return `${gregYear}-${String(gregMonth).padStart(2, "0")}-01`;
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
    const windowStart = estimateMasaStart(tithiIdentity.masaNumber, year);
    const searchStart = addDays(windowStart, -20);

    let found = false;
    let current = searchStart;

    for (let i = 0; i < 75 && !found; i++) {
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
