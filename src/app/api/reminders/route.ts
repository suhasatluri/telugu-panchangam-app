import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getUpcomingAmavasyas, getUpcomingEkadashis } from "@/engine/reminders";
import { confirmationEmail } from "@/lib/emailTemplates";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  city_name: z.string(),
  lat: z.number(),
  lng: z.number(),
  tz: z.string(),
  tithi_types: z.array(z.string()).min(1),
  custom_tithi: z.string().optional(),
  personal_note: z.string().max(300).optional(),
  remind_days_before: z.number().int().min(0).max(2),
  remind_time: z.string(),
  reminder_type: z.enum(["amavasya", "ekadashi", "tithi_anniversary"]).optional().default("amavasya"),
  tithi_masa_number: z.number().int().min(1).max(12).optional(),
  tithi_paksha: z.enum(["shukla", "krishna"]).optional(),
  tithi_number: z.number().int().min(1).max(15).optional(),
  tithi_description: z.string().optional(),
  origin_lat: z.number().optional(),
  origin_lng: z.number().optional(),
  origin_tz: z.string().optional(),
  original_date: z.string().optional(),
});

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.string().min(1),
  count: z.coerce.number().int().min(1).max(12).optional().default(6),
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "MISSING_PARAM" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "MISSING_PARAM" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { error: "Email service not configured", code: "ENGINE_ERROR" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const id = crypto.randomUUID();
    const unsubscribe_token = crypto.randomUUID();
    const origin = request.nextUrl.origin;

    const template = confirmationEmail({
      name: parsed.data.name,
      tithi_types: parsed.data.tithi_types,
      remind_days_before: parsed.data.remind_days_before,
      remind_time: parsed.data.remind_time,
      city_name: parsed.data.city_name,
      personal_note: parsed.data.personal_note,
      unsubscribe_url: `${origin}/api/reminders/unsubscribe?token=${unsubscribe_token}`,
    });

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: parsed.data.email,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json(
      {
        success: true,
        id,
        unsubscribe_token,
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const parsed = querySchema.safeParse({
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    tz: searchParams.get("tz"),
    count: searchParams.get("count") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "MISSING_PARAM" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { lat, lng, tz, count } = parsed.data;
  const today = new Date();
  const fromDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  try {
    const amavasyas = getUpcomingAmavasyas(fromDate, count, lat, lng, tz);
    const ekadashis = getUpcomingEkadashis(fromDate, count, lat, lng, tz);

    return NextResponse.json(
      { data: { amavasyas, ekadashis } },
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
