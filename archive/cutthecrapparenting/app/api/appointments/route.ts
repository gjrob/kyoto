import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, service, message, language } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('cutthecrapparenting_appointments')
      .insert({
        name: name.trim(),
        email: email.trim(),
        service: service || 'Free Discovery Call (15 min)',
        message: message?.trim() || null,
        language: language || 'en',
        status: 'new',
        client_slug: 'cutthecrapparenting',
      })

    if (error) {
      console.error('Appointment insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    try {
      await supabase.from('nurture_queue').insert({
        client_slug: 'cutthecrapparenting',
        lead_name: name.trim(),
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
    console.error('Appointment error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
