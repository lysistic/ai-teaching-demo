import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../lib/cn'

type Props = {
  code: string
  speedMs?: number
  startDelayMs?: number
  className?: string
  onDone?: () => void
  enabled?: boolean
}

export function TypewriterCode({
  code,
  speedMs = 6,
  startDelayMs = 120,
  className,
  onDone,
  enabled = true,
}: Props) {
  const [visible, setVisible] = useState('')
  const stable = useMemo(() => code ?? '', [code])
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
        if (i < stable.length) window.setTimeout(tick, speedMs)
        else onDoneRef.current?.()
      }
      tick()
    }, startDelayMs)

    return () => {
      cancelled = true
      window.clearTimeout(start)
    }
  }, [stable, speedMs, startDelayMs, enabled])

  return (
    <pre
      className={cn(
        'whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-white/82',
        className
      )}
    >
      {visible}
      <span className="inline-block w-[0.65ch] animate-pulse align-baseline text-white/55">▍</span>
    </pre>
  )
}

