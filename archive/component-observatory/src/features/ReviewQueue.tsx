import { ExternalLink, ShieldCheck, Trash2 } from 'lucide-react'
import type { ReviewReference } from '../domain/registry'

type Props = { records: ReviewReference[]; onRemove: (id: string) => void }

export default function ReviewQueue({ records, onRemove }: Props) {
  return <>
    <div className="library-heading"><div><div className="eyebrow"><span className="eyebrow-mark">✳</span> PROVENANCE WORKFLOW <span className="eyebrow-line"/></div><h1>Review queue</h1><p>Source links stay out of previews until the exact component and its terms have been reviewed.</p></div><span className="queue-count">{records.length.toString().padStart(2, '0')} SOURCES</span></div>
    {records.length ? <div className="review-queue-list">{records.map(record => <article className="review-queue-card" key={record.id}>
      <div className="review-queue-icon"><ShieldCheck/></div><div className="review-queue-main"><div className="review-queue-title"><h2>{record.name}</h2><span>REVIEW REQUIRED</span></div><p>{record.notes || 'No review notes added.'}</p><div className="review-queue-meta"><span>{record.category}</span><span>Added {new Date(record.addedAt).toLocaleDateString()}</span></div><a href={record.sourceUrl} target="_blank" rel="noreferrer">Open source website <ExternalLink/></a></div><button className="icon-button review-queue-remove" aria-label={`Remove ${record.name} from review queue`} title="Remove from queue" onClick={() => onRemove(record.id)}><Trash2/></button>
    </article>)}</div> : <div className="empty-state queue-empty"><ShieldCheck/><h3>Your review queue is clear.</h3><p>Add an external source from the component library when you find something worth reviewing.</p></div>}
    <div className="review-queue-guidance"><ShieldCheck/><span><b>Keep the trust boundary intact</b><small>Check the exact component version, source author and licence. Record attribution, modification, redistribution and commercial use before creating a preview adapter.</small></span></div>
  </>
}
