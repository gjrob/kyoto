'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import LiveStream from './components/LiveStream'

const T = {
  langLabel:    { en: 'CUT THE CRAP PARENTING · WILMINGTON, NC', es: 'CUT THE CRAP PARENTING · WILMINGTON, NC' },
  navAbout:     { en: 'About',           es: 'Sobre Mí' },
  navServices:  { en: 'Services',        es: 'Servicios' },
  navBlueprint: { en: 'Blueprint',       es: 'Blueprint' },
  navReviews:   { en: 'Reviews',         es: 'Reseñas' },
  navLive:      { en: 'Watch Live',      es: 'Ver En Vivo' },
  navBook:      { en: 'Book a Session',  es: 'Reservar' },

  heroLabel:    { en: 'Wilmington, NC · Parenting Support', es: 'Wilmington, NC · Apoyo Familiar' },
  heroH1:       { en: (<>An Intuitive and <em>Holistic Approach</em> for Today's Parents.</>),
                  es: (<>Un Enfoque Intuitivo y <em>Holístico</em> para los Padres de Hoy.</>) },
  heroStrong:   { en: "This isn't therapy.", es: 'Esto no es terapia.' },
  heroSub:      { en: " It's specific solutions for today's parenting problems — delivered with compassion and zero judgment.",
                  es: ' Son soluciones específicas para los problemas de crianza de hoy, con compasión y sin juicios.' },
  heroCta1:     { en: 'Book a Free Call',   es: 'Llamada Gratuita' },
  heroCta2:     { en: 'See How It Works',   es: 'Ver Cómo Funciona' },

  liveNow:      { en: 'LIVE NOW',           es: 'EN VIVO' },
  liveTitle:    { en: 'Workshop: Setting Limits Without the Meltdown', es: 'Taller: Poner Límites Sin Crisis' },
  liveSub:      { en: 'With Denise · Free to watch · Q&A at the end',  es: 'Con Denise · Gratis · Preguntas al final' },
  watchNow:     { en: 'Watch Now →',        es: 'Ver Ahora →' },

  seeLabel:     { en: 'For Exhausted, Capable Mamas', es: 'Para Mamás Agotadas y Capaces' },
  seeTitle:     { en: 'I see you, Mama.',              es: 'Te veo, Mamá.' },
  seeP1:        { en: "You're highly-educated and well-read, but you just can't seem to get out of the trenches.",
                  es: 'Eres educada y has leído mucho, pero no puedes salir de las trincheras.' },
  seeP2:        { en: "You're out there trying to heal some generational traumas and soften some cycles after the marathon work of bringing a whole human into the world (or at least your home.)",
                  es: 'Estás tratando de sanar traumas generacionales y suavizar ciclos después del maratón de traer un ser humano al mundo (o al menos a tu hogar).' },
  seeEm:        { en: 'You are smart and capable, and you are tired.', es: 'Eres inteligente y capaz, y estás cansada.' },
  seeStrong:    { en: " But you don't have to go it alone.", es: ' Pero no tienes que hacerlo sola.' },
  seeCta:       { en: 'Find Out How I Can Help', es: 'Descubre Cómo Puedo Ayudar' },
  offerLabel:   { en: 'What I Offer', es: 'Lo Que Ofrezco' },
  offers: [
    { en: 'In-Home Support (Fairy Godmother Service)', es: 'Apoyo en Casa (Hada Madrina)' },
    { en: 'Online & In-Person Workshops',              es: 'Talleres Virtuales y Presenciales' },
    { en: 'Playdate-Style Learning Groups',            es: 'Grupos de Aprendizaje' },
    { en: 'Private Consultations',                     es: 'Consultas Privadas' },
    { en: 'Corporate Family Outreach Programs',        es: 'Programas Corporativos Familiares' },
    { en: 'The Blueprint Online Course',               es: 'El Curso Blueprint Online' },
  ],

  svcLabel:     { en: 'How Does It Work?', es: '¿Cómo Funciona?' },
  svcTitle:     { en: 'Pick Your Path.',   es: 'Elige Tu Camino.' },

  bpLabel:      { en: 'Online Parenting Course',    es: 'Curso de Crianza Online' },
  bpTitle:      { en: 'The Blueprint.',             es: 'El Blueprint.' },
  bpBody:       { en: "Everything Denise teaches in person — distilled into a self-paced online course you can start today. Words, techniques, frameworks. Built for busy, exhausted parents who are ready to stop reacting and start responding.",
                  es: 'Todo lo que Denise enseña en persona — destilado en un curso online a tu ritmo que puedes comenzar hoy.' },
  bpPeriod:     { en: 'one time',                   es: 'pago único' },
  bpCta:        { en: 'Enroll in the Blueprint →',  es: 'Inscribirse al Blueprint →' },
  bpF: [
    { title: { en: 'Immediate Results',  es: 'Resultados Inmediatos' }, body: { en: 'Most parents use the techniques within hours of their first session.', es: 'La mayoría usa las técnicas en horas después de la primera sesión.' } },
    { title: { en: 'Self-Paced Access',  es: 'Acceso a Tu Ritmo' },     body: { en: "Watch when your kids are asleep. Rewatch whenever you need a reset.", es: 'Mira cuando tus hijos estén dormidos. Revisa cuando necesites un reinicio.' } },
    { title: { en: 'No Judgment Zone',  es: 'Zona Libre de Juicios' },  body: { en: "Designed for real families, not perfect ones.", es: 'Diseñado para familias reales, no perfectas.' } },
    { title: { en: 'Bilingual Content', es: 'Contenido Bilingüe' },     body: { en: 'Full course available in English and Spanish.', es: 'Curso completo disponible en inglés y español.' } },
  ],

  revLabel:     { en: 'What Parents Are Saying', es: 'Lo Que Dicen los Padres' },
  revTitle:     { en: 'Real Results.',            es: 'Resultados Reales.' },

  bookLabel:    { en: 'Ready to Start?',          es: '¿Lista para Empezar?' },
  bookTitle:    { en: 'Book a Session.',           es: 'Reservar una Sesión.' },
  bookBody:     { en: "Start with a free 15-minute discovery call. No commitment, no pressure — just a conversation to see if we're a good fit.",
                  es: 'Comienza con una llamada de descubrimiento gratuita de 15 minutos. Sin compromiso, sin presión.' },
  formTitle:    { en: 'Book Your Session',         es: 'Reservar tu Sesión' },
  formSub:      { en: "I'll respond within 24 hours to confirm.", es: 'Te responderé dentro de 24 horas para confirmar.' },
  fName:        { en: 'First Name',  es: 'Nombre' },
  fEmail:       { en: 'Email',       es: 'Correo' },
  fService:     { en: 'Service',     es: 'Servicio' },
  fMsg:         { en: 'Message (optional)', es: 'Mensaje (opcional)' },
  fSubmit:      { en: 'Request Session →', es: 'Solicitar Sesión →' },
  fMsgPlaceholder: { en: "Tell me a little about what's going on...", es: 'Cuéntame un poco sobre lo que está pasando...' },
  svcOptions: [
    { en: 'Free Discovery Call (15 min)',              es: 'Llamada Gratuita (15 min)' },
    { en: 'Private Consultation — $150',               es: 'Consulta Privada — $150' },
    { en: 'In-Home Support / Fairy Godmother — $350',  es: 'Apoyo en Casa — $350' },
    { en: 'Workshop (group) — $45–65/person',          es: 'Taller (grupo) — $45–65/persona' },
    { en: 'Blueprint Course — $197',                   es: 'Curso Blueprint — $197' },
  ],

  mailTitle:    { en: 'Food for Thought.',    es: 'Alimento para el Pensamiento.' },
  mailBody:     { en: 'For thinking parents. No spam — just honest, useful content when I have something worth saying.',
                  es: 'Para padres reflexivos. Sin spam — solo contenido honesto y útil cuando tengo algo que vale la pena decir.' },
  mailBtn:      { en: 'I want in', es: 'Me apunto' },
  mailPlaceholder: { en: 'your@email.com', es: 'tu@correo.com' },

  footerPrivacy: { en: 'Privacy',  es: 'Privacidad' },
  footerTerms:   { en: 'Terms',    es: 'Términos' },
  footerBlog:    { en: 'Blog',     es: 'Blog' },
  footerBook:    { en: 'Book',     es: 'Reservar' },
  footerCopy:    { en: '© 2025 · Wilmington, NC · All Rights Reserved', es: '© 2025 · Wilmington, NC · Todos los Derechos Reservados' },
  builtBy:       { en: 'Built by Blue Ring Holdings LLC', es: 'Desarrollado por Blue Ring Holdings LLC' },

  location:      { en: 'Wilmington, NC · Serving the Cape Fear Region', es: 'Wilmington, NC · Sirviendo la Región de Cape Fear' },
  announceText:  { en: 'New Blueprint cohort starts April 1st — spots filling fast! Register now.', es: '¡Nueva cohorte Blueprint comienza el 1 de abril — cupos llenándose rápido! Regístrate ahora.' },
}

const SERVICES = [
  { icon: '🏡',
    name:  { en: 'In-Home Support', es: 'Apoyo en Casa' },
    desc:  { en: 'Whether you want to target a specific area or opt for the premier "Fairy Godmother Service" — a fresh set of eyes is the quickest way to get your family back on track.',
             es: 'Ya sea que quieras enfocarte en un área específica o el servicio "Hada Madrina" — una perspectiva fresca es la forma más rápida de poner a tu familia en camino.' },
    price: { en: 'From $350 · 3 hours', es: 'Desde $350 · 3 horas' } },
  { icon: '🎓',
    name:  { en: 'Workshops', es: 'Talleres' },
    desc:  { en: 'Online and in-person. Sharpen your skills to better handle normal challenges. Gather friends, neighbors, or co-workers to cover a lot of ground in a little time.',
             es: 'Virtuales y presenciales. Refuerza tus habilidades para manejar mejor los retos normales.' },
    price: { en: '$45–65/person', es: '$45–65/persona' } },
  { icon: '🧸',
    name:  { en: 'Playdates', es: 'Grupos de Juego' },
    desc:  { en: "Sometimes the best way to see behavior changes in kids is to teach them new skills too. Hear the exact words and techniques to tackle social & emotional challenges.",
             es: 'A veces la mejor manera es enseñarles nuevas habilidades también. Aprende las palabras exactas para manejar desafíos sociales y emocionales.' },
    price: { en: 'Group pricing available', es: 'Precios grupales disponibles' } },
  { icon: '💻',
    name:  { en: 'Private Consultation', es: 'Consulta Privada' },
    desc:  { en: "One-on-one focused session. Bring your specific situation, get specific answers. No fluff, no judgment — just solutions you can use today.",
             es: 'Sesión enfocada uno a uno. Trae tu situación específica, obtén respuestas específicas. Sin rodeos, sin juicios.' },
    price: { en: '$150 · 60 min', es: '$150 · 60 min' } },
  { icon: '📺',
    name:  { en: 'Live Workshops', es: 'Talleres En Vivo' },
    desc:  { en: "Denise goes live to teach, answer questions, and connect with parents in real time. Free to watch.",
             es: 'Denise va en vivo para enseñar, responder preguntas y conectar con padres en tiempo real. Gratis para ver.' },
    price: { en: 'Free to watch', es: 'Gratis para ver' } },
  { icon: '✍️',
    name:  { en: 'Corporate Outreach', es: 'Outreach Corporativo' },
    desc:  { en: "Support for companies with family-focused employee programs. Speaking, workshops, and ongoing consulting available.",
             es: 'Apoyo para empresas con programas familiares. Charlas, talleres y consultoría continua.' },
    price: { en: 'Custom pricing', es: 'Precio personalizado' } },
]

const REVIEWS = [
  { body: '"Denise completely changed how I talk to my kids. I learned more in one workshop than in 3 years of reading parenting books."', author: 'Sarah M.', title: 'Mom of 3, Wilmington NC' },
  { body: '"The Fairy Godmother Service was worth every penny. She came in, observed for an hour, and gave us a specific plan that worked immediately."', author: 'Jessica T.', title: 'Working Mom' },
  { body: '"I was skeptical but desperate. The Blueprint course gave me language I actually use every single day. Game changer."', author: 'Rachel K.', title: 'New Mom' },
  { body: '"No judgment, just solutions. Exactly what she promises. Our bedtime routine went from chaos to smooth in one week."', author: 'Amanda L.', title: 'Mom of twins' },
]

const HERO_IMG = 'https://img1.wsimg.com/isteam/ip/f1fa88ee-a446-4bae-9a8f-d321fded6304/611C8DE4-5529-4AF7-AEFF-2F4ECD09C222.jpeg'

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [liveActive, setLiveActive] = useState(false)
  const [streamUrl, setStreamUrl] = useState('')
  const [streamTitle, setStreamTitle] = useState('')
  const [announceActive, setAnnounceActive] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mailEmail, setMailEmail] = useState('')
  const [mailDone, setMailDone] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('venue_status')
      .select('live_stream_active, stream_url, stream_title, announcement_active')
      .eq('client_slug', 'cutthecrapparenting')
      .single()
      .then(({ data }) => {
        if (!data) return
        setLiveActive(!!data.live_stream_active)
        setStreamUrl(data.stream_url ?? '')
        setStreamTitle(data.stream_title ?? '')
        setAnnounceActive(data.announcement_active !== false)
      })
    const ch = supabase
      .channel('ctcp')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'venue_status',
          filter: 'client_slug=eq.cutthecrapparenting' }, p => {
        setLiveActive(!!p.new.live_stream_active)
        setStreamUrl(p.new.stream_url ?? '')
        setStreamTitle(p.new.stream_title ?? '')
        setAnnounceActive(p.new.announcement_active !== false)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, language: lang }),
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  async function handleMail(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/mailing-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: mailEmail, source: 'homepage', client_slug: 'cutthecrapparenting' }),
    })
    setMailDone(true)
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'LocalBusiness',
        name: 'Cut the Crap Parenting', telephone: '(910) 612-7885',
        email: 'Denise@CutTheCrapParenting.com',
        address: { '@type': 'PostalAddress', addressLocality: 'Wilmington', addressRegion: 'NC', addressCountry: 'US' },
        url: 'https://cutthecrapparenting.com', areaServed: 'Wilmington, NC',
      })}} />

      {/* ANNOUNCEMENT */}
      {announceActive && (
        <div className="announcement">
          <div className="pulse" />
          <span>{T.announceText[lang]}</span>
        </div>
      )}

      {/* LANG BAR */}
      <div className="lang-bar">
        <span>{T.langLabel[lang]}</span>
        <div className="lang-toggle">
          <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn${lang === 'es' ? ' active' : ''}`} onClick={() => setLang('es')}>ES</button>
        </div>
      </div>

      {/* HEADER */}
      <header>
        <a href="#" className="logo-area">
          <div className="logo-text">
            Cut the Crap Parenting
            <span>Denise · Wilmington NC</span>
          </div>
        </a>
        <nav>
          <a href="#about">{T.navAbout[lang]}</a>
          <a href="#services">{T.navServices[lang]}</a>
          <a href="#blueprint">{T.navBlueprint[lang]}</a>
          <a href="#reviews">{T.navReviews[lang]}</a>
          {liveActive && (
            <a href="#live" className="live-badge">
              <div className="live-dot" />
              <span>{T.navLive[lang]}</span>
            </a>
          )}
          <a href="#book" className="book-btn">{T.navBook[lang]}</a>
        </nav>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="hero-text reveal">
          <div className="hero-label">{T.heroLabel[lang]}</div>
          <h1 className="hero-headline">{T.heroH1[lang]}</h1>
          <p className="hero-sub">
            <strong>{T.heroStrong[lang]}</strong>
            {T.heroSub[lang]}
          </p>
          <div className="hero-ctas">
            <a href="#book" className="btn-primary">{T.heroCta1[lang]}</a>
            <a href="#services" className="btn-outline">{T.heroCta2[lang]}</a>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={HERO_IMG}
            alt="Denise - Cut the Crap Parenting"
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.background = 'linear-gradient(135deg, #C4622D, #7A9E7E)'
            }}
          />
        </div>
      </div>

      {/* LIVE STRIP */}
      {liveActive && (
        <div className="live-strip" id="live">
          <div className="live-strip-left">
            <div className="live-badge-lg">
              <div className="live-dot" />
              <span>{T.liveNow[lang]}</span>
            </div>
            <div>
              <div className="live-strip-title">{streamTitle || T.liveTitle[lang]}</div>
              <div className="live-strip-sub">{T.liveSub[lang]}</div>
            </div>
          </div>
          <a href="#live-player" className="watch-btn">{T.watchNow[lang]}</a>
        </div>
      )}

      {/* LIVE PLAYER */}
      {liveActive && streamUrl && (
        <div id="live-player" style={{ background: 'var(--warm-dark)', padding: '40px 80px' }}>
          <LiveStream streamUrl={streamUrl} />
        </div>
      )}

      {/* I SEE YOU */}
      <div className="see-you" id="about">
        <div className="reveal">
          <div className="section-label">{T.seeLabel[lang]}</div>
          <h2 className="section-title white">{T.seeTitle[lang]}</h2>
          <p className="section-body muted">
            {T.seeP1[lang]}<br /><br />
            {T.seeP2[lang]}<br /><br />
            <em style={{ color: 'white', fontStyle: 'normal' }}>{T.seeEm[lang]}</em>
            <strong style={{ color: 'white' }}>{T.seeStrong[lang]}</strong>
          </p>
          <a href="#book" className="see-you-btn">{T.seeCta[lang]}</a>
        </div>
        <div className="reveal">
          <div className="section-label" style={{ color: 'var(--sage-light)' }}>{T.offerLabel[lang]}</div>
          <ul className="services-list">
            {T.offers.map((o, i) => <li key={i}>{o[lang]}</li>)}
          </ul>
        </div>
      </div>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div className="section-label reveal">{T.svcLabel[lang]}</div>
        <h2 className="section-title reveal">{T.svcTitle[lang]}</h2>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card reveal">
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name[lang]}</div>
              <div className="service-desc">{s.desc[lang]}</div>
              <div className="service-price">{s.price[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BLUEPRINT */}
      <div className="blueprint-section" id="blueprint">
        <div className="reveal">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>{T.bpLabel[lang]}</div>
          <h2 className="section-title white">{T.bpTitle[lang]}</h2>
          <p className="section-body" style={{ color: 'rgba(255,255,255,0.8)' }}>{T.bpBody[lang]}</p>
          <div className="blueprint-price">
            <span className="bp-amount">$197</span>
            <span className="bp-period">{T.bpPeriod[lang]}</span>
          </div>
          <a href="#book" className="btn-white">{T.bpCta[lang]}</a>
        </div>
        <div className="blueprint-features reveal">
          {T.bpF.map((f, i) => (
            <div key={i} className="blueprint-feature">
              <div className="bp-check">✓</div>
              <div className="bp-text">
                <strong>{f.title[lang]}</strong>
                <span>{f.body[lang]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <section className="reviews-section" id="reviews">
        <div className="section-label reveal">{T.revLabel[lang]}</div>
        <h2 className="section-title reveal">{T.revTitle[lang]}</h2>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card reveal">
              <div className="review-stars">★★★★★</div>
              <div className="review-body">{r.body}</div>
              <div className="review-author">
                <strong>{r.author}</strong>
                <span>{r.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section className="booking-section" id="book">
        <div className="booking-grid">
          <div className="booking-info reveal">
            <div className="section-label">{T.bookLabel[lang]}</div>
            <h2 className="section-title">{T.bookTitle[lang]}</h2>
            <p className="section-body">{T.bookBody[lang]}</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <a href="tel:9106127885">(910) 612-7885</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <a href="mailto:Denise@CutTheCrapParenting.com">Denise@CutTheCrapParenting.com</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <span>{T.location[lang]}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="booking-form-card reveal">
              <div className="form-title">{T.formTitle[lang]}</div>
              <div className="form-sub">{T.formSub[lang]}</div>
              {submitted ? (
                <p style={{ color: 'var(--sage)', fontFamily: "'DM Mono', monospace", fontSize: 14, padding: '20px 0' }}>
                  ✓ {lang === 'en' ? "Got it! I'll be in touch within 24 hours." : '¡Recibido! Te contactaré en 24 horas.'}
                </p>
              ) : (
                <form onSubmit={handleBook}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{T.fName[lang]}</label>
                      <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Sarah" required />
                    </div>
                    <div className="form-group">
                      <label>{T.fEmail[lang]}</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="sarah@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{T.fService[lang]}</label>
                    <select value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                      {T.svcOptions.map((o, i) => <option key={i} value={o.en}>{o[lang]}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{T.fMsg[lang]}</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={T.fMsgPlaceholder[lang]} />
                  </div>
                  <button type="submit" className="btn-primary btn-full" disabled={submitting}>
                    {submitting ? '...' : T.fSubmit[lang]}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAILING */}
      <div className="mailing-section">
        <h2 className="section-title white reveal">{T.mailTitle[lang]}</h2>
        <p className="section-body reveal" style={{ color: 'rgba(187,169,158,0.9)', maxWidth: 600, margin: '0 auto 32px' }}>{T.mailBody[lang]}</p>
        {mailDone ? (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#7A9E7E' }}>
            ✓ {lang === 'en' ? "You're on the list." : 'Ya estás en la lista.'}
          </p>
        ) : (
          <form className="mail-form reveal" onSubmit={handleMail}>
            <input
              type="email"
              value={mailEmail}
              onChange={e => setMailEmail(e.target.value)}
              placeholder={T.mailPlaceholder[lang]}
              required
            />
            <button type="submit" className="btn-primary">{T.mailBtn[lang]}</button>
          </form>
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          Cut the Crap Parenting
          <span>{T.footerCopy[lang]}</span>
        </div>
        <div className="footer-links">
          <a href="/privacy">{T.footerPrivacy[lang]}</a>
          <a href="/terms">{T.footerTerms[lang]}</a>
          <a href="/blog">{T.footerBlog[lang]}</a>
          <a href="#book">{T.footerBook[lang]}</a>
        </div>
        <div className="footer-copy">{T.builtBy[lang]}</div>
      </footer>
    </>
  )
}
