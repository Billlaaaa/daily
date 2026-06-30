import dayjs from 'dayjs'
import { lsGet } from '../../hooks/useLocalStorage'
import { getNutritionItems, getSupplementItems } from '../../hooks/usePlanData'

const PLAN_START = '2026-07-01'
const TOTAL_DAYS = 50

const R = 54
const CIRCUMFERENCE = 2 * Math.PI * R

function Ring({ pct, label, color }) {
  const offset = CIRCUMFERENCE * (1 - pct / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg width={130} height={130}>
        <circle cx={65} cy={65} r={R} fill="none" stroke="#1E1E1E" strokeWidth={10} />
        <circle
          cx={65} cy={65} r={R}
          fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
        />
        <text x={65} y={60} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={24} fontFamily="JetBrains Mono, monospace" fontWeight={700} dy={6}>
          {Math.round(pct)}%
        </text>
      </svg>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

export default function ComplianceRings() {
  const today = dayjs().format('YYYY-MM-DD')
  const nutritionItems = getNutritionItems()
  const supplementItems = getSupplementItems()
  let nutFullDays = 0
  let supFullDays = 0
  let totalDays = 0

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = dayjs(PLAN_START).add(i, 'day').format('YYYY-MM-DD')
    if (d > today) break
    totalDays++

    const nut = lsGet(`nutrition_${d}`, {})
    if (nutritionItems.every(item => nut[item.id])) nutFullDays++

    const sup = lsGet(`supplements_${d}`, {})
    if (supplementItems.every(item => sup[item.id])) supFullDays++
  }

  const nutPct = totalDays > 0 ? (nutFullDays / totalDays) * 100 : 0
  const supPct = totalDays > 0 ? (supFullDays / totalDays) * 100 : 0

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="section-title">Nutrition Compliance</div>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
        <Ring pct={nutPct} label="Meals" color="var(--amber)" />
        <Ring pct={supPct} label="Supplements" color="var(--purple)" />
      </div>
    </div>
  )
}
