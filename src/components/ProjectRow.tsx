import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { Project } from '../data/projects'
import { ProjectImage } from './ProjectImage'
import { ProjectInfo } from './ProjectInfo'
import { ease } from '../lib/motion'

type Props = { project: Project; onOpen: (project: Project) => void }

/** Stacked layout used on tablet and mobile: artwork above text, with image parallax. */
export function ProjectRow({ project, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

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
      <ProjectImage project={project} onOpen={onOpen} parallax={reduce ? undefined : parallax} entrance />
      <ProjectInfo project={project} onOpen={onOpen} />
    </motion.article>
  )
}
