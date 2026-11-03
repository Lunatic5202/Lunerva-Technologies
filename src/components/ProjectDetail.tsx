import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { Artwork } from './Artwork'
import { ease } from '../lib/motion'

type Props = { project: Project | null; open: boolean; onClose: () => void; restoreFocus: () => void }

/** Accessible modal (Radix Dialog handles focus trap, Escape, scroll lock and focus return). */
export function ProjectDetail({ project, open, onClose, restoreFocus }: Props) {
  const ratio = project?.width && project.height ? project.width / project.height : 1.4
  const wide = ratio > 1.3 // landscape screenshots get the full dialog width so they stay whole and legible
  return (
    <Dialog.Root open={open} onOpenChange={next => !next && onClose()}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            <Dialog.Content
              asChild
              forceMount
              onCloseAutoFocus={event => {
                // There is no Dialog.Trigger, so hand focus back to whatever opened the dialog.
                event.preventDefault()
                restoreFocus()
              }}
            >
              <motion.div
                className="detail-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onMouseDown={event => {
                  if (event.target === event.currentTarget) onClose()
                }}
              >
                <motion.article
                  className={'project-detail' + (wide ? ' is-wide' : '')}
                  style={{ ['--ar' as string]: ratio }}
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.99 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <Dialog.Close className="detail-close" aria-label="Close project details">
                    <X size={18} />
                  </Dialog.Close>
                  <Artwork project={project} reveal={project.kind === 'tale' || project.kind === 'water'} />
                  <div className="detail-copy">
                    <span className="eyebrow">
                      PROJECT {project.number} / {project.category}
                    </span>
                    <Dialog.Title asChild>
                      <h2>{project.name}</h2>
                    </Dialog.Title>
                    <Dialog.Description asChild>
                      <p>{project.description}</p>
                    </Dialog.Description>
                    <div className="detail-facts">
                      <span>
                        STATUS <b>{project.status}</b>
                      </span>
                      <span>
                        STUDIO <b>LUNEVRA {project.division}</b>
                      </span>
                      <span>
                        PLATFORM <b>{project.platform}</b>
                      </span>
                      <span>
                        ARTWORK <b>{project.artworkNote}</b>
                      </span>
                    </div>
                    <div className="detail-stack" aria-label="Stack">
                      {project.stack.map(item => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <ul className="detail-highlights">
                      {project.highlights.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="detail-links">
                      {project.links.map(link => (
                        <a className="text-link" href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                          {link.label}
                          <ArrowUpRight size={14} />
                        </a>
                      ))}
                    </div>
                    {project.note && <p className="project-note">{project.note}</p>}
                    <Dialog.Close className="text-link detail-back">
                      <ArrowLeft size={15} /> Back to selected work
                    </Dialog.Close>
                  </div>
                </motion.article>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
