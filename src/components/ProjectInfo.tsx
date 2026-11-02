import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

type Props = { project: Project; onOpen: (project: Project) => void }

export function ProjectInfo({ project, onOpen }: Props) {
  const [primary] = project.links
  return (
    <div className="project-info">
      <div className="project-heading">
        <span className="project-number">{project.number}</span>
        <div>
          <span className="eyebrow">{project.category}</span>
          <h3>{project.name}</h3>
        </div>
        <span className={'project-status ' + (project.status === 'Released' ? 'released' : '')}>
          <i />
          {project.status}
        </span>
      </div>
      <p>{project.description}</p>
      <div className="project-foot">
        <span>LUNEVRA {project.division.toUpperCase()}</span>
        <div className="project-actions">
          <a className="text-link" href={primary.href} target="_blank" rel="noreferrer">
            {primary.label}
            <ArrowUpRight size={13} />
          </a>
          <button className="text-link" onClick={() => onOpen(project)}>
            Details <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
