function inputStyle(width) {
  return {
    width: width || '100%',
    padding: '6px 8px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
  }
}

export default function ListEditor({ items, fields, onChange, idPrefix, makeDefaults }) {
  const updateField = (idx, key, value) => {
    const next = items.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    onChange(next)
  }

  const removeRow = (idx) => {
    onChange(items.filter((_, i) => i !== idx))
  }

  const addRow = () => {
    const blank = { id: `${idPrefix}_${Date.now()}`, ...makeDefaults() }
    onChange([...items, blank])
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: 8 }}>
            {fields.map((f) => (
              f.type === 'select' ? (
                <select
                  key={f.key}
                  value={item[f.key] ?? ''}
                  onChange={(e) => updateField(idx, f.key, e.target.value)}
                  style={{ ...inputStyle(f.width), background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}
                >
                  {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  key={f.key}
                  type={f.type || 'text'}
                  placeholder={f.label}
                  value={item[f.key] ?? ''}
                  onChange={(e) => updateField(idx, f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                  style={inputStyle(f.width)}
                />
              )
            ))}
            <button
              onClick={() => removeRow(idx)}
              title="Remove"
              style={{ marginLeft: 'auto', width: 26, height: 26, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', color: '#FF4444', fontSize: 14, cursor: 'pointer', flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        style={{ marginTop: 10, padding: '8px 14px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-heading)', fontWeight: 600, cursor: 'pointer', width: '100%' }}
      >
        + Add row
      </button>
    </div>
  )
}
