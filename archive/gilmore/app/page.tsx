'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import JobRequestModal from './components/JobRequestModal'
import { emit, EventType } from '../lib/events'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CLIENT_SLUG = 'gilmore'

// ── Static content ──────────────────────────────────────────────────
const t = {
  nav: {
    services:  { en: 'Services', es: 'Servicios' },
    about:     { en: 'About', es: 'Nosotros' },
    contact:   { en: 'Contact', es: 'Contacto' },
    estimate:  { en: 'Free Estimate', es: 'Presupuesto Gratis' },
  },
  hero: {
    eyebrow:   { en: 'Licensed & Insured General Contractor · Wilmington NC', es: 'Contratista General Licenciado y Asegurado · Wilmington NC' },
    h1a:       { en: 'BUILT TO', es: 'CONSTRUIDO' },
    h1b:       { en: 'LAST.', es: 'PARA DURAR.' },
    sub:       { en: 'Expert residential & commercial construction services. Quality craftsmanship from a team with 30 years of East Coast experience.', es: 'Servicios expertos de construcción residencial y comercial. Artesanía de calidad con 30 años de experiencia.' },
    promo:     { en: '$100 off your first project — $1,000 minimum', es: '$100 de descuento en tu primer proyecto — mínimo $1,000' },
    cta:       { en: 'Schedule Free Estimate', es: 'Solicitar Presupuesto Gratis' },
    call:      { en: 'Call Shannon: 910-547-7410', es: 'Llamar a Shannon: 910-547-7410' },
  },
  about: {
    eyebrow:   { en: 'About Us', es: 'Sobre Nosotros' },
    title:     { en: 'YOUR PROJECT. OUR PASSION.', es: 'TU PROYECTO. NUESTRA PASIÓN.' },
    body:      { en: 'At Gilmore Craft and Coat, our mission is to provide high-quality contracting services that meet the diverse needs of our clients. We are dedicated to delivering exceptional craftsmanship and customer satisfaction in every project we undertake. With our talented in-house crew and trusted long-time subcontractors, we are confident we will meet the needs of all our clients.', es: 'En Gilmore Craft and Coat, nuestra misión es brindar servicios de contratación de alta calidad que satisfagan las diversas necesidades de nuestros clientes. Nos dedicamos a ofrecer artesanía excepcional y satisfacción del cliente en cada proyecto.' },
    ownerName: { en: 'Shannon Gilmore', es: 'Shannon Gilmore' },
    ownerTitle:{ en: 'Owner & General Contractor', es: 'Propietario y Contratista General' },
    ownerBio:  { en: 'Shannon has dedicated the past 30 years of his life to the construction industry, gaining the skills and knowledge needed to provide the best quality services up and down the East Coast. He highly values loyalty, honesty, and transparent communication.', es: 'Shannon ha dedicado los últimos 30 años de su vida a la industria de la construcción, ganando las habilidades necesarias para brindar servicios de la mejor calidad en la Costa Este.' },
    badge:     { en: '30 YEARS OF EXPERIENCE', es: '30 AÑOS DE EXPERIENCIA' },
  },
  services: {
    eyebrow:   { en: 'Services', es: 'Servicios' },
    title:     { en: 'WE BUILD IT ALL.', es: 'LO CONSTRUIMOS TODO.' },
  },
  why: {
    eyebrow:   { en: 'Why Choose Us', es: '¿Por Qué Elegirnos?' },
    title:     { en: 'THE GILMORE DIFFERENCE.', es: 'LA DIFERENCIA GILMORE.' },
    items: [
      {
        num: '01',
        title: { en: 'LICENSED & INSURED', es: 'LICENCIADO Y ASEGURADO' },
        body:  { en: 'Fully licensed and insured for your peace of mind on every residential and commercial project.', es: 'Totalmente licenciados y asegurados para tu tranquilidad en cada proyecto.' },
      },
      {
        num: '02',
        title: { en: '30 YEARS OF MASTERY', es: '30 AÑOS DE MAESTRÍA' },
        body:  { en: 'Three decades of East Coast construction experience means we\'ve seen it all — and built it all.', es: 'Tres décadas de experiencia en construcción en la Costa Este.' },
      },
      {
        num: '03',
        title: { en: 'TRANSPARENT COMMUNICATION', es: 'COMUNICACIÓN TRANSPARENTE' },
        body:  { en: 'Shannon personally stays in contact throughout every project. No runaround, no surprises.', es: 'Shannon permanece en contacto personal durante todo el proyecto. Sin sorpresas.' },
      },
    ],
  },
  contact: {
    eyebrow:   { en: 'Contact', es: 'Contacto' },
    title:     { en: 'LET\'S GET TO WORK.', es: 'PONGÁMONOS A TRABAJAR.' },
    body:      { en: 'Give us a call, send a text, or submit a request. We respond within 24 hours.', es: 'Llámanos, envía un mensaje o envía una solicitud. Respondemos en 24 horas.' },
    cell:      { en: 'Cell (Shannon)', es: 'Celular (Shannon)' },
    office:    { en: 'Office', es: 'Oficina' },
    emailLabel:{ en: 'Email', es: 'Correo' },
    hours:     { en: 'Hours', es: 'Horario' },
    hoursVal:  { en: 'Mon–Fri, 9:00 AM – 5:00 PM', es: 'Lun–Vie, 9:00 AM – 5:00 PM' },
    area:      { en: 'Service Area', es: 'Área de Servicio' },
    areaVal:   { en: 'Wilmington, NC & Surrounding Areas', es: 'Wilmington, NC y Alrededores' },
  },
}

