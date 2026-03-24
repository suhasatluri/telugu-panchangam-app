import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTithiForDate, findTithiAnniversaries } from "@/engine/reminders";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  origin_lat: z.coerce.number().min(-90).max(90),
  origin_lng: z.coerce.number().min(-180).max(180),
  origin_tz: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.string().min(1),
  from_year: z.coerce.number().int().optional(),
  to_year: z.coerce.number().int().optional(),
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=86400",
};

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const parsed = querySchema.safeParse({
    date: sp.get("date"),
    origin_lat: sp.get("origin_lat"),
    origin_lng: sp.get("origin_lng"),
    origin_tz: sp.get("origin_tz"),
    lat: sp.get("lat"),
    lng: sp.get("lng"),
    tz: sp.get("tz"),
    from_year: sp.get("from_year") ?? undefined,
    to_year: sp.get("to_year") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "MISSING_PARAM" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { date, origin_lat, origin_lng, origin_tz, lat, lng, tz } = parsed.data;
  const now = new Date();
  const currentYear = now.getFullYear();
  const fromYear = parsed.data.from_year ?? currentYear;
  const toYear = parsed.data.to_year ?? currentYear + 9;
  const todayDate = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  try {
    const tithiIdentity = getTithiForDate(date, origin_lat, origin_lng, origin_tz);
    const occurrences = findTithiAnniversaries(
      tithiIdentity, fromYear, toYear, lat, lng, tz, todayDate
    );

    return NextResponse.json(
      {
        data: {
          tithiIdentity,
          occurrences,
          originalDate: date,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "ENGINE_ERROR" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
