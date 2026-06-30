import { getInstructions } from '../../data/instructions'

export function InfoButton({ onClick, color = 'var(--muted)', open = false }) {
  return (
    <button
      onClick={onClick}
      title="How to do it"
      style={{
        width: 24, height: 24, flexShrink: 0, borderRadius: '50%',
        background: open ? color : 'var(--surface-2)',
        border: `1px solid ${open ? color : 'var(--border)'}`,
        color: open ? '#08080C' : color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </button>
  )
}

export default function MovementSteps({ name, accent = 'var(--accent)' }) {
  const info = getInstructions(name)

  return (
    <div className="steps-reveal" style={{ borderLeft: `2px solid ${accent}` }}>
      {info ? (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {info.steps.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                background: `${accent}1A`, border: `1px solid ${accent}55`, color: accent,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, paddingTop: 1 }}>{step}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>No instructions added for this one yet.</p>
      )}

      {info?.tip && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 13 }}>💡</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{info.tip}</span>
        </div>
      )}
    </div>
  )
}
