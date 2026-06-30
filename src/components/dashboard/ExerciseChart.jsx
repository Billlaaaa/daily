import { useState } from 'react'
import dayjs from 'dayjs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { lsGet } from '../../hooks/useLocalStorage'
import { gymExercises } from '../../data/exercises'
import { getGymSession } from '../../hooks/useGymCycle'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50

const allExercises = [
  ...gymExercises.Push,
  ...gymExercises.Pull,
  ...gymExercises.Legs,
]

export default function ExerciseChart() {
  const [selectedExercise, setSelectedExercise] = useState(allExercises[0])
  const today = dayjs().format('YYYY-MM-DD')

  const data = []
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = dayjs(PLAN_START).add(i, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    if (dateStr > today) break

    const split = getGymSession(dateStr)
    const splitExercises = gymExercises[split] || []
    if (!splitExercises.includes(selectedExercise)) continue

    const sets = lsGet(`gym_${dateStr}_${selectedExercise}`, [])
    const weights = sets.map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0)
    if (weights.length === 0) continue

    data.push({ date: d.format('M/D'), weight: Math.max(...weights) })
  }

  const isEmpty = data.length === 0

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Exercise Progression</div>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            color: 'var(--text)',
            padding: '4px 8px',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
          }}
        >
          {Object.entries(gymExercises).map(([split, exercises]) => (
            <optgroup key={split} label={split}>
              {exercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
          No data logged for {selectedExercise} yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
            <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} />
            <YAxis tick={{ fill: '#666', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: 6 }}
              labelStyle={{ color: '#666', fontSize: 11 }}
              formatter={(val) => [`${val}kg`, 'Top weight']}
            />
            <Line type="monotone" dataKey="weight" stroke="#00E676" strokeWidth={2} dot={{ fill: '#00E676', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
