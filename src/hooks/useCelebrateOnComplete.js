import { useEffect, useRef, useState } from 'react'

export function useCelebrateOnComplete(isDone) {
  const [show, setShow] = useState(false)
  const prevRef = useRef(isDone)

  useEffect(() => {
    if (isDone && !prevRef.current) {
      setShow(true)
    }
    prevRef.current = isDone
  }, [isDone])

  return [show, () => setShow(false)]
}
