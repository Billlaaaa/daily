import dayjs from 'dayjs'
import { lsGet } from '../../hooks/useLocalStorage'
import { getStudyBlocks } from '../../hooks/usePlanData'
import WeightChart from '../dashboard/WeightChart'
import StudyChart from '../dashboard/StudyChart'
import ExerciseChart from '../dashboard/ExerciseChart'
import ComplianceRings from '../dashboard/ComplianceRings'
import StreakTracker from '../dashboard/StreakTracker'
import TodaySummaryCard from '../dashboard/TodaySummaryCard'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50
const EXAM_DATE = '2026-08-20'
const BLOCK_HOURS = 50 / 60

export default function DashboardTab() {
  const today = dayjs().format('YYYY-MM-DD')
  const dayNum = Math.max(1, Math.min(TOTAL_DAYS, dayjs(today).diff(dayjs(PLAN_START), 'day') + 1))
  const daysRemaining = dayjs(EXAM_DATE).diff(today, 'day')
  const currentWeight = lsGet(`weight_${today}`, null)

  // Total study hours across all days
  const studyBlocks = getStudyBlocks()
  let totalHours = 0
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = dayjs(PLAN_START).add(i, 'day').format('YYYY-MM-DD')
    if (d > today) break
    const study = lsGet(`study_${d}`, {})
    totalHours += studyBlocks.filter(b => study[b.id]).length * BLOCK_HOURS
  }

  const metrics = [
    { label: 'Day', value: `${dayNum} of ${TOTAL_DAYS}`, color: 'var(--accent)' },
    { label: 'Days to Exam', value: `${daysRemaining}d`, color: '#FF3333' },
    { label: 'Weight Today', value: currentWeight !== null ? `${currentWeight}kg` : '—', color: 'var(--text)' },
    { label: 'Total Study', value: `${totalHours.toFixed(1)}h`, color: 'var(--amber)' },
  ]

  return (
    <div className="tab-content">
      <TodaySummaryCard />

      {/* Header stat strip — one flat panel, hairline-divided quadrants */}
      <div className="panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{
            textAlign: 'center',
            padding: '16px 8px',
            borderRight: i % 2 === 0 ? '1px solid var(--border-soft)' : 'none',
            borderBottom: i < 2 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <WeightChart />
      <StudyChart />
      <ExerciseChart />
      <ComplianceRings />
      <StreakTracker />
    </div>
  )
}
