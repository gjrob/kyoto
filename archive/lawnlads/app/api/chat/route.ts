import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = process.env.CHATBOT_SYSTEM_PROMPT || ''

export async function POST(req: NextRequest) {
  const { messages, lang = 'en' } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT + (lang === 'es' ? '\n\nRespond entirely in Spanish.' : '\n\nRespond in English unless the customer writes in Spanish, in which case respond in Spanish.'),
      messages,
    }),
  })

  const data = await res.json()
  const text = data.content?.[0]?.text ?? "Sorry, I couldn't get a response. Please call us directly."
  return NextResponse.json({ reply: text })
}
