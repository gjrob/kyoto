'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import BookingForm from '../components/BookingForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const GREEN = '#22c55e'
const LIME = '#a3e635'
const BG = '#0a0f0a'
const DARK = '#0f170f'
const CARD = '#111a11'
const BORDER = '#1e3a1e'

const SERVICES = [
  { name: 'Lawn Mowing', icon: '🌿', xp: 500, desc: 'Weekly or bi-weekly cuts. Clean lines, every time.' },
  { name: 'Edging & Trim', icon: '✂️', xp: 350, desc: 'Crisp borders along driveways, walkways, and beds.' },
  { name: 'Yard Cleanup', icon: '🍂', xp: 400, desc: 'Leaf blowing, debris removal, general tidying.' },
  { name: 'Mulch & Beds', icon: '🌱', xp: 600, desc: 'Fresh mulch, bed edging, and weed pulling.' },
]

const REVIEWS = [
  { name: 'Karen M.', stars: 5, text: 'These boys show up on time every single week. My yard looks better than ever. 10/10 would recommend to every neighbor.' },
  { name: 'Tony R.', stars: 5, text: 'Hired them for a one-time cleanup before my daughter\'s graduation party — absolute pros. Yard was spotless.' },
  { name: 'Diane W.', stars: 5, text: 'Love supporting local teens who actually work hard. Great price, great attitude, great results.' },
]

const XP_SKILLS = [
  { label: 'Punctuality', xp: 98 },
  { label: 'Attention to Detail', xp: 94 },
  { label: 'Customer Service', xp: 96 },
  { label: 'Equipment Mastery', xp: 90 },
  { label: 'Consistency', xp: 95 },
]

const MARQUEE_ITEMS = ['🌿 LAWN MOWING', '✂️ EDGING', '🍂 YARD CLEANUP', '🌱 MULCH & BEDS', '⚡ SAME-WEEK BOOKING', '🏆 5-STAR RATED', '📍 WILMINGTON NC']

function StarRow({ n }: { n: number }) {
  return <span style={{ color: LIME, fontSize: '14px' }}>{'★'.repeat(n)}</span>
}

