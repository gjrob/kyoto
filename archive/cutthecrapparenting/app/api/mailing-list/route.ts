import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, source, client_slug } = await req.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
      await supabase.from('nurture_queue').insert({
        client_slug: client_slug || 'cutthecrapparenting',
        lead_name: null,
        lead_phone: null,
        lead_email: email.trim(),
        sequence_step: 1,
        status: 'pending',
        channel: 'email',
        scheduled_at: new Date().toISOString(),
      })
    } catch (nurtureErr) {
      console.error('nurture_queue error (non-fatal):', nurtureErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Mailing list error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
