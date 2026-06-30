import { useEffect, useState } from 'react'

export default function OfflineBadge() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--muted)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-full)',
      padding: '4px 9px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3333', flexShrink: 0 }} />
      Offline
    </span>
  )
}