export default function Home() {
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [bookingOpen, setBookingOpen] = useState(false)
  const [specials, setSpecials] = useState('')

  useEffect(() => {
    supabase.from('venue_status').select('specials_text').eq('client_slug', 'lawnlads').single()
      .then(({ data }) => { if (data?.specials_text) setSpecials(data.specials_text) })

    const channel = supabase.channel('lawnlads-venue')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'venue_status', filter: 'client_slug=eq.lawnlads' },
        ({ new: next }) => setSpecials((next as { specials_text: string }).specials_text || ''))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#e8f5e9', fontFamily: "'Exo 2', sans-serif", position: 'relative' }}>
      <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'LandscapingBusiness',
                  name: 'Lawn Lads',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Wilmington, NC',
                    addressLocality: 'Wilmington',
                    addressRegion: 'NC',
                    addressCountry: 'US',
                  },
                  url: 'https://lawnlads.com',
                })
              }}
            />


      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
      }} />

      {/* NAV */}
      <nav style={{ borderBottom: `2px solid ${GREEN}`, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: DARK, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', background: GREEN,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', color: '#0a0f0a', fontWeight: 900 }}>L</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', color: '#e8f5e9', fontWeight: 900, letterSpacing: '.08em' }}>LAWN LADS</div>
            <div style={{ fontSize: '9px', color: GREEN, letterSpacing: '.15em' }}>WILMINGTON NC · TEEN CREW</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {['Services', 'Reviews', 'Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ color: '#8db38d', fontWeight: 600, fontSize: '13px', letterSpacing: '.08em', textDecoration: 'none' }}>{s}</a>
          ))}
          <div style={{ display: 'flex', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {(['en', 'es'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '6px 10px', background: lang === l ? GREEN : 'transparent',
                color: lang === l ? '#0a0f0a' : '#4a6a4a', border: 'none', cursor: 'pointer',
                fontFamily: 'Orbitron, monospace', fontSize: '10px', fontWeight: 700,
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button
            onClick={() => setBookingOpen(true)}
            style={{ background: GREEN, color: '#0a0f0a', fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '12px', letterSpacing: '.1em', padding: '10px 22px', border: 'none', cursor: 'pointer', animation: 'cta-glow 3s ease-in-out infinite' }}
          >
            {lang === 'es' ? 'RESERVAR' : 'BOOK NOW'}
          </button>
        </div>
      </nav>

      {/* SPECIALS BANNER */}
      {specials && (
        <div style={{ background: '#c9a84c', color: '#0a0f0a', textAlign: 'center', padding: '10px 24px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace' }}>
          ⚡ {specials}
        </div>
      )}

      {/* MARQUEE */}
      <div style={{ background: GREEN, overflow: 'hidden', padding: '10px 0', borderBottom: `1px solid ${LIME}` }}>
        <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', fontWeight: 700, color: '#0a0f0a', letterSpacing: '.12em', paddingRight: '64px' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: DARK, padding: '80px 32px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Left */}
        <div>
          <div style={{ display: 'inline-block', background: BORDER, border: `1px solid ${LIME}`, padding: '4px 14px', marginBottom: '20px', fontFamily: 'Orbitron, monospace', fontSize: '10px', color: LIME, letterSpacing: '.2em' }}>
            ⚡ LEVEL UP YOUR LAWN
          </div>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '52px', fontWeight: 900, lineHeight: 1.05, color: '#e8f5e9', marginBottom: '20px', letterSpacing: '.02em' }}>
            YOUR YARD.<br />
            <span style={{ color: GREEN }}>OUR QUEST.</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#8db38d', fontWeight: 600, lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' }}>
            We&apos;re a crew of motivated teens delivering pro-level lawn care across Wilmington NC. Reliable. Affordable. Leveling up every yard we touch.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={() => setBookingOpen(true)}
              style={{ background: GREEN, color: '#0a0f0a', fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '15px', letterSpacing: '.08em', padding: '18px 36px', border: 'none', cursor: 'pointer', animation: 'cta-glow 3s ease-in-out infinite' }}
            >
              ⚡ GET A QUOTE
            </button>
            <a href="#services" style={{ background: 'transparent', border: `2px solid ${BORDER}`, color: '#8db38d', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '13px', letterSpacing: '.08em', padding: '18px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              VIEW SERVICES
            </a>
          </div>
          <div style={{ marginTop: '36px', display: 'flex', gap: '36px' }}>
            {[{ v: '50+', l: 'Yards Served' }, { v: '5★', l: 'Google Rating' }, { v: '100%', l: 'Show Up Rate' }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '26px', fontWeight: 900, color: GREEN }}>{s.v}</div>
                <div style={{ fontSize: '11px', color: '#8db38d', letterSpacing: '.08em', marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Arena Card */}
        <div style={{ animation: 'hero-float 4s ease-in-out infinite' }}>
          <div style={{ border: `2px solid ${GREEN}`, background: CARD, overflow: 'hidden', boxShadow: `0 0 40px rgba(34,197,94,0.15)` }}>
            {/* Top bar */}
            <div style={{ background: GREEN, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '13px', color: '#0a0f0a', letterSpacing: '.1em' }}>LAWN LADS CREW</span>
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#0a0f0a' }}>LVL 12 ⚡</span>
            </div>
            {/* Field graphic */}
            <div style={{ background: '#0d1f0d', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '160px' }}>
              <div style={{
                width: '120px', height: '120px',
                border: `3px solid ${GREEN}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 30px rgba(34,197,94,0.3), inset 0 0 30px rgba(34,197,94,0.05)`,
              }}>
                <span style={{ fontSize: '52px' }}>🌿</span>
              </div>
              <div style={{ position: 'absolute', top: '16px', right: '20px', fontFamily: 'Orbitron, monospace', fontSize: '9px', color: LIME, letterSpacing: '.1em' }}>ACTIVE</div>
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', fontFamily: 'Orbitron, monospace', fontSize: '9px', color: '#4a6a4a', letterSpacing: '.1em' }}>WILMINGTON NC</div>
            </div>
            {/* XP bar */}
            <div style={{ padding: '14px 20px', background: '#0c160c', borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', color: '#4a6a4a', letterSpacing: '.1em' }}>XP PROGRESS</span>
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', color: LIME }}>1,240 / 1,500</span>
              </div>
              <div style={{ background: BORDER, height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: GREEN, letterSpacing: '.25em', marginBottom: '10px' }}>// AVAILABLE QUESTS</div>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '36px', fontWeight: 900, color: '#e8f5e9' }}>OUR SERVICES</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: BORDER }}>
          {SERVICES.map(svc => (
            <div key={svc.name} style={{ background: CARD, padding: '32px 24px', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#152015')}
              onMouseLeave={e => (e.currentTarget.style.background = CARD)}
            >
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{svc.icon}</div>
              {/* XP badge */}
              <div style={{ display: 'inline-block', background: BORDER, border: `1px solid ${LIME}`, padding: '2px 10px', marginBottom: '12px', fontFamily: 'Orbitron, monospace', fontSize: '9px', color: LIME, letterSpacing: '.12em', animation: 'badge-pulse 3s ease-in-out infinite' }}>
                +{svc.xp} XP
              </div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '14px', fontWeight: 700, color: '#e8f5e9', marginBottom: '10px', letterSpacing: '.05em' }}>{svc.name}</div>
              <div style={{ fontSize: '13px', color: '#6a8a6a', lineHeight: 1.6 }}>{svc.desc}</div>
              <button
                onClick={() => setBookingOpen(true)}
                style={{ marginTop: '20px', background: 'transparent', border: `1px solid ${GREEN}`, color: GREEN, fontFamily: 'Orbitron, monospace', fontSize: '10px', letterSpacing: '.1em', padding: '8px 16px', cursor: 'pointer', width: '100%' }}
              >
                BOOK THIS →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* XP SKILL BARS */}
      <section style={{ background: DARK, padding: '80px 32px', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: GREEN, letterSpacing: '.25em', marginBottom: '10px' }}>// CREW STATS</div>
            <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '36px', fontWeight: 900, color: '#e8f5e9' }}>SKILL TREE</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {XP_SKILLS.map(skill => (
              <div key={skill.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#8db38d', letterSpacing: '.1em' }}>{skill.label.toUpperCase()}</span>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: LIME }}>{skill.xp}/100</span>
                </div>
                <div style={{ background: BORDER, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${skill.xp}%`, height: '100%',
                    background: `linear-gradient(90deg, ${GREEN}, ${LIME})`,
                    boxShadow: `0 0 8px rgba(34,197,94,0.4)`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: GREEN, letterSpacing: '.25em', marginBottom: '10px' }}>// PLAYER FEEDBACK</div>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '36px', fontWeight: 900, color: '#e8f5e9' }}>REVIEWS</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: BORDER }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: CARD, padding: '28px 24px' }}>
              <StarRow n={r.stars} />
              <p style={{ fontSize: '14px', color: '#8db38d', lineHeight: 1.7, margin: '14px 0 18px', fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#4a6a4a', letterSpacing: '.08em' }}>— {r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="contact" style={{ background: DARK, borderTop: `1px solid ${BORDER}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: GREEN, letterSpacing: '.25em', marginBottom: '10px' }}>// ACCEPT QUEST</div>
            <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '36px', fontWeight: 900, color: '#e8f5e9', marginBottom: '12px' }}>GET A FREE QUOTE</h2>
            <p style={{ fontSize: '14px', color: '#6a8a6a', fontWeight: 600 }}>Fill out the form and we&apos;ll text you back within the hour.</p>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `2px solid ${GREEN}`, padding: '28px 32px', background: '#060c06', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '14px', fontWeight: 900, color: '#e8f5e9', letterSpacing: '.08em' }}>LAWN LADS</div>
        <div style={{ fontSize: '12px', color: '#4a6a4a' }}>© 2025 Lawn Lads · Wilmington NC · All rights reserved</div>
        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: GREEN, letterSpacing: '.1em' }}>⚡ LEVEL UP YOUR LAWN</div>
      </footer>

      {/* BOOKING MODAL */}
      {bookingOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setBookingOpen(false) }}>
          <div style={{ background: DARK, border: `2px solid ${GREEN}`, padding: '40px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: GREEN, letterSpacing: '.2em', marginBottom: '6px' }}>// ACCEPT QUEST</div>
                <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', fontWeight: 900, color: '#e8f5e9' }}>REQUEST A QUOTE</h3>
              </div>
              <button onClick={() => setBookingOpen(false)} style={{ background: 'transparent', border: 'none', color: '#4a6a4a', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <BookingForm />
          </div>
        </div>
      )}
    </div>
  )
}
