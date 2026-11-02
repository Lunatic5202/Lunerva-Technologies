import { useLayoutEffect, useRef } from 'react'

type Part = { text: string; em?: boolean }

const BASE = '#747c80' // unlit: 4.6:1 on the page background
const LIT = '#dfe2e3'
const LIT_EM = '#a9cbd3'
const target = (el: Element) => (el.classList.contains('em-word') ? LIT_EM : LIT)

/** Words light up one by one as the paragraph scrolls through the viewport (GSAP ScrollTrigger, loaded on demand). */
export function ScrubText({ parts }: { parts: Part[] }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll<HTMLElement>('.scrub-word')
    const showAll = () => words.forEach(word => (word.style.color = target(word)))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll()
      return
    }
    let cancelled = false
    let revert = () => {}
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          gsap.fromTo(
            words,
            { color: BASE },
            {
              color: (_index: number, el: Element) => target(el),
              ease: 'none',
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
            },
          )
        }, el)
        revert = () => ctx.revert()
        // Web fonts change line breaks; re-measure once they land.
        document.fonts?.ready.then(() => ScrollTrigger.refresh())
      })
      .catch(showAll)
    return () => {
      cancelled = true
      revert()
    }
  }, [])

  return (
    <p ref={ref}>
      {parts.flatMap((part, i) =>
        part.text
          .split(' ')
          .filter(Boolean)
          .map((word, j) => (
            <span className={'scrub-word' + (part.em ? ' em-word' : '')} key={i + '-' + j}>
              {word}
            </span>
          )),
      )}
    </p>
  )
}
