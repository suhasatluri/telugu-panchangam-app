"use client";

import { useCallback, useEffect, useState } from "react";
import { getCity } from "@/lib/cache";
import type { CityInfo } from "@/lib/cache";
import TithiAnniversary from "./TithiAnniversary";
import ErrorState from "./ErrorState";

type Tab = "monthly" | "anniversary";

interface AmavasyaInfo {
  date: string;
  masa: { te: string; en: string };
  sunriseTime: string;
  isMahalaya: boolean;
  isSomavati: boolean;
  tithi: { te: string; en: string };
  daysFromNow: number;
}

interface FormData {
  name: string;
  email: string;
  tithi_types: string[];
  personal_note: string;
  remind_days_before: number;
  remind_time: string;
}

const TITHI_OPTIONS = [
  { value: "amavasya", label: "Amavasya (అమావాస్య)", labelTe: "అమావాస్య" },
  { value: "ekadashi", label: "Ekadashi (ఏకాదశి)", labelTe: "ఏకాదశి" },
  { value: "purnima", label: "Purnima (పౌర్ణమి)", labelTe: "పౌర్ణమి" },
];

export default function AncestorReminder() {
  const [city, setCity] = useState<CityInfo | null>(null);
  const [amavasyas, setAmavasyas] = useState<AmavasyaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [reminderId, setReminderId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("monthly");

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    tithi_types: ["amavasya"],
    personal_note: "",
    remind_days_before: 1,
    remind_time: "06:00",
  });

  useEffect(() => {
    const c = getCity();
    setCity(c);

    const savedId =
      typeof window !== "undefined"
        ? localStorage.getItem("pitru-smarana-reminder-id")
        : null;
    if (savedId) setReminderId(savedId);

    fetch(
      `/api/reminders?lat=${c.lat}&lng=${c.lng}&tz=${encodeURIComponent(c.tz)}&count=6`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Service temporarily unavailable");
        return res.json();
      })
      .then((json) => {
        if (json.data?.amavasyas) setAmavasyas(json.data.amavasyas);
      })
      .catch((err) => {
        setFetchError(err instanceof Error ? err.message : "Unable to load upcoming dates");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!city) return;

      setFormState("submitting");
      setErrorMsg("");

      try {
        const res = await fetch("/api/reminders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            city_name: city.name,
            lat: city.lat,
            lng: city.lng,
            tz: city.tz,
          }),
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error ?? "Failed to create reminder");
        }

        const json = await res.json();
        setFormState("success");

        if (json.id) {
          setReminderId(json.id);
          localStorage.setItem("pitru-smarana-reminder-id", json.id);
        }
      } catch (err) {
        setFormState("error");
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [form, city]
  );

  const handleCancel = useCallback(() => {
    localStorage.removeItem("pitru-smarana-reminder-id");
    setReminderId(null);
    setFormState("idle");
  }, []);

  const toggleTithiType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      tithi_types: prev.tithi_types.includes(value)
        ? prev.tithi_types.filter((t) => t !== value)
        : [...prev.tithi_types, value],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("monthly")}
          className={`px-4 py-2 rounded-md text-sm transition-all ${
            activeTab === "monthly"
              ? "bg-accent text-white font-semibold"
              : "bg-transparent text-text-secondary hover:bg-label/10"
          }`}
        >
          &#x1F311; Monthly Reminders
        </button>
        <button
          onClick={() => setActiveTab("anniversary")}
          className={`px-4 py-2 rounded-md text-sm transition-all ${
            activeTab === "anniversary"
              ? "bg-accent text-white font-semibold"
              : "bg-transparent text-text-secondary hover:bg-label/10"
          }`}
        >
          &#x1F64F; Tithi Anniversary
        </button>
      </div>

      {activeTab === "anniversary" ? (
        <TithiAnniversary />
      ) : (
      <div className="space-y-8">
      {/* SECTION A — Upcoming Sacred Dates */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-4">
          Upcoming Amavasyas
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg skeleton"
              />
            ))}
          </div>
        ) : fetchError ? (
          <ErrorState
            title="Unable to load dates"
            titleTe="తేదీలు లోడ్ చేయడం సాధ్యం కాలేదు"
            message={fetchError}
            onRetry={() => window.location.reload()}
          />
        ) : amavasyas.length === 0 ? (
          <p className="text-text-secondary text-sm font-lora">
            No upcoming Amavasyas found.
          </p>
        ) : (
          <div className="space-y-3">
            {amavasyas.map((a) => (
              <div
                key={a.date}
                className="flex items-start gap-3 p-3 rounded-lg border border-label/10 bg-cream animate-fade-up"
              >
                <div className="flex flex-col items-center min-w-[48px]">
                  <span className="text-2xl">&#x1F311;</span>
                  <span className="text-[10px] text-accent font-semibold mt-1">
                    {a.daysFromNow === 0
                      ? "Today"
                      : a.daysFromNow === 1
                        ? "Tomorrow"
                        : `in ${a.daysFromNow} days`}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-noto-telugu text-text-primary font-semibold">
                    {a.tithi.te}
                  </div>
                  <div className="font-playfair italic text-text-secondary text-sm">
                    {a.tithi.en} &middot; {a.date}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {a.masa.te} &middot; {a.masa.en}
                  </div>
                  <div className="text-xs text-label mt-1">
                    &#x1F305; Sunrise: {a.sunriseTime}
                  </div>
                  {(a.isMahalaya || a.isSomavati) && (
                    <div className="flex gap-1 mt-1.5">
                      {a.isMahalaya && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px]">
                          ✨ Mahalaya
                        </span>
                      )}
                      {a.isSomavati && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px]">
                          ✨ Somavati
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION C — Manage existing reminder */}
      {reminderId && formState !== "idle" && formState !== "error" ? (
        <section className="p-4 rounded-lg border border-auspicious/20 bg-auspicious/5">
          <p className="text-auspicious font-lora text-sm mb-3">
            &#x2714; You have an active reminder set.
          </p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-md border border-danger/30 text-danger hover:bg-danger/5 transition-colors font-lora"
          >
            Cancel Reminder
          </button>
        </section>
      ) : null}

      {/* SECTION B — Reminder Form */}
      {formState === "success" ? (
        <section className="p-6 rounded-lg border border-auspicious/20 bg-auspicious/5 text-center">
          <div className="text-2xl mb-2">&#x1F64F;</div>
          <p className="font-noto-telugu text-auspicious text-lg mb-1">
            స్మరణ సెట్ అయింది
          </p>
          <p className="font-lora text-text-secondary text-sm">
            Reminder set. Check your email for confirmation.
          </p>
        </section>
      ) : (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-4">
            Set a Reminder
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-label mb-1 font-lora">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-label mb-1 font-lora">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
                placeholder="your@email.com"
              />
            </div>

            {/* Tithi Types */}
            <div>
              <label className="block text-xs text-label mb-2 font-lora">
                Remind me for
              </label>
              <div className="flex flex-wrap gap-2">
                {TITHI_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleTithiType(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                      form.tithi_types.includes(opt.value)
                        ? "bg-accent/10 border-accent text-accent font-semibold"
                        : "border-label/20 text-text-secondary hover:bg-label/5"
                    }`}
                  >
                    <span className="font-noto-telugu">{opt.labelTe}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* When to remind */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-label mb-1 font-lora">
                  Days before
                </label>
                <select
                  value={form.remind_days_before}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      remind_days_before: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
                >
                  <option value={0}>Same day</option>
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-label mb-1 font-lora">
                  Remind at
                </label>
                <input
                  type="time"
                  value={form.remind_time}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      remind_time: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Personal note */}
            <div>
              <label className="block text-xs text-label mb-1 font-lora">
                Personal note (optional)
              </label>
              <textarea
                value={form.personal_note}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    personal_note: e.target.value,
                  }))
                }
                maxLength={300}
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-label/20 bg-cream text-text-primary text-sm font-lora focus:outline-none focus:border-accent resize-none"
                placeholder="A personal prayer or family names to remember..."
              />
              <div className="text-right text-[10px] text-label mt-0.5">
                {form.personal_note.length}/300
              </div>
            </div>

            {/* City info */}
            {city && (
              <div className="text-xs text-text-secondary font-lora">
                &#x1F4CD; City: {city.name} ({city.tz})
              </div>
            )}

            {/* Error */}
            {formState === "error" && (
              <div className="text-sm text-danger font-lora">{errorMsg}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                formState === "submitting" || form.tithi_types.length === 0
              }
              className="w-full py-2.5 rounded-md bg-accent text-white font-lora text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState === "submitting"
                ? "Setting reminder..."
                : "పితృ స్మరణ సెట్ చేయండి — Set Reminder"}
            </button>
          </form>
        </section>
      )}
    </div>
      )}
    </div>
  );
}
