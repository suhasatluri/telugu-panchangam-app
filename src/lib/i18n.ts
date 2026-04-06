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

/** Reminder form (పితృ స్మరణ) strings */
export const REMINDERS: Record<string, I18nString> = {
  pageTitle: { te: "పితృ స్మరణ", en: "Ancestor Remembrance" },
  pageSubtitle: { te: "మీ పూర్వీకులను గుర్తుంచుకోండి", en: "Remember those who came before you" },
  pageIntro: {
    te: "అమావాస్య మరియు ఇతర పవిత్ర తిథులకు రిమైండర్ సెట్ చేసుకోండి — మీరు శ్రద్ధాంజలి అర్పించే ప్రతి క్షణం మిస్ కాకుండా మేము మీకు వ్యక్తిగత ఇమెయిల్ పంపుతాం.",
    en: "Set a reminder for Amavasya and other sacred Tithis — we will send you a personal email so you never miss a moment to pay respects.",
  },
  monthlyTab: { te: "నెలవారీ రిమైండర్లు", en: "Monthly Reminders" },
  upcomingTitle: { te: "రాబోయే అమావాస్యలు", en: "Upcoming Amavasyas" },
  upcomingNone: { te: "రాబోయే అమావాస్యలు లేవు.", en: "No upcoming Amavasyas found." },
  upcomingError: { te: "తేదీలు లోడ్ చేయడం సాధ్యం కాలేదు", en: "Unable to load dates" },
  setReminderTitle: { te: "రిమైండర్ సెట్ చేయండి", en: "Set a Reminder" },
  nameLabel: { te: "మీ పేరు", en: "Your name" },
  namePlaceholder: { te: "మీ పేరు", en: "Your name" },
  emailLabel: { te: "ఇమెయిల్ చిరునామా", en: "Email address" },
  emailPlaceholder: { te: "your@email.com", en: "your@email.com" },
  remindForLabel: { te: "ఇవి జరిగినప్పుడు నాకు గుర్తు చేయండి", en: "Remind me for" },
  amavasyaOption: { te: "అమావాస్య (ప్రతి నెల)", en: "Amavasya (every month)" },
  ekadashiOption: { te: "ఏకాదశి (విష్ణు భక్తులకు)", en: "Ekadashi (for Vishnu devotees)" },
  purnimaOption: { te: "పౌర్ణమి", en: "Purnima" },
  daysBeforeLabel: { te: "ఎన్ని రోజుల ముందు", en: "Days before" },
  sameDay: { te: "ఆ రోజే", en: "Same day" },
  oneDayBefore: { te: "1 రోజు ముందు", en: "1 day before" },
  twoDaysBefore: { te: "2 రోజుల ముందు", en: "2 days before" },
  remindAtLabel: { te: "రిమైండర్ సమయం", en: "Remind at" },
  personalNoteLabel: { te: "మీ వ్యక్తిగత నోట్ (ఐచ్ఛికం)", en: "Personal note (optional)" },
  personalNotePlaceholder: {
    te: "ఉదా: నాన్నకు దీపం వెలిగించు. అమ్మ కోసం నీళ్ళు అర్పించు.",
    en: "A personal prayer or family names to remember...",
  },
  cityInfo: { te: "నగరం", en: "City" },
  submitButton: { te: "పితృ స్మరణ సెట్ చేయండి", en: "Set Reminder" },
  submitting: { te: "రిమైండర్ సెట్ చేస్తోంది...", en: "Setting reminder..." },
  successTitle: { te: "స్మరణ సెట్ అయింది", en: "Reminder set" },
  successMessage: {
    te: "మీ రిమైండర్ సెట్ అయింది. నిర్ధారణ మీ ఇమెయిల్‌కు పంపబడింది.",
    en: "Reminder set. Check your email for confirmation.",
  },
  activeReminder: { te: "మీకు యాక్టివ్ రిమైండర్ ఉంది.", en: "You have an active reminder set." },
  cancelButton: { te: "రిమైండర్ రద్దు చేయండి", en: "Cancel Reminder" },
  todayLabel: { te: "నేడు", en: "Today" },
  tomorrowLabel: { te: "రేపు", en: "Tomorrow" },
  inDays: { te: "రోజుల్లో", en: "days" },
  sunriseLabel: { te: "సూర్యోదయం", en: "Sunrise" },
  mahalayaBadge: { te: "మహాలయ", en: "Mahalaya" },
  somavatiBadge: { te: "సోమవతి", en: "Somavati" },
};

