export type Experiment = {
  slug: string
  title: string
  kind: 'Interface experiment' | 'Animation study' | 'AI prototype' | 'Developer tool' | 'Graphics experiment' | 'Proof of concept'
  /** Experiments are never presented as released products. */
  status: 'Experimental' | 'Archived'
  summary: string
  href?: string
}

/** Add real experiments here; the Labs section renders them automatically. */
export const experiments: Experiment[] = []
