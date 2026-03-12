import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const runtime = 'nodejs'

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = supabase()

  try {
    switch (event.type) {
      // ── Checkout completed → create agency_client record ──────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const meta = session.metadata ?? {}

        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null

        const { error } = await db.from('agency_clients').insert({
          client_name:            meta.business_name ?? '',
          email:                  meta.contact_email ?? session.customer_email ?? '',
          tier:                   0,          // stored as string tier_id in tier_name
          tier_name:              meta.tier_name ?? meta.tier_id ?? '',
          stripe_customer_id:     customerId,
          stripe_subscription_id: subscriptionId,
          setup_paid:             true,
          status:                 'active',
          monthly_amount:         Number(meta.monthly_amount) || 0,
          setup_amount:           Number(meta.setup_amount) || 0,
        })

        if (error) {
          console.error('agency_clients insert error:', error)
          // Return 200 regardless — log for manual follow-up
        }

        // Non-fatal: nurture_queue follow-up
        try {
          await db.from('nurture_queue').insert({
            client_slug:   'agency',
            lead_name:     meta.business_name ?? '',
            lead_phone:    meta.contact_phone ?? null,
            lead_email:    meta.contact_email ?? session.customer_email ?? null,
            sequence_step: 1,
            status:        'pending',
            channel:       'email',
            scheduled_at:  new Date().toISOString(),
          })
        } catch (nurtureErr) {
          console.error('nurture_queue error (non-fatal):', nurtureErr)
        }

        break
      }

      // ── Subscription updated → sync status ────────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer?.id

        const status =
          subscription.status === 'active'    ? 'active'
          : subscription.status === 'canceled' ? 'inactive'
          : subscription.status === 'past_due' ? 'payment_failed'
          : subscription.status

        const { error } = await db
          .from('agency_clients')
          .update({ status })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('subscription updated error:', error)
        }

        break
      }

      // ── Payment failed → mark for follow-up ───────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id ?? null

        if (!customerId) break

        const { error } = await db
          .from('agency_clients')
          .update({ status: 'payment_failed' })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('payment_failed update error:', error)
        }

        // Non-fatal: queue follow-up email
        try {
          const { data: client } = await db
            .from('agency_clients')
            .select('client_name, email')
            .eq('stripe_customer_id', customerId)
            .single()

          if (client) {
            await db.from('nurture_queue').insert({
              client_slug:   'agency',
              lead_name:     client.client_name,
              lead_phone:    null,
              lead_email:    client.email,
              sequence_step: 1,
              status:        'pending',
              channel:       'email',
              scheduled_at:  new Date().toISOString(),
            })
          }
        } catch (nurtureErr) {
          console.error('nurture_queue (payment_failed) error (non-fatal):', nurtureErr)
        }

        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Return 200 to prevent Stripe retries
  }

  return NextResponse.json({ received: true })
}
