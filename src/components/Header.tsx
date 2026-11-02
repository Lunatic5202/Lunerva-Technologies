import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { nav } from '../data/projects'
import { ease } from '../lib/motion'

export function Mark({ className = '' }: { className?: string }) {
  return (
    <span className={'lunevra-mark ' + className} aria-hidden="true">
      <i />
      <b />
    </span>
  )
}

const list = { show: { transition: { staggerChildren: 0.05 } }, hidden: {} }
const item = { hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } } }

export function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  // Floating navbar: tuck away while reading downward, return the moment you scroll up.
  useMotionValueEvent(scrollY, 'change', latest => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(!open && latest > previous && latest > 160)
  })

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      className="site-header"
      animate={{ y: hidden && !reduce ? '-100%' : '0%' }}
      transition={{ duration: 0.4, ease }}
      onFocusCapture={() => setHidden(false)}
    >
      <a className="wordmark" href="#home" aria-label="LUNEVRA Technologies home">
        <Mark />
        <span>
          LUNEVRA<small>TECHNOLOGIES</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(({ label, href }) => (
          <a key={href} className={active === href ? 'current' : ''} href={href} aria-current={active === href ? 'location' : undefined}>
            {label}
            {active === href && !reduce && (
              <motion.span className="nav-underline" layoutId="nav-underline" transition={{ duration: 0.4, ease }} />
            )}
            {active === href && reduce && <span className="nav-underline" />}
          </a>
        ))}
      </nav>
      <a className="header-index" href="#work">
        <span className="status-dot" /> INDEPENDENT STUDIO <ArrowUpRight size={13} />
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            variants={list}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {nav.map(({ label, href }) => (
              <motion.a key={href} href={href} variants={item} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={14} />
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      {!reduce && <motion.span className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />}
    </motion.header>
  )
}
