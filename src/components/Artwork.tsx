import { useState, type PointerEvent } from 'react'
import { motion, type MotionValue } from 'motion/react'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  parallax?: MotionValue<string>
  /** Dim the artwork and reveal its full colour in a soft circle that follows the pointer. */
  reveal?: boolean
}

/** Project artwork with a loading state and a graceful fallback if the remote image fails. */
export function Artwork({ project, parallax, reveal }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  // Cached images can finish before React attaches onLoad.
  const attach = (img: HTMLImageElement | null) => {
    if (img?.complete) setState(img.naturalWidth > 0 ? 'ready' : 'error')
  }

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    if (!reveal || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    // The parallax wrapper is 12% taller than the frame (6% overhang above), so shift into image space.
    event.currentTarget.style.setProperty('--rx', event.clientX - box.left + 'px')
    event.currentTarget.style.setProperty('--ry', event.clientY - box.top + box.height * 0.06 + 'px')
  }

  return (
    <div
      className={'project-art art-' + project.kind + (reveal ? ' has-reveal' : '')}
      data-state={state}
      onPointerMove={follow}
    >
      <motion.div className="art-parallax" style={{ y: parallax }}>
        {state !== 'error' && (
          <img
            ref={attach}
            src={project.image}
            srcSet={project.srcSet}
            sizes="(max-width: 1050px) 100vw, 580px"
            width={project.width}
            height={project.height}
            alt={project.imageAlt}
            loading="lazy"
            decoding="async"
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
          />
        )}
        {reveal && state === 'ready' && <img className="art-reveal" src={project.image} srcSet={project.srcSet} sizes="(max-width: 1050px) 100vw, 580px" alt="" aria-hidden="true" />}
      </motion.div>
      {state === 'error' && (
        <div className="art-fallback" role="img" aria-label={project.imageAlt}>
          <span>ARTWORK UNAVAILABLE</span>
          <b>{project.name}</b>
        </div>
      )}
      <span className="art-source" aria-hidden="true">{project.sourceLabel}</span>
      <span className="art-index" aria-hidden="true">{project.number} / LUNEVRA</span>
    </div>
  )
}
