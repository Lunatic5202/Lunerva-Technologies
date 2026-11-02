import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { GenerateText } from './GenerateText'
import { MagneticLink } from './MagneticLink'
import { SplitChars } from './SplitChars'
import { ease } from '../lib/motion'

const rise = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease, delay },
})

const soft = { stiffness: 110, damping: 20, mass: 0.5 }

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Pointer state lives in motion values so moving the mouse never re-renders React.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, soft)
  const sy = useSpring(py, soft)
  const farX = useTransform(sx, [0, 1], [10, -10])
  const farY = useTransform(sy, [0, 1], [8, -8])
  const nearX = useTransform(sx, [0, 1], [24, -24])
  const nearY = useTransform(sy, [0, 1], [18, -18])
  const tagX = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const tagY = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const tagOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 })
  const xText = useTransform(sx, v => v.toFixed(2))
  const yText = useTransform(sy, v => v.toFixed(2))

  const track = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    event.currentTarget.style.setProperty('--mx', x + 'px')
    event.currentTarget.style.setProperty('--my', y + 'px')
    px.set(x / box.width)
    py.set(y / box.height)
    // Flip to the left of the pointer near the right edge so the tag is never clipped.
    tagX.set(x > box.width - 170 ? x - 136 : x + 16)
    tagY.set(y + 16)
    tagOpacity.set(1)
  }
  const release = () => {
    px.set(0.5)
    py.set(0.5)
    tagOpacity.set(0)
  }

  const layer = (x: typeof farX, y: typeof farY) => (reduce ? undefined : { x, y })

  return (
    <section className="hero" id="home" ref={ref} onPointerMove={track} onPointerLeave={release}>
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
          <p className="hero-tagline">
            <GenerateText
              delay={1.15}
              lines={[{ text: 'Independent by design.' }, { text: 'Built to create.', em: true }]}
            />
          </p>
          <motion.div {...rise(1.9, reduce)}>
            <MagneticLink className="hero-cta" href="#work">
              Explore selected work <ArrowDown size={15} />
            </MagneticLink>
          </motion.div>
        </motion.div>
        <div className="hero-visual" aria-hidden="true">
          <motion.div className="hero-visual-inner" style={reduce ? undefined : { y: visualY }}>
            <motion.div className="hero-layer" style={layer(farX, farY)}>
              <div className="hero-coordinate coordinate-one">FIG. 01&nbsp; / &nbsp;LUNAR SIGNAL</div>
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-crosshair crosshair-h" />
              <div className="hero-crosshair crosshair-v" />
              <div className="hero-coordinate coordinate-two">INDEPENDENT&nbsp; / &nbsp;CREATIVE&nbsp; / &nbsp;TECHNOLOGY</div>
            </motion.div>
            <motion.div className="hero-layer" style={layer(nearX, nearY)}>
              <div className="hero-eclipse">
                <i />
              </div>
              <div className="hero-star">✳</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="hero-foot">
        <span>SOFTWARE&nbsp; · &nbsp;APPLICATIONS&nbsp; · &nbsp;INTERACTIVE WORLDS</span>
        <span>
          SCROLL TO DISCOVER <ArrowDown size={13} />
        </span>
      </div>
      {!reduce && (
        <motion.div className="hero-tag" aria-hidden="true" style={{ x: tagX, y: tagY, opacity: tagOpacity }}>
          X <motion.span>{xText}</motion.span> · Y <motion.span>{yText}</motion.span>
        </motion.div>
      )}
    </section>
  )
}