const SERVICES = [
  { icon: '🏠', en: 'Custom Home Building',     es: 'Construcción de Casas' },
  { icon: '🔨', en: 'Remodeling',               es: 'Remodelación' },
  { icon: '🎨', en: 'Painting',                 es: 'Pintura' },
  { icon: '✨', en: 'Epoxy Treatments',          es: 'Tratamientos de Epoxi' },
  { icon: '🍳', en: 'Custom Kitchens & Baths',  es: 'Cocinas y Baños' },
  { icon: '🏗️', en: 'Roofing',                  es: 'Techos' },
  { icon: '🧱', en: 'Siding',                   es: 'Revestimiento' },
  { icon: '⛏️', en: 'Masonry / Brick Work',     es: 'Mampostería' },
  { icon: '🚪', en: 'Windows & Doors',           es: 'Ventanas y Puertas' },
  { icon: '🌿', en: 'Outdoor Living Spaces',    es: 'Espacios Exteriores' },
  { icon: '🏊', en: 'Pool Installation',        es: 'Instalación de Piscinas' },
  { icon: '🪵', en: 'Fine Carpentry',           es: 'Carpintería Fina' },
  { icon: '🔩', en: 'Framing',                  es: 'Entramado' },
  { icon: '🪟', en: 'Floor Coverings',          es: 'Pisos' },
  { icon: '🧱', en: 'Drywall',                  es: 'Tabla Roca' },
  { icon: '⚡', en: 'Electrical',               es: 'Electricidad' },
  { icon: '🔧', en: 'Plumbing',                 es: 'Plomería' },
  { icon: '🔉', en: 'Acoustical Ceilings',      es: 'Techos Acústicos' },
]

