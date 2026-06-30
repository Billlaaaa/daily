import dayjs from 'dayjs'
import { useStreak } from '../../hooks/useStreak'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50

export default function StreakTracker() {
  const today = dayjs().format('YYYY-MM-DD')
  const { currentStreak, longestStreak } = useStreak(PLAN_START, TOTAL_DAYS, today)

  return (
    <div className="card">
      <div className="section-title">Streak Tracker</div>
      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
            {currentStreak}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Current streak</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>
            {longestStreak}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Longest streak</div>
        </div>
      </div>
    </div>
  )
}
