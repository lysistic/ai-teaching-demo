import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  text: string
  speedMs?: number
  startDelayMs?: number
  className?: string
  onDone?: () => void
  enabled?: boolean
}

export function TypewriterText({
  text,
  speedMs = 16,
  startDelayMs = 200,
  className,
  onDone,
  enabled = true,
}: Props) {
  const [visible, setVisible] = useState('')

  const stable = useMemo(() => text ?? '', [text])
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setVisible('')

    const start = window.setTimeout(() => {
      let i = 0
      const tick = () => {
        if (cancelled) return
        i++
        setVisible(stable.slice(0, i))
        if (i < stable.length) {
          window.setTimeout(tick, speedMs)
        } else {
          onDoneRef.current?.()
        }
      }
      tick()
    }, startDelayMs)

    return () => {
      cancelled = true
      window.clearTimeout(start)
    }
  }, [stable, speedMs, startDelayMs, enabled])

  return (
    <span className={className}>
      {visible}
      <span className="inline-block w-[0.65ch] animate-pulse align-baseline text-white/55">▍</span>
    </span>
  )
}

