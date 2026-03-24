import { createClient } from '@supabase/supabase-js'
import { emitServer, EventType } from '../../../lib/events'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, service, description } = body

    if (!name || !phone || !service) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('job_requests').insert({
      client_slug: 'gilmore',
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      service: service.trim(),
      description: description?.trim() || null,
      status: 'new',
    })

    if (error) throw error

    await emitServer({
      event_type: EventType.RESERVATION,
      client_slug: 'gilmore',
      payload: { name, phone, service, source: 'job_request_form' },
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[gilmore] job-request error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
