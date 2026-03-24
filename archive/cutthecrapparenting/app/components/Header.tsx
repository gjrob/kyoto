'use client'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(250,247,242,0.95)' : '#FAF7F2',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: '1px solid #E0D9D0',
      padding: '0 80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '72px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '20px',
        fontWeight: 700,
        color: '#2C1810',
        lineHeight: 1.2,
      }}>
        Cut the Crap<br />
        <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: 400, color: '#7A6E65', letterSpacing: '0.1em' }}>
          PARENTING
        </span>
      </div>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}>
        {['Services', 'About', 'Reviews', 'Contact'].map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: '#7A6E65',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2C1810')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A6E65')}
          >
            {item.toUpperCase()}
          </a>
        ))}
        <a href="#book" className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
          Book a Call
        </a>
      </nav>
    </header>
  )
}
