'use client'

import { useState } from 'react'
import type { Tier } from '../page'

export default function CheckoutModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.businessName.trim() || !formData.contactEmail.trim()) {
      setError('Business name and email are required.')
      return
    }
    if (!formData.contactEmail.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          businessName: formData.businessName.trim(),
          contactName: formData.contactName.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactPhone: formData.contactPhone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Checkout failed. Please try again.')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>{tier.name} Plan</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
              ${tier.setupPrice.toLocaleString()} setup &nbsp;+&nbsp; ${tier.monthlyPrice}/mo
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1,
              padding: '0 4px',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCheckout}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Business Name *
            </label>
            <input
              className="form-input"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your business name"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Contact Name
            </label>
            <input
              className="form-input"
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email *
            </label>
            <input
              className="form-input"
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="you@yourbusiness.com"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Phone
            </label>
            <input
              className="form-input"
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="(910) 555-0000"
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.875rem', color: 'var(--error)', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Redirecting...' : `Pay $${tier.setupPrice.toLocaleString()} Setup Fee`}
          </button>

          <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '12px', marginBottom: 0, color: 'var(--text-secondary)', opacity: 0.7 }}>
            Secured by Stripe · Cancel anytime after month 1
          </p>
        </form>
      </div>
    </div>
  )
}
