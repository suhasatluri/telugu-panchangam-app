export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEnvVar } from "@/lib/cloudflare";

const querySchema = z.object({
  q: z.string().min(1, "Query is required"),
});

const OPENCAGE_BASE = "https://api.opencagedata.com/geocode/v1/json";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const parsed = querySchema.safeParse({
    q: searchParams.get("q"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "MISSING_PARAM" },
      { status: 400 }
    );
  }

  const apiKey = getEnvVar("OPENCAGE_API_KEY");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Geocoding service not configured", code: "ENGINE_ERROR" },
      { status: 500 }
    );
  }

  try {
    const url = `${OPENCAGE_BASE}?q=${encodeURIComponent(parsed.data.q)}&key=${apiKey}&limit=5&no_annotations=0`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Geocoding service error", code: "ENGINE_ERROR" },
        { status: 502 }
      );
    }

    const json = await res.json();
    const results = (json.results ?? []).map(
      (r: {
        formatted: string;
        geometry: { lat: number; lng: number };
        annotations?: { timezone?: { name?: string } };
        components?: { country?: string; state?: string };
      }) => ({
        displayName: r.formatted,
        lat: r.geometry.lat,
        lng: r.geometry.lng,
        timezone: r.annotations?.timezone?.name ?? "UTC",
        country: r.components?.country ?? "",
        state: r.components?.state ?? "",
      })
    );

    return NextResponse.json(
      { data: results, source: "opencage" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Geocoding request failed", code: "ENGINE_ERROR" },
      { status: 500 }
    );
  }
}
