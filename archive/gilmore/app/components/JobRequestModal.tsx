'use client'

import { useState } from 'react'

interface JobRequestModalProps {
  onClose: () => void
  lang: 'en' | 'es'
}

const t = {
  title:        { en: 'REQUEST A FREE ESTIMATE', es: 'SOLICITAR PRESUPUESTO GRATIS' },
  name:         { en: 'Full Name', es: 'Nombre Completo' },
  phone:        { en: 'Phone Number', es: 'Número de Teléfono' },
  email:        { en: 'Email Address', es: 'Correo Electrónico' },
  service:      { en: 'Service Type', es: 'Tipo de Servicio' },
  description:  { en: 'Job Description', es: 'Descripción del Trabajo' },
  descPh:       { en: 'Tell us about your project — size, timeline, special requirements...', es: 'Cuéntanos sobre tu proyecto...' },
  submit:       { en: 'SUBMIT REQUEST', es: 'ENVIAR SOLICITUD' },
  submitting:   { en: 'SENDING...', es: 'ENVIANDO...' },
  successTitle: { en: "We'll be in touch!", es: '¡Nos pondremos en contacto!' },
  successBody:  { en: 'Your request has been received. Shannon will reach out within 24 hours. Call 910-547-7410 for urgent needs.', es: 'Tu solicitud ha sido recibida. Shannon te contactará en 24 horas. Llama al 910-547-7410 para necesidades urgentes.' },
}

const SERVICES_EN = [
  'Custom Home Building', 'Remodeling', 'Painting', 'Epoxy Treatments',
  'Custom Kitchens & Bathrooms', 'Roofing', 'Siding', 'Masonry / Brick Work',
  'Windows & Doors', 'Outdoor Living Spaces', 'Pool Installation',
  'Fine Carpentry / Trim Work', 'Framing', 'Floor Coverings', 'Drywall',
  'Acoustical Ceilings', 'Electrical', 'Plumbing', 'Other',
]

const SERVICES_ES = [
  'Construcción de Casas', 'Remodelación', 'Pintura', 'Tratamientos de Epoxi',
  'Cocinas y Baños', 'Techos', 'Revestimiento', 'Mampostería / Ladrillo',
  'Ventanas y Puertas', 'Espacios Exteriores', 'Instalación de Piscinas',
  'Carpintería Fina', 'Entramado', 'Pisos', 'Tabla Roca',
  'Techos Acústicos', 'Electricidad', 'Plomería', 'Otro',
]

export default function JobRequestModal({ onClose, lang }: JobRequestModalProps) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const services = lang === 'es' ? SERVICES_ES : SERVICES_EN

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service) {
      setError(lang === 'es' ? 'Por favor completa los campos requeridos.' : 'Please fill in required fields.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/job-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, client_slug: 'gilmore' }),
      })
      if (!res.ok) throw new Error('submit failed')
      setSuccess(true)
    } catch {
      setError(lang === 'es' ? 'Algo salió mal. Llama al 910-547-7410.' : 'Something went wrong. Call 910-547-7410.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{t.title[lang]}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {success ? (
          <div className="modal-success">
            <span className="modal-success-icon">✓</span>
            <h3>{t.successTitle[lang]}</h3>
            <p>{t.successBody[lang]}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label className="form-label">{t.name[lang]} *</label>
              <input
                className="form-input"
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.phone[lang]} *</label>
              <input
                className="form-input"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.email[lang]}</label>
              <input
                className="form-input"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.service[lang]} *</label>
              <select
                className="form-select"
                value={form.service}
                onChange={e => set('service', e.target.value)}
                required
              >
                <option value="">{lang === 'es' ? '— Selecciona —' : '— Select service —'}</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.description[lang]}</label>
              <textarea
                className="form-textarea"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder={t.descPh[lang]}
              />
            </div>

            {error && (
              <p style={{ color: '#ff4444', fontSize: '13px', margin: '-8px 0 0' }}>{error}</p>
            )}

            <button
              type="submit"
              className="modal-submit"
              disabled={submitting}
            >
              {submitting ? t.submitting[lang] : t.submit[lang]}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
