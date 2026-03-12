import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const TIER_CONFIG: Record<
  string,
  { name: string; setupPriceId: string; monthlyPriceId: string; setupAmount: number; monthlyAmount: number }
> = {
  foundation: {
    name: 'Foundation',
    setupPriceId:   process.env.STRIPE_PRICE_FOUNDATION_SETUP!,
    monthlyPriceId: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY!,
    setupAmount:    1500,
    monthlyAmount:  99,
  },
  broadcast: {
    name: 'Broadcast',
    setupPriceId:   process.env.STRIPE_PRICE_BROADCAST_SETUP!,
    monthlyPriceId: process.env.STRIPE_PRICE_BROADCAST_MONTHLY!,
    setupAmount:    3000,
    monthlyAmount:  135,
  },
  network: {
    name: 'Network',
    setupPriceId:   process.env.STRIPE_PRICE_NETWORK_SETUP!,
    monthlyPriceId: process.env.STRIPE_PRICE_NETWORK_MONTHLY!,
    setupAmount:    5000,
    monthlyAmount:  175,
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tierId, businessName, contactName, contactEmail, contactPhone, promoCode } = body as {
      tierId: string
      businessName: string
      contactName: string
      contactEmail: string
      contactPhone: string
      promoCode?: string
    }

    if (!tierId || !businessName?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        { error: 'tierId, businessName, and contactEmail are required' },
        { status: 400 }
      )
    }

    const config = TIER_CONFIG[tierId]
    if (!config) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: contactEmail.trim(),
      line_items: [
        { price: config.setupPriceId,   quantity: 1 },
        { price: config.monthlyPriceId, quantity: 1 },
      ],
      metadata: {
        tier_id:        tierId,
        tier_name:      config.name,
        business_name:  businessName.trim(),
        contact_name:   contactName?.trim() ?? '',
        contact_email:  contactEmail.trim(),
        contact_phone:  contactPhone?.trim() ?? '',
        setup_amount:   String(config.setupAmount),
        monthly_amount: String(config.monthlyAmount),
      },
      subscription_data: {
        metadata: {
          tier_id:       tierId,
          tier_name:     config.name,
          business_name: businessName.trim(),
        },
      },
      ...(promoCode?.trim() ? { discounts: [{ coupon: promoCode.trim() }] } : {}),
      success_url: `${baseUrl}/success?tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
