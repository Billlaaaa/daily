import { useClock } from '../hooks/useClock'

const DAY_START_H = 6       // 6:00 AM
const DAY_START_M = 0
const DAY_END_H = 23        // 11:30 PM
const DAY_END_M = 30

export default function MissionBar() {
  const now = useClock()

  const totalMinutes = (DAY_END_H * 60 + DAY_END_M) - (DAY_START_H * 60 + DAY_START_M) // 1050
  const elapsedMinutes = (now.hour() * 60 + now.minute()) - (DAY_START_H * 60 + DAY_START_M)
  const pct = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100))

  return (
    <div style={{ height: 3, background: 'var(--border)', position: 'relative' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'var(--accent)',
        transition: 'width 1s linear',
        boxShadow: '0 0 6px var(--accent)',
      }} />
    </div>
  )
}
