"use client";

import { usePanchangam } from "@/hooks/usePanchangam";
import DayDetail from "@/components/DayDetail";

interface DayPageProps {
  params: { year: string; month: string; day: string };
}

export default function DayPage({ params }: DayPageProps) {
  const { year, month, day } = params;
  const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const { data, loading, error } = usePanchangam(dateStr);

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
          {error ?? "Failed to load panchangam"}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <DayDetail data={data} />
    </div>
  );
}
