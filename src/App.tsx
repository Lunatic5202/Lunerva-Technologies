import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { countFor, filters, nav, projects, type Filter, type Project } from './data/projects'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Header, Mark } from './components/Header'
import { Hero } from './components/Hero'
import { MagneticLink } from './components/MagneticLink'
import { ProjectRow } from './components/ProjectRow'
import { Showcase } from './components/Showcase'
import { BackgroundLines } from './components/BackgroundLines'
import { TextHover } from './components/TextHover'
import { useMediaQuery } from './lib/useMediaQuery'
import { Principles } from './components/Principles'
import { Reveal } from './components/Reveal'
import { SectionLabel } from './components/ScrambleText'
import { ScrubText } from './components/ScrubText'
import { StatusMarquee } from './components/StatusMarquee'
import { dispatches } from './data/journal'
import { experiments } from './data/labs'

const loadDetail = () => import('./components/ProjectDetail')
const ProjectDetail = lazy(() => loadDetail().then(m => ({ default: m.ProjectDetail })))

const PROJECT_HASH = /^#project\/([\w-]+)$/
const projectFromHash = () => {
  const match = window.location.hash.match(PROJECT_HASH)
  return match ? (projects.find(p => p.slug === match[1]) ?? null) : null
}
const navHrefs: string[] = nav.map(item => item.href)
const sectionFromHash = () => (navHrefs.includes(window.location.hash) ? window.location.hash : '#home')

const divisions = [
  ['01 / SOFTWARE', 'Digital', 'Software products, consumer applications and digital utilities.'],
  ['02 / ENTERTAINMENT', 'Interactive', 'Games, interactive entertainment and narrative experiences.'],
  ['03 / EXPLORATION', 'Labs', 'Experiments, prototypes and exploratory research.'],
]

