import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the assistant for Cell Phone Paradise,
Wilmington NC's oldest and most complete phone store.
Owner: Mr. Harry
Address: 1929 Oleander Dr #B, Wilmington, NC 28403
Phone: (910) 772-5599

Services and starting prices:
- Screen Replacement: from $49 (iPhones, Androids, tablets)
- Battery Replacement: from $39
- Charging Port Repair: from $29
- Water Damage Repair: from $49
- Camera Repair: from $39
- Speaker/Mic Repair: from $29
- Data Recovery: from $59
- Computer Repair: from $49
- iPad/Tablet Repair: from $49
- SIM card help and carrier assistance: from $19
- Used/unlocked phones for sale (call for inventory)
- Accessories for all carriers

About: Mr. Harry has been serving Wilmington for years.
He goes the extra mile to ensure customer satisfaction.
He helps with all carriers and works with customers on pricing.
Most repairs done same-day.

To book: use the form on the website or call (910) 772-5599.
If asked about exact prices, tell them to call for a quote — prices vary by device model.
Keep answers brief, direct, and friendly.
Respond in the same language the user writes in.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: "user", content: message }],
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
