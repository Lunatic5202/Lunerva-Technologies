import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../lib/motion'

const tags = { div: motion.div, h2: motion.h2, p: motion.p, article: motion.article }

type Props = { as?: keyof typeof tags; delay?: number; className?: string; children: ReactNode }

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, className, children }: Props) {
  const Tag = tags[as] as unknown as typeof motion.div
  const reduce = useReducedMotion()
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.85, ease, delay }}
    >
      {children}
    </Tag>
  )
}
