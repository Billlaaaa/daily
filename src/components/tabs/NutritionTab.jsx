import { useState } from 'react'
import dayjs from 'dayjs'
import {
  nutritionItems, supplementItems,
  DAILY_PROTEIN_TARGET, DAILY_CARB_TARGET, DAILY_FAT_TARGET, DAILY_CALORIE_TARGET,
} from '../../data/nutritionItems'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import SwipeableRow from '../SwipeableRow'

function MacroLine({ label, value, target, color }) {
  const pct = Math.min(100, (value / target) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>
          {value}<span style={{ color: 'var(--muted)' }}>/{target}g</span>
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function NutritionTab() {
  const today = dayjs().format('YYYY-MM-DD')
  const nutKey = `nutrition_${today}`
  const supKey = `supplements_${today}`

  const [nutChecked, setNutChecked] = useState(() => lsGet(nutKey, {}))
  const [supChecked, setSupChecked] = useState(() => lsGet(supKey, {}))

  const toggleNut = (id) => {
    const next = { ...nutChecked, [id]: !nutChecked[id] }
    setNutChecked(next)
    lsSet(nutKey, next)
  }

  const toggleSup = (id) => {
    const next = { ...supChecked, [id]: !supChecked[id] }
    setSupChecked(next)
    lsSet(supKey, next)
  }

  const eaten = nutritionItems.filter(item => nutChecked[item.id])
  const totalProtein = eaten.reduce((sum, item) => sum + item.protein, 0)
  const totalCarbs = eaten.reduce((sum, item) => sum + item.carbs, 0)
  const totalFat = eaten.reduce((sum, item) => sum + item.fat, 0)
  const totalKcal = eaten.reduce((sum, item) => sum + item.kcal, 0)
  const kcalPct = Math.min(100, (totalKcal / DAILY_CALORIE_TARGET) * 100)

  const allNutDone = nutritionItems.every(i => nutChecked[i.id])
  const allSupDone = supplementItems.every(i => supChecked[i.id])

  const toggleAllNut = () => {
    const next = {}
    nutritionItems.forEach(i => { next[i.id] = !allNutDone })
    setNutChecked(next)
    lsSet(nutKey, next)
  }

  const toggleAllSup = () => {
    const next = {}
    supplementItems.forEach(i => { next[i.id] = !allSupDone })
    setSupChecked(next)
    lsSet(supKey, next)
  }

  return (
    <div className="tab-content">
      {/* Calorie + macro tracker */}
      <div className="card" style={{ borderLeft: '3px solid var(--accent)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 34, fontWeight: 700, color: 'var(--accent-2)' }}>
              {totalKcal}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--muted)' }}>
              / {DAILY_CALORIE_TARGET} kcal
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, color: kcalPct >= 100 ? 'var(--green)' : 'var(--muted)' }}>
            {Math.round(kcalPct)}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 8, marginBottom: 18 }}>
          <div
            className="progress-fill"
            style={{ width: `${kcalPct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
          />
        </div>

        <MacroLine label="Protein" value={totalProtein} target={DAILY_PROTEIN_TARGET} color="var(--amber)" />
        <MacroLine label="Carbs" value={totalCarbs} target={DAILY_CARB_TARGET} color="var(--sky)" />
        <MacroLine label="Fat" value={totalFat} target={DAILY_FAT_TARGET} color="var(--purple)" />
      </div>

      {/* Meals & Shakes */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title">Meals & Shakes</div>
          <input type="checkbox" className="checkbox" checked={allNutDone} onChange={toggleAllNut} title="Mark all done" style={{ marginBottom: 12 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nutritionItems.map((item) => {
            const done = !!nutChecked[item.id]
            return (
              <SwipeableRow key={item.id} done={done} onComplete={() => toggleNut(item.id)}>
                <div
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    borderLeft: '3px solid var(--amber)',
                    opacity: done ? 0.55 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', minWidth: 60, whiteSpace: 'nowrap' }}>
                    {item.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', fontWeight: 500 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--amber)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {item.kcal} kcal · {item.protein}p / {item.carbs}c / {item.fat}f
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={done}
                    onChange={() => toggleNut(item.id)}
                  />
                </div>
              </SwipeableRow>
            )
          })}
        </div>
      </div>

      {/* Supplements */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title">Supplements</div>
          <input type="checkbox" className="checkbox" checked={allSupDone} onChange={toggleAllSup} title="Mark all done" style={{ marginBottom: 12 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {supplementItems.map((item) => {
            const done = !!supChecked[item.id]
            return (
              <SwipeableRow key={item.id} done={done} onComplete={() => toggleSup(item.id)}>
                <div
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    borderLeft: '3px solid var(--purple)',
                    opacity: done ? 0.55 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', minWidth: 60, whiteSpace: 'nowrap' }}>
                    {item.time}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={done}
                    onChange={() => toggleSup(item.id)}
                  />
                </div>
              </SwipeableRow>
            )
          })}
        </div>
      </div>
    </div>
  )
}
