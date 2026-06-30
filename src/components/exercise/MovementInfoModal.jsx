import { getInstructions } from '../../data/instructions'

export function InfoButton({ onClick, color = 'var(--muted)' }) {
  return (
    <button
      onClick={onClick}
      title="How to do it"
      style={{
        width: 24, height: 24, flexShrink: 0, borderRadius: '50%',
        background: 'var(--surface-2)', border: '1px solid var(--border)', color,
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

export default function MovementInfoModal({ name, prescription, accent = 'var(--accent)', onClose }) {
  const info = getInstructions(name)

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', borderRadius: '20px 20px 0 0', padding: '22px 20px 28px', borderTop: `3px solid ${accent}` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{name}</h2>
          <button onClick={onClose} style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 16, cursor: 'pointer' }}>×</button>
        </div>

        {prescription && (
          <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 12, color: accent, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: 18 }}>
            {prescription}
          </div>
        )}

        {info ? (
          <ol style={{ listStyle: 'none', counterReset: 'step', display: 'flex', flexDirection: 'column', gap: 12, margin: 0, padding: 0 }}>
            {info.steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                  background: `${accent}1A`, border: `1px solid ${accent}55`, color: accent,
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, paddingTop: 2 }}>{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>No instructions added for this one yet.</p>
        )}

        {info?.tip && (
          <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{info.tip}</span>
          </div>
        )}
      </div>
    </div>
  )
}
