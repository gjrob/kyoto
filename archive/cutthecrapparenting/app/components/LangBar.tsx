'use client'
import { useState } from 'react'

export default function LangBar() {
  const [lang, setLang] = useState<'en' | 'es'>('en')

  return (
    <div style={{
      background: '#2C1810',
      padding: '8px 80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '16px',
    }}>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.1em',
      }}>
        LANGUAGE
      </span>
      <button
        onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}
        style={{
          background: 'transparent',
          border: '1px solid rgba(196,98,45,0.5)',
          borderRadius: '4px',
          color: '#C4622D',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          padding: '4px 10px',
          cursor: 'pointer',
        }}
      >
        {lang === 'en' ? 'ES' : 'EN'}
      </button>
    </div>
  )
}
