import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../lib/motion'

type Props = { text: string; delay?: number; step?: number }

/** Rises each character out of a mask. Parent should expose the full text to assistive tech. */
export function SplitChars({ text, delay = 0, step = 0.05 }: Props) {
  const reduce = useReducedMotion()
  return (
    <span className="split-line" aria-hidden="true">
      {[...text].map((char, i) => (
        <span className="char-mask" key={i}>
          <motion.i
            className="char"
            initial={reduce ? false : { y: '115%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.95, ease, delay: delay + i * step }}
          >
            {char}
          </motion.i>
        </span>
      ))}
    </span>
  )
}
