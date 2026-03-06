// components/SpecialsBanner.tsx
// CLAUDE.md: Owner-controlled specials/happy hour banner
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SpecialsBanner({ lang = 'en' }: { lang?: 'en' | 'es' }) {
  const [banner, setBanner] = useState<{ text_en: string; text_es: string; active: boolean } | null>(null)

  useEffect(() => {
    supabase
      .from('venue_status')
      .select('specials_text, happy_hour_active, specials_text_es')
      .eq('client_slug', 'cellphoneparadise')
      .single()
      .then(({ data }) => {
        if (data?.happy_hour_active) {
          setBanner({
            text_en: data.specials_text || "Today's Special",
            text_es: data.specials_text_es || 'Especial de Hoy',
            active: true,
          })
        }
      })

    const channel = supabase
      .channel('specials-cellphoneparadise')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'venue_status', filter: 'client_slug=eq.cellphoneparadise' },
        ({ new: next }: any) => {
          setBanner(next.happy_hour_active ? {
            text_en: next.specials_text || "Today's Special",
            text_es: next.specials_text_es || 'Especial de Hoy',
            active: true,
          } : null)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (!banner?.active) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--accent, #c9a96e), var(--accent-deep, #a07840))',
      color: '#fff',
      textAlign: 'center',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      position: 'relative',
      zIndex: 50,
    }}>
      ✨ {lang === 'es' ? banner.text_es : banner.text_en}
    </div>
  )
}
