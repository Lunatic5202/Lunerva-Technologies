import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { Artwork } from './Artwork'
import { ease } from '../lib/motion'

type Props = { project: Project; onOpen: (project: Project) => void }

export function ProjectRow({ project, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const [primary] = project.links

  // Restrained 3D tilt with a soft light that follows the pointer.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const tilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width
    const py = (event.clientY - box.top) / box.height
    tiltY.set((px - 0.5) * 6)
    tiltX.set(-(py - 0.5) * 6)
    event.currentTarget.style.setProperty('--gx', px * 100 + '%')
    event.currentTarget.style.setProperty('--gy', py * 100 + '%')
  }
  const untilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <motion.article
      ref={ref}
      className={'project-row project-' + project.kind}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.85, ease }}
    >
      <motion.button
        className="project-image-button"
        onClick={() => onOpen(project)}
        aria-label={'View ' + project.name + ' details'}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.1, ease, delay: 0.1 }}
        style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1100 }}
        onPointerMove={tilt}
        onPointerLeave={untilt}
      >
        <Artwork project={project} parallax={reduce ? undefined : parallax} />
        <span className="image-open">
          <ArrowUpRight size={17} />
        </span>
      </motion.button>
      <div className="project-info">
        <div className="project-heading">
          <span className="project-number">{project.number}</span>
          <div>
            <span className="eyebrow">{project.category}</span>
            <h3>{project.name}</h3>
          </div>
          <span className={'project-status ' + (project.status === 'Released' ? 'released' : '')}>
            <i />
            {project.status}
          </span>
        </div>
        <p>{project.description}</p>
        <div className="project-foot">
          <span>LUNEVRA {project.division.toUpperCase()}</span>
          <div className="project-actions">
            <a className="text-link" href={primary.href} target="_blank" rel="noreferrer">
              {primary.label}
              <ArrowUpRight size={13} />
            </a>
            <button className="text-link" onClick={() => onOpen(project)}>
              Details <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
