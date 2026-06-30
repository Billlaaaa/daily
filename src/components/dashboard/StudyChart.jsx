import dayjs from 'dayjs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { lsGet } from '../../hooks/useLocalStorage'
import { studyBlocks } from '../../data/studyBlocks'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50
const BLOCK_HOURS = 50 / 60

export default function StudyChart() {
  const today = dayjs().format('YYYY-MM-DD')
  const data = []
  let totalHours = 0
  let bestDay = 0
  let currentStreak = 0
  let tempStreak = 0

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = dayjs(PLAN_START).add(i, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    if (dateStr > today) break

    const study = lsGet(`study_${dateStr}`, {})
    const completed = studyBlocks.filter(b => study[b.id]).length
    const hours = parseFloat((completed * BLOCK_HOURS).toFixed(2))

    totalHours += hours
    if (hours > bestDay) bestDay = hours

    if (completed === 12) {
      tempStreak++
    } else {
      tempStreak = 0
    }

    data.push({ day: i + 1, hours, label: d.format('M/D') })
  }

  const daysRecorded = data.length
  const avgHours = daysRecorded > 0 ? (totalHours / daysRecorded).toFixed(1) : '0.0'

  // Current streak (consecutive full days going backwards)
  for (let i = data.length - 1; i >= 0; i--) {
    const d = dayjs(PLAN_START).add(i, 'day').format('YYYY-MM-DD')
    const study = lsGet(`study_${d}`, {})
    if (studyBlocks.every(b => study[b.id])) currentStreak++
    else break
  }

  const isEmpty = data.every(d => d.hours === 0)

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="section-title">Study Hours</div>

      {isEmpty ? (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
          No study data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#666', fontSize: 9 }} interval={6} />
            <YAxis domain={[0, 10]} tick={{ fill: '#666', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #1E1E1E', borderRadius: 6 }}
              labelStyle={{ color: '#666', fontSize: 11 }}
              formatter={(val) => [`${val.toFixed(1)}h`, 'Hours']}
            />
            <Bar dataKey="hours" fill="#FF4D00" radius={[3, 3, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div style={{ display: 'flex', gap: 28, marginTop: 12, flexWrap: 'wrap' }}>
        <Stat label="Avg/day" value={`${avgHours}h`} />
        <Stat label="Best day" value={`${bestDay.toFixed(1)}h`} color="var(--amber)" />
        <Stat label="Full-day streak" value={`${currentStreak}d`} color="var(--green)" />
        <Stat label="Total" value={`${totalHours.toFixed(1)}h`} color="var(--accent)" />
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
