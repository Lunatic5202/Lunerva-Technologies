import { useState } from 'react'
import { motion, type MotionValue } from 'motion/react'
import type { Project } from '../data/projects'

type Props = { project: Project; parallax?: MotionValue<string> }

/** Project artwork with a loading state and a graceful fallback if the remote image fails. */
export function Artwork({ project, parallax }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  // Cached images can finish before React attaches onLoad.
  const attach = (img: HTMLImageElement | null) => {
    if (img?.complete) setState(img.naturalWidth > 0 ? 'ready' : 'error')
  }

  return (
    <div className={'project-art art-' + project.kind} data-state={state}>
      <motion.div className="art-parallax" style={{ y: parallax }}>
        {state !== 'error' && (
          <img
            ref={attach}
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            decoding="async"
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
          />
        )}
      </motion.div>
      {state === 'error' && (
        <div className="art-fallback" role="img" aria-label={project.imageAlt}>
          <span>ARTWORK UNAVAILABLE</span>
          <b>{project.name}</b>
        </div>
      )}
      <span className="art-source">{project.sourceLabel}</span>
      <span className="art-index">{project.number} / LUNEVRA</span>
    </div>
  )
}
