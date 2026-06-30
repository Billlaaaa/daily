import { useState } from 'react'
import dayjs from 'dayjs'
import { categoryColors } from '../../data/dailyItems'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import { getDailyItems } from '../../hooks/usePlanData'
import { useCelebrateOnComplete } from '../../hooks/useCelebrateOnComplete'
import SwipeableRow from '../SwipeableRow'
import Confetti from '../Confetti'

export default function DailyTab() {
  const today = dayjs().format('YYYY-MM-DD')
  const storageKey = `daily_${today}`

  const [dailyItems] = useState(getDailyItems)
  const [checked, setChecked] = useState(() => lsGet(storageKey, {}))

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    lsSet(storageKey, next)
  }

  const completedCount = dailyItems.filter(i => checked[i.id]).length
  const allDone = completedCount === dailyItems.length
  const [showConfetti, dismissConfetti] = useCelebrateOnComplete(allDone)

  const toggleAll = () => {
    const next = {}
    dailyItems.forEach(i => { next[i.id] = !allDone })
    setChecked(next)
    lsSet(storageKey, next)
  }

  return (
    <div className="tab-content">
      {showConfetti && <Confetti onDone={dismissConfetti} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
          Daily Routine
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)' }}>
            {completedCount}/{dailyItems.length}
          </span>
          <input type="checkbox" className="checkbox" checked={allDone} onChange={toggleAll} title="Mark all done" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dailyItems.map((item) => {
          const done = !!checked[item.id]
          const color = categoryColors[item.category] || 'var(--border)'
          return (
            <SwipeableRow key={item.id} done={done} onComplete={() => toggle(item.id)}>
              <div
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderLeft: `3px solid ${color}`,
                  opacity: done ? 0.55 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--muted)',
                  minWidth: 60,
                  whiteSpace: 'nowrap',
                }}>
                  {item.time}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    color: done ? 'var(--muted)' : 'var(--text)',
                    textDecoration: done ? 'line-through' : 'none',
                    fontWeight: done ? 400 : 500,
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 11,
                    marginTop: 1,
                    color: color,
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    {item.category}
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="checkbox"
                  checked={done}
                  onChange={() => toggle(item.id)}
                />
              </div>
            </SwipeableRow>
          )
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${(completedCount / dailyItems.length) * 100}%`, background: 'var(--muted)' }} />
        </div>
      </div>
    </div>
  )
}
