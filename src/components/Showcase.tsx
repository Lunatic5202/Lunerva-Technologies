import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'
import { ProjectImage } from './ProjectImage'
import { ProjectInfo } from './ProjectInfo'
import { TracingBeam } from './TracingBeam'
import { ease } from '../lib/motion'

/**
 * Sticky scroll reveal for wide screens: project text scrolls on the left beside a tracing beam,
 * while one pinned artwork panel on the right crossfades to the project in focus.
 */
export function Showcase({ projects, onOpen }: { projects: Project[]; onOpen: (project: Project) => void }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  return (
    <div className="showcase">
      <TracingBeam className="showcase-text">
        {projects.map((project, i) => (
          <motion.div
            className="showcase-item"
            key={project.slug}
            animate={{ opacity: active === i ? 1 : 0.32 }}
            transition={{ duration: 0.5, ease }}
            onViewportEnter={() => setActive(i)}
            viewport={{ margin: '-45% 0px -45% 0px' }}
          >
            <ProjectInfo project={project} onOpen={onOpen} />
          </motion.div>
        ))}
      </TracingBeam>
      <div className="showcase-visual">
        {projects.map((project, i) => (
          <motion.div
            className="showcase-panel"
            key={project.slug}
            inert={active !== i}
            initial={false}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i || reduce ? 1 : 1.035 }}
            transition={{ duration: 0.7, ease }}
          >
            <ProjectImage project={project} onOpen={onOpen} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
