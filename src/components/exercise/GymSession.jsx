import { useState } from 'react'
import dayjs from 'dayjs'
import { gymExercises, gymStretches, REHAB_EXERCISES } from '../../data/exercises'
import { getLastSessionDate } from '../../hooks/useGymCycle'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'

// Progressive overload nudge: if last session hit 10+ reps at a weight, suggest a small bump; otherwise repeat it.
function suggestNextWeight(prevSet) {
  if (!prevSet?.weight) return null
  const w = parseFloat(prevSet.weight)
  const r = parseFloat(prevSet.reps)
  if (Number.isNaN(w)) return null
  if (!Number.isNaN(r) && r >= 10) return Math.round((w + 2.5) * 2) / 2
  return w
}

function ExerciseCard({ name, today, lastDate, isRehab }) {
  const gymKey = `gym_${today}_${name}`
  const [sets, setSets] = useState(() =>
    lsGet(gymKey, [{ weight: '', reps: '', done: false }, { weight: '', reps: '', done: false }, { weight: '', reps: '', done: false }])
  )
  const prevSets = lastDate ? lsGet(`gym_${lastDate}_${name}`, []) : []

  const updateSet = (idx, field, value) => {
    const next = sets.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    setSets(next)
    lsSet(gymKey, next)
  }

  const toggleSetDone = (idx) => {
    const next = sets.map((s, i) => i === idx ? { ...s, done: !s.done } : s)
    setSets(next)
    lsSet(gymKey, next)
  }

  const addSet = () => {
    const next = [...sets, { weight: '', reps: '', done: false }]
    setSets(next)
    lsSet(gymKey, next)
  }

  const setsDone = sets.filter(s => s.done).length

  return (
    <div className="card" style={{ borderLeft: isRehab ? '3px solid #FF3333' : '3px solid var(--green)' }}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{name}</div>
          {isRehab && (
            <div style={{ fontSize: 11, color: '#FF3333', fontWeight: 600, marginTop: 4, letterSpacing: '0.04em' }}>
              LIGHT WEIGHT ONLY — NO ADDED PLATES — REHAB MOVEMENT
            </div>
          )}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: setsDone === sets.length ? 'var(--green)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
          {setsDone}/{sets.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sets.map((set, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', opacity: set.done ? 0.6 : 1 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', minWidth: 36 }}>
              Set {idx + 1}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" min="0" className="set-input" placeholder="kg" value={set.weight} onChange={(e) => updateSet(idx, 'weight', e.target.value)} />
              {(() => {
                const suggested = suggestNextWeight(prevSets[idx])
                if (set.weight !== '' || suggested == null) return null
                const isBump = parseFloat(prevSets[idx].weight) !== suggested
                return (
                  <button
                    onClick={() => updateSet(idx, 'weight', suggested)}
                    title={isBump ? 'Last session hit 10+ reps — suggested progression' : 'Same as last session'}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                      color: isBump ? 'var(--green)' : 'var(--muted)',
                      background: isBump ? 'rgba(0,230,118,0.12)' : 'var(--surface-2)',
                      border: `1px solid ${isBump ? 'var(--green)' : 'var(--border)'}`,
                      borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap', cursor: 'pointer',
                    }}
                  >
                    {isBump ? '↑' : '→'} {suggested}
                  </button>
                )
              })()}
            </div>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>×</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" min="0" className="set-input" placeholder="reps" value={set.reps} onChange={(e) => updateSet(idx, 'reps', e.target.value)} />
              {prevSets[idx]?.reps && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>({prevSets[idx].reps})</span>
              )}
            </div>
            <input
              type="checkbox"
              className="checkbox"
              checked={!!set.done}
              onChange={() => toggleSetDone(idx)}
              style={{ marginLeft: 'auto' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addSet}
        style={{ marginTop: 12, padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-heading)', fontWeight: 600, cursor: 'pointer' }}
      >
        + Add Set
      </button>
    </div>
  )
}

function CardioCard({ today }) {
  const key = `gym_${today}_cardio`
  const [done, setDone] = useState(() => !!lsGet(key, false))

  const toggle = () => {
    const next = !done
    setDone(next)
    lsSet(key, next)
  }

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '3px solid var(--amber)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Treadmill</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>90 minutes · 5 km/h · 5% incline</div>
      </div>
      <input type="checkbox" className="checkbox" checked={done} onChange={toggle} />
    </div>
  )
}

export default function GymSession({ split }) {
  const today = dayjs().format('YYYY-MM-DD')
  const [stretchOpen, setStretchOpen] = useState(false)

  const exercises = gymExercises[split] || []
  const stretches = gymStretches[split] || []
  const lastDate = ['Push', 'Pull', 'Legs'].includes(split) ? getLastSessionDate(split, today) : null

  if (split === 'Rest') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40, borderLeft: '3px solid var(--purple)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--purple)', marginBottom: 8 }}>Rest Day</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Recovery is part of the plan.</div>
      </div>
    )
  }

  if (split === 'Cardio') {
    return <CardioCard today={today} />
  }

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--green)', marginBottom: 20, letterSpacing: '0.04em' }}>
        {split} Day
      </div>

      {/* Collapsible warm-up stretches */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setStretchOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--purple)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, cursor: 'pointer', width: '100%', justifyContent: 'space-between' }}
        >
          <span>Warm-up Stretches</span>
          <span>{stretchOpen ? '▲' : '▼'}</span>
        </button>

        {stretchOpen && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {stretches.map((s, i) => (
              <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderLeft: '3px solid var(--purple)' }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{s.name}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{s.prescription}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercises */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {exercises.map((name) => (
          <ExerciseCard key={name} name={name} today={today} lastDate={lastDate} isRehab={REHAB_EXERCISES.includes(name)} />
        ))}
      </div>

      {lastDate && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>
          Previous session: {lastDate}
        </div>
      )}
    </div>
  )
}
