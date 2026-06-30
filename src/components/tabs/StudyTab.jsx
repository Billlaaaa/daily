import { useState } from 'react'
import dayjs from 'dayjs'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import { getStudyBlocks } from '../../hooks/usePlanData'
import { useCelebrateOnComplete } from '../../hooks/useCelebrateOnComplete'
import FullScreenTimer from '../timer/FullScreenTimer'
import Confetti from '../Confetti'

export default function StudyTab() {
  const today = dayjs().format('YYYY-MM-DD')
  const storageKey = `study_${today}`

  const [studyBlocks] = useState(getStudyBlocks)
  const [checked, setChecked] = useState(() => lsGet(storageKey, {}))
  // Resume an in-progress timer if the page was refreshed mid-session
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

  const handleTimerExit = () => {
    setActiveBlock(null)
  }

  const completedCount = studyBlocks.filter(b => checked[b.id]).length
  const hoursStudied = (completedCount * 50 / 60).toFixed(1)
  const allDone = studyBlocks.length > 0 && completedCount === studyBlocks.length
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

  return (
    <div className="tab-content">
      {showConfetti && <Confetti onDone={dismissConfetti} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {studyBlocks.map((block) => {
          const done = !!checked[block.id]
          return (
            <div
              key={block.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                borderLeft: `3px solid ${done ? 'var(--green)' : 'var(--accent)'}`,
                opacity: done ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
                    {block.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {block.time}
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={!!checked[block.id]}
                  onChange={() => toggle(block.id)}
                />
              </div>

              {!done && (
                <button
                  className="btn-primary"
                  onClick={() => setActiveBlock(block)}
                  style={{ padding: '8px 0', fontSize: 13, letterSpacing: '0.04em' }}
                >
                  START
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="card" style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>
            {completedCount}<span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 400 }}>/12</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>blocks completed</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
            {hoursStudied}<span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 400 }}>h</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>studied today</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(completedCount / 12) * 100}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
