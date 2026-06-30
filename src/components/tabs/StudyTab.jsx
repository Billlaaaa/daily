import { useState } from 'react'
import dayjs from 'dayjs'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import { getStudyBlocks } from '../../hooks/usePlanData'
import { useClock } from '../../hooks/useClock'
import { useCelebrateOnComplete } from '../../hooks/useCelebrateOnComplete'
import { BLOCK_DURATION_MS } from '../../data/studyBlocks'
import FullScreenTimer from '../timer/FullScreenTimer'
import Confetti from '../Confetti'

const BLOCK_MIN = BLOCK_DURATION_MS / 60000

// Robust "h:mm A" parser — avoids depending on dayjs customParseFormat plugin
function parseBlockTime(today, timeStr) {
  const m = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return null
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const mer = m[3].toUpperCase()
  if (mer === 'PM' && h !== 12) h += 12
  if (mer === 'AM' && h === 12) h = 0
  return dayjs(today).hour(h).minute(min).second(0).millisecond(0)
}

function StudyRing({ done, total }) {
  const pct = total > 0 ? done / total : 0
  const R = 38
  const C = 2 * Math.PI * R
  const offset = C * (1 - pct)
  const complete = total > 0 && done === total
  const color = complete ? 'var(--green)' : 'var(--accent)'
  return (
    <svg width={92} height={92} style={{ flexShrink: 0 }}>
      <circle cx={46} cy={46} r={R} fill="none" stroke="var(--border)" strokeWidth={7} />
      <circle
        cx={46} cy={46} r={R} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 46 46)" style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text x={46} y={42} textAnchor="middle" fill="var(--text)" fontSize={22} fontFamily="var(--font-mono)" fontWeight={700}>
        {done}<tspan fill="var(--muted)" fontSize={14}>/{total}</tspan>
      </text>
      <text x={46} y={60} textAnchor="middle" fill="var(--muted)" fontSize={9} fontFamily="var(--font-heading)" fontWeight={600} letterSpacing="0.12em">
        BLOCKS
      </text>
    </svg>
  )
}

function relativeStart(now, start) {
  const mins = start.diff(now, 'minute')
  if (mins <= 0) return 'now'
  if (mins < 60) return `in ${mins}m`
  const h = Math.floor(mins / 60)
  const mm = mins % 60
  return mm === 0 ? `in ${h}h` : `in ${h}h ${mm}m`
}

