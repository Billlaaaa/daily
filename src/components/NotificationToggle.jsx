import { useEffect, useState } from 'react'
import { requestNotificationPermission, getNotificationStatus, scheduleTodayNotifications, clearScheduledNotifications } from '../lib/notifications'

export default function NotificationToggle() {
  const [status, setStatus] = useState(() => getNotificationStatus())

  useEffect(() => {
    if (status !== 'granted') return
    scheduleTodayNotifications()
    const interval = setInterval(scheduleTodayNotifications, 60 * 60 * 1000)
    return () => {
      clearInterval(interval)
      clearScheduledNotifications()
    }
  }, [status])

  if (status === 'unsupported') return null

  const granted = status === 'granted'
  const denied = status === 'denied'

  const handleClick = async () => {
    if (granted || denied) return
    const result = await requestNotificationPermission()
    setStatus(result)
  }

  return (
    <button
      onClick={handleClick}
      title={denied ? 'Notifications blocked — enable in browser settings' : granted ? 'Reminders on' : 'Enable reminders'}
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        background: granted ? 'var(--accent-soft)' : 'var(--surface-2)',
        border: `1px solid ${granted ? 'var(--accent)' : 'var(--border)'}`,
        color: granted ? 'var(--accent)' : 'var(--muted)',
        opacity: denied ? 0.5 : 1,
        cursor: denied ? 'default' : 'pointer',
        flexShrink: 0,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={granted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>
  )
}
