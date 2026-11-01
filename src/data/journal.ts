export type DispatchKind =
  | 'Development log'
  | 'Technical article'
  | 'Product announcement'
  | 'Design exploration'
  | 'Engineering note'
  | 'Studio note'

export type Dispatch = {
  slug: string
  title: string
  /** ISO date, e.g. 2026-11-02 */
  date: string
  kind: DispatchKind
  summary: string
  href?: string
}

/** Add real dispatches here; the Journal section renders them automatically. Newest first. */
export const dispatches: Dispatch[] = []
