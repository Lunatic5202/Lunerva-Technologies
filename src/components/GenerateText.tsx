import { Fragment } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../lib/motion'

type Line = { text: string; em?: boolean }

/** Words resolve out of a soft blur one after another, like text being generated. */
export function GenerateText({ lines, delay = 0, step = 0.09 }: { lines: Line[]; delay?: number; step?: number }) {
  const reduce = useReducedMotion()
  let index = 0
  return (
    <>
      {lines.map((line, li) => {
        const words = line.text.split(' ')
        const spans = words.map((word, wi) => {
          const i = index++
          return (
            <Fragment key={wi}>
              <motion.span
                style={{ display: 'inline-block' }}
                initial={reduce ? false : { opacity: 0, filter: 'blur(6px)', y: 8 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.7, ease, delay: delay + i * step }}
              >
                {word}
              </motion.span>
              {wi < words.length - 1 ? ' ' : null}
            </Fragment>
          )
        })
        return (
          <Fragment key={li}>
            {line.em ? <em>{spans}</em> : spans}
            {li < lines.length - 1 ? <br /> : null}
          </Fragment>
        )
      })}
    </>
  )
}
