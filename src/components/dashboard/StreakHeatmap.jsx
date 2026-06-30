import dayjs from 'dayjs'
import { getDayCompletionFraction } from '../../hooks/useStreak'

function intensityColor(frac, isFuture) {
  if (isFuture) return 'var(--surface-2)'
  if (frac <= 0) return 'var(--surface-2)'
  if (frac < 0.34) return 'color-mix(in srgb, var(--green) 25%, var(--surface-2))'
  if (frac < 0.67) return 'color-mix(in srgb, var(--green) 55%, var(--surface-2))'
  if (frac < 1) return 'color-mix(in srgb, var(--green) 80%, var(--surface-2))'
  return 'var(--green)'
}

export default function StreakHeatmap({ planStartDate, totalDays, today }) {
  const todayStr = dayjs(today).format('YYYY-MM-DD')
  const start = dayjs(planStartDate)

  const days = []
  for (let i = 0; i < totalDays; i++) {
    const d = start.add(i, 'day')
    days.push({
      date: d.format('YYYY-MM-DD'),
      isFuture: d.format('YYYY-MM-DD') > todayStr,
    })
  }

  // Pad the front so the first column starts on the correct weekday (Mon=0)
  const leadingEmpty = (start.day() + 6) % 7
  const cells = [...Array(leadingEmpty).fill(null), ...days]
  const columns = []
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7))
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Sprint Heatmap
      </div>
      <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
        {columns.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {col.map((day, ri) => {
              if (!day) return <div key={ri} style={{ width: 12, height: 12 }} />
              const frac = day.isFuture ? 0 : getDayCompletionFraction(day.date)
              return (
                <div
                  key={ri}
                  title={`${day.date} — ${day.isFuture ? 'upcoming' : `${Math.round(frac * 100)}%`}`}
                  style={{
                    width: 12, height: 12, borderRadius: 3,
                    background: intensityColor(frac, day.isFuture),
                    outline: day.date === todayStr ? '1px solid var(--accent)' : 'none',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
