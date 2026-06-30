import { useState } from 'react'
import dayjs from 'dayjs'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50
const EXAM_DATE = '2026-08-20'
const STARTING_WEIGHT = 100

function linearRegression(points) {
  const n = points.length
  if (n < 2) return null
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

export default function WeightChart() {
  const today = dayjs().format('YYYY-MM-DD')
  const GOAL_WEIGHT = lsGet('goalWeight', 90)
  const [weightInput, setWeightInput] = useState(() => {
    const stored = lsGet(`weight_${today}`, null)
    return stored !== null ? String(stored) : ''
  })

  const saveWeight = (val) => {
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0) {
      lsSet(`weight_${today}`, num)
    }
  }

  // Build chart data
  const dataPoints = []
  const regressionPoints = []

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = dayjs(PLAN_START).add(i, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    const weight = lsGet(`weight_${dateStr}`, null)
    const entry = { day: i + 1, date: dateStr, label: d.format('M/D') }
    if (weight !== null) {
      entry.actual = weight
      regressionPoints.push({ x: i, y: weight })
    }
    entry.goal = GOAL_WEIGHT
    dataPoints.push(entry)
  }

  const reg = linearRegression(regressionPoints)
  if (reg) {
    dataPoints.forEach((d, i) => {
      d.trend = parseFloat((reg.intercept + reg.slope * i).toFixed(1))
    })
  }

  const currentWeight = regressionPoints.length > 0 ? regressionPoints[regressionPoints.length - 1].y : STARTING_WEIGHT
  const totalLost = STARTING_WEIGHT - currentWeight

  let projectedExam = null
  if (reg) {
    const examDay = dayjs(EXAM_DATE).diff(dayjs(PLAN_START), 'day')
    projectedExam = parseFloat((reg.intercept + reg.slope * examDay).toFixed(1))
  }

  const isEmpty = regressionPoints.length === 0

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Weight Tracker</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            onBlur={() => saveWeight(weightInput)}
            placeholder="kg"
            style={{ width: 80, textAlign: 'center', fontFamily: 'var(--font-mono)' }}
          />
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>today's weight</span>
        </div>
      </div>

      {isEmpty ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
          No weight data yet — log your first entry above
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dataPoints} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
            <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: '#666', fontSize: 10 }} interval={6} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: '#666', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: 6 }}
              labelStyle={{ color: '#666', fontSize: 11 }}
              itemStyle={{ fontSize: 12 }}
            />
            <Line type="monotone" dataKey="actual" stroke="#F5F5F5" strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
            <Line type="monotone" dataKey="goal" stroke="#00E676" strokeWidth={1} strokeDasharray="6 3" dot={false} name={`Goal (${GOAL_WEIGHT}kg)`} />
            {reg && <Line type="monotone" dataKey="trend" stroke="#FF8C00" strokeWidth={1.5} dot={false} name="Trend" opacity={0.7} />}
          </LineChart>
        </ResponsiveContainer>
      )}

      <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
        <Stat label="Starting" value={`${STARTING_WEIGHT}kg`} />
        <Stat label="Current" value={`${currentWeight.toFixed(1)}kg`} color="var(--text)" />
        <Stat label="Lost" value={`${totalLost.toFixed(1)}kg`} color={totalLost > 0 ? 'var(--green)' : 'var(--muted)'} />
        {projectedExam && <Stat label="Exam Day (proj.)" value={`${projectedExam}kg`} color="var(--amber)" />}
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: color || 'var(--muted)' }}>{value}</div>
    </div>
  )
}
