'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const CLIENT_NAME = 'Lawn Lads'
const LEADS_TABLE = 'lawnlads_bookings'
const CLIENT_SLUG = 'lawnlads'
const GREEN = '#4caf50'
const LIME = '#7cb342'

interface Lead {
  id: string
  name: string
  phone?: string
  service?: string
  address?: string
  notes?: string
  status: string
  created_at: string
}

interface NurtureMessage {
  id: string
  lead_name: string
  phone: string
  sequence_step: number
  status: string
  channel: string
  scheduled_at: string
}

function NurtureTab() {
  const [queue, setQueue] = useState<NurtureMessage[]>([])
  const [stats, setStats] = useState({ pending: 0, sent: 0, failed: 0, opted_out: 0 })

  useEffect(() => {
    supabase
      .from('nurture_queue')
      .select('*')
      .eq('client_slug', CLIENT_SLUG)
      .order('scheduled_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) {
          setQueue(data)
          setStats({
            pending:   data.filter(m => m.status === 'pending').length,
            sent:      data.filter(m => m.status === 'sent').length,
            failed:    data.filter(m => m.status === 'failed').length,
            opted_out: data.filter(m => m.status === 'opted_out').length,
          })
        }
      })
  }, [])

  const statusColor: Record<string, string> = {
    pending: '#ffaa00', sent: GREEN, failed: '#ff4444', opted_out: '#4a6a4a',
  }

  return (
    <div style={{ margin: '24px 32px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: '#1e3a1e', marginBottom: '24px' }}>
        {[
          { label: 'PENDING',  value: stats.pending,   color: '#ffaa00' },
          { label: 'SENT',     value: stats.sent,      color: GREEN },
          { label: 'FAILED',   value: stats.failed,    color: '#ff4444' },
          { label: 'OPT-OUT',  value: stats.opted_out, color: '#4a6a4a' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0a0f0a', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4a6a4a', letterSpacing: '.1em' }}>{s.label}</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '40px', color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: GREEN, letterSpacing: '.15em', marginBottom: '12px' }}>// NURTURE QUEUE</div>
      {queue.length === 0 ? (
        <div style={{ color: '#4a6a4a', padding: '48px', textAlign: 'center', border: '1px solid #1e3a1e' }}>NO MESSAGES QUEUED YET</div>
      ) : (
        <div style={{ border: '1px solid #1e3a1e' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 60px 90px', padding: '10px 16px', background: '#0f170f', fontFamily: 'monospace', fontSize: '10px', color: '#4a6a4a', letterSpacing: '.1em', borderBottom: '1px solid #1e3a1e' }}>
            <span>NAME</span><span>SCHEDULED</span><span>STEP</span><span>CH</span><span>STATUS</span>
          </div>
          {queue.map((msg, i) => (
            <div key={msg.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 60px 90px', padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', borderBottom: i < queue.length - 1 ? '1px solid #152015' : 'none', background: i % 2 === 0 ? '#0a0f0a' : '#0f170f', alignItems: 'center' }}>
              <span style={{ color: '#e8f5e9', fontWeight: 600 }}>{msg.lead_name}</span>
              <span style={{ color: '#4a6a4a' }}>{new Date(msg.scheduled_at).toLocaleDateString()}</span>
              <span style={{ color: '#4a6a4a' }}>Step {msg.sequence_step}</span>
              <span style={{ color: '#4a6a4a' }}>{msg.channel.toUpperCase()}</span>
              <span style={{ color: statusColor[msg.status] || '#666' }}>{msg.status.toUpperCase().replace('_', '-')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [overlayActive, setOverlayActive] = useState(false)
  const [overlayMsg, setOverlayMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'leads' | 'nurture'>('leads')

  useEffect(() => {
    fetchLeads()
    fetchVenueStatus()
    const sub = supabase.channel('lawnlads-leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: LEADS_TABLE, filter: `client_slug=eq.${CLIENT_SLUG}` },
        (payload) => {
          setLeads(prev => [payload.new as Lead, ...prev])
          setStats(prev => ({ ...prev, today: prev.today + 1, total: prev.total + 1 }))
        })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  async function fetchVenueStatus() {
    const { data } = await supabase.from('venue_status').select('is_open,specials_text').eq('client_slug', CLIENT_SLUG).single()
    if (data) {
      setOverlayActive(data.is_open)
      setOverlayMsg(data.specials_text || '')
    }
  }

  async function fetchLeads() {
    const { data } = await supabase.from(LEADS_TABLE).select('*').eq('client_slug', CLIENT_SLUG).order('created_at', { ascending: false }).limit(200)
    if (data) {
      setLeads(data)
      const today = new Date().toDateString()
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      setStats({
        today: data.filter(l => new Date(l.created_at).toDateString() === today).length,
        week: data.filter(l => new Date(l.created_at) >= weekAgo).length,
        total: data.length,
      })
    }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from(LEADS_TABLE).update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  function exportCSV() {
    if (!leads.length) return
    const headers = Object.keys(leads[0]).join(',')
    const rows = leads.map(l => Object.values(l).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `lawnlads-bookings-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  }

  const statusColor = (s: string) => (
    ({ new: '#ffaa00', pending: LIME, confirmed: GREEN, completed: '#4ade80', cancelled: '#ff4444' } as Record<string, string>)[s] || '#666'
  )

  const tabStyle = (tab: 'leads' | 'nurture') => ({
    padding: '10px 28px',
    cursor: 'pointer' as const,
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '.1em',
    fontWeight: 700,
    border: 'none',
    background: 'transparent',
    color: activeTab === tab ? GREEN : '#4a6a4a',
    borderBottom: activeTab === tab ? `2px solid ${GREEN}` : '2px solid transparent',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8f5e9', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${GREEN}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px', height: '40px', background: GREEN,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#0a0f0a', lineHeight: 1 }}>L</span>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: GREEN, letterSpacing: '.15em' }}>// DASHBOARD</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', color: '#e8f5e9', letterSpacing: '.05em' }}>{CLIENT_NAME.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={exportCSV} style={{ background: 'transparent', border: `1px solid ${GREEN}`, color: GREEN, padding: '8px 20px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.1em' }}>
          EXPORT CSV
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid #1e3a1e', display: 'flex', padding: '0 32px' }}>
        <button onClick={() => setActiveTab('leads')} style={tabStyle('leads')}>LEADS</button>
        <button onClick={() => setActiveTab('nurture')} style={tabStyle('nurture')}>NURTURE</button>
      </div>

      {activeTab === 'leads' ? (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: '#1e3a1e' }}>
            {[{ label: 'TODAY', value: stats.today }, { label: 'THIS WEEK', value: stats.week }, { label: 'ALL TIME', value: stats.total }].map(s => (
              <div key={s.label} style={{ background: '#0a0f0a', padding: '28px 32px' }}>
                <div style={{ fontSize: '10px', color: '#4a6a4a', letterSpacing: '.1em', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '56px', color: GREEN, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: '#4a6a4a', marginTop: '4px' }}>BOOKINGS</div>
              </div>
            ))}
          </div>

          {/* Overlay Control */}
          <div style={{ margin: '24px 32px', border: '1px solid #1e3a1e', padding: '20px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: GREEN, letterSpacing: '.15em', marginBottom: '12px' }}>// OVERLAY CONTROL</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                value={overlayMsg}
                onChange={e => setOverlayMsg(e.target.value)}
                placeholder="e.g. Spring special — first mow 20% off, call now!"
                style={{ flex: 1, background: '#0f170f', border: '1px solid #1e3a1e', color: '#e8f5e9', padding: '10px 16px', fontFamily: 'monospace', fontSize: '13px', outline: 'none' }}
              />
              <button
                onClick={async () => {
                  const next = !overlayActive
                  setOverlayActive(next)
                  await supabase.from('venue_status').upsert(
                    { client_slug: CLIENT_SLUG, is_open: next, specials_text: overlayMsg },
                    { onConflict: 'client_slug' }
                  )
                }}
                style={{ background: overlayActive ? '#ff4444' : GREEN, color: '#0a0f0a', border: 'none', padding: '10px 28px', cursor: 'pointer', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '12px', letterSpacing: '.1em' }}
              >
                {overlayActive ? 'STOP' : 'GO LIVE'}
              </button>
            </div>
            {overlayActive && (
              <div style={{ marginTop: '12px', padding: '10px 16px', background: `${GREEN}10`, border: `1px solid ${GREEN}`, fontFamily: 'monospace', fontSize: '12px', color: GREEN }}>
                ● LIVE — &quot;{overlayMsg || 'No message set'}&quot;
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ margin: '0 32px 48px' }}>
            <div style={{ fontSize: '10px', color: GREEN, letterSpacing: '.15em', marginBottom: '12px' }}>// BOOKINGS — REAL TIME</div>
            {loading ? (
              <div style={{ color: '#4a6a4a', padding: '48px', textAlign: 'center' }}>LOADING...</div>
            ) : leads.length === 0 ? (
              <div style={{ color: '#4a6a4a', padding: '48px', textAlign: 'center', border: '1px solid #1e3a1e' }}>NO BOOKINGS YET</div>
            ) : (
              <div style={{ border: '1px solid #1e3a1e' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1.5fr 1fr', padding: '10px 16px', background: '#0f170f', fontSize: '10px', color: '#4a6a4a', letterSpacing: '.1em', borderBottom: '1px solid #1e3a1e' }}>
                  <span>NAME</span><span>PHONE</span><span>SERVICE</span><span>ADDRESS</span><span>STATUS</span>
                </div>
                {leads.map((lead, i) => (
                  <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1.5fr 1fr', padding: '14px 16px', fontSize: '12px', borderBottom: i < leads.length - 1 ? '1px solid #152015' : 'none', background: i % 2 === 0 ? '#0a0f0a' : '#0f170f', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#e8f5e9' }}>{lead.name}</span>
                    <span style={{ color: '#4a6a4a' }}>{lead.phone || '—'}</span>
                    <span style={{ color: '#4a6a4a' }}>{lead.service || '—'}</span>
                    <span style={{ color: '#4a6a4a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>{lead.address || lead.notes || '—'}</span>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      style={{ background: '#0f170f', border: `1px solid ${statusColor(lead.status)}`, color: statusColor(lead.status), padding: '4px 8px', fontSize: '10px', fontFamily: 'monospace', cursor: 'pointer' }}
                    >
                      <option value="new">NEW</option>
                      <option value="pending">PENDING</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <NurtureTab />
      )}
    </div>
  )
}
