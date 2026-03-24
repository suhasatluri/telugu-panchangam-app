import { toZonedTime, fromZonedTime } from "date-fns-tz";

/**
 * Convert a UTC Date to a local date in the given IANA timezone.
 */
export function utcToLocal(date: Date, tz: string): Date {
  return toZonedTime(date, tz);
}

/**
 * Convert a local date (in the given IANA timezone) back to UTC.
 */
export function localToUtc(date: Date, tz: string): Date {
  return fromZonedTime(date, tz);
}

/**
 * Get the timezone offset in minutes for a date and IANA timezone.
 * Positive = east of UTC (e.g. +330 for IST, +660 for AEDT).
 * Uses Intl.DateTimeFormat — system-timezone-agnostic.
 */
export function getTimezoneOffsetMinutes(date: Date, tz: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  });
  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((p) => p.type === "timeZoneName");
  if (tzPart) {
    // Parses "GMT+05:30" or "GMT-05:00" or "GMT"
    const match = tzPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
    if (match) {
      const sign = match[1] === "+" ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const mins = parseInt(match[3] || "0", 10);
      return sign * (hours * 60 + mins);
    }
    // "GMT" with no offset = UTC
    if (tzPart.value === "GMT") return 0;
  }
  return 0;
}

/**
 * Format a Date as ISO 8601 string with the timezone offset for the given IANA tz.
 * e.g. "2026-03-23T07:32:00+11:00"
 */
export function formatWithTz(date: Date, tz: string): string {
  const local = toZonedTime(date, tz);
  const offsetMinutes = getTimezoneOffsetMinutes(date, tz);

  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");

  const y = local.getFullYear();
  const mo = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  const h = String(local.getHours()).padStart(2, "0");
  const mi = String(local.getMinutes()).padStart(2, "0");
  const s = String(local.getSeconds()).padStart(2, "0");

  return `${y}-${mo}-${d}T${h}:${mi}:${s}${sign}${offsetHours}:${offsetMins}`;
}
