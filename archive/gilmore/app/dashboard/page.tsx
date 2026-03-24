'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CLIENT_SLUG = 'gilmore'
const ACCENT = '#c8952a'
const ACCENT_TEXT = '#0e0c0a'

interface JobRequest {
  id: string
  name: string
  phone: string
  email?: string
  service: string
  description?: string
  status: string
  created_at: string
}

const statusColor: Record<string, string> = {
  new: '#c8952a',
  contacted: '#00d4ff',
  quoted: '#a78bfa',
  won: '#39ff14',
  lost: '#ff4444',
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobRequest[]>([])
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [overlayActive, setOverlayActive] = useState(false)
  const [overlayMsg, setOverlayMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'jobs' | 'overlay'>('jobs')

  useEffect(() => {
    fetchJobs()
    fetchVenueStatus()

    const sub = supabase
      .channel('gilmore-dashboard-jobs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_requests', filter: `client_slug=eq.${CLIENT_SLUG}` },
        (payload) => {
          setJobs(prev => [payload.new as JobRequest, ...prev])
          setStats(prev => ({ ...prev, today: prev.today + 1, total: prev.total + 1 }))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [])

  async function fetchVenueStatus() {
    const { data } = await supabase
      .from('venue_status')
      .select('is_open,specials_text')
      .eq('client_slug', CLIENT_SLUG)
      .single()
    if (data) {
      setOverlayActive(data.is_open)
      setOverlayMsg(data.specials_text || '')
    }
  }

  async function fetchJobs() {
    const { data } = await supabase
      .from('job_requests')
      .select('*')
      .eq('client_slug', CLIENT_SLUG)
      .order('created_at', { ascending: false })
      .limit(200)

    if (data) {
      setJobs(data)
      const today = new Date().toDateString()
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      setStats({
        today: data.filter(j => new Date(j.created_at).toDateString() === today).length,
        week:  data.filter(j => new Date(j.created_at) >= weekAgo).length,
        total: data.length,
      })
    }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('job_requests').update({ status }).eq('id', id)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j))
  }

  function exportCSV() {
    if (!jobs.length) return
    const headers = Object.keys(jobs[0]).join(',')
    const rows = jobs.map(j =>
      Object.values(j).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `gilmore-job-requests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const tabStyle = (tab: 'jobs' | 'overlay') => ({
    padding: '10px 28px',
    cursor: 'pointer' as const,
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '.1em',
    fontWeight: 700,
    border: 'none',
    background: 'transparent',
    color: activeTab === tab ? ACCENT : '#6b7a8d',
    borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#080b0f', color: '#f0f4f8', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${ACCENT}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '10px', color: ACCENT, letterSpacing: '.15em' }}>// DASHBOARD</div>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '.05em' }}>GILMORE CRAFT & COAT</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/qr"
            style={{ background: 'transparent', border: `1px solid ${ACCENT}`, color: ACCENT, padding: '8px 20px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.1em', textDecoration: 'none', display: 'inline-block' }}
          >
            QR CODE
          </a>
          <button
            onClick={exportCSV}
            style={{ background: 'transparent', border: `1px solid ${ACCENT}`, color: ACCENT, padding: '8px 20px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.1em' }}
          >
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid #1a2332', display: 'flex', padding: '0 32px' }}>
        <button onClick={() => setActiveTab('jobs')} style={tabStyle('jobs')}>JOB REQUESTS</button>
        <button onClick={() => setActiveTab('overlay')} style={tabStyle('overlay')}>SPECIALS BANNER</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: '#1a2332' }}>
        {[
          { label: 'TODAY',     value: stats.today, sub: 'REQUESTS' },
          { label: 'THIS WEEK', value: stats.week,  sub: 'REQUESTS' },
          { label: 'ALL TIME',  value: stats.total, sub: 'REQUESTS' },
        ].map(s => (
          <div key={s.label} style={{ background: '#080b0f', padding: '28px 32px' }}>
            <div style={{ fontSize: '10px', color: '#6b7a8d', letterSpacing: '.1em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '56px', fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: '#6b7a8d', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {activeTab === 'jobs' ? (
        <div style={{ margin: '24px 32px 48px' }}>
          <div style={{ fontSize: '10px', color: ACCENT, letterSpacing: '.15em', marginBottom: '12px' }}>// JOB REQUESTS — REAL TIME</div>
          {loading ? (
            <div style={{ color: '#6b7a8d', padding: '48px', textAlign: 'center' }}>LOADING...</div>
          ) : jobs.length === 0 ? (
            <div style={{ color: '#6b7a8d', padding: '48px', textAlign: 'center', border: '1px solid #1a2332' }}>NO REQUESTS YET</div>
          ) : (
            <div style={{ border: '1px solid #1a2332' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1.5fr 100px', padding: '10px 16px', background: '#0f1419', fontSize: '10px', color: '#6b7a8d', letterSpacing: '.1em', borderBottom: '1px solid #1a2332' }}>
                <span>NAME</span><span>PHONE</span><span>SERVICE</span><span>DATE</span><span>STATUS</span>
              </div>
              {jobs.map((job, i) => (
                <div
                  key={job.id}
                  style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1.5fr 100px', padding: '14px 16px', fontSize: '12px', borderBottom: i < jobs.length - 1 ? '1px solid #0d1117' : 'none', background: i % 2 === 0 ? '#080b0f' : '#0a0e13', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontWeight: 600, color: '#f0f4f8' }}>{job.name}</span>
                  <span style={{ color: '#6b7a8d' }}>
                    <a href={`tel:${job.phone.replace(/\D/g, '')}`} style={{ color: ACCENT, textDecoration: 'none' }}>{job.phone}</a>
                  </span>
                  <span style={{ color: '#a0aabb' }}>{job.service}</span>
                  <span style={{ color: '#6b7a8d', fontSize: '11px' }}>
                    {new Date(job.created_at).toLocaleDateString()} {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <select
                    value={job.status}
                    onChange={e => updateStatus(job.id, e.target.value)}
                    style={{ background: '#0f1419', border: `1px solid ${statusColor[job.status] || '#666'}`, color: statusColor[job.status] || '#666', padding: '4px 6px', fontSize: '10px', fontFamily: 'monospace', cursor: 'pointer', width: '100%' }}
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="quoted">QUOTED</option>
                    <option value="won">WON</option>
                    <option value="lost">LOST</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ margin: '24px 32px 48px' }}>
          <div style={{ fontSize: '10px', color: ACCENT, letterSpacing: '.15em', marginBottom: '12px' }}>// SPECIALS BANNER CONTROL</div>
          <div style={{ border: '1px solid #1a2332', padding: '24px' }}>
            <p style={{ fontSize: '12px', color: '#6b7a8d', marginBottom: '16px' }}>
              This banner appears at the top of the site when active. Use it for promos, announcements, or specials.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                value={overlayMsg}
                onChange={e => setOverlayMsg(e.target.value)}
                placeholder="e.g. Summer special: free paint consultation with any remodel"
                style={{ flex: 1, background: '#0f1419', border: '1px solid #1a2332', color: '#f0f4f8', padding: '10px 16px', fontFamily: 'monospace', fontSize: '13px', outline: 'none' }}
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
                style={{ background: overlayActive ? '#ff4444' : ACCENT, color: ACCENT_TEXT, border: 'none', padding: '10px 28px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', letterSpacing: '.1em' }}
              >
                {overlayActive ? 'DEACTIVATE' : 'ACTIVATE'}
              </button>
            </div>
            {overlayActive && (
              <div style={{ marginTop: '16px', padding: '10px 16px', background: `rgba(200,149,42,0.06)`, border: `1px solid ${ACCENT}`, fontSize: '12px', color: ACCENT }}>
                ● ACTIVE — &quot;{overlayMsg || 'No message set'}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
