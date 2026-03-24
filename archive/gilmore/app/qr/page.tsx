'use client'

import { useEffect } from 'react'
import { emit, EventType } from '../../lib/events'

const CLIENT_SLUG = 'gilmore'
const QR_URL = 'https://gilmorecraftandcoat.com'

export default function QRPage() {
  useEffect(() => {
    emit({
      event_type: EventType.QR_SCAN,
      client_slug: CLIENT_SLUG,
      payload: { page: '/qr', url: QR_URL },
    })
  }, [])

  const handlePrint = () => window.print()

  return (
    <div className="qr-page-body">
      <div className="qr-card">
        <div className="qr-eyebrow">Scan to Visit</div>
        <div className="qr-brand">GILMORE <span>CRAFT &amp; COAT</span></div>

        <div className="qr-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(QR_URL)}&bgcolor=ffffff&color=0e0c0a&margin=2`}
            alt="QR Code for Gilmore Craft and Coat"
            width={256}
            height={256}
            style={{ display: 'block' }}
          />
        </div>

        <div className="qr-url">{QR_URL}</div>

        <div className="qr-cta">GET YOUR FREE ESTIMATE</div>
        <p className="qr-sub">
          Scan the code or visit our site to request a free estimate.<br />
          Licensed &amp; Insured · Wilmington NC
        </p>

        <div className="qr-promo">
          🏷 $100 OFF your first project · $1,000 minimum
        </div>

        <div className="qr-contact">
          <div className="qr-contact-row">
            <span className="qr-contact-label">Cell</span>
            <span className="qr-contact-value">910-547-7410</span>
          </div>
          <div className="qr-contact-row">
            <span className="qr-contact-label">Office</span>
            <span className="qr-contact-value">910-431-4309</span>
          </div>
          <div className="qr-contact-row">
            <span className="qr-contact-label">Email</span>
            <span className="qr-contact-value">Gilmorecraftncoat@gmail.com</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="qr-print-btn" onClick={handlePrint}>
            PRINT
          </button>
          <button
            className="qr-print-btn"
            style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
            onClick={async () => {
              const url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(QR_URL)}&bgcolor=ffffff&color=0e0c0a&margin=2`
              const res = await fetch(url)
              const blob = await res.blob()
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = 'gilmore-qr.png'
              a.click()
            }}
          >
            DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  )
}
