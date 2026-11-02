import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../lib/motion'

const paths = Array.from({ length: 9 }, (_, i) => {
  const y = 70 + i * 46
  return `M -40 ${y} C 280 ${y - 70 + i * 6}, 640 ${y + 90 - i * 8}, 1240 ${y - 30}`
})

/** Fine architectural lines that draw themselves once when the section arrives, then stay still. */
export function BackgroundLines() {
  const reduce = useReducedMotion()
  return (
    <svg className="bg-lines" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.7}
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 2.4, ease, delay: i * 0.12 }}
        />
      ))}
    </svg>
  )
}
