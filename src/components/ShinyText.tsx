import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/**
 * Adapted from the React Bits Shiny Text pattern:
 * https://reactbits.dev/text-animations/shiny-text
 *
 * The sweep is used once as a quiet material cue, not as a repeating gimmick.
 */
type Props = HTMLAttributes<HTMLSpanElement> & { children: ReactNode; className?: string; style?: CSSProperties }

export function ShinyText({ children, className = '', style, ...props }: Props) {
  return (
    <span className={`shiny-text ${className}`} style={style} {...props}>
      {children}
    </span>
  )
}
