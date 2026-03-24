'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const TABLE = 'lawnlads_bookings'
const GREEN = '#22c55e'
const BORDER = '#1e3a1e'

export default function BookingForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', address: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.phone) return alert('Please enter your name and phone.')
    setLoading(true)
    const { error } = await supabase.from(TABLE).insert({ ...form, status: 'new' })
    if (error) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ border: `2px solid ${GREEN}`, background: `${GREEN}12`, padding: '48px', textAlign: 'center', borderRadius: '2px' }}>
      <div style={{ fontSize: '52px', marginBottom: '12px' }}>⚡</div>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', color: GREEN, fontWeight: 900, marginBottom: '8px' }}>QUEST ACCEPTED!</div>
      <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 600, fontSize: '14px', color: '#6a8a6a' }}>
        The crew will text you back within the hour to confirm. Stay tuned!
      </div>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    background: '#0a0f0a',
    border: `2px solid ${BORDER}`,
    color: '#e8f5e9',
    fontFamily: "'Exo 2', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    padding: '12px 14px',
    outline: 'none',
    width: '100%',
    transition: 'border-color .15s',
    borderRadius: '2px',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Orbitron, monospace',
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '.15em',
    color: '#4a6a4a',
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      <div>
        <label style={labelStyle}>YOUR NAME</label>
        <input
          style={inputStyle}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="First Last"
          onFocus={e => (e.target.style.borderColor = GREEN)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>
      <div>
        <label style={labelStyle}>PHONE</label>
        <input
          style={inputStyle}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          placeholder="910-000-0000"
          onFocus={e => (e.target.style.borderColor = GREEN)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>SERVICE NEEDED</label>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={form.service}
          onChange={e => setForm({ ...form, service: e.target.value })}
          onFocus={e => (e.target.style.borderColor = GREEN)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        >
          <option value="">Select a service...</option>
          <option>Lawn Mowing</option>
          <option>Edging &amp; Trim</option>
          <option>Yard Cleanup</option>
          <option>Mulch &amp; Beds</option>
          <option>Full Service Package</option>
        </select>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>ADDRESS</label>
        <input
          style={inputStyle}
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          placeholder="123 Main St, Wilmington NC"
          onFocus={e => (e.target.style.borderColor = GREEN)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>NOTES (OPTIONAL)</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Yard size, gate code, special instructions..."
          onFocus={e => (e.target.style.borderColor = GREEN)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? BORDER : GREEN,
            color: '#0a0f0a',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: '15px',
            letterSpacing: '.1em',
            padding: '18px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background .15s',
            animation: loading ? 'none' : 'cta-glow 3s ease-in-out infinite',
          }}
        >
          {loading ? 'SENDING...' : '⚡ REQUEST QUOTE'}
        </button>
      </div>
    </div>
  )
}
