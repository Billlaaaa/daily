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

      <div className="progress-bar" style={{ height: 5, marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${dailyItems.length ? (completedCount / dailyItems.length) * 100 : 0}%`, background: allDone ? 'var(--green)' : 'var(--accent)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dailyItems.map((item) => {
          const done = !!checked[item.id]
          const color = categoryColors[item.category] || 'var(--border)'
          return (
            <div key={item.id} className="tl-item">
              <div className="tl-rail">
                <span
                  className={`tl-dot${done ? ' dot-done' : ''}`}
                  style={done ? undefined : { borderColor: color, background: 'transparent' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <SwipeableRow done={done} onComplete={() => toggle(item.id)}>
                  <div className={`list-row${done ? ' is-done' : ''}`}>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--muted)',
                      minWidth: 56,
                      whiteSpace: 'nowrap',
                    }}>
                      {item.time}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14,
                        color: done ? 'var(--muted)' : 'var(--text)',
                        textDecoration: done ? 'line-through' : 'none',
                        fontWeight: done ? 400 : 500,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 10,
                        marginTop: 2,
                        color: color,
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
