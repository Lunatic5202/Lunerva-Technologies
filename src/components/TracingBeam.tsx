import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/** A hairline rail down the left edge with a beam that fills as the content scrolls past. */
export function TracingBeam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 62%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const headTop = useTransform(progress, v => v * 100 + '%')

  return (
    <div ref={ref} className={'tracing ' + (className ?? '')}>
      <div className="beam-rail" aria-hidden="true">
        <span className="beam-track" />
        {!reduce && (
          <>
            <motion.span className="beam-fill" style={{ scaleY: progress }} />
            <motion.span className="beam-head" style={{ top: headTop }} />
          </>
        )}
      </div>
      {children}
    </div>
  )
}