// ── Component ────────────────────────────────────────────────────────
export default function GilmorePage() {
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [modalOpen, setModalOpen] = useState(false)
  const [venueOpen, setVenueOpen] = useState(false)
  const [specialsText, setSpecialsText] = useState('')

  // Emit page view + subscribe to venue_status
  useEffect(() => {
    emit({
      event_type: EventType.PAGE_VIEW,
      client_slug: CLIENT_SLUG,
      payload: { path: '/', referrer: document.referrer },
    })

    supabase
      .from('venue_status')
      .select('is_open,specials_text')
      .eq('client_slug', CLIENT_SLUG)
      .single()
      .then(({ data }) => {
        if (data) {
          setVenueOpen(data.is_open)
          setSpecialsText(data.specials_text || '')
        }
      })

    const sub = supabase
      .channel('gilmore-venue-status')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'venue_status', filter: `client_slug=eq.${CLIENT_SLUG}` },
        (payload) => {
          const row = payload.new as { is_open: boolean; specials_text: string }
          setVenueOpen(row.is_open)
          setSpecialsText(row.specials_text || '')
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [])

  const openModal = () => {
    setModalOpen(true)
    emit({
      event_type: EventType.RESERVATION,
      client_slug: CLIENT_SLUG,
      payload: { action: 'modal_open' },
    })
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Gilmore Craft and Coat',
            telephone: '910-547-7410',
            email: 'Gilmorecraftncoat@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Wilmington',
              addressRegion: 'NC',
              addressCountry: 'US',
            },
            url: 'https://gilmorecraftandcoat.com',
            areaServed: 'Wilmington, NC',
            description: 'Licensed & Insured General Contractor serving Wilmington NC and surrounding areas.',
          }),
        }}
      />

      {/* Specials banner */}
      {venueOpen && specialsText && (
        <div className="specials-banner">{specialsText}</div>
      )}

      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          GILMORE <span>CRAFT & COAT</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services">{t.nav.services[lang]}</a></li>
          <li><a href="#about">{t.nav.about[lang]}</a></li>
          <li><a href="#contact">{t.nav.contact[lang]}</a></li>
          <li>
            <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}>
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
          </li>
          <li>
            <button className="nav-cta nav-links a" onClick={openModal} style={{ background: 'var(--accent)', color: '#0e0c0a', border: 'none', padding: '10px 22px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {t.nav.estimate[lang]}
            </button>
          </li>
        </ul>
        {/* Mobile lang toggle */}
        <button className="lang-toggle" style={{ display: 'none' }} onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}>
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">{t.hero.eyebrow[lang]}</span>
          <h1>
            {t.hero.h1a[lang]}<br />
            <span>{t.hero.h1b[lang]}</span>
          </h1>
          <p className="hero-sub">{t.hero.sub[lang]}</p>
          <div className="hero-promo">🏷 {t.hero.promo[lang]}</div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={openModal}>
              {t.hero.cta[lang]}
            </button>
            <a className="btn-secondary" href="tel:9105477410">
              {t.hero.call[lang]}
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">30+</div>
            <div className="hero-stat-label">{lang === 'en' ? 'Years Experience' : 'Años de Experiencia'}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">18+</div>
            <div className="hero-stat-label">{lang === 'en' ? 'Services' : 'Servicios'}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">100%</div>
            <div className="hero-stat-label">{lang === 'en' ? 'Licensed & Insured' : 'Licenciado y Asegurado'}</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section">
        <span className="section-eyebrow">{t.services.eyebrow[lang]}</span>
        <h2 className="section-title">{t.services.title[lang]}</h2>
        <div className="services-grid">
          {SERVICES.map((svc) => (
            <div key={svc.en} className="service-card">
              <span className="service-icon">{svc.icon}</span>
              <div className="service-name">{lang === 'en' ? svc.en : svc.es}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-image-block">
          <div className="about-image-placeholder">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ref/hero-bg.jpg"
              alt="Gilmore Craft and Coat construction work"
            />
          </div>
          <div className="about-badge">
            <span className="about-badge-num">30</span>
            {lang === 'en' ? 'YEARS\nEXPERIENCE' : 'AÑOS DE\nEXPERIENCIA'}
          </div>
        </div>

        <div className="about-content">
          <span className="section-eyebrow">{t.about.eyebrow[lang]}</span>
          <h2 className="section-title">{t.about.title[lang]}</h2>
          <p className="section-body">{t.about.body[lang]}</p>
          <p className="section-body" style={{ marginTop: '20px' }}>{t.about.ownerBio[lang]}</p>
          <div className="about-owner">
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--accent)',
                color: '#0e0c0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                flexShrink: 0,
              }}
            >
              SG
            </div>
            <div className="about-owner-info">
              <span className="about-owner-name">{t.about.ownerName[lang]}</span>
              <span className="about-owner-title">{t.about.ownerTitle[lang]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-section">
        <span className="section-eyebrow">{t.why.eyebrow[lang]}</span>
        <h2 className="section-title">{t.why.title[lang]}</h2>
        <div className="why-grid">
          {t.why.items.map((item) => (
            <div key={item.num} className="why-card">
              <div className="why-num">{item.num}</div>
              <h3 className="why-title">{item.title[lang]}</h3>
              <p className="why-body">{item.body[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR SECTION */}
      <section className="qr-section">
        <div className="qr-section-content">
          <span className="section-eyebrow">{lang === 'en' ? 'Scan & Share' : 'Escanea y Comparte'}</span>
          <h2 className="section-title">{lang === 'en' ? 'SHARE OUR SITE.' : 'COMPARTE NUESTRO SITIO.'}</h2>
          <p className="section-body">
            {lang === 'en'
              ? 'Scan the QR code to visit our site or share it with someone who needs quality construction work.'
              : 'Escanea el código QR para visitar nuestro sitio o compártelo con alguien que necesite trabajo de construcción de calidad.'}
          </p>
          <a href="/qr" className="btn-secondary" style={{ display: 'inline-block', marginTop: '24px' }}>
            {lang === 'en' ? 'Print QR Code' : 'Imprimir Código QR'}
          </a>
        </div>
        <div className="qr-section-code">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://gilmorecraftandcoat.com')}&bgcolor=ffffff&color=0e0c0a&margin=2`}
            alt="Scan for free estimate"
            width={200}
            height={200}
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div>
          <span className="section-eyebrow">{t.contact.eyebrow[lang]}</span>
          <h2 className="section-title">{t.contact.title[lang]}</h2>
          <p className="section-body">{t.contact.body[lang]}</p>
          <div style={{ marginTop: '48px' }}>
            <button className="btn-primary" onClick={openModal} style={{ marginBottom: '16px', display: 'block', textAlign: 'center' }}>
              {t.nav.estimate[lang]}
            </button>
          </div>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">{t.contact.cell[lang]}</span>
            <span className="contact-value">
              <a href="tel:9105477410">910-547-7410</a>
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-label">{t.contact.office[lang]}</span>
            <span className="contact-value">
              <a href="tel:9104314309">910-431-4309</a>
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-label">{t.contact.emailLabel[lang]}</span>
            <span className="contact-value" style={{ fontSize: '16px' }}>
              <a href="mailto:Gilmorecraftncoat@gmail.com">Gilmorecraftncoat@gmail.com</a>
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-label">{t.contact.hours[lang]}</span>
            <span className="contact-value" style={{ fontSize: '18px' }}>{t.contact.hoursVal[lang]}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">{t.contact.area[lang]}</span>
            <span className="contact-value" style={{ fontSize: '16px' }}>{t.contact.areaVal[lang]}</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Facebook</span>
            <span className="contact-value" style={{ fontSize: '16px' }}>
              <a href="https://www.facebook.com/528417747021197" target="_blank" rel="noopener noreferrer">
                Gilmore Craft and Coat
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">GILMORE <span>CRAFT & COAT</span></div>
            <p className="footer-tagline">
              {lang === 'en'
                ? 'Expert residential and commercial construction in Wilmington, NC. Licensed & Insured. 30 years of craftsmanship.'
                : 'Construcción residencial y comercial experta en Wilmington, NC. Licenciados y asegurados. 30 años de artesanía.'}
            </p>
          </div>
          <div>
            <div className="footer-heading">{lang === 'en' ? 'Quick Links' : 'Enlaces'}</div>
            <ul className="footer-links">
              <li><a href="#services">{t.nav.services[lang]}</a></li>
              <li><a href="#about">{t.nav.about[lang]}</a></li>
              <li><a href="#contact">{t.nav.contact[lang]}</a></li>
              <li><a href="/dashboard">{lang === 'en' ? 'Dashboard' : 'Panel'}</a></li>
              <li><a href="/qr">QR Code</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">{lang === 'en' ? 'Contact' : 'Contacto'}</div>
            <ul className="footer-links">
              <li><a href="tel:9105477410">910-547-7410</a></li>
              <li><a href="tel:9104314309">910-431-4309</a></li>
              <li><a href="mailto:Gilmorecraftncoat@gmail.com">Gilmorecraftncoat@gmail.com</a></li>
              <li><a href="https://www.facebook.com/528417747021197" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gilmore Craft and Coat — All Rights Reserved</span>
          <div className="footer-social">
            <a href="https://www.facebook.com/528417747021197" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
          </div>
        </div>
      </footer>

      {/* Job Request Modal */}
      {modalOpen && (
        <JobRequestModal
          lang={lang}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
