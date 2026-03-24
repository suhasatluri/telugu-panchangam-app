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
 * Format a Date as ISO 8601 string with the timezone offset for the given IANA tz.
 * e.g. "2026-03-23T07:32:00+11:00"
 */
export function formatWithTz(date: Date, tz: string): string {
  const local = toZonedTime(date, tz);

  // Calculate offset in minutes between UTC and local
  const utcMs = date.getTime();
  const localMs = local.getTime();
  const offsetMs = localMs - utcMs;
  const offsetMinutes = Math.round(offsetMs / 60000);

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

/**
 * Get the timezone offset in minutes for a date and IANA timezone.
 * Positive = east of UTC (e.g. +330 for IST, +660 for AEDT).
 */
export function getTimezoneOffsetMinutes(date: Date, tz: string): number {
  const local = toZonedTime(date, tz);
  const utcMs = date.getTime();
  const localMs = local.getTime();
  return Math.round((localMs - utcMs) / 60000);
}
