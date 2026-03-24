import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const text = await req.text()
  const params = new URLSearchParams(text)
  const phone = params.get('From') || ''
  const body = (params.get('Body') || '').trim().toUpperCase()

  if (body === 'STOP' && phone) {
    await supabase.from('nurture_optouts').upsert({ phone }, { onConflict: 'phone' })
  }

  return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  })
}
