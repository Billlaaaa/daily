import { useState } from 'react'
import dayjs from 'dayjs'
import { useClock } from '../hooks/useClock'
import { useGymCycle } from '../hooks/useGymCycle'
import { useAuth } from '../context/AuthContext'
import NotificationToggle from './NotificationToggle'

const EXAM_DATE = '2026-08-20'
const PLAN_START_DATE = '2026-07-01'
const TOTAL_PLAN_DAYS = 50

const sessionColors = {
  Push:   '#FF4D00',
  Pull:   '#38BDF8',
  Cardio: '#FFB800',
  Legs:   '#00E676',
  Rest:   '#A855F7',
}

function UserBadge() {
  const { user, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  if (!user) return null

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setShowMenu(m => !m)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 20, background: 'var(--border)', cursor: 'pointer' }}
      >
        {user.picture
          ? <img src={user.picture} alt="" style={{ width: 26, height: 26, borderRadius: '50%' }} referrerPolicy="no-referrer" />
          : <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{user.name?.[0]}</div>
        }
        <span style={{ fontSize: 12, color: 'var(--text)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
      </button>

      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '6px 10px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>{user.email}</div>
            <button
              onClick={() => { setShowMenu(false); signOut() }}
              style={{ width: '100%', padding: '8px 10px', textAlign: 'left', color: '#FF4444', fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 600, borderRadius: 4, cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const now = useClock()
  const todayStr = now.format('YYYY-MM-DD')
  const session = useGymCycle(todayStr)

  const dayNum = Math.max(1, Math.min(TOTAL_PLAN_DAYS, dayjs(todayStr).diff(dayjs(PLAN_START_DATE), 'day') + 1))
  const daysRemaining = dayjs(EXAM_DATE).diff(now, 'day')

  return (
    <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 14px' }}>
      {/* Row 1: app name + user */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          MISSION CONTROL
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NotificationToggle />
          <UserBadge />
        </div>
      </div>

      {/* Row 2: day, clock, exam countdown, gym badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
          Day {dayNum}/{TOTAL_PLAN_DAYS}
        </span>

        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16, color: 'var(--text)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          {now.format('HH:mm:ss')}
        </span>

        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 12, color: '#FF3333', whiteSpace: 'nowrap' }}>
          {daysRemaining}d to exam
        </span>

        <span style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11,
          color: sessionColors[session] || 'var(--text)',
          background: `${sessionColors[session]}1A`,
          border: `1px solid ${sessionColors[session]}44`,
          borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          {session}
        </span>
      </div>
    </div>
  )
}
