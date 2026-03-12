'use client'

import { useSearchParams } from 'next/navigation'

const TIER_NAMES: Record<string, string> = {
  foundation: 'Foundation',
  broadcast:  'Broadcast',
  network:    'Network',
}

export default function SuccessContent() {
  const params = useSearchParams()
  const tierId = params.get('tier') ?? 'foundation'
  const tierName = TIER_NAMES[tierId] ?? 'Foundation'

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '1rem' }}>
          BLURING HOLDINGS LLC
        </div>

        <h1 style={{ marginBottom: '0.5rem' }}>You&apos;re in.</h1>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Welcome to the network.</h2>

        <div style={{
          display: 'inline-block',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9rem',
          letterSpacing: '0.12em',
          padding: '6px 20px',
          borderRadius: '20px',
          marginBottom: '2.5rem',
        }}>
          {tierName.toUpperCase()} PLAN ACTIVE
        </div>

        <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
          Payment confirmed. You&apos;ll receive a welcome email within 24 hours
          with your onboarding checklist and Notion workspace link.
        </p>

        <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Next Steps</h3>
          <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
            {[
              ['01', 'Welcome email', 'Check your inbox within 24 hours — onboarding checklist + Notion workspace link.'],
              ['02', 'Brand intake call', '30-minute call to collect your logo, photos, hours, and business details.'],
              ['03', 'Site build', 'Your production site is deployed with Supabase backend and all ' + tierName + ' tier features.'],
              ['04', 'Go live', 'Dashboard access, chatbot training, and a full feature walkthrough.'],
            ].map(([num, title, desc]) => (
              <li key={num} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--accent)', lineHeight: 1, flexShrink: 0, width: '28px' }}>
                  {num}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>{title}</strong>
                  {desc}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
          Questions?{' '}
          <a href="mailto:garlan@bluetubetv.com">garlan@bluetubetv.com</a>
          {' '}·{' '}
          <a href="tel:+19107994521">(910) 799-4521</a>
        </p>
      </div>
    </main>
  )
}
