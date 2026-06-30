import { useState, useEffect, useRef, useCallback } from 'react'
import { lsGet, lsSet, lsDel } from '../../hooks/useLocalStorage'
import { BLOCK_DURATION_MS } from '../../data/studyBlocks'

const RADIUS = 120
const CX = 140
const CY = 140
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function FullScreenTimer({ block, onComplete, onExit }) {
  const [isPaused, setIsPaused] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [remaining, setRemaining] = useState(BLOCK_DURATION_MS)
  const intervalRef = useRef(null)
  // Use a ref for onComplete so tick never needs it in its deps
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  // Initialize from localStorage (survives refresh)
  useEffect(() => {
    const stored = lsGet('activeTimer', null)
    if (stored && stored.blockId === block.id) {
      if (stored.pausedAt) {
        setRemaining(Math.max(0, BLOCK_DURATION_MS - stored.elapsed))
        setIsPaused(true)
      } else {
        const elapsed = stored.elapsed + (Date.now() - stored.startedAt)
        setRemaining(Math.max(0, BLOCK_DURATION_MS - elapsed))
      }
    } else {
      lsSet('activeTimer', { blockId: block.id, startedAt: Date.now(), pausedAt: null, elapsed: 0 })
      setRemaining(BLOCK_DURATION_MS)
    }
  }, [block.id])

  // Stable tick — only depends on block.id, reads onComplete via ref
  const tick = useCallback(() => {
    const stored = lsGet('activeTimer', null)
    if (!stored || stored.pausedAt) return
    const elapsed = stored.elapsed + (Date.now() - stored.startedAt)
    const rem = BLOCK_DURATION_MS - elapsed
    if (rem <= 0) {
      setRemaining(0)
      clearInterval(intervalRef.current)
      lsDel('activeTimer')
      setTimeout(() => onCompleteRef.current(block.id), 300)
    } else {
      setRemaining(rem)
    }
  }, [block.id])

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(tick, 250)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPaused, tick])

  const handlePause = () => {
    clearInterval(intervalRef.current)
    const stored = lsGet('activeTimer', null)
    if (stored) {
      lsSet('activeTimer', { ...stored, pausedAt: Date.now(), elapsed: stored.elapsed + (Date.now() - stored.startedAt) })
    }
    setIsPaused(true)
  }

  const handleResume = () => {
    const stored = lsGet('activeTimer', null)
    if (stored) {
      lsSet('activeTimer', { ...stored, startedAt: Date.now(), pausedAt: null })
    }
    setIsPaused(false)
    setShowControls(false)
  }

  const handleEnd = () => {
    clearInterval(intervalRef.current)
    lsDel('activeTimer')
    onExit()
  }

  const totalSecs = Math.ceil(remaining / 1000)
  const minutes = Math.floor(totalSecs / 60)
  const seconds = totalSecs % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progress = remaining / BLOCK_DURATION_MS
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !isPaused && setShowControls(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#000000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* SVG: only circles are rotated, text stays upright */}
      <svg width={CX * 2} height={CY * 2}>
        {/* Track */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#1A1A1A" strokeWidth={8} />
        {/* Progress arc — rotated so it starts at 12 o'clock */}
        <circle
          cx={CX} cy={CY} r={RADIUS}
          fill="none" stroke="white" strokeWidth={8}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: 'stroke-dashoffset 0.25s linear' }}
        />
        {/* Countdown text — naturally upright, no rotation needed */}
        <text
          x={CX} y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={54}
          fontFamily="JetBrains Mono, monospace"
          fontWeight={700}
          letterSpacing="2"
        >
          {timeStr}
        </text>
      </svg>

      {/* Block label */}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {block.label} · 50 min
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 48,
        display: 'flex', gap: 16, alignItems: 'center',
        opacity: showControls || isPaused ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        {isPaused ? (
          <>
            <button onClick={handleResume} style={{ padding: '10px 28px', background: 'var(--accent)', color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, borderRadius: 6, cursor: 'pointer' }}>
              Resume
            </button>
            <button onClick={handleEnd} style={{ padding: '10px 28px', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer' }}>
              End Session
            </button>
          </>
        ) : (
          <button onClick={handlePause} style={{ padding: '10px 28px', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            ⏸ Pause
          </button>
        )}
      </div>
    </div>
  )
}
