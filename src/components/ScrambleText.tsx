import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** Resolves a monospace label out of random glyphs once it scrolls into view. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!inView || reduce) return
    const start = performance.now()
    const duration = 900
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const resolved = Math.floor(t * text.length)
      setShown(
        [...text].map((c, i) => (c === ' ' || c === '/' || i < resolved ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''),
      )
      if (t < 1) frame = requestAnimationFrame(tick)
      else setShown(text)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, text])

  return (
    <span ref={ref} className={className} style={{ opacity: inView || reduce ? 1 : 0 }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}

export function SectionLabel({ text }: { text: string }) {
  return <ScrambleText className="section-number" text={text} />
}
