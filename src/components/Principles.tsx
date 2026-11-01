import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from './Reveal'
import { SectionLabel } from './ScrambleText'
import { ease } from '../lib/motion'

const principles = [
  ['Purposeful technology.', 'Make tools and experiences for a reason. Let usefulness and feeling sit side by side.'],
  ['Intentional design.', 'Give every interaction, detail and decision the care it deserves.'],
  ['Creative freedom.', 'Independence makes space to explore ideas on their own terms.'],
]

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 721px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 721px)')
    const onChange = () => setWide(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return wide
}

/** Sticky-scroll layout: the title and counter stay put while each principle takes focus in turn. */
export function Principles() {
  const [active, setActive] = useState(0)
  const wide = useWide()

  return (
    <section className="principles section-wrap" id="about">
      <div className="principle-title">
        <Reveal>
          <SectionLabel text="04 / A STUDIO, BY DESIGN" />
          <h2>
            Independent
            <br />
            <em>by nature.</em>
          </h2>
          <p>
            LUNEVRA is an independent, founder-led technology studio creating software products, digital applications and
            interactive entertainment.
          </p>
        </Reveal>
        <div className="principle-counter" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease }}
            >
              0{active + 1}
            </motion.span>
          </AnimatePresence>
          <small>/ 0{principles.length}</small>
        </div>
      </div>
      <div className="principle-list">
        {principles.map(([title, body], i) => (
          <motion.div
            className="principle-item"
            key={title}
            animate={{ opacity: wide && active !== i ? 0.28 : 1 }}
            transition={{ duration: 0.5, ease }}
            onViewportEnter={() => setActive(i)}
            viewport={{ margin: '-42% 0px -42% 0px' }}
          >
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
