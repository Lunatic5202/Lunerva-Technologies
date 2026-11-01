import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

type Props = { href: string; className?: string; strength?: number; external?: boolean; children: ReactNode }

/** Anchor that drifts slightly toward a mouse pointer. Disabled for touch and reduced motion. */
export function MagneticLink({ strength = 0.28, external, children, ...rest }: Props) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 220, damping: 18, mass: 0.4 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (box.left + box.width / 2)) * strength)
    y.set((event.clientY - (box.top + box.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      {...rest}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.a>
  )
}