export default function StudyTab() {
  const now = useClock()
  const today = now.format('YYYY-MM-DD')
  const storageKey = `study_${today}`

  const [studyBlocks] = useState(getStudyBlocks)
  const [checked, setChecked] = useState(() => lsGet(storageKey, {}))
  const [activeBlock, setActiveBlock] = useState(() => {
    const stored = lsGet('activeTimer', null)
    if (!stored) return null
    return studyBlocks.find(b => b.id === stored.blockId) || null
  })

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    lsSet(storageKey, next)
  }

  const handleTimerComplete = (blockId) => {
    const next = { ...checked, [blockId]: true }
    setChecked(next)
    lsSet(storageKey, next)
    setActiveBlock(null)
  }

  const handleTimerExit = () => setActiveBlock(null)

  const total = studyBlocks.length
  const completedCount = studyBlocks.filter(b => checked[b.id]).length
  const hoursStudied = (completedCount * BLOCK_MIN / 60).toFixed(1)
  const remaining = total - completedCount
  const allDone = total > 0 && completedCount === total
  const [showConfetti, dismissConfetti] = useCelebrateOnComplete(allDone)

  if (activeBlock) {
    return (
      <FullScreenTimer
        block={activeBlock}
        onComplete={handleTimerComplete}
        onExit={handleTimerExit}
      />
    )
  }

  // Annotate each block with its schedule phase relative to "now"
  const items = studyBlocks.map((block) => {
    const start = parseBlockTime(today, block.time)
    const end = start ? start.add(BLOCK_MIN, 'minute') : null
    const done = !!checked[block.id]
    let phase = 'upcoming'
    if (done) phase = 'done'
    else if (start && now.isAfter(start) && now.isBefore(end)) phase = 'now'
    else if (start && now.isAfter(end)) phase = 'past'
    return { block, start, end, done, phase }
  })

  // The one block to feature: a block happening now, else the soonest upcoming one
  const nowItem = items.find(i => i.phase === 'now')
  const nextItem = items.find(i => i.phase === 'upcoming')
  const featured = nowItem || nextItem || null
  const featuredId = featured?.block.id

  let status
  if (total === 0) status = 'No study blocks configured'
  else if (allDone) status = `Crushed it — all ${total} blocks done`
  else if (nowItem) status = `${nowItem.block.label} is happening now`
  else if (nextItem) status = `Up next: ${nextItem.block.label} · ${nextItem.block.time}`
  else status = `${remaining} ${remaining === 1 ? 'block' : 'blocks'} left today`

  return (
    <div className="tab-content">
      {showConfetti && <Confetti onDone={dismissConfetti} />}

      {/* Hero: progress ring + status */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, borderLeft: `3px solid ${allDone ? 'var(--green)' : 'var(--accent)'}` }}>
        <StudyRing done={completedCount} total={total} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: allDone ? 'var(--green)' : 'var(--accent)', lineHeight: 1 }}>
              {hoursStudied}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--muted)' }}>h studied</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 8, fontWeight: 500 }}>
            {status}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
            <Stat label="Done" value={completedCount} color="var(--green)" />
            <Stat label="Left" value={remaining} color="var(--text)" />
          </div>
        </div>
      </div>

      <div className="section-title">Today's Schedule</div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(({ block, start, done, phase }) => {
          const isFeatured = block.id === featuredId
          const dotClass = done ? 'dot-done' : phase === 'now' ? 'dot-now' : isFeatured ? 'dot-next' : ''

          let sub = null
          if (done) sub = 'Completed'
          else if (phase === 'now') sub = `Happening now · ${start.add(BLOCK_MIN, 'minute').diff(now, 'minute')}m left`
          else if (isFeatured) sub = `Up next · ${relativeStart(now, start)}`
          else if (phase === 'past') sub = 'Earlier today'

          return (
            <div key={block.id} className="study-item">
              <div className={`study-row${isFeatured ? ' is-featured' : ''}${done ? ' is-done' : ''}`}>
                <div className="study-rail">
                  <span className={`study-dot ${dotClass}`} />
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: phase === 'now' ? 'var(--accent)' : 'var(--muted)', minWidth: 58, whiteSpace: 'nowrap', fontWeight: phase === 'now' ? 700 : 400 }}>
                  {block.time}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: isFeatured ? 16 : 14,
                    color: done ? 'var(--muted)' : 'var(--text)',
                    textDecoration: done ? 'line-through' : 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {block.label}
                  </div>
                  {sub && (
                    <div style={{
                      fontSize: 11, marginTop: 2,
                      color: phase === 'now' ? 'var(--accent)' : done ? 'var(--green)' : 'var(--muted)',
                      fontWeight: phase === 'now' ? 600 : 400,
                    }}>
                      {sub}
                    </div>
                  )}

                  {isFeatured && (
                    <button
                      className="btn-primary"
                      onClick={() => setActiveBlock(block)}
                      style={{ marginTop: 12, width: '100%', padding: '10px 0', fontSize: 13, letterSpacing: '0.06em' }}
                    >
                      START · {BLOCK_MIN} MIN
                    </button>
                  )}
                </div>

                {!isFeatured && !done && (
                  <button className="study-start-ghost" onClick={() => setActiveBlock(block)}>
                    START
                  </button>
                )}

                <input
                  type="checkbox"
                  className="checkbox"
                  checked={done}
                  onChange={() => toggle(block.id)}
                  style={{ flexShrink: 0 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}
