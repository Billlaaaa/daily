import dayjs from 'dayjs'
import { lsGet } from '../../hooks/useLocalStorage'
import { getStudyBlocks, getDailyItems, getNutritionItems, getMacroTargets, getCalorieTarget } from '../../hooks/usePlanData'
import { getGymCompletion } from '../../hooks/useGymCycle'

const sessionColors = {
  Push:   '#FF4D00',
  Pull:   '#38BDF8',
  Cardio: '#FFB800',
  Legs:   '#00E676',
  Rest:   '#A855F7',
}

function MiniRing({ pct, label, color }) {
  const r = 30
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(100, pct) / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, minWidth: 70 }}>
      <svg width={72} height={72}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
        <circle
          cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        <text x={36} y={36} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={14} fontFamily="JetBrains Mono, monospace" fontWeight={700}>
          {Math.round(pct)}%
        </text>
      </svg>
      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center' }}>
        {label}
      </div>
    </div>
  )
}

export default function TodaySummaryCard() {
  const today = dayjs().format('YYYY-MM-DD')

  const studyBlocks = getStudyBlocks()
  const studyChecked = lsGet(`study_${today}`, {})
  const studyPct = studyBlocks.length > 0 ? (studyBlocks.filter(b => studyChecked[b.id]).length / studyBlocks.length) * 100 : 0

  const dailyItems = getDailyItems()
  const dailyChecked = lsGet(`daily_${today}`, {})
  const dailyPct = dailyItems.length > 0 ? (dailyItems.filter(i => dailyChecked[i.id]).length / dailyItems.length) * 100 : 0

  const nutritionItems = getNutritionItems()
  const nutChecked = lsGet(`nutrition_${today}`, {})
  const macroTargets = getMacroTargets()
  const kcalTarget = getCalorieTarget(macroTargets)
  const kcalEaten = nutritionItems.filter(i => nutChecked[i.id]).reduce((s, i) => s + i.kcal, 0)
  const nutPct = kcalTarget > 0 ? (kcalEaten / kcalTarget) * 100 : 0

  const { split, pct: gymPct } = getGymCompletion(today)

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Today at a Glance</div>
        <span style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11,
          color: sessionColors[split] || 'var(--text)',
          background: `${sessionColors[split]}1A`,
          border: `1px solid ${sessionColors[split]}44`,
          borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          {split}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8 }}>
        <MiniRing pct={studyPct} label="Study" color="var(--accent)" />
        <MiniRing pct={dailyPct} label="Daily" color="var(--muted)" />
        <MiniRing pct={nutPct} label="Nutrition" color="var(--amber)" />
        <MiniRing pct={gymPct} label="Gym" color="var(--green)" />
      </div>
    </div>
  )
}
