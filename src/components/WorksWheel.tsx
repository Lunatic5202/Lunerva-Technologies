import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Adapted from the supplied Works Wheel direction. It keeps the interaction
 * source-owned and uses the portfolio's existing Project model and CSS tokens.
 */
export function WorksWheel({ items, onOpen }: { items: Project[]; onOpen: (project: Project) => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([])
  const target = useRef(0)
  const turn = useRef(0)
  const settling = useRef<number>(0)
  const drag = useRef<number | null>(null)
  const itemSignature = items.map(item => item.slug).join('|')
  const previousSignature = useRef(itemSignature)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [stage, setStage] = useState({ width: 0, height: 0 })

  const metrics = useMemo(() => {
    const cardHeight = Math.min(stage.height * 0.38, 290)
    const cardWidth = Math.min(cardHeight * 1.45, stage.width * 0.34)
    return { cardWidth, cardHeight, ring: cardHeight * 1.12, depth: cardHeight * 2.7 }
  }, [stage])
  const last = Math.max(items.length - 1, 0)

  useEffect(() => {
    if (previousSignature.current === itemSignature) return
    previousSignature.current = itemSignature
    target.current = 0
    turn.current = 0
    setActive(0)
    if (reduced) return
    setSwitching(true)
    const timer = window.setTimeout(() => setSwitching(false), 460)
    return () => window.clearTimeout(timer)
  }, [itemSignature, reduced])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduced(query.matches)
    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const read = () => setStage({ width: node.clientWidth, height: node.clientHeight })
    read()
    const observer = new ResizeObserver(read)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!stage.height || !items.length) return
    let frame = 0
    const draw = () => {
      const gap = target.current - turn.current
      turn.current = Math.abs(gap) < 0.0005 ? target.current : turn.current + gap * (reduced ? 1 : 0.12)
      const position = Math.max(0, turn.current - 1)
      const mode = clamp(turn.current, 0, 1)
      const scale = metrics.cardWidth ? metrics.cardWidth / Math.max(metrics.cardHeight * 1.45, 1) : 1

      cardsRef.current.forEach((card, index) => {
        if (!card) return
        const distance = index - position
        const ringAngle = distance * (360 / items.length)
        const drumAngle = distance * 40
        const arcX = -metrics.cardHeight * 1.82 * (1 - Math.cos((drumAngle * Math.PI) / 180))
        const ringY = -(1 - mode) * metrics.ring
        const x = arcX * mode
        const y = ringY + Math.sin((distance * Math.PI * 2) / items.length) * metrics.ring * (1 - mode)
        const z = mode * metrics.cardHeight * 2.22
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateZ(${(1 - mode) * ringAngle}deg) rotateX(${mode * drumAngle}deg) scale(${lerp(0.55 * scale, 1, mode)})`
        card.style.opacity = mode > 0.5 && Math.abs(distance) > 1.6 ? '0' : '1'
        card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2))
      })

      const next = clamp(Math.round(position), 0, last)
      setActive(prev => (prev === next ? prev : next))
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [items.length, last, metrics, reduced, stage.height])

  const to = (next: number) => {
    target.current = clamp(next, 0, last + 1)
  }

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / 900
      if (next > 0 && next < last + 1) event.preventDefault()
      to(next)
      window.clearTimeout(settling.current)
      settling.current = window.setTimeout(() => to(Math.round(target.current)), 140)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      node.removeEventListener('wheel', onWheel)
      window.clearTimeout(settling.current)
    }
  }, [last])

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current === null) return
    to(target.current + (drag.current - event.clientY) / 420)
    drag.current = event.clientY
  }

  return (
    <section className={'works-wheel' + (switching ? ' is-switching' : '')} aria-label="Selected work wheel">
      <div
        ref={stageRef}
        className="works-wheel-stage"
        tabIndex={0}
        role="listbox"
        aria-label="Selected projects"
        aria-activedescendant={`works-wheel-${active}`}
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={() => { drag.current = null; to(Math.round(target.current)) }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); to(Math.round(target.current) + 1) }
          if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); to(Math.round(target.current) - 1) }
        }}
      >
        <div className="works-wheel-ring-label">SELECTED WORK</div>
        {items.map((project, index) => (
          <button
            key={project.slug}
            id={`works-wheel-${index}`}
            ref={node => { cardsRef.current[index] = node }}
            className="works-wheel-card"
            type="button"
            role="option"
            aria-selected={index === active}
            aria-label={`${project.name}. ${project.status}. View details.`}
            onClick={() => onOpen(project)}
            style={{ width: metrics.cardWidth || 220, height: metrics.cardHeight || 150 }}
          >
            {project.image ? <img src={project.image} alt="" draggable={false} /> : <span className="works-wheel-fallback">{project.name}</span>}
            <span className="works-wheel-card-meta">{project.number} / {project.status.toUpperCase()}</span>
            <span className="works-wheel-card-action">View <ArrowUpRight size={13} /></span>
          </button>
        ))}
        <div className="works-wheel-active-title">{items[active]?.name}</div>
        <ol className="works-wheel-index" aria-label="Select project">
          {items.map((project, index) => (
            <li key={project.slug}>
              <button type="button" className={index === active ? 'active' : ''} onClick={() => to(index)}>{project.number}</button>
            </li>
          ))}
        </ol>
      </div>
      <div className="works-wheel-hint">SCROLL OR DRAG TO TURN <span>↕</span></div>
    </section>
  )
}