export default function App() {
  const [filter, setFilter] = useState<Filter>('All work')
  const [selected, setSelected] = useState<Project | null>(projectFromHash)
  const [active, setActive] = useState(sectionFromHash)

  // Keep the last project mounted while the dialog plays its exit animation.
  const lastSelected = useRef<Project | null>(null)
  if (selected) lastSelected.current = selected

  const wideLayout = useMediaQuery('(min-width: 1051px)')
  const visible = projects.filter(p => filter === 'All work' || p.discipline === filter)

  const opener = useRef<HTMLElement | null>(null)
  const restoreFocus = useCallback(() => opener.current?.focus(), [])

  const open = useCallback((project: Project) => {
    opener.current = document.activeElement as HTMLElement | null
    window.location.hash = 'project/' + project.slug
  }, [])
  const close = useCallback(() => {
    window.history.replaceState(null, '', '#work')
    setSelected(null)
  }, [])

  useEffect(() => {
    const onHash = () => {
      setSelected(projectFromHash())
      if (!PROJECT_HASH.test(window.location.hash)) setActive(sectionFromHash())
    }
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const current = navHrefs
          .map(href => document.getElementById(href.slice(1)))
          .filter((el): el is HTMLElement => Boolean(el))
          .filter(el => el.getBoundingClientRect().top < 180)
          .at(-1)
        if (current) setActive('#' + current.id)
      })
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    document.title = selected
      ? selected.name + ' — LUNEVRA Technologies'
      : 'LUNEVRA Technologies — Independent by design'
  }, [selected])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div>
        <Header active={active} />
        <main id="main">
          <Hero />
          <StatusMarquee />

          <section className="manifesto" aria-label="Studio positioning">
            <SectionLabel text="01 / POSITION" />
            <ScrubText
              parts={[
                { text: 'We build' },
                { text: 'digital products', em: true },
                { text: 'and interactive experiences with a distinct point of view.' },
              ]}
            />
            <span className="manifesto-mark">
              <Mark />
            </span>
          </section>

          <section className="work-section section-wrap" id="work" onPointerEnter={() => void loadDetail()} onFocus={() => void loadDetail()}>
            <Reveal className="section-top">
              <div>
                <SectionLabel text="02 / SELECTED WORK" />
                <h2>
                  Made to mean
                  <br />
                  <em>something.</em>
                </h2>
              </div>
              <p className="section-intro">
                A small, considered body of work.
                <br />
                Each project starts with a reason to exist.
              </p>
            </Reveal>
            <div className="filter-bar" role="group" aria-label="Filter work by category">
              {filters.map(item => (
                <button
                  key={item}
                  className={filter === item ? 'selected' : ''}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                >
                  {item}
                  <span>{countFor(item)}</span>
                </button>
              ))}
            </div>
            <div className="project-list">
              <AnimatePresence mode="wait" initial={false}>
                {visible.length ? (
                  <div key={filter} className="project-group">
                    {wideLayout ? (
                      <Showcase projects={visible} onOpen={open} />
                    ) : (
                      visible.map(project => <ProjectRow key={project.slug} project={project} onOpen={open} />)
                    )}
                  </div>
                ) : (
                  <Reveal key="empty" className="empty-work">
                    <span>IN DEVELOPMENT</span>
                    <p>
                      New work is taking shape.
                      <br />
                      This space will grow as projects are ready to share.
                    </p>
                  </Reveal>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="labs-section" id="labs">
            <BackgroundLines />
            <div className="section-wrap labs-inner">
              <Reveal className="labs-heading">
                <div>
                  <SectionLabel text="03 / LUNEVRA LABS" />
                  <h2>
                    Room to
                    <br />
                    <em>wonder.</em>
                  </h2>
                </div>
                <span className="lab-coordinate">OPEN ENDED BY DESIGN&nbsp; / &nbsp;L—LAB</span>
              </Reveal>
              <Reveal className="labs-body" delay={0.1}>
                <div className="lab-symbol">
                  <div className="lab-grid" />
                  <div className="lab-crescent" />
                  <span>FIELD STUDY / 001</span>
                </div>
                <div className="labs-copy">
                  <p>
                    A place for experiments, prototypes and questions worth following. Some ideas become products. Others
                    teach us what to make next.
                  </p>
                  <div className="lab-tags">
                    <span>INTERFACE STUDIES</span>
                    <span>GRAPHICS</span>
                    <span>PROTOTYPES</span>
                    <span>RESEARCH</span>
                  </div>
                  {experiments.length ? (
                    <ul className="entry-list">
                      {experiments.map(item => (
                        <li key={item.slug}>
                          <span>
                            {item.kind.toUpperCase()} · {item.status.toUpperCase()}
                          </span>
                          <h3>{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.title}</a> : item.title}</h3>
                          <p>{item.summary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="quiet-status">
                      <i /> No public experiments yet
                    </span>
                  )}
                </div>
              </Reveal>
            </div>
          </section>

          <Principles />

          <section className="divisions section-wrap" aria-labelledby="divisions-heading">
            <Reveal className="divisions-heading">
              <SectionLabel text="05 / CREATIVE PRACTICE" />
              <h2 id="divisions-heading">
                One studio.
                <br />
                <em>Many directions.</em>
              </h2>
            </Reveal>
            <div className="division-list">
              {divisions.map(([label, name, body], i) => (
                <Reveal as="article" key={name} delay={i * 0.1}>
                  <span>{label}</span>
                  <h3>
                    LUNEVRA <em>{name}</em>
                  </h3>
                  <p>{body}</p>
                  <ArrowUpRight aria-hidden="true" />
                </Reveal>
              ))}
            </div>
            <p className="division-note">Creative areas within one independent studio.</p>
          </section>

          <section className="journal-section" id="journal">
            <div className="section-wrap journal-inner">
              <Reveal>
                <SectionLabel text="06 / JOURNAL" />
                <h2>
                  Notes from
                  <br />
                  <em>the process.</em>
                </h2>
              </Reveal>
              {dispatches.length ? (
                <Reveal className="journal-empty" delay={0.1}>
                  <ul className="entry-list">
                    {dispatches.map(item => (
                      <li key={item.slug}>
                        <span>
                          {item.kind.toUpperCase()} · {item.date}
                        </span>
                        <h3>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
                        <p>{item.summary}</p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : (
                <Reveal className="journal-empty" delay={0.1}>
                  <span>DISPATCHES / 000</span>
                  <p>Development notes, ideas and studio updates will find their place here.</p>
                  <span className="quiet-status">
                    <i /> No dispatches published
                  </span>
                </Reveal>
              )}
            </div>
          </section>

          <section className="contact-section section-wrap" id="contact">
            <div className="contact-overline">
              <SectionLabel text="07 / CONTACT" />
              <span>OPEN TO THE NEXT GOOD IDEA</span>
            </div>
            <Reveal as="h2">
              Something on
              <br />
              your <em>mind?</em>
            </Reveal>
            <p>For now, find LUNEVRA on GitHub.</p>
            <MagneticLink className="contact-link" href="https://github.com/Lunatic5202" external>
              Visit GitHub <ArrowUpRight size={17} />
            </MagneticLink>
            <div className="contact-orbit" aria-hidden="true">
              <Mark />
            </div>
          </section>
        </main>
        <div className="footer-display" aria-hidden="true">
          <TextHover text="LUNEVRA" />
        </div>
        <footer className="site-footer">
          <a className="wordmark footer-wordmark" href="#home">
            <Mark />
            <span>
              LUNEVRA{' '}<small>TECHNOLOGIES</small>
            </span>
          </a>
          <span>INDEPENDENT BY DESIGN. BUILT TO CREATE.</span>
          <span>© 2026 LUNEVRA TECHNOLOGIES</span>
          <a href="#home" aria-label="Back to top">
            BACK TO TOP ↑
          </a>
        </footer>
      </div>
      {lastSelected.current && (
        <ErrorBoundary
          fallback={
            <div className="load-error" role="alert">
              Project details couldn’t load.
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          }
        >
        <Suspense fallback={null}>
          <ProjectDetail project={lastSelected.current} open={Boolean(selected)} onClose={close} restoreFocus={restoreFocus} />
        </Suspense>
        </ErrorBoundary>
      )}
    </>
  )
}
