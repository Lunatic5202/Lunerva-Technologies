import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ChevronDown, Copy, ExternalLink, FolderHeart, Heart, Play, ShieldCheck, X } from 'lucide-react'
import type { ComponentRecord, LicenceReviewRecord } from '../domain/registry'
import { previewFiles } from '../preview/documents'

type Props = {
  item: ComponentRecord
  overrides: Record<string, LicenceReviewRecord>
  favourites: string[]
  collections: string[]
  onClose: () => void
  onToggleFavourite: (id: string) => void
  onAddToCollection: (name: string, id: string) => void
  onCopy: (text: string) => void
  onPlay: (item: ComponentRecord) => void
  onEditLicence: () => void
  children: ReactNode
}

type Tab = 'overview' | 'source' | 'licence'

export default function ComponentDetails({ item, overrides, favourites, collections, onClose, onToggleFavourite, onAddToCollection, onCopy, onPlay, onEditLicence, children }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [fileName, setFileName] = useState<'index.html' | 'styles.css'>('index.html')
  const dialog = useRef<HTMLElement>(null)
  const closeAction = useRef(onClose)
  const files = useMemo(() => item.previewAvailable ? previewFiles(item) : null, [item])
  useEffect(() => { closeAction.current = onClose }, [onClose])
  useEffect(() => {
    const root = dialog.current
    if (!root) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    focusables()[0]?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); closeAction.current(); return }
      if (event.key !== 'Tab') return
      const elements = focusables()
      if (!elements.length) { event.preventDefault(); root.focus(); return }
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    root.addEventListener('keydown', handleKey)
    return () => { root.removeEventListener('keydown', handleKey); previous?.focus() }
  }, [])
  const licence: LicenceReviewRecord = overrides[item.id] ?? {
    status: item.licence.status,
    name: item.licence.name,
    version: item.licence.version ?? '',
    commercialUse: item.licence.commercialUse,
    modification: item.licence.modification,
    redistribution: item.licence.redistribution,
    attribution: item.licence.attribution,
    verifiedAt: '',
    reference: item.licence.reference,
    notes: item.licence.notes,
  }

  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialog} tabIndex={-1} className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="component-detail-title">
      <div className="detail-top"><span className="section-kicker">{item.category.toUpperCase()} <i>·</i> COMPONENT</span><button className="icon-button" onClick={onClose} aria-label="Close details"><X/></button></div>
      <div className="detail-preview">{children}</div>
      <div className="detail-content">
        <div className="detail-title-row"><div><h2 id="component-detail-title">{item.name}</h2><p>{item.description}</p></div><button className={`fav-button detail-fav ${favourites.includes(item.id) ? 'is-fav' : ''}`} onClick={() => onToggleFavourite(item.id)} aria-label={favourites.includes(item.id) ? 'Remove favourite' : 'Add favourite'}><Heart/></button></div>
        <div className="detail-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="detail-tabs" role="tablist" aria-label="Component information">
          {(['overview', 'source', 'licence'] as const).map(value => <button key={value} role="tab" aria-selected={tab === value} className={tab === value ? 'tab-current' : ''} onClick={() => setTab(value)}>{value === 'licence' ? 'LICENCE' : value === 'source' ? 'SOURCE & USAGE' : 'OVERVIEW'}</button>)}
        </div>

        {tab === 'overview' && <div className="detail-tab-panel" role="tabpanel">
          <div className="detail-meta"><span>FRAMEWORK<b>{item.framework}</b></span><span>AUTHOR<b>{item.author}</b></span><span>DEPENDENCIES<b>{item.dependencies.length ? item.dependencies.join(', ') : 'None'}</b></span><span>PREVIEW<b>{item.previewAvailable ? 'Local preview available' : 'Not available'}</b></span></div>
          <div className={`review-notice ${item.previewAvailable ? 'neutral-notice' : ''}`}><ShieldCheck/><span><b>{item.previewAvailable ? 'Original Observatory demonstration' : 'External discovery reference'}</b><small>{item.previewAvailable ? 'A visual study with copyable HTML and CSS. Review the source and confirm reuse terms before shipping.' : 'The exact component has not been selected or reviewed. Its code is not imported or executed.'}</small></span></div>
          <p className="detail-notes">{item.notes}</p>
          {item.inspiration && <div className="inspiration-note"><span className="section-kicker">DESIGN REFERENCE</span><b>{item.inspiration.name} · {item.inspiration.licence}</b><small>{item.inspiration.notes}</small><a href={item.inspiration.url} target="_blank" rel="noreferrer">View upstream component ↗</a></div>}
        </div>}

        {tab === 'source' && <div className="detail-tab-panel" role="tabpanel">
          {files ? <>
            <div className="source-view-head"><span className="section-kicker">COPYABLE PREVIEW SOURCE</span><button onClick={() => onCopy(files[fileName] ?? '')}><Copy/>Copy file</button></div>
            <label className="source-file-picker"><select aria-label="Source file" value={fileName} onChange={event => setFileName(event.target.value as 'index.html' | 'styles.css')}>{Object.keys(files).map(file => <option key={file}>{file}</option>)}</select><ChevronDown/></label>
            <pre className="source-editor detail-source-editor"><code>{files[fileName] ?? 'Source is unavailable.'}</code></pre>
            <div className="source-install"><span>INSTALLATION</span><code>{item.installation}</code><span>USAGE</span><code>{item.usage}</code></div>
          </> : <div className="review-notice"><ExternalLink/><span><b>Source package not imported</b><small>This is a discovery link. Review the specific component and its licence before adding an isolated preview.</small>{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer">Open source website ↗</a>}</span></div>}
        </div>}

        {tab === 'licence' && <div className="detail-tab-panel" role="tabpanel">
          <div className="detail-meta licence-detail-meta"><span>STATUS<b>{licence.status}</b></span><span>LICENCE<b>{licence.name}{licence.version ? ` · ${licence.version}` : ''}</b></span><span>COMMERCIAL USE<b>{licence.commercialUse}</b></span><span>MODIFICATION<b>{licence.modification}</b></span><span>REDISTRIBUTION<b>{licence.redistribution}</b></span><span>ATTRIBUTION<b>{licence.attribution || 'Not recorded'}</b></span>{licence.verifiedAt && <span>REVIEWED<b>{licence.verifiedAt}</b></span>}</div>
          <div className="review-notice"><ShieldCheck/><span><b>Confirm before reuse</b><small>{licence.notes || 'No additional review notes.'}</small>{licence.reference && <a href={licence.reference} target="_blank" rel="noreferrer">Open licence reference ↗</a>}</span></div>
          <button className="text-link detail-licence-link" onClick={onEditLicence}>Open Licence Manager <ArrowRight/></button>
        </div>}

        <div className="detail-actions"><label className="collection-select-label"><FolderHeart/><select value="" aria-label="Add component to collection" onChange={event => { if (event.target.value) onAddToCollection(event.target.value, item.id) }}><option value="">Add to collection…</option>{collections.map(name => <option key={name} value={name}>{name}</option>)}</select><ChevronDown/></label><button className="button button-secondary" onClick={() => onCopy(`${item.name}\n${item.description}\nFramework: ${item.framework}\nLicence: ${licence.name} · ${licence.status}\nSource: ${item.sourceUrl || 'Original local Observatory demonstration'}\nDesign reference: ${item.inspiration ? item.inspiration.name+' — '+item.inspiration.url : 'None recorded'}`)}><Copy/>Copy metadata</button><button className="button button-primary" onClick={() => onPlay(item)}><Play/>Open in playground</button></div>
      </div>
    </section>
  </div>
}
