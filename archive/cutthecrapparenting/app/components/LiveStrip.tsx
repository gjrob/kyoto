const items = [
  '🏡 In-Home Fairy Godmother Service',
  '🎓 Workshops & Group Sessions',
  '💻 Private Consultations via Zoom',
  '📚 The Blueprint Online Course · $197',
  '🌿 Wilmington, NC & Surrounding Areas',
  '⭐ Zero Judgment. Real Solutions.',
]

export default function LiveStrip() {
  return (
    <div style={{
      background: '#F2EDE4',
      borderTop: '1px solid #E0D9D0',
      borderBottom: '1px solid #E0D9D0',
      overflow: 'hidden',
      padding: '12px 0',
    }}>
      <div style={{
        display: 'flex',
        gap: '48px',
        animation: 'none',
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        padding: '0 80px',
        scrollbarWidth: 'none',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            color: '#7A6E65',
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
