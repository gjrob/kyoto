export default function Footer() {
  return (
    <footer style={{
      background: '#2C1810',
      color: 'rgba(255,255,255,0.5)',
      padding: '48px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '40px',
    }}>
      <div>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '8px',
        }}>
          Cut the Crap Parenting
        </div>
        <div style={{
          fontFamily: 'Source Serif 4, serif',
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.45)',
        }}>
          An intuitive and holistic approach for today's parents. Wilmington, NC.
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '16px',
        }}>
          SERVICES
        </div>
        {['In-Home Support', 'Private Consultation', 'Workshops', 'The Blueprint Course'].map(s => (
          <div key={s} style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '8px',
          }}>
            {s}
          </div>
        ))}
      </div>

      <div>
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '16px',
        }}>
          CONTACT
        </div>
        <a href="tel:(910) 612-7885" style={{
          display: 'block',
          fontFamily: 'Source Serif 4, serif',
          fontSize: '14px',
          color: '#C4622D',
          textDecoration: 'none',
          marginBottom: '8px',
        }}>
          (910) 612-7885
        </a>
        <div style={{
          fontFamily: 'Source Serif 4, serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
        }}>
          Wilmington, NC
        </div>
      </div>

      <div style={{
        gridColumn: '1 / -1',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '24px',
        fontFamily: 'DM Mono, monospace',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.05em',
      }}>
        © {new Date().getFullYear()} Cut the Crap Parenting · Denise · Wilmington, NC
      </div>
    </footer>
  )
}
