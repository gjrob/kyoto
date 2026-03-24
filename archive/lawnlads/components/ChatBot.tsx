'use client'
import { useState, useRef, useEffect } from 'react'

const ACCENT = '#22c55e'
const ACCENT_TEXT = '#000000'
const BUSINESS_NAME = 'Lawn Lads'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm the ${BUSINESS_NAME} assistant. Ask me about our services, pricing, or how to book!` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Text us at (917) 301-7435!' }])
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '56px', height: '56px',
          background: open ? '#1a2a1a' : ACCENT,
          color: open ? '#fff' : ACCENT_TEXT,
          border: open ? `2px solid ${ACCENT}` : 'none',
          cursor: 'pointer',
          fontSize: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
          boxShadow: `0 4px 20px ${ACCENT}40`,
          fontFamily: 'inherit',
        }}
        aria-label="Chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 999,
          width: '340px', maxHeight: '480px',
          background: '#0f170f', border: `2px solid ${ACCENT}`,
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Exo 2', sans-serif",
        }}>
          <div style={{
            background: ACCENT, color: ACCENT_TEXT,
            padding: '12px 16px', fontSize: '13px', fontWeight: 700,
            letterSpacing: '.08em', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace' }}>⚡ {BUSINESS_NAME}</span>
            <span style={{ opacity: .7, fontSize: '10px', fontWeight: 400, fontFamily: 'Orbitron, monospace' }}>AI ASSISTANT</span>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            maxHeight: '320px',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? ACCENT : '#1a2a1a',
                color: m.role === 'user' ? ACCENT_TEXT : '#e8f5e9',
                padding: '9px 13px', fontSize: '13px', lineHeight: 1.45,
                border: m.role === 'assistant' ? '1px solid #1e3a1e' : 'none',
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: ACCENT, fontSize: '18px', letterSpacing: '3px', padding: '6px 12px' }}>
                • • •
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #1e3a1e' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              style={{
                flex: 1, background: '#0a0f0a', border: 'none', outline: 'none',
                color: '#e8f5e9', fontFamily: "'Exo 2', sans-serif", fontSize: '13px',
                padding: '12px 14px',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#1a2a1a' : ACCENT,
                color: ACCENT_TEXT, border: 'none', cursor: 'pointer',
                padding: '0 16px', fontSize: '16px', transition: 'background .15s',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
