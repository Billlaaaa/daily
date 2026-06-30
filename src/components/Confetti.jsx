import { useEffect, useMemo } from 'react'

const COLORS = ['#FF4D00', '#FFB800', '#00E676', '#38BDF8', '#A855F7', '#FF3B6F']

export default function Confetti({ onDone }) {
  const pieces = useMemo(() => (
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.8 + Math.random() * 1.2,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    }))
  ), [])

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3000, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
