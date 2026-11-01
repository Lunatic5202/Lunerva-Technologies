import { projects } from '../data/projects'

const loop = [...projects, ...projects, ...projects]

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {loop.map((project, i) => (
        <li key={i}>
          <i className={project.status === 'Released' ? 'released' : ''} />
          {project.name.toUpperCase()}
          <b>{project.status.toUpperCase()}</b>
        </li>
      ))}
    </ul>
  )
}

/** Slow ticker of real project statuses. Pauses on hover, static under reduced motion. */
export function StatusMarquee() {
  return (
    <section className="status-marquee" aria-label="Current development">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  )
}
