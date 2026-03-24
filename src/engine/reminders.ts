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
