"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCity } from "@/lib/cache";
import type { CityInfo } from "@/lib/cache";

interface TithiIdentity {
  masaNumber: number;
  masa: { te: string; en: string };
  paksha: "shukla" | "krishna";
  tithiNumber: number;
  tithi: { te: string; en: string };
  samvatsaram: { te: string; en: string };
  description: string;
}

interface AnniversaryOccurrence {
  year: number;
  date: string;
  gregorianFormatted: string;
  teluguFormatted: string;
  sunriseTime: string;
  daysFromNow: number;
  samvatsaram: { te: string; en: string };
  isCurrentYear: boolean;
}

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  timezone: string;
}

type ViewState = "form" | "loading" | "results";

export default function TithiAnniversary() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [city, setCity] = useState<CityInfo | null>(null);

  // Form state
  const [passingDate, setPassingDate] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originGeo, setOriginGeo] = useState<{ lat: number; lng: number; tz: string } | null>(null);
  const [yearRange, setYearRange] = useState(5);
  const [originResults, setOriginResults] = useState<GeocodeResult[]>([]);
  const [originSearching, setOriginSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Results state
  const [tithiIdentity, setTithiIdentity] = useState<TithiIdentity | null>(null);
  const [occurrences, setOccurrences] = useState<AnniversaryOccurrence[]>([]);
  const [originalDate, setOriginalDate] = useState("");
  const [error, setError] = useState("");

  // Inline reminder state
  const [reminderIdx, setReminderIdx] = useState<number | null>(null);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderNote, setReminderNote] = useState("");
  const [reminderDays, setReminderDays] = useState(1);
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderSent, setReminderSent] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCity(getCity());
  }, []);

  // Origin city search
  const searchOrigin = useCallback(async (q: string) => {
    if (q.length < 2) { setOriginResults([]); return; }
    setOriginSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) setOriginResults(Array.isArray(json.data) ? json.data : [json.data]);
      }
    } catch { /* ignore */ }
    finally { setOriginSearching(false); }
  }, []);

  const handleOriginInput = useCallback((value: string) => {
    setOriginCity(value);
    setOriginGeo(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchOrigin(value), 300);
  }, [searchOrigin]);

  const selectOrigin = useCallback((r: GeocodeResult) => {
    setOriginCity(r.displayName.split(",")[0]);
    setOriginGeo({ lat: r.lat, lng: r.lng, tz: r.timezone });
    setOriginResults([]);
  }, []);

  // Submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originGeo || !city || !passingDate) return;

    setViewState("loading");
    setError("");

    const now = new Date();
    const fromYear = now.getFullYear();
    const toYear = fromYear + yearRange - 1;

    try {
      const params = new URLSearchParams({
        date: passingDate,
        origin_lat: String(originGeo.lat),
        origin_lng: String(originGeo.lng),
        origin_tz: originGeo.tz,
        lat: String(city.lat),
        lng: String(city.lng),
        tz: city.tz,
        from_year: String(fromYear),
        to_year: String(toYear),
      });

      const res = await fetch(`/api/reminders/anniversary?${params}`);
      if (!res.ok) throw new Error("Failed to calculate anniversaries");

      const json = await res.json();
      setTithiIdentity(json.data.tithiIdentity);
      setOccurrences(json.data.occurrences);
      setOriginalDate(json.data.originalDate);
      setViewState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setViewState("form");
    }
  }, [originGeo, city, passingDate, yearRange]);

  // Inline reminder submit
  const sendReminder = useCallback(async (occ: AnniversaryOccurrence) => {
    if (!city || !tithiIdentity || !reminderEmail) return;
    setReminderSending(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: reminderEmail,
          name: reminderEmail.split("@")[0],
          city_name: city.name,
          lat: city.lat,
          lng: city.lng,
          tz: city.tz,
          tithi_types: ["tithi_anniversary"],
          personal_note: reminderNote || undefined,
          remind_days_before: reminderDays,
          remind_time: "06:00",
          reminder_type: "tithi_anniversary",
          tithi_description: tithiIdentity.description,
          original_date: originalDate,
        }),
      });
      if (res.ok) {
        setReminderSent((prev) => new Set(prev).add(occ.year));
        setReminderIdx(null);
      }
    } catch { /* ignore */ }
    finally { setReminderSending(false); }
  }, [city, tithiIdentity, reminderEmail, reminderNote, reminderDays, originalDate]);

  // ─── STATE 1: Form ───
  if (viewState === "form") {
    return (
      <div className="space-y-6">
        <p className="font-lora text-text-secondary text-sm leading-relaxed">
          When a loved one passes away, the family observes their death anniversary
          on the same Tithi every year — not the same Gregorian date. Enter the date
          and city of passing to find when their Tithi falls each year.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date of passing */}
          <div>
            <label className="block text-xs text-label mb-1 font-lora">Date of passing</label>
            <input
              type="date"
              required
              value={passingDate}
              onChange={(e) => setPassingDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
            />
            <div className="text-[10px] text-label mt-0.5">The date your loved one passed away</div>
          </div>

          {/* City at time of passing */}
          <div className="relative">
            <label className="block text-xs text-label mb-1 font-lora">City at time of passing</label>
            <input
              type="text"
              required
              value={originCity}
              onChange={(e) => handleOriginInput(e.target.value)}
              placeholder="e.g. Hyderabad, Vijayawada, Melbourne"
              className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
            />
            <div className="text-[10px] text-label mt-0.5">Used to calculate the precise Tithi at that location</div>
            {originGeo && (
              <div className="text-[10px] text-auspicious mt-0.5">&#x2714; {originCity} selected</div>
            )}
            {originResults.length > 0 && !originGeo && (
              <ul className="absolute z-10 w-full mt-1 bg-cream border border-label/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {originResults.map((r, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => selectOrigin(r)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-label/10 text-text-primary"
                    >
                      {r.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {originSearching && <div className="text-[10px] text-label mt-1">Searching...</div>}
          </div>

          {/* Current city */}
          {city && (
            <div>
              <label className="block text-xs text-label mb-1 font-lora">Your current city (for sunrise times)</label>
              <div className="px-3 py-2 rounded-md border border-label/10 bg-label/5 text-text-secondary text-sm font-lora">
                &#x1F4CD; {city.name} ({city.tz})
              </div>
              <div className="text-[10px] text-label mt-0.5">Sunrise times shown in your local time</div>
            </div>
          )}

          {/* Year range */}
          <div>
            <label className="block text-xs text-label mb-1 font-lora">Show anniversaries for</label>
            <select
              value={yearRange}
              onChange={(e) => setYearRange(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
            >
              <option value={5}>Next 5 years</option>
              <option value={10}>Next 10 years</option>
              <option value={15}>Next 15 years</option>
              <option value={25}>Next 25 years</option>
            </select>
          </div>

          {error && <div className="text-sm text-danger font-lora">{error}</div>}

          <button
            type="submit"
            disabled={!originGeo || !passingDate}
            className="w-full py-2.5 rounded-md bg-header-grad text-white font-lora text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            తిథి కనుగొనండి — Find Tithi
          </button>
        </form>
      </div>
    );
  }

  // ─── STATE 2: Loading ───
  if (viewState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-4xl animate-moon-pulse">&#x1F311;</div>
        <div className="font-playfair italic text-text-secondary">Calculating Tithi...</div>
        <div className="font-lora text-label text-sm">Looking across the years...</div>
      </div>
    );
  }

  // ─── STATE 3: Results ───
  return (
    <div className="space-y-6">
      {/* Result header */}
      {tithiIdentity && (
        <div className="bg-header-grad rounded-xl p-6 text-center text-white">
          <div className="text-sm opacity-80 mb-1">{originalDate}</div>
          <div className="font-noto-telugu text-2xl font-bold mb-1">
            {tithiIdentity.masa.te} {tithiIdentity.paksha === "shukla" ? "శుక్ల" : "కృష్ణ"} {tithiIdentity.tithi.te}
          </div>
          <div className="font-playfair italic text-sm opacity-90 mb-2">
            {tithiIdentity.description}
          </div>
          <div className="text-xs opacity-70">
            {tithiIdentity.samvatsaram.en} Samvatsaram
          </div>
          <div className="text-xs opacity-60 mt-2 italic">
            This is the sacred Tithi to observe every year
          </div>
        </div>
      )}

      <button
        onClick={() => setViewState("form")}
        className="text-sm text-accent hover:underline font-lora"
      >
        &larr; Search again
      </button>

      {/* Anniversary list */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-label mb-1">
          When does this Tithi fall?
        </h3>
        {city && (
          <div className="text-[10px] text-text-secondary mb-3">
            Shown for your city — {city.name}
          </div>
        )}

        <div className="space-y-3">
          {occurrences.map((occ) => {
            const isPast = occ.daysFromNow < 0;
            const isSent = reminderSent.has(occ.year);

            return (
              <div
                key={occ.year}
                className={`rounded-lg border p-4 transition-all ${
                  occ.isCurrentYear
                    ? "border-accent border-2 bg-accent/5"
                    : isPast
                      ? "border-label/10 opacity-60"
                      : "border-label/10 bg-cream"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-playfair text-lg text-text-primary">{occ.year}</span>
                  {occ.isCurrentYear && (
                    <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-semibold">
                      THIS YEAR
                    </span>
                  )}
                  {isPast && (
                    <span className="text-[10px] text-label">
                      {Math.abs(occ.daysFromNow)} days ago
                    </span>
                  )}
                </div>

                <div className="font-noto-telugu text-text-primary text-sm mb-0.5">
                  {occ.teluguFormatted}
                </div>
                <div className="font-lora text-text-secondary text-sm">
                  {occ.gregorianFormatted}
                </div>
                <div className="text-xs text-label mt-1">
                  &#x1F305; Sunrise: {occ.sunriseTime}
                  {!isPast && occ.daysFromNow > 0 && (
                    <span className="ml-2 text-accent">
                      &middot; in {occ.daysFromNow} days
                    </span>
                  )}
                  {occ.daysFromNow === 0 && (
                    <span className="ml-2 text-accent font-semibold">&middot; Today</span>
                  )}
                </div>

                {/* Set Reminder (future dates only) */}
                {!isPast && !isSent && (
                  <div className="mt-2">
                    {reminderIdx === occ.year ? (
                      <div className="space-y-2 p-3 rounded-md bg-label/5 border border-label/10">
                        <input
                          type="email"
                          required
                          value={reminderEmail}
                          onChange={(e) => setReminderEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-2 py-1.5 rounded border border-label/20 bg-cream text-sm font-lora focus:outline-none focus:border-accent"
                        />
                        <textarea
                          value={reminderNote}
                          onChange={(e) => setReminderNote(e.target.value)}
                          maxLength={300}
                          rows={2}
                          placeholder="e.g. Light a lamp. Offer favourite sweets."
                          className="w-full px-2 py-1.5 rounded border border-label/20 bg-cream text-sm font-lora focus:outline-none focus:border-accent resize-none"
                        />
                        <select
                          value={reminderDays}
                          onChange={(e) => setReminderDays(parseInt(e.target.value, 10))}
                          className="w-full px-2 py-1.5 rounded border border-label/20 bg-cream text-sm font-lora focus:outline-none focus:border-accent"
                        >
                          <option value={0}>On the day</option>
                          <option value={1}>1 day before</option>
                          <option value={2}>2 days before</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => sendReminder(occ)}
                            disabled={reminderSending || !reminderEmail}
                            className="flex-1 py-1.5 rounded bg-accent text-white text-xs font-semibold disabled:opacity-50"
                          >
                            {reminderSending ? "Sending..." : "Confirm Reminder"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReminderIdx(null)}
                            className="px-3 py-1.5 rounded border border-label/20 text-xs text-label"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReminderIdx(occ.year)}
                        className="text-xs text-accent hover:underline font-lora"
                      >
                        Set Reminder for this date
                      </button>
                    )}
                  </div>
                )}
                {isSent && (
                  <div className="mt-2 text-xs text-auspicious">&#x2714; Reminder set</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Annual reminder */}
      <div className="rounded-xl border-2 border-gold/30 p-5 bg-gold/5">
        <h3 className="font-noto-telugu text-gold text-sm font-semibold mb-1">
          ప్రతి సంవత్సరం గుర్తు చేయండి
        </h3>
        <p className="font-lora text-text-secondary text-xs mb-3">
          Set a reminder for every year automatically. We will find this Tithi each year
          and remind you — you never need to look it up again.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            value={reminderEmail}
            onChange={(e) => setReminderEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 rounded-md border border-gold/20 bg-cream text-sm font-lora focus:outline-none focus:border-gold"
          />
          <textarea
            value={reminderNote}
            onChange={(e) => setReminderNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="A personal prayer or family names to remember..."
            className="w-full px-3 py-2 rounded-md border border-gold/20 bg-cream text-sm font-lora focus:outline-none focus:border-gold resize-none"
          />
          <select
            value={reminderDays}
            onChange={(e) => setReminderDays(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-md border border-gold/20 bg-cream text-sm font-lora focus:outline-none focus:border-gold"
          >
            <option value={0}>On the day</option>
            <option value={1}>1 day before</option>
            <option value={2}>2 days before</option>
          </select>
          <button
            type="button"
            onClick={() => {
              if (occurrences[0]) sendReminder(occurrences[0]);
            }}
            disabled={!reminderEmail || reminderSending}
            className="w-full py-2.5 rounded-md bg-gold text-white font-lora text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {reminderSending ? "Setting..." : "Set Annual Reminder"}
          </button>
          <div className="text-[10px] text-label text-center">You will receive one reminder per year</div>
        </div>
      </div>
    </div>
  );
}
