import { useState, useRef, useEffect } from 'react'
import './styles/global.css'
import { lsGet, lsSet } from './hooks/useLocalStorage'
import { useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import MissionBar from './components/MissionBar'
import TabNav from './components/TabNav'
import StudyTab from './components/tabs/StudyTab'
import DailyTab from './components/tabs/DailyTab'
import NutritionTab from './components/tabs/NutritionTab'
import ExerciseTab from './components/tabs/ExerciseTab'
import DashboardTab from './components/tabs/DashboardTab'

function SetupModal({ onComplete }) {
  const [goalWeight, setGoalWeight] = useState('90')
  const [cycleStart, setCycleStart] = useState('2026-07-01')

  const handleSave = () => {
    lsSet('goalWeight', parseFloat(goalWeight) || 90)
    lsSet('cycleStartDate', cycleStart)
    lsSet('setupDone', true)
    onComplete()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: 380, padding: 32, borderColor: 'var(--accent)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Mission Setup</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>Confirm your targets before the sprint begins.</p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Goal Weight (kg)
          </label>
          <input type="number" min="0" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', fontSize: 16, fontFamily: 'var(--font-mono)' }} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Cycle Start Date
          </label>
          <input type="date" value={cycleStart} onChange={(e) => setCycleStart(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-mono)', colorScheme: 'dark' }} />
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ width: '100%', padding: '12px 0', fontSize: 15, letterSpacing: '0.04em' }}>
          LAUNCH MISSION
        </button>
      </div>
    </div>
  )
}

const TAB_ORDER = ['study', 'daily', 'nutrition', 'exercise', 'dashboard']
const SWIPE_THRESHOLD = 60

// Keyed by user.sub — remounts fresh for each user so useState reads correct prefix
function AuthenticatedApp() {
  const [setupDone, setSetupDone] = useState(() => !!lsGet('setupDone', false))
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    return TAB_ORDER.includes(tab) ? tab : 'study'
  })
  const touchStart = useRef(null)

  useEffect(() => {
    if (window.location.search.includes('tab=')) {
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (!('serviceWorker' in navigator)) return
    const handleMessage = (event) => {
      if (event.data?.type === 'navigate' && TAB_ORDER.includes(event.data.tab)) {
        setActiveTab(event.data.tab)
      }
    }
    navigator.serviceWorker.addEventListener('message', handleMessage)
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage)
  }, [])

  const handleTouchStart = (e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return

    const idx = TAB_ORDER.indexOf(activeTab)
    if (dx < 0 && idx < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[idx + 1])
    if (dx > 0 && idx > 0) setActiveTab(TAB_ORDER[idx - 1])
  }

  return (
    <>
      {!setupDone && <SetupModal onComplete={() => setSetupDone(true)} />}
      <div className="app">
        <Header />
        <MissionBar />
        <div
          style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {activeTab === 'study'     && <StudyTab />}
          {activeTab === 'daily'     && <DailyTab />}
          {activeTab === 'nutrition' && <NutritionTab />}
          {activeTab === 'exercise'  && <ExerciseTab />}
          {activeTab === 'dashboard' && <DashboardTab />}
        </div>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: 13 }}>Loading...</div>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  // key={user.sub} forces a full remount when a different user logs in
  return <AuthenticatedApp key={user.sub} />
}
