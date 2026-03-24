import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getStats(supabase: any, clientSlug: string) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [pvWeek, pvMonth, chatWeek, resWeek, pending, pvWeekDetailed] = await Promise.all([
    supabase
      .from('canonical_events').select('*', { count: 'exact', head: true })
      .eq('client_slug', clientSlug).eq('event_type', 'page.view').gte('occurred_at', weekAgo),
    supabase
      .from('canonical_events').select('*', { count: 'exact', head: true })
      .eq('client_slug', clientSlug).eq('event_type', 'page.view').gte('occurred_at', monthAgo),
    supabase
      .from('canonical_events').select('*', { count: 'exact', head: true })
      .eq('client_slug', clientSlug).eq('event_type', 'chat.message').gte('occurred_at', weekAgo),
    supabase
      .from('reservations').select('*', { count: 'exact', head: true })
      .eq('client_slug', clientSlug).gte('created_at', weekAgo),
    supabase
      .from('reservations').select('*')
      .eq('client_slug', clientSlug).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(10),
    // Detailed page views for bar vs kitchen traffic analysis
    supabase
      .from('canonical_events').select('occurred_at')
      .eq('client_slug', clientSlug).eq('event_type', 'page.view').gte('occurred_at', weekAgo),
  ])

  // Bar vs Kitchen traffic: extract local hour from timestamps
  // Kitchen = 5pm–10pm (17–22), Bar = 10pm–2am (22–2)
  let kitchenVisits = 0
  let barVisits = 0
  if (pvWeekDetailed.data) {
    for (const row of pvWeekDetailed.data as any[]) {
      const hour = new Date(row.occurred_at).getHours()
      if (hour >= 17 && hour < 22) kitchenVisits++
      else if (hour >= 22 || hour < 2) barVisits++
    }
  }

  return {
    pageViewsWeek: pvWeek.count ?? 0,
    pageViewsMonth: pvMonth.count ?? 0,
    chatWeek: chatWeek.count ?? 0,
    reservationsWeek: resWeek.count ?? 0,
    kitchenVisits,
    barVisits,
    pendingReservations: pending.data ?? [],
  }
}

export default async function Dashboard1504() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || url.includes('placeholder')) {
    return (
      <main style={{ background: '#0d0814', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ color: '#9d8ec4', textAlign: 'center' }}>
          <p>Dashboard not configured.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Set SUPABASE_SERVICE_ROLE_KEY in .env.local</p>
        </div>
      </main>
    )
  }

  const supabase = createClient(url, key)
  const stats = await getStats(supabase, '1504')

  const statCards = [
    { label: 'Page Views', sub: 'This Week', value: stats.pageViewsWeek, accent: '#8b5cf6' },
    { label: 'Page Views', sub: 'This Month', value: stats.pageViewsMonth, accent: '#8b5cf6' },
    { label: 'Chatbot Conversations', sub: 'This Week', value: stats.chatWeek, accent: '#4ade80' },
    { label: 'Reservation Requests', sub: 'This Week', value: stats.reservationsWeek, accent: '#d97706' },
  ]

  return (
    <main style={{ background: '#0d0814', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", color: '#f3f0ff', padding: '0 0 4rem' }}>
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid rgba(139,92,246,0.15)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f0ff', margin: 0 }}>
            1504 Resto-Bar · Owner Dashboard
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#9d8ec4', marginTop: '4px', letterSpacing: '0.05em' }}>
            Updated in real time · Powered by BlueTubeTV
          </p>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#9d8ec4', textAlign: 'right' }}>
          <div>2206 Carolina Beach Rd · Wilmington, NC</div>
          <div style={{ marginTop: '2px' }}>(910) 555-1504</div>
        </div>
      </header>

      <div style={{ padding: '2rem' }}>
        {/* MAIN STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ background: '#1a0f28', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: '0.5rem' }}>
                {card.label}<br/><span style={{ color: card.accent, fontSize: '0.6rem' }}>{card.sub}</span>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: card.accent, lineHeight: 1 }}>
                {card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* BAR VS KITCHEN TRAFFIC CARD */}
        <div style={{ background: '#1a0f28', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: '1rem' }}>
            Kitchen vs Bar Traffic · This Week
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                🍽️ Kitchen
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d97706', lineHeight: 1 }}>
                {stats.kitchenVisits}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#9d8ec4', marginTop: '4px' }}>5pm–10pm visits</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                🥃 Bar
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', lineHeight: 1 }}>
                {stats.barVisits}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#9d8ec4', marginTop: '4px' }}>10pm–2am visits</div>
            </div>
          </div>
        </div>

        {/* PENDING RESERVATIONS */}
        <div>
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: '1rem', fontWeight: 600 }}>
            Pending Reservations
          </h2>
          {stats.pendingReservations.length === 0 ? (
            <div style={{ background: '#1a0f28', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#9d8ec4', fontSize: '0.85rem' }}>
              No pending reservations
            </div>
          ) : (
            <div style={{ background: '#1a0f28', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
                    {['Name', 'Party', 'Date', 'Time', 'Phone', 'Notes', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9d8ec4', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.pendingReservations.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#f3f0ff' }}>{r.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a78bfa', textAlign: 'center' }}>{r.party_size}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#f3f0ff' }}>{r.date}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#f3f0ff' }}>{r.time}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#9d8ec4' }}>{r.phone}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#9d8ec4', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', background: 'rgba(245,158,11,0.12)', color: '#d97706', border: '1px solid rgba(245,158,11,0.25)' }}>
                          PENDING
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid rgba(139,92,246,0.08)', marginTop: '3rem' }}>
        <p style={{ color: '#9d8ec4', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
          BlueTubeTV · Blue Ring Holdings LLC
        </p>
      </footer>
    </main>
  )
}
