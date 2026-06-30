import { useRef, useState } from 'react'

const THRESHOLD = 64
const MAX_DRAG = 96

export default function SwipeableRow({ children, done, onComplete }) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)

  const handleTouchStart = (e) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchMove = (e) => {
    if (!start.current) return
    const t = e.touches[0]
    const dx = t.clientX - start.current.x
    const dy = t.clientY - start.current.y

    // Ignore mostly-vertical gestures so the list can still scroll
    if (Math.abs(dy) > Math.abs(dx)) return

    // Only allow the direction that's a valid action for current state:
    // not done -> swipe right to complete; done -> swipe left to undo
    const allowed = done ? Math.min(0, dx) : Math.max(0, dx)
    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, allowed))
    setDragging(true)
    setDragX(clamped)
  }

  const handleTouchEnd = () => {
    if (Math.abs(dragX) >= THRESHOLD) onComplete()
    setDragging(false)
    setDragX(0)
    start.current = null
  }

  const revealRight = dragX > 0
  const revealOpacity = Math.min(1, Math.abs(dragX) / THRESHOLD)

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: revealRight ? 'flex-start' : 'flex-end',
          padding: '0 22px',
          background: revealRight ? 'var(--green)' : 'var(--surface-2)',
          opacity: revealOpacity,
        }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: revealRight ? '#08200F' : 'var(--muted)', letterSpacing: '0.04em' }}>
          {revealRight ? 'DONE' : 'UNDO'}
        </span>
      </div>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 0.25s ease',
        }}
      >
        {children}
      </div>
    </div>
  )
}
