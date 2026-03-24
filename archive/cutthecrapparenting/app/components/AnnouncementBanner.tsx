'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AnnouncementBanner() {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('venue_status')
      .select('specials_text, happy_hour_active')
      .eq('client_slug', 'cutthecrapparenting')
      .single()
      .then(({ data }) => {
        if (data?.happy_hour_active && data?.specials_text) {
          setText(data.specials_text)
        }
      })
  }, [])

  if (!text) return null

  return (
    <div style={{
      background: '#C4622D',
      color: 'white',
      textAlign: 'center',
      padding: '10px 80px',
      fontFamily: 'DM Mono, monospace',
      fontSize: '13px',
      letterSpacing: '0.05em',
    }}>
      {text}
    </div>
  )
}
