import { useState } from 'react'
import dayjs from 'dayjs'
import { morningStretches } from '../../data/stretches'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import SwipeableRow from '../SwipeableRow'
import MovementInfoModal, { InfoButton } from './MovementInfoModal'

export default function MorningStretches() {
  const today = dayjs().format('YYYY-MM-DD')
  const key = `stretch_am_${today}`
  const [checked, setChecked] = useState(() => lsGet(key, {}))
  const [info, setInfo] = useState(null)

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    lsSet(key, next)
  }

  const done = morningStretches.filter(s => checked[s.id]).length
  const allDone = done === morningStretches.length

  const toggleAll = () => {
    const next = {}
    morningStretches.forEach(s => { next[s.id] = !allDone })
    setChecked(next)
    lsSet(key, next)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Morning Stretches</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{done}/{morningStretches.length}</span>
          <input type="checkbox" className="checkbox" checked={allDone} onChange={toggleAll} title="Mark all done" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {morningStretches.map((s) => {
          const isDone = !!checked[s.id]
          return (
            <SwipeableRow key={s.id} done={isDone} onComplete={() => toggle(s.id)}>
              <div className={`list-row${isDone ? ' is-done' : ''}`}>
                <span className="row-dot" style={{ background: 'var(--purple)' }} />
                <div onClick={() => setInfo(s)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: isDone ? 'var(--muted)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.prescription}</div>
                </div>
                <InfoButton onClick={() => setInfo(s)} color="var(--purple)" />
                <input type="checkbox" className="checkbox" checked={isDone} onChange={() => toggle(s.id)} />
              </div>
            </SwipeableRow>
          )
        })}
      </div>

      {info && (
        <MovementInfoModal name={info.name} prescription={info.prescription} accent="var(--purple)" onClose={() => setInfo(null)} />
      )}
    </div>
  )
}
