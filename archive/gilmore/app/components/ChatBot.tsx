'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatBotProps {
  lang?: 'en' | 'es'
}

const WELCOME: Record<'en' | 'es', string> = {
  en: "Hi! I'm Jake, your Gilmore Craft & Coat assistant. Ask me about our services, pricing, or get a free estimate. How can I help?",
  es: '¡Hola! Soy Jake, el asistente de Gilmore Craft & Coat. Pregúntame sobre nuestros servicios o solicita un presupuesto gratis.',
}

export default function ChatBot({ lang = 'en' }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME[lang] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, lang }),
      })

      if (!res.ok) throw new Error('Chat failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let botText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      setLoading(false)

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          botText += decoder.decode(value, { stream: true })
          setMessages(prev => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'assistant', content: botText }
            return copy
          })
        }
      }
    } catch {
      setLoading(false)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: lang === 'es'
            ? 'Lo siento, hay un problema técnico. Llama al 910-547-7410.'
            : 'Sorry, having trouble connecting. Call us at 910-547-7410!',
        },
      ])
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const label = lang === 'es' ? 'Pregúntanos...' : 'Ask about our services...'

  return (
    <>
      <button
        className={`chatbot-bubble ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '🔨'}
      </button>

      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-avatar">J</div>
            <div className="chatbot-header-text">
              <h4>JAKE — GILMORE ASSISTANT</h4>
              <span><span className="chatbot-online"></span>Online now</span>
            </div>
          </div>

          <div className="chatbot-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === 'user' ? 'user' : 'bot'}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={label}
              autoFocus
            />
            <button onClick={send} disabled={loading} aria-label="Send">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
