'use client'

import { useState } from 'react'
import CheckoutModal from './components/CheckoutModal'

const TIERS = [
  {
    id: 'foundation',
    name: 'Foundation',
    setupPrice: 1500,
    monthlyPrice: 99,
    description: 'Logo + basic QR code tracking',
    features: [
      'Custom logo on stream overlays',
      'QR code for venue tracking',
      'Basic impression analytics',
      'Bilingual EN/ES site',
      'AI chatbot + booking engine',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    setupPrice: 3000,
    monthlyPrice: 135,
    description: 'Logo + video + advanced tracking',
    features: [
      'Everything in Foundation',
      'Video playback on stream',
      'Real-time specials banner',
      'Advanced analytics dashboard',
      'QR campaign tracking',
      'BlueTubeTV map pin',
      'Priority support',
    ],
    cta: 'Choose Broadcast',
    popular: true,
  },
  {
    id: 'network',
    name: 'Network',
    setupPrice: 5000,
    monthlyPrice: 175,
    description: 'White-label + full BTV integration',
    features: [
      'Everything in Broadcast',
      'Live camera embed on your site',
      'Event streaming capabilities',
      'Full BlueTubeTV integration',
      'Discoverable on livewilmingtonmap.com',
      'Dedicated account manager',
    ],
    cta: 'Choose Network',
    popular: false,
  },
]

export type Tier = typeof TIERS[0]

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  return (
    <main>
      {/* Hero */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          BLURING HOLDINGS LLC
        </p>
        <h1>BlueTubeTV Sponsor Plans</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto' }}>
          Reach Wilmington audiences. Stream your brand live.
          One-time setup. Month-to-month. No contracts.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 2rem 4rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div className="grid grid-3">
          {TIERS.map(tier => (
            <div
              key={tier.id}
              className="card"
              style={tier.popular ? { borderColor: 'var(--accent)', position: 'relative' } : { position: 'relative' }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: '#000',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              <h3 style={{ color: 'var(--text-primary)' }}>{tier.name}</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tier.description}</p>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  One-time setup
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--accent)', lineHeight: 1, margin: '4px 0' }}>
                  ${tier.setupPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  then <strong style={{ color: 'var(--text-primary)' }}>${tier.monthlyPrice}/mo</strong>
                </div>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      color: feature.startsWith('Everything') ? 'rgba(176,176,176,0.5)' : 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="btn-primary"
                onClick={() => setSelectedTier(tier)}
                style={{ width: '100%' }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 0 }}>
          Questions?{' '}
          <a href="mailto:garlan@bluetubetv.com">garlan@bluetubetv.com</a>
          {' '}·{' '}
          <a href="https://bluetubetv.com" target="_blank" rel="noopener">bluetubetv.com</a>
        </p>
      </section>

      {/* Checkout Modal */}
      {selectedTier && (
        <CheckoutModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
      )}
    </main>
  )
}
