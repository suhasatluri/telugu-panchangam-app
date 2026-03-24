export type Lang = "te" | "en";

interface I18nString {
  te: string;
  en: string;
}

/** All UI strings — Telugu and English */
export const UI: Record<string, I18nString> = {
  // App title
  appTitle: { te: "తెలుగు పంచాంగం", en: "Telugu Panchangam" },
  appSubtitle: { te: "పంచాంగం", en: "Panchangam" },

  // Pancha Anga labels
  tithi: { te: "తిథి", en: "Tithi" },
  nakshatra: { te: "నక్షత్రం", en: "Nakshatra" },
  yoga: { te: "యోగం", en: "Yoga" },
  karana: { te: "కరణం", en: "Karana" },
  vara: { te: "వారం", en: "Vara" },

  // Calendar context labels
  samvatsaram: { te: "సంవత్సరం", en: "Samvatsaram" },
  masa: { te: "మాసం", en: "Masa" },
  paksha: { te: "పక్షం", en: "Paksha" },
  ritu: { te: "ఋతువు", en: "Ritu" },
  ayana: { te: "అయనం", en: "Ayana" },

  // Paksha values
  shukla: { te: "శుక్ల పక్షం", en: "Shukla Paksha" },
  krishna: { te: "కృష్ణ పక్షం", en: "Krishna Paksha" },

  // Celestial timings
  sunrise: { te: "సూర్యోదయం", en: "Sunrise" },
  sunset: { te: "సూర్యాస్తమయం", en: "Sunset" },
  moonrise: { te: "చంద్రోదయం", en: "Moonrise" },
  moonset: { te: "చంద్రాస్తమయం", en: "Moonset" },
  skyTimings: { te: "ఖగోళ సమయాలు", en: "Sky Timings" },

  // Inauspicious periods
  rahukalam: { te: "రాహుకాలం", en: "Rahukalam" },
  gulikaKalam: { te: "గులికకాలం", en: "Gulika Kalam" },
  yamagandam: { te: "యమగండం", en: "Yamagandam" },
  inauspiciousPeriods: { te: "అశుభ సమయాలు", en: "Inauspicious Periods" },

  // Moon
  moonPhase: { te: "చంద్ర దశ", en: "Moon Phase" },
  illumination: { te: "ప్రకాశం", en: "Illumination" },

  // Festivals
  festivals: { te: "పండుగలు", en: "Festivals" },
  noFestivals: { te: "ఈ రోజు పండుగలు లేవు", en: "No festivals today" },

  // Navigation
  today: { te: "ఈ రోజు", en: "Today" },
  previousMonth: { te: "గత నెల", en: "Previous Month" },
  nextMonth: { te: "తదుపరి నెల", en: "Next Month" },

  // UI states
  loading: { te: "లోడ్ అవుతోంది...", en: "Loading..." },
  error: { te: "లోపం సంభవించింది", en: "An error occurred" },
  retry: { te: "మళ్ళీ ప్రయత్నించండి", en: "Retry" },

  // City search
  selectCity: { te: "నగరం ఎంచుకోండి", en: "Select City" },
  searchCity: { te: "నగరం వెతకండి...", en: "Search city..." },
  defaultCity: { te: "మెల్బోర్న్", en: "Melbourne" },

  // Language toggle
  telugu: { te: "తెలుగు", en: "Telugu" },
  english: { te: "ఆంగ్లం", en: "English" },

  // Time labels
  endsAt: { te: "ముగింపు", en: "Ends at" },
  startTime: { te: "ప్రారంభం", en: "Start" },
  endTime: { te: "ముగింపు", en: "End" },

  // Pancha Anga section
  panchaAnga: { te: "పంచాంగం", en: "Pancha Anga" },

  // Weekday headers (short)
  sun: { te: "ఆది", en: "Sun" },
  mon: { te: "సోమ", en: "Mon" },
  tue: { te: "మంగళ", en: "Tue" },
  wed: { te: "బుధ", en: "Wed" },
  thu: { te: "గురు", en: "Thu" },
  fri: { te: "శుక్ర", en: "Fri" },
  sat: { te: "శని", en: "Sat" },

  // Special days
  amavasya: { te: "అమావాస్య", en: "Amavasya" },
  purnima: { te: "పౌర్ణమి", en: "Purnima" },
  ekadashi: { te: "ఏకాదశి", en: "Ekadashi" },

  // Months (Gregorian)
  january: { te: "జనవరి", en: "January" },
  february: { te: "ఫిబ్రవరి", en: "February" },
  march: { te: "మార్చి", en: "March" },
  april: { te: "ఏప్రిల్", en: "April" },
  may: { te: "మే", en: "May" },
  june: { te: "జూన్", en: "June" },
  july: { te: "జూలై", en: "July" },
  august: { te: "ఆగస్టు", en: "August" },
  september: { te: "సెప్టెంబర్", en: "September" },
  october: { te: "అక్టోబర్", en: "October" },
  november: { te: "నవంబర్", en: "November" },
  december: { te: "డిసెంబర్", en: "December" },
};

/** Gregorian month names indexed 1-12 */
const GREGORIAN_MONTHS: I18nString[] = [
  UI.january,
  UI.february,
  UI.march,
  UI.april,
  UI.may,
  UI.june,
  UI.july,
  UI.august,
  UI.september,
  UI.october,
  UI.november,
  UI.december,
];

/** Get Gregorian month name (1-indexed) */
export function getMonthName(month: number, lang: Lang): string {
  const m = GREGORIAN_MONTHS[month - 1];
  return m ? m[lang] : "";
}

/** Weekday headers for calendar grid (0=Sun) */
const WEEKDAY_HEADERS: I18nString[] = [
  UI.sun,
  UI.mon,
  UI.tue,
  UI.wed,
  UI.thu,
  UI.fri,
  UI.sat,
];

export function getWeekdayHeaders(lang: Lang): string[] {
  return WEEKDAY_HEADERS.map((w) => w[lang]);
}

/** Helper: get string for current language */
export function t(key: string, lang: Lang): string {
  return UI[key]?.[lang] ?? key;
}
