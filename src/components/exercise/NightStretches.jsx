import { useState } from 'react'
import dayjs from 'dayjs'
import { nightStretches } from '../../data/stretches'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import SwipeableRow from '../SwipeableRow'

export default function NightStretches() {
  const today = dayjs().format('YYYY-MM-DD')
  const key = `stretch_pm_${today}`
  const [checked, setChecked] = useState(() => lsGet(key, {}))

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    lsSet(key, next)
  }

  const done = nightStretches.filter(s => checked[s.id]).length
  const allDone = done === nightStretches.length

  const toggleAll = () => {
    const next = {}
    nightStretches.forEach(s => { next[s.id] = !allDone })
    setChecked(next)
    lsSet(key, next)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Night Stretches</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{done}/{nightStretches.length}</span>
          <input type="checkbox" className="checkbox" checked={allDone} onChange={toggleAll} title="Mark all done" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {nightStretches.map((s) => {
          const isDone = !!checked[s.id]
          return (
            <SwipeableRow key={s.id} done={isDone} onComplete={() => toggle(s.id)}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid var(--sky)', opacity: isDone ? 0.55 : 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: isDone ? 'var(--muted)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.prescription}</div>
                </div>
                <input type="checkbox" className="checkbox" checked={isDone} onChange={() => toggle(s.id)} />
              </div>
            </SwipeableRow>
          )
        })}
      </div>
    </div>
  )
}
