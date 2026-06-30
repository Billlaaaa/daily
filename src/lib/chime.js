let ctx = null

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  return ctx
}

export function playCompletionChime() {
  const audioCtx = getCtx()
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const startAt = audioCtx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0, startAt)
      gain.gain.linearRampToValueAtTime(0.18, startAt + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.5)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(startAt)
      osc.stop(startAt + 0.55)
    })
  }

  if (navigator.vibrate) {
    navigator.vibrate([120, 60, 120])
  }
}
