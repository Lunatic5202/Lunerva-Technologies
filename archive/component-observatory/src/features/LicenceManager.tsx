import { useState } from 'react'
import { ArrowRight, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react'
import { components, type ComponentRecord, type LicenceReviewRecord, type LicenceStatus, type PermissionStatus } from '../domain/registry'

const permissions: PermissionStatus[] = ['Allowed','Restricted','Review required','Unknown']
const statuses: LicenceStatus[] = ['Verified','Review required','Restricted','Unknown']

function currentRecord(item: ComponentRecord, overrides: Record<string,LicenceReviewRecord>): LicenceReviewRecord {
  return overrides[item.id] ?? {
    status:item.licence.status,name:item.licence.name,version:item.licence.version??'',commercialUse:item.licence.commercialUse,
    modification:item.licence.modification,redistribution:item.licence.redistribution,attribution:item.licence.attribution,
    verifiedAt:'',reference:item.licence.reference,notes:item.licence.notes,
  }
}

type Props={overrides:Record<string,LicenceReviewRecord>;onChange:(id:string,record:LicenceReviewRecord)=>void}
export default function LicenceManager({overrides,onChange}:Props){
  const [expanded,setExpanded]=useState<string|null>(null)
  const displayed=components.map(item=>({item,record:currentRecord(item,overrides)}))
  const verified=displayed.filter(({record})=>record.status==='Verified').length
  const review=displayed.filter(({record})=>['Review required','Unknown'].includes(record.status)).length
  const update=(id:string,record:LicenceReviewRecord,patch:Partial<LicenceReviewRecord>)=>onChange(id,{...record,...patch})
  return <>
    <div className="library-heading"><div><div className="eyebrow"><span className="eyebrow-mark">✳</span> PROVENANCE & PERMISSIONS <span className="eyebrow-line"/></div><h1>Licence manager</h1><p>Record what is known, review each source and keep decisions traceable.</p></div></div>
    <div className="licence-summary"><div><ShieldCheck/><b>{verified.toString().padStart(2,'0')}</b><span>Manually verified records</span></div><div><ShieldCheck/><b>{review.toString().padStart(2,'0')}</b><span>Review required or unknown</span></div><div><ExternalLink/><b>{components.filter(item=>item.sourceUrl).length.toString().padStart(2,'0')}</b><span>External source references</span></div></div>
    <div className="licence-list">{displayed.map(({item,record})=><article className="licence-record" key={item.id}>
      <div className="licence-record-head"><div><b>{item.name}</b><small>{item.author} · {item.category}</small></div><span className={`status-tag ${record.status==='Verified'?'status-verified':record.status==='Restricted'?'status-restricted':'status-review'}`}><i/>{record.status.toUpperCase()}</span><button aria-label={`Edit ${item.name} licence record`} onClick={()=>setExpanded(current=>current===item.id?null:item.id)}>{expanded===item.id?<ChevronDown/>:<ArrowRight/>}</button></div>
      <div className="licence-record-meta"><span>LICENCE<b>{record.name}{record.version&&` · ${record.version}`}</b></span><span>COMMERCIAL<b>{record.commercialUse}</b></span><span>MODIFICATION<b>{record.modification}</b></span><span>REDISTRIBUTION<b>{record.redistribution}</b></span>{item.sourceUrl&&<a href={item.sourceUrl} target="_blank" rel="noreferrer">Open original source ↗</a>}</div>
      {expanded===item.id&&<div className="licence-editor"><label>Status<select value={record.status} onChange={event=>update(item.id,record,{status:event.target.value as LicenceStatus,verifiedAt:event.target.value==='Verified'?(record.verifiedAt||new Date().toISOString().slice(0,10)):record.verifiedAt})}>{statuses.map(value=><option key={value}>{value}</option>)}</select></label><label>Licence name<input value={record.name} onChange={event=>update(item.id,record,{name:event.target.value})} placeholder="Unknown"/></label><label>Version<input value={record.version} onChange={event=>update(item.id,record,{version:event.target.value})} placeholder="Version or date"/></label><label>Commercial use<select value={record.commercialUse} onChange={event=>update(item.id,record,{commercialUse:event.target.value as PermissionStatus})}>{permissions.map(value=><option key={value}>{value}</option>)}</select></label><label>Modification<select value={record.modification} onChange={event=>update(item.id,record,{modification:event.target.value as PermissionStatus})}>{permissions.map(value=><option key={value}>{value}</option>)}</select></label><label>Redistribution<select value={record.redistribution} onChange={event=>update(item.id,record,{redistribution:event.target.value as PermissionStatus})}>{permissions.map(value=><option key={value}>{value}</option>)}</select></label><label>Attribution requirements<input value={record.attribution} onChange={event=>update(item.id,record,{attribution:event.target.value})} placeholder="Required notice or credit"/></label><label>Verification date<input type="date" value={record.verifiedAt} onChange={event=>update(item.id,record,{verifiedAt:event.target.value})}/></label><label className="licence-editor-wide">Licence reference<input value={record.reference} onChange={event=>update(item.id,record,{reference:event.target.value})} placeholder="URL or path to the licence text"/></label><label className="licence-editor-wide">Review notes<textarea value={record.notes} onChange={event=>update(item.id,record,{notes:event.target.value})} rows={3}/></label></div>}
    </article>)}</div>
    <p className="legal-note"><ShieldCheck/> Manual records are provenance notes, not legal advice. Confirm component and version specific terms at the source before reuse.</p>
  </>
}
