import { useRef, useState } from 'react'
import { lsGet, lsSet } from '../../hooks/useLocalStorage'
import { DEFAULTS, getStudyBlocks, getDailyItems, getNutritionItems, getSupplementItems, getMacroTargets, savePlanData, resetPlanData } from '../../hooks/usePlanData'
import { downloadBackup, importUserData } from '../../lib/backup'
import { categoryColors } from '../../data/dailyItems'
import ListEditor from './ListEditor'

const TABS = ['Backup', 'Plan', 'Targets']

function SectionHeading({ children, onReset }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 22 }}>
      <div className="section-title" style={{ marginBottom: 0 }}>{children}</div>
      {onReset && (
        <button onClick={onReset} style={{ fontSize: 11, color: 'var(--muted)', background: 'transparent', textDecoration: 'underline', cursor: 'pointer' }}>
          Reset to default
        </button>
      )}
    </div>
  )
}

export default function SettingsModal({ onClose }) {
  const [tab, setTab] = useState('Backup')
  const [importMsg, setImportMsg] = useState('')
  const fileInputRef = useRef(null)

  const [studyBlocks, setStudyBlocks] = useState(getStudyBlocks)
  const [dailyItems, setDailyItems] = useState(getDailyItems)
  const [nutritionItems, setNutritionItems] = useState(getNutritionItems)
  const [supplementItems, setSupplementItems] = useState(getSupplementItems)
  const [macroTargets, setMacroTargets] = useState(getMacroTargets)
  const [goalWeight, setGoalWeight] = useState(() => String(lsGet('goalWeight', 90)))

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importUserData(JSON.parse(text))
      setImportMsg('Backup restored — reloading…')
      setTimeout(() => window.location.reload(), 900)
    } catch (err) {
      setImportMsg(`Import failed: ${err.message}`)
    }
    e.target.value = ''
  }

  const saveAndReload = () => {
    savePlanData('studyBlocks', studyBlocks)
    savePlanData('dailyItems', dailyItems)
    savePlanData('nutritionItems', nutritionItems)
    savePlanData('supplementItems', supplementItems)
    savePlanData('macroTargets', { protein: Number(macroTargets.protein), carbs: Number(macroTargets.carbs), fat: Number(macroTargets.fat) })
    lsSet('goalWeight', parseFloat(goalWeight) || 90)
    window.location.reload()
  }

  const resetAllDefaults = () => {
    resetPlanData('studyBlocks')
    resetPlanData('dailyItems')
    resetPlanData('nutritionItems')
    resetPlanData('supplementItems')
    resetPlanData('macroTargets')
    setStudyBlocks(DEFAULTS.studyBlocks)
    setDailyItems(DEFAULTS.dailyItems)
    setNutritionItems(DEFAULTS.nutritionItems)
    setSupplementItems(DEFAULTS.supplementItems)
    setMacroTargets(DEFAULTS.macroTargets)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 600, maxHeight: '88vh', overflowY: 'auto', borderRadius: '20px 20px 0 0', padding: '20px 18px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 16, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 18, borderBottom: '1px solid var(--border)' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 14px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13,
                color: tab === t ? 'var(--accent)' : 'var(--muted)',
                borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Backup' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              Your data lives only in this browser. Export a backup before clearing site data or switching devices.
            </p>
            <button className="btn-primary" onClick={downloadBackup} style={{ width: '100%', padding: '12px 0', fontSize: 14, marginBottom: 12 }}>
              Export backup (.json)
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: 'none' }} />
            <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '12px 0', fontSize: 14 }}>
              Import backup…
            </button>
            {importMsg && <p style={{ fontSize: 12, color: importMsg.startsWith('Import failed') ? '#FF4444' : 'var(--green)', marginTop: 10 }}>{importMsg}</p>}
          </div>
        )}

        {tab === 'Plan' && (
          <div>
            <SectionHeading onReset={() => { resetPlanData('studyBlocks'); setStudyBlocks(DEFAULTS.studyBlocks) }}>Study Blocks</SectionHeading>
            <ListEditor
              items={studyBlocks}
              onChange={setStudyBlocks}
              idPrefix="block"
              makeDefaults={() => ({ time: '7:00 AM', label: `Block ${studyBlocks.length + 1}` })}
              fields={[
                { key: 'time', label: 'Time', width: 90 },
                { key: 'label', label: 'Label', width: 180 },
              ]}
            />

            <SectionHeading onReset={() => { resetPlanData('dailyItems'); setDailyItems(DEFAULTS.dailyItems) }}>Daily Routine</SectionHeading>
            <ListEditor
              items={dailyItems}
              onChange={setDailyItems}
              idPrefix="daily"
              makeDefaults={() => ({ time: '7:00 AM', label: 'New item', category: 'daily' })}
              fields={[
                { key: 'time', label: 'Time', width: 90 },
                { key: 'label', label: 'Label', width: 160 },
                { key: 'category', label: 'Category', type: 'select', width: 100, options: Object.keys(categoryColors) },
              ]}
            />

            <SectionHeading onReset={() => { resetPlanData('nutritionItems'); setNutritionItems(DEFAULTS.nutritionItems) }}>Meals & Shakes</SectionHeading>
            <ListEditor
              items={nutritionItems}
              onChange={setNutritionItems}
              idPrefix="meal"
              makeDefaults={() => ({ time: '12:00 PM', label: 'New meal', protein: 0, carbs: 0, fat: 0, kcal: 0 })}
              fields={[
                { key: 'time', label: 'Time', width: 85 },
                { key: 'label', label: 'Label', width: 150 },
                { key: 'protein', label: 'Protein g', type: 'number', width: 70 },
                { key: 'carbs', label: 'Carbs g', type: 'number', width: 70 },
                { key: 'fat', label: 'Fat g', type: 'number', width: 60 },
                { key: 'kcal', label: 'Kcal', type: 'number', width: 65 },
              ]}
            />

            <SectionHeading onReset={() => { resetPlanData('supplementItems'); setSupplementItems(DEFAULTS.supplementItems) }}>Supplements</SectionHeading>
            <ListEditor
              items={supplementItems}
              onChange={setSupplementItems}
              idPrefix="supp"
              makeDefaults={() => ({ time: '12:00 PM', label: 'New supplement' })}
              fields={[
                { key: 'time', label: 'Time', width: 90 },
                { key: 'label', label: 'Label', width: 200 },
              ]}
            />
          </div>
        )}

        {tab === 'Targets' && (
          <div>
            <SectionHeading>Macro Targets (daily)</SectionHeading>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: 90 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Protein (g)</div>
                <input type="number" value={macroTargets.protein} onChange={(e) => setMacroTargets({ ...macroTargets, protein: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font-mono)' }} />
              </label>
              <label style={{ flex: 1, minWidth: 90 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Carbs (g)</div>
                <input type="number" value={macroTargets.carbs} onChange={(e) => setMacroTargets({ ...macroTargets, carbs: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font-mono)' }} />
              </label>
              <label style={{ flex: 1, minWidth: 90 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Fat (g)</div>
                <input type="number" value={macroTargets.fat} onChange={(e) => setMacroTargets({ ...macroTargets, fat: e.target.value })} style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font-mono)' }} />
              </label>
            </div>

            <SectionHeading>Body</SectionHeading>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Goal weight (kg)</div>
                <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} style={{ width: '100%', padding: '8px 10px', fontFamily: 'var(--font-mono)' }} />
              </label>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
              Gym split follows the day of the week — Mon Push · Tue Pull · Wed Cardio · Thu Push · Fri Pull · Sat Legs · Sun Rest.
            </p>
          </div>
        )}

        {tab !== 'Backup' && (
          <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
            <button className="btn-secondary" onClick={resetAllDefaults} style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>
              Reset all
            </button>
            <button className="btn-primary" onClick={saveAndReload} style={{ flex: 1, padding: '12px 0', fontSize: 14 }}>
              Save & reload
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
