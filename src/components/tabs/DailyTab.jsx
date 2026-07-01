import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { categoryColors } from '../../data/dailyItems'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import { getDailyItems } from '../../hooks/usePlanData'
import { useCelebrateOnComplete } from '../../hooks/useCelebrateOnComplete'
import SwipeableRow from '../SwipeableRow'
import Confetti from '../Confetti'

function Chevron({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease', flexShrink: 0 }}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export default function DailyTab() {
  const today = dayjs().format('YYYY-MM-DD')
  const storageKey = `daily_${today}`

  const [dailyItems] = useState(getDailyItems)
  const [checked, setChecked] = useState(() => lsGet(storageKey, {}))
  const [openGroups, setOpenGroups] = useState({})
  const [openSubs, setOpenSubs] = useState({})

  const persist = (next) => { setChecked(next); lsSet(storageKey, next) }
  const toggle = (id) => persist({ ...checked, [id]: !checked[id] })
  const setMany = (ids, value) => {
    const next = { ...checked }
    ids.forEach(id => { next[id] = value })
    persist(next)
  }

  const completedCount = dailyItems.filter(i => checked[i.id]).length
  const total = dailyItems.length
  const allDone = total > 0 && completedCount === total
  const [showConfetti, dismissConfetti] = useCelebrateOnComplete(allDone)

  const toggleAll = () => setMany(dailyItems.map(i => i.id), !allDone)

  // Group the flat list into ordered routine sections
  const groups = useMemo(() => {
    const order = []
    const map = {}
    dailyItems.forEach(it => {
      const g = it.group || 'Other'
      if (!map[g]) { map[g] = []; order.push(g) }
      map[g].push(it)
    })
    return order.map(label => ({ label, items: map[label] }))
  }, [dailyItems])

  // Within a group, collapse consecutive same-`sub` items into a nested dropdown
  const buildSequence = (items) => {
    const seq = []
    let i = 0
    while (i < items.length) {
      const it = items[i]
      if (it.sub) {
        const subName = it.sub
        const steps = []
        while (i < items.length && items[i].sub === subName) { steps.push(items[i]); i++ }
        seq.push({ type: 'sub', name: subName, steps })
      } else {
        seq.push({ type: 'item', item: it }); i++
      }
    }
    return seq
  }

  const LeafRow = ({ item, indented, hideTime }) => {
    const done = !!checked[item.id]
    const color = categoryColors[item.category] || 'var(--border)'
    return (
      <SwipeableRow done={done} onComplete={() => toggle(item.id)}>
        <div className={`list-row${done ? ' is-done' : ''}`} style={indented ? { paddingLeft: 14 } : undefined}>
          <span className="row-dot" style={{ background: color }} />
          {!hideTime && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', minWidth: 56, whiteSpace: 'nowrap' }}>{item.time}</div>
          )}
          <div style={{ flex: 1, minWidth: 0, fontSize: 14, color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', fontWeight: done ? 400 : 500 }}>
            {item.label}
          </div>
          <input type="checkbox" className="checkbox" checked={done} onChange={() => toggle(item.id)} />
        </div>
      </SwipeableRow>
    )
  }

  return (
    <div className="tab-content">
      {showConfetti && <Confetti onDone={dismissConfetti} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Daily Routine</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)' }}>{completedCount}/{total}</span>
          <input type="checkbox" className="checkbox" checked={allDone} onChange={toggleAll} title="Mark all done" />
        </div>
      </div>

      <div className="progress-bar" style={{ height: 5, marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${total ? (completedCount / total) * 100 : 0}%`, background: allDone ? 'var(--green)' : 'var(--accent)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groups.map((group) => {
          const groupIds = group.items.map(i => i.id)
          const gDone = group.items.filter(i => checked[i.id]).length
          const gAll = groupIds.length > 0 && gDone === groupIds.length
          const gOpen = openGroups[group.label] !== false
          const seq = buildSequence(group.items)
          const firstTime = group.items[0]?.time

          return (
            <div key={group.label}>
              {/* Routine header (dropdown) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div onClick={() => setOpenGroups(s => ({ ...s, [group.label]: !gOpen }))} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, cursor: 'pointer' }}>
                  <Chevron open={gOpen} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{group.label}</div>
                    {firstTime && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>from {firstTime}</div>}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: gAll ? 'var(--green)' : 'var(--muted)' }}>{gDone}/{groupIds.length}</span>
                <input type="checkbox" className="checkbox" checked={gAll} onChange={() => setMany(groupIds, !gAll)} title="Mark whole routine done" />
              </div>

              {/* Routine body */}
              {gOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, paddingLeft: 4 }}>
                  {seq.map((node) => {
                    if (node.type === 'item') {
                      return <LeafRow key={node.item.id} item={node.item} />
                    }
                    const subKey = `${group.label}:${node.name}`
                    const subIds = node.steps.map(s => s.id)
                    const sDone = node.steps.filter(s => checked[s.id]).length
                    const sAll = subIds.length > 0 && sDone === subIds.length
                    const sOpen = openSubs[subKey] !== false
                    const subColor = categoryColors[node.steps[0]?.category] || 'var(--sky)'
                    const subTime = node.steps[0]?.time
                    return (
                      <div key={subKey}>
                        {/* Skincare sub-dropdown header */}
                        <div className="list-row">
                          <span className="row-dot" style={{ background: subColor }} />
                          <div onClick={() => setOpenSubs(s => ({ ...s, [subKey]: !sOpen }))} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, cursor: 'pointer' }}>
                            {subTime && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', minWidth: 56, whiteSpace: 'nowrap' }}>{subTime}</span>}
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{node.name}</span>
                            <Chevron open={sOpen} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: sAll ? 'var(--green)' : 'var(--muted)' }}>{sDone}/{subIds.length}</span>
                          <input type="checkbox" className="checkbox" checked={sAll} onChange={() => setMany(subIds, !sAll)} title="Mark all skincare done" />
                        </div>
                        {sOpen && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, marginLeft: 14 }}>
                            {node.steps.map(step => <LeafRow key={step.id} item={step} indented hideTime />)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
