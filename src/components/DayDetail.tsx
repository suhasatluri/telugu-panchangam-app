"use client";

import { useEffect, useState } from "react";
import { getLang } from "@/lib/cache";
import { UI } from "@/lib/i18n";
import MoonPhase from "./MoonPhase";
import type { Lang } from "@/lib/i18n";
import type { DayPanchangam } from "@/engine/types";

interface DayDetailProps {
  data: DayPanchangam;
}

/** Format ISO time string to HH:MM */
function formatTime(iso: string): string {
  if (!iso) return "--:--";
  const match = iso.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "--:--";
}

/** Format ISO time string to HH:MM range */
function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export default function DayDetail({ data }: DayDetailProps) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLang());
  }, []);

  const l = (key: string) => UI[key]?.[lang] ?? key;

  // Determine if waxing (phase < 0.5)
  const isWaxing = data.moonPhase.phase < 0.5;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER — Date + Context */}
      <header className="text-center space-y-2">
        <h1 className="font-playfair text-2xl text-text-primary">
          {data.vara[lang]} &middot; {data.date}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
          <span className="font-noto-telugu text-text-secondary">
            {data.samvatsaram.te}
          </span>
          <span className="text-label">&middot;</span>
          <span className={lang === "te" ? "font-noto-telugu text-text-secondary" : "font-playfair italic text-text-secondary"}>
            {data.masa[lang]}
          </span>
          <span className="text-label">&middot;</span>
          <span className={lang === "te" ? "font-noto-telugu text-text-secondary" : "font-playfair italic text-text-secondary"}>
            {data.paksha[lang]}
          </span>
          <span className="text-label">&middot;</span>
          <span className="text-text-secondary text-xs">
            {data.ritu[lang]} &middot; {data.ayana[lang]}
          </span>
        </div>
      </header>

      {/* PANCHA ANGA — 5 cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-3">
          {l("panchaAnga")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Tithi */}
          <AngaCard
            label={l("tithi")}
            te={data.tithi.te}
            en={data.tithi.en}
            lang={lang}
            endsAt={data.tithi.endsAt}
          />
          {/* Nakshatra */}
          <AngaCard
            label={l("nakshatra")}
            te={data.nakshatra.te}
            en={data.nakshatra.en}
            lang={lang}
            endsAt={data.nakshatra.endsAt}
            extra={`${l("nakshatra")} ${data.nakshatra.pada}`}
          />
          {/* Yoga */}
          <AngaCard
            label={l("yoga")}
            te={data.yoga.te}
            en={data.yoga.en}
            lang={lang}
            endsAt={data.yoga.endsAt}
            highlight={!data.yoga.isAuspicious ? "danger" : undefined}
          />
          {/* Karana */}
          <AngaCard
            label={l("karana")}
            te={data.karana.te}
            en={data.karana.en}
            lang={lang}
            endsAt={data.karana.endsAt}
          />
          {/* Vara */}
          <AngaCard
            label={l("vara")}
            te={data.vara.te}
            en={data.vara.en}
            lang={lang}
          />
        </div>
      </section>

      {/* SKY TIMINGS */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-3">
          {l("skyTimings")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TimingCard icon="&#x1F305;" label={l("sunrise")} time={formatTime(data.sunrise)} />
          <TimingCard icon="&#x1F307;" label={l("sunset")} time={formatTime(data.sunset)} />
          <TimingCard icon="&#x1F319;" label={l("moonrise")} time={formatTime(data.moonrise)} />
          <TimingCard icon="&#x1F311;" label={l("moonset")} time={formatTime(data.moonset)} />
        </div>

        {/* Moon Phase Visual */}
        <div className="flex items-center justify-center gap-4 mt-4 p-3 rounded-lg bg-text-primary/[0.03]">
          <MoonPhase
            illumination={data.moonPhase.illuminationPercent}
            isWaxing={isWaxing}
            size={56}
          />
          <div className="text-center">
            <div className={`text-sm ${lang === "te" ? "font-noto-telugu" : "font-lora"} text-text-primary`}>
              {data.moonPhase[lang]}
            </div>
            <div className="text-xs text-text-secondary">
              {data.moonPhase.illuminationPercent}% {l("illumination").toLowerCase()}
            </div>
          </div>
        </div>
      </section>

      {/* INAUSPICIOUS PERIODS */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-3">
          {l("inauspiciousPeriods")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PeriodCard
            label={data.rahukalam[lang]}
            labelTe={data.rahukalam.te}
            time={formatTimeRange(data.rahukalam.start, data.rahukalam.end)}
            lang={lang}
          />
          <PeriodCard
            label={data.gulikaKalam[lang]}
            labelTe={data.gulikaKalam.te}
            time={formatTimeRange(data.gulikaKalam.start, data.gulikaKalam.end)}
            lang={lang}
          />
          <PeriodCard
            label={data.yamagandam[lang]}
            labelTe={data.yamagandam.te}
            time={formatTimeRange(data.yamagandam.start, data.yamagandam.end)}
            lang={lang}
          />
        </div>
      </section>

      {/* FESTIVALS */}
      {data.festivals.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-label mb-3">
            {l("festivals")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.festivals.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-lora"
              >
                <span className="w-2 h-2 rounded-full bg-gold" />
                {lang === "te" ? (
                  <span className="font-noto-telugu">{f.te}</span>
                ) : (
                  f.en
                )}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Pancha Anga card */
function AngaCard({
  label,
  te,
  en,
  lang,
  endsAt,
  extra,
  highlight,
}: {
  label: string;
  te: string;
  en: string;
  lang: Lang;
  endsAt?: string;
  extra?: string;
  highlight?: "danger" | "auspicious";
}) {
  const borderColor =
    highlight === "danger"
      ? "border-danger/30"
      : highlight === "auspicious"
        ? "border-auspicious/30"
        : "border-label/10";

  return (
    <div className={`p-3 rounded-lg border ${borderColor} bg-cream`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-label mb-1">
        {label}
      </div>
      <div className="font-noto-telugu text-text-primary text-sm leading-snug">
        {te}
      </div>
      <div className="font-playfair italic text-text-secondary text-xs mt-0.5">
        {en}
      </div>
      {endsAt && (
        <div className="text-[10px] text-accent mt-1">
          {formatTime(endsAt)}
        </div>
      )}
      {extra && !endsAt && (
        <div className="text-[10px] text-text-secondary mt-1">{extra}</div>
      )}
    </div>
  );
}

/** Sky timing card */
function TimingCard({
  icon,
  label,
  time,
}: {
  icon: string;
  label: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-text-primary/[0.02]">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-[10px] text-label uppercase">{label}</div>
        <div className="text-sm font-lora text-text-primary">{time}</div>
      </div>
    </div>
  );
}

/** Inauspicious period card */
function PeriodCard({
  label,
  labelTe,
  time,
  lang,
}: {
  label: string;
  labelTe: string;
  time: string;
  lang: Lang;
}) {
  return (
    <div className="p-3 rounded-lg bg-danger/5 border border-danger/10">
      <div className="text-xs font-noto-telugu text-danger">{labelTe}</div>
      {lang === "en" && (
        <div className="text-[10px] text-danger/70">{label}</div>
      )}
      <div className="text-sm font-lora text-text-primary mt-1">{time}</div>
    </div>
  );
}
