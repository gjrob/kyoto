import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, device, service, notes, language } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("cellphoneparadise_bookings")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        device: device || null,
        service: service || null,
        notes: notes?.trim() || null,
        language: language || "en",
        status: "new",
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    // Non-fatal — don't let this kill the booking confirmation
    try {
      await supabase.from("nurture_queue").insert({
        client_slug: "cellphoneparadise",
        lead_name: name.trim(),
        lead_phone: phone.trim(),
        lead_email: null,
        sequence_step: 1,
        status: "pending",
        channel: "sms",
        scheduled_at: new Date().toISOString(),
      });
    } catch (nurtureErr) {
      console.error("nurture_queue error (non-fatal):", nurtureErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
