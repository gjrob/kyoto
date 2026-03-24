'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReservationModal from './components/ReservationModal';
import LiveStatusBadge from './components/LiveStatusBadge';
import SpecialsBanner from './components/SpecialsBanner';
import PageViewTracker from './components/PageViewTracker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const KITCHEN_HOURS = [
  { day: 'Mon',     time: 'Closed', closed: true },
  { day: 'Tue–Thu', time: '5–10pm' },
  { day: 'Fri–Sat', time: '5–11pm' },
  { day: 'Sun',     time: '5–9pm' },
];

const BAR_HOURS = [
  { day: 'Mon',     time: '5pm–midnight' },
  { day: 'Tue–Thu', time: '5pm–1am' },
  { day: 'Fri–Sat', time: '5pm–2am' },
  { day: 'Sun',     time: '5pm–midnight' },
];

export default function Page1504() {
  const [scrolled, setScrolled] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase
      .from('menu_items')
      .select('*')
      .eq('client_slug', '1504')
      .eq('available', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setMenuItems(data); });
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];
  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);

  return (
    <>
      <PageViewTracker clientSlug="1504" />

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-brand">1504 <span>·</span></a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#hours">Hours</a></li>
          <li>
            <button
              onClick={() => setShowReservation(true)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', letterSpacing: 'inherit', padding: 0 }}
            >
              Reserve
            </button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo">
            1504
            <div className="hero-logo-sub">Resto-Bar</div>
          </div>
          <p className="hero-tagline">Kitchen + Bar · 2206 Carolina Beach Rd · Wilmington, NC</p>

          <div className="hero-badges" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kitchen</span>
              <LiveStatusBadge clientSlug="1504-kitchen" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bar</span>
              <LiveStatusBadge clientSlug="1504-bar" />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <SpecialsBanner clientSlug="1504" accentColor="#8b5cf6" />
          </div>

          <div className="hero-ctas" style={{ marginTop: '2rem' }}>
            <button
              onClick={() => setShowReservation(true)}
              className="btn-primary"
            >
              Reserve a Table
            </button>
            <a href="#menu" className="btn-secondary">View Menu</a>
            <a href="tel:+19105551504" className="btn-secondary">Call Us</a>
          </div>
        </div>
      </section>

      {/* HOURS SECTION */}
      <section id="hours" style={{ background: 'var(--bg-section)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Hours
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', letterSpacing: '0.03em' }}>
            The kitchen closes at 10 — the bar never rushes you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Kitchen */}
            <div className="about-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🍽️</span>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)', fontSize: '1.05rem', letterSpacing: '0.05em' }}>Kitchen</h3>
              </div>
              {KITCHEN_HOURS.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{h.day}</span>
                  <span style={{ color: h.closed ? 'rgba(248,113,113,0.7)' : 'var(--text)', fontSize: '0.85rem', fontWeight: h.closed ? 400 : 500 }}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Bar */}
            <div className="about-card" style={{ padding: '1.75rem', borderColor: 'var(--purple)', borderLeftColor: 'var(--purple)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🥃</span>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--purple-mid)', fontSize: '1.05rem', letterSpacing: '0.05em' }}>Bar</h3>
              </div>
              {BAR_HOURS.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{h.day}</span>
                  <span style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 500 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '4.5rem 1.5rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
            Our Story
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', color: 'var(--text)', margin: '0.75rem 0 1.25rem' }}>
            Where the Kitchen Meets the Bar
          </h2>
          <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 1.75rem' }} />
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1rem' }}>
            1504 is a resto-bar rooted in the flavors of the American South. We serve the kind of food that
            feels like a long exhale — shrimp & grits, smothered pork chops, cast iron cornbread —
            paired with a craft cocktail program built on house syrups and local spirits.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            The kitchen closes at 10. The bar stays open. Come for dinner, stay for the conversation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 700 }}>Soul</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>Food</div>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--purple-mid)', fontWeight: 700 }}>Craft</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>Cocktails</div>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 700 }}>Late</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>Nights</div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
              What We're Serving
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: 'var(--text)', margin: '0.75rem 0 0' }}>
              The Menu
            </h2>
          </div>

          {menuItems.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '0.04em',
                    transition: 'all 0.2s',
                    background: activeCategory === cat ? 'var(--purple)' : 'transparent',
                    border: `1px solid ${activeCategory === cat ? 'var(--purple)' : 'var(--border)'}`,
                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {menuItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Menu coming soon — ask Remy about tonight's offerings.
              </p>
            </div>
          ) : (
            <div className="menu-grid">
              {filtered.map((item: any) => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-text">
                    <div className="menu-item-name">{item.name}</div>
                    {item.description && <div className="menu-item-desc">{item.description}</div>}
                    {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                  </div>
                  <div className="menu-item-right">
                    {item.price_cents && (
                      <div className="menu-item-price">
                        ${(item.price_cents / 100).toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INFO BAR */}
      <section style={{ background: 'var(--bg)', padding: '3rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem' }}>Location</div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <a href="https://maps.google.com/?q=2206+Carolina+Beach+Rd+Wilmington+NC" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>
                2206 Carolina Beach Rd<br/>Wilmington, NC 28412
              </a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem' }}>Phone</div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
              <a href="tel:+19105551504" style={{ color: 'inherit', textDecoration: 'none' }}>(910) 555-1504</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem' }}>Kitchen</div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>Tue–Sun · 5–10pm<br/><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed Monday</span></div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple-mid)', fontWeight: 600, marginBottom: '0.5rem' }}>Bar</div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>Nightly · 5pm–late</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '1.75rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          © 2026 1504 Resto-Bar — Downtown Wilmington, NC — <a href="tel:+19105551504" style={{ color: 'inherit' }}>(910) 555-1504</a>
        </p>
      </footer>

      <ReservationModal isOpen={showReservation} onClose={() => setShowReservation(false)} />
    </>
  );
}