/** Tithi Anniversary strings */
export const TITHI_ANNIV: Record<string, I18nString> = {
  tabTitle: { te: "తిథి వార్షికం", en: "Tithi Anniversary" },
  intro: {
    te: "ప్రియమైన వ్యక్తి వెళ్ళిపోయినప్పుడు, కుటుంబం ప్రతి సంవత్సరం అదే తిథి రోజున శ్రద్ధాంజలి అర్పిస్తుంది — అదే గ్రెగోరియన్ తేదీ కాదు. ఆ తిథి ఎప్పుడు వస్తుందో తెలుసుకోవడానికి వెళ్ళిపోయిన తేదీ మరియు నగరం నమోదు చేయండి.",
    en: "When a loved one passes away, the family observes their death anniversary on the same Tithi every year — not the same Gregorian date. Enter the date and city of passing to find when their Tithi falls each year.",
  },
  dateLabel: { te: "వెళ్ళిపోయిన తేదీ", en: "Date of passing" },
  dateHint: { te: "మీ ప్రియమైన వ్యక్తి వెళ్ళిపోయిన తేదీ", en: "The date your loved one passed away" },
  originCityLabel: { te: "అప్పటి నగరం", en: "City at time of passing" },
  originCityPlaceholder: { te: "ఉదా: హైదరాబాద్, విజయవాడ, మెల్బోర్న్", en: "e.g. Hyderabad, Vijayawada, Melbourne" },
  originCityHint: {
    te: "ఆ సమయంలో ఉన్న నగరం (ఖచ్చితమైన తిథి లెక్కించడానికి)",
    en: "Used to calculate the precise Tithi at that location",
  },
  selected: { te: "ఎంచుకోబడింది", en: "selected" },
  searching: { te: "వెతుకుతోంది...", en: "Searching..." },
  currentCityLabel: { te: "మీ ప్రస్తుత నగరం (సూర్యోదయ సమయాలకు)", en: "Your current city (for sunrise times)" },
  currentCityHint: { te: "సూర్యోదయ సమయాలు మీ స్థానిక సమయంలో చూపిస్తాం", en: "Sunrise times shown in your local time" },
  yearsLabel: { te: "ఎన్ని సంవత్సరాలు చూపించాలి", en: "Show anniversaries for" },
  next5: { te: "తదుపరి 5 సంవత్సరాలు", en: "Next 5 years" },
  next10: { te: "తదుపరి 10 సంవత్సరాలు", en: "Next 10 years" },
  next15: { te: "తదుపరి 15 సంవత్సరాలు", en: "Next 15 years" },
  next25: { te: "తదుపరి 25 సంవత్సరాలు", en: "Next 25 years" },
  findButton: { te: "తిథి కనుగొనండి", en: "Find Tithi" },
  loadingText: { te: "తిథి లెక్కిస్తోంది...", en: "Calculating Tithi..." },
  loadingSub: { te: "సంవత్సరాల్లో వెతుకుతోంది...", en: "Looking across the years..." },
  searchAgain: { te: "మళ్ళీ వెతకండి", en: "Search again" },
  resultsTitle: { te: "ఈ తిథి ఎప్పుడు వస్తుంది?", en: "When does this Tithi fall?" },
  resultsSubtitle: { te: "మీ నగరానికి చూపిస్తోంది", en: "Shown for your city" },
  thisYear: { te: "ఈ సంవత్సరం", en: "THIS YEAR" },
  daysAgo: { te: "రోజుల క్రితం", en: "days ago" },
  inDays: { te: "రోజుల్లో", en: "days" },
  todayLabel: { te: "నేడు", en: "Today" },
  sunriseLabel: { te: "సూర్యోదయం", en: "Sunrise" },
  sacredTithi: { te: "ప్రతి సంవత్సరం పాటించవలసిన పవిత్ర తిథి", en: "This is the sacred Tithi to observe every year" },
  setReminderBtn: { te: "ఈ తేదీకి రిమైండర్ సెట్ చేయండి", en: "Set Reminder for this date" },
  confirmReminder: { te: "రిమైండర్ నిర్ధారించండి", en: "Confirm Reminder" },
  sending: { te: "పంపుతోంది...", en: "Sending..." },
  cancel: { te: "రద్దు", en: "Cancel" },
  reminderSet: { te: "రిమైండర్ సెట్ అయింది", en: "Reminder set" },
  reminderEmailPlaceholder: { te: "your@email.com", en: "your@email.com" },
  reminderNotePlaceholder: {
    te: "ఉదా: దీపం వెలిగించు. ఇష్టమైన మిఠాయి అర్పించు.",
    en: "e.g. Light a lamp. Offer favourite sweets.",
  },
  onTheDay: { te: "ఆ రోజే", en: "On the day" },
  oneDayBefore: { te: "1 రోజు ముందు", en: "1 day before" },
  twoDaysBefore: { te: "2 రోజుల ముందు", en: "2 days before" },
  annualReminder: { te: "ప్రతి సంవత్సరం గుర్తు చేయండి", en: "Set Annual Reminder" },
  annualReminderDesc: {
    te: "మేము ప్రతి సంవత్సరం ఈ తిథి కనుగొని మీకు గుర్తు చేస్తాం — మీరు మళ్ళీ వెతకాల్సిన అవసరం లేదు.",
    en: "Set a reminder for every year automatically. We will find this Tithi each year and remind you — you never need to look it up again.",
  },
  annualNotePlaceholder: {
    te: "వ్యక్తిగత ప్రార్థన లేదా గుర్తుంచుకోవలసిన కుటుంబ పేర్లు...",
    en: "A personal prayer or family names to remember...",
  },
  setting: { te: "సెట్ చేస్తోంది...", en: "Setting..." },
  setAnnual: { te: "వార్షిక రిమైండర్ సెట్ చేయండి", en: "Set Annual Reminder" },
  oncePerYear: { te: "మీరు సంవత్సరానికి ఒక రిమైండర్ అందుకుంటారు", en: "You will receive one reminder per year" },
};
