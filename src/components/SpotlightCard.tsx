import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

/**
 * Adapted from the React Bits Spotlight Card pattern:
 * https://reactbits.dev/components/spotlight-card
 *
 * Kept intentionally small for this site: the existing project image button
 * owns the interaction, while this wrapper contributes the soft light and rim.
 */
type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  spotlightColor?: string
}

export function SpotlightCard({ children, className = '', spotlightColor = '#9ac5d1', ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = node.getBoundingClientRect()
      node.style.setProperty('--spotlight-x', `${event.clientX - box.left}px`)
      node.style.setProperty('--spotlight-y', `${event.clientY - box.top}px`)
      node.style.setProperty('--spotlight-opacity', '1')
    }
    const onLeave = () => node.style.setProperty('--spotlight-opacity', '0')

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`spotlight-card ${className}`}
      style={{ '--spotlight-color': spotlightColor } as CSSProperties}
      {...props}
    >
      <span className="spotlight-card__light" aria-hidden="true" />
      <span className="spotlight-card__edge" aria-hidden="true" />
      {children}
    </div>
  )
}
