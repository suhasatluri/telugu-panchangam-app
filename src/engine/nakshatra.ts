import type { BilingualName } from "./types";
import nakshatraData from "../data/nakshatra.json";

export interface NakshatraResult {
  name: BilingualName;
  number: number;
  pada: 1 | 2 | 3 | 4;
  endsAt: Date | null;
}

/**
 * Get bilingual Nakshatra info from a 0-indexed nakshatra number (from panchangam-js).
 * panchangam-js returns 0-26: 0=Ashwini, 26=Revati
 */
export function getNakshatraInfo(
  nakshatraIndex: number,
  pada: number,
  nakshatraEndTime: Date | null
): NakshatraResult {
  const entry = nakshatraData[nakshatraIndex];

  if (!entry) {
    throw new Error(`Invalid nakshatra index: ${nakshatraIndex}`);
  }

  // Clamp pada to 1-4 (panchangam-js returns 0-3)
  const padaValue = Math.max(1, Math.min(4, pada + 1)) as 1 | 2 | 3 | 4;

  return {
    name: { te: entry.te, en: entry.en },
    number: nakshatraIndex + 1,
    pada: padaValue,
    endsAt: nakshatraEndTime,
  };
}
