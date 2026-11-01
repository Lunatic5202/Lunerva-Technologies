import { useRef, type PointerEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { MagneticLink } from './MagneticLink'
import { SplitChars } from './SplitChars'
import { ease } from '../lib/motion'

const rise = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease, delay },
})

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Faint cyan light that follows a mouse pointer across the hero.
  const light = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', event.clientX - box.left + 'px')
    event.currentTarget.style.setProperty('--my', event.clientY - box.top + 'px')
  }

  return (
    <section className="hero" id="home" ref={ref} onPointerMove={light}>
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="hero-meta">
        <span>INDEPENDENT TECHNOLOGY STUDIO</span>
        <span>SELECTED WORK&nbsp; / &nbsp;01—03</span>
      </div>
      <div className="hero-stage">
        <motion.div className="hero-copy" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
          <motion.p className="hero-kicker" {...rise(0.1, reduce)}>
            <i /> BUILT WITH INTENTION
          </motion.p>
          <h1>
            <span className="sr-only">LUNEVRA Technologies</span>
            <SplitChars text="LUNEVRA" delay={0.25} step={0.06} />
            <span className="sub" aria-hidden="true">
              <SplitChars text="TECHNOLOGIES" delay={0.85} step={0.035} />
            </span>
          </h1>
          <motion.p className="hero-tagline" {...rise(1.1, reduce)}>
            Independent by design.
            <br />
            <em>Built to create.</em>
          </motion.p>
          <motion.div {...rise(1.3, reduce)}>
            <MagneticLink className="hero-cta" href="#work">
              Explore selected work <ArrowDown size={15} />
            </MagneticLink>
          </motion.div>
        </motion.div>
        <div className="hero-visual" aria-hidden="true">
          <motion.div className="hero-visual-inner" style={reduce ? undefined : { y: visualY }}>
            <div className="hero-coordinate coordinate-one">FIG. 01&nbsp; / &nbsp;LUNAR SIGNAL</div>
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-eclipse">
              <i />
            </div>
            <div className="hero-star">✳</div>
            <div className="hero-crosshair crosshair-h" />
            <div className="hero-crosshair crosshair-v" />
            <div className="hero-coordinate coordinate-two">INDEPENDENT&nbsp; / &nbsp;CREATIVE&nbsp; / &nbsp;TECHNOLOGY</div>
          </motion.div>
        </div>
      </div>
      <div className="hero-foot">
        <span>SOFTWARE&nbsp; · &nbsp;APPLICATIONS&nbsp; · &nbsp;INTERACTIVE WORLDS</span>
        <span>
          SCROLL TO DISCOVER <ArrowDown size={13} />
        </span>
      </div>
    </section>
  )
}
