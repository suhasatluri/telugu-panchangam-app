"use client";

import { useEffect, useState } from "react";
import { useMonth } from "@/hooks/usePanchangam";
import { getLang } from "@/lib/cache";
import CalendarGrid from "@/components/CalendarGrid";
import TimeNav from "@/components/TimeNav";
import type { Lang } from "@/lib/i18n";

interface MonthPageProps {
  params: { year: string; month: string };
}

export default function MonthPage({ params }: MonthPageProps) {
  const year = parseInt(params.year, 10);
  const month = parseInt(params.month, 10);
  const { data, loading, error } = useMonth(year, month);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLang());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-label font-lora animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-danger font-lora">
          {error ?? "Failed to load month data"}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-6">
      {/* Samvatsaram + Masa header */}
      <div className="text-center space-y-1">
        <div className="font-noto-telugu text-text-secondary text-sm">
          {data.samvatsaram.te} &middot; {data.masa.te}
        </div>
        {lang === "en" && (
          <div className="font-playfair italic text-text-secondary text-xs">
            {data.samvatsaram.en} &middot; {data.masa.en}
          </div>
        )}
      </div>

      <TimeNav year={year} month={month} />

      <CalendarGrid year={year} month={month} days={data.days} />
    </div>
  );
}
