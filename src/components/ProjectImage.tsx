import { useLayoutEffect, type PointerEvent } from 'react'
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { Artwork } from './Artwork'
import { ease } from '../lib/motion'

type Side = 'top' | 'right' | 'bottom' | 'left'
const offscreen: Record<Side, { x: string | number; y: string | number }> = {
  top: { x: 0, y: '-101%' },
  right: { x: '101%', y: 0 },
  bottom: { x: 0, y: '101%' },
  left: { x: '-101%', y: 0 },
}

/** Which edge of the element the pointer is closest to. */
const sideOf = (event: PointerEvent<HTMLElement>): Side => {
  const box = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width - 0.5
  const y = (event.clientY - box.top) / box.height - 0.5
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : y > 0 ? 'bottom' : 'top'
}

type Props = {
  project: Project
  onOpen: (project: Project) => void
  parallax?: MotionValue<string>
  /** Clip-path entrance when scrolled into view. */
  entrance?: boolean
}

/** Frame ratio follows the real image (clamped so tall phone shots and wide dashboards both stay a sensible size). */
const aspect = (p: Project) => (p.width && p.height ? Math.min(1.8, Math.max(0.85, p.width / p.height)) : 2.4)

/**
 * Project artwork as a button. On hover it tilts slightly toward the pointer and a details
 * panel slides in from whichever edge the pointer entered (and leaves through the exit edge).
 */
export function ProjectImage({ project, onOpen, parallax, entrance }: Props) {
  const reduce = useReducedMotion()
  const overlay = useAnimationControls()
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })

  // Park the panel off-canvas before first paint. (A parent with initial={false} would otherwise
  // suppress the `initial` prop and leave it covering the artwork.)
  useLayoutEffect(() => {
    overlay.set(offscreen.left)
  }, [overlay])

  const show = (side: Side) => {
    overlay.set(offscreen[side])
    overlay.start({ x: 0, y: 0, transition: { duration: 0.45, ease } })
  }
  const hide = (side: Side) => overlay.start({ ...offscreen[side], transition: { duration: 0.35, ease } })

  const enter = (event: PointerEvent<HTMLButtonElement>) => {
    if (!reduce && event.pointerType === 'mouse') show(sideOf(event))
  }
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width
    const py = (event.clientY - box.top) / box.height
    tiltY.set((px - 0.5) * 6)
    tiltX.set(-(py - 0.5) * 6)
    event.currentTarget.style.setProperty('--gx', px * 100 + '%')
    event.currentTarget.style.setProperty('--gy', py * 100 + '%')
  }
  const leave = (event: PointerEvent<HTMLButtonElement>) => {
    tiltX.set(0)
    tiltY.set(0)
    if (!reduce && event.pointerType === 'mouse') hide(sideOf(event))
  }

  return (
    <motion.button
      className="project-image-button"
      onClick={() => onOpen(project)}
      aria-label={project.status + '. View details: ' + project.name}
      initial={entrance && !reduce ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
      whileInView={entrance ? { clipPath: 'inset(0 0 0% 0)' } : undefined}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease, delay: 0.1 }}
      style={{
        ['--ar' as string]: aspect(project),
        ...(reduce ? null : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1100 }),
      }}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      onFocus={event => event.currentTarget.matches(':focus-visible') && show('bottom')}
      onBlur={() => hide('bottom')}
    >
      <Artwork project={project} parallax={parallax} />
      <motion.span className="dir-overlay" aria-hidden="true" initial={offscreen.left} animate={overlay}>
        <small>
          <i className={project.status === 'Released' ? 'released' : ''} />
          {project.status.toUpperCase()}
        </small>
        <b>
          View details <ArrowUpRight size={14} />
        </b>
      </motion.span>
    </motion.button>
  )
}
