import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ease } from '../lib/motion'

/**
 * Large outlined wordmark. A cyan-to-silver stroke is revealed through a soft mask
 * that follows the pointer. On touch screens it rests as a quiet centred highlight.
 */
export function TextHover({ text }: { text: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  const mx = useSpring(useMotionValue(500), { stiffness: 180, damping: 26 })
  const my = useSpring(useMotionValue(100), { stiffness: 180, damping: 26 })
  const lit = useSpring(useMotionValue(canHover ? 0 : 0.7), { stiffness: 140, damping: 24 })

  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (reduce || event.pointerType !== 'mouse' || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    mx.set(((event.clientX - box.left) / box.width) * 1000)
    my.set(((event.clientY - box.top) / box.height) * 200)
    lit.set(1)
  }

  return (
    <motion.svg
      ref={ref}
      className="text-hover"
      viewBox="0 0 1000 200"
      aria-hidden="true"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease }}
      onPointerMove={move}
      onPointerLeave={() => canHover && lit.set(0)}
    >
      <defs>
        <linearGradient id="th-stroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
          <stop offset="0" stopColor="#7fb3c0" />
          <stop offset="0.5" stopColor="#eef2f3" />
          <stop offset="1" stopColor="#7fb3c0" />
        </linearGradient>
        <radialGradient id="th-fade">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="th-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="200">
          <motion.circle cx={mx} cy={my} r={260} fill="url(#th-fade)" />
        </mask>
      </defs>
      <text className="th-text th-base" x="500" y="160" textAnchor="middle">
        {text}
      </text>
      <motion.text
        className="th-text th-lit"
        x="500"
        y="160"
        textAnchor="middle"
        mask="url(#th-mask)"
        stroke="url(#th-stroke)"
        style={{ opacity: lit }}
      >
        {text}
      </motion.text>
    </motion.svg>
  )
}
