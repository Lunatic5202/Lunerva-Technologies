export type Category =
  | 'Hero sections' | 'Typography' | 'Backgrounds' | 'Cards & UI'
  | 'Navigation' | 'Transitions' | '3D & WebGL' | 'Interactive effects' | 'Utilities'

export type PreviewKind = 'orbit' | 'meteorHero' | 'ventures' | 'transitionStudy' | 'signalReveal' | 'type' | 'grid' | 'panel' | 'nav' | 'drift' | 'depth' | 'cursor' | 'pulse' | 'unavailable'
export type LicenceStatus = 'Verified' | 'Review required' | 'Restricted' | 'Unknown'
export type PermissionStatus = 'Allowed' | 'Restricted' | 'Review required' | 'Unknown'
export type LicenceReviewRecord = { status: LicenceStatus; name: string; version: string; commercialUse: PermissionStatus; modification: PermissionStatus; redistribution: PermissionStatus; attribution: string; verifiedAt: string; reference: string; notes: string }
export type ReviewReference = { id: string; name: string; sourceUrl: string; category: Category; notes: string; addedAt: string }

type RegistryRecord = {
  id: string
  name: string
  description: string
  category: Category
  tags: string[]
  framework: string
  dependencies: string[]
  author: string
  sourceUrl: string
  repositoryUrl?: string
  inspiration?: { name: string; url: string; licence: string; notes: string }
  previewKind: PreviewKind
  previewAvailable: boolean
  licence: { name: string; version?: string; status: LicenceStatus; attribution: string; commercialUse: 'Allowed' | 'Review required' | 'Unknown'; modification: 'Allowed' | 'Review required' | 'Unknown'; redistribution: 'Allowed' | 'Review required' | 'Unknown'; reference: string; notes: string }
  reducedMotion: 'Simplified' | 'Static' | 'Unknown'
  installation: string
  usage: string
  sourceFiles: string[]
  createdAt: string
  notes: string
}
export type ComponentRecord = RegistryRecord & { license: string; source: string; kind: PreviewKind; preview: boolean; date: string }

const originalLicence = {
  name: 'Terms not set', status: 'Unknown' as const, attribution: 'LUNEVRA Technologies',
  commercialUse: 'Unknown' as const, modification: 'Unknown' as const, redistribution: 'Unknown' as const,
  reference: '', notes: 'Original local visual study. The repository has not selected a distribution licence.'
}
const reviewLicence = {
  name: 'Review required', status: 'Review required' as const, attribution: 'Review before reuse',
  commercialUse: 'Review required' as const, modification: 'Review required' as const, redistribution: 'Review required' as const,
  reference: '', notes: 'Confirm the exact component and version terms before use.'
}

export const categories = ['All components', 'Hero sections', 'Typography', 'Backgrounds', 'Cards & UI', 'Navigation', 'Transitions', '3D & WebGL', 'Interactive effects', 'Utilities'] as const

const componentRecords: RegistryRecord[] = [
  { id:'orbital-hero', name:'Orbital hero', category:'Hero sections', description:'A quiet, cinematic introduction framed by an orbiting light field.', tags:['hero','space','glow'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'orbit', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Place the preview markup in a page section and include its stylesheet.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-28', notes:'Original LUNEVRA study. Reduced motion replaces the moving field with a static composition.' },
  { id:'meteor-horizon', name:'Meteor horizon', category:'Hero sections', description:'A restrained meteor field frames a clear studio message without competing with the headline.', tags:['hero','meteors','space','launch'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'meteorHero', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Replace the message and connect the call to action to a real destination.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-11-01', notes:'Independent HTML/CSS implementation. The meteor field is a visual adaptation of a Magic UI pattern; no upstream code is included.', inspiration:{name:'Magic UI · Meteors',url:'https://magicui.design/docs/components/meteors',licence:'MIT · reference only',notes:'The upstream repository is MIT licensed. This demo independently reproduces the meteor streak idea in CSS; no Magic UI source was copied. Reviewed 2026-11-01.'} },
  { id:'venture-orbits', name:'Venture orbits', category:'Hero sections', description:'LUNEVRA’s real portfolio lines arranged around a calm central identity mark.', tags:['hero','orbit','portfolio','system'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'ventures', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Replace portfolio labels only when the project names or structure change.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-11-01', notes:'Uses portfolio names from the repository and an independently authored orbital composition inspired by Magic UI Orbiting Circles. No upstream code is included.', inspiration:{name:'Magic UI · Orbiting Circles',url:'https://magicui.design/docs/components/orbiting-circles',licence:'MIT · reference only',notes:'The upstream repository is MIT licensed. This demo independently recreates the orbiting-system concept in CSS; no Magic UI source was copied. Reviewed 2026-11-01.'} },
  { id:'quiet-entrance', name:'Quiet entrance', category:'Transitions', description:'A calm staged reveal that brings copy and product notes into view with a precise, lunar cadence.', tags:['transition','reveal','stagger','motion'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'transitionStudy', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Use the stagger on short, related content groups; avoid delaying controls or essential information.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-11-01', notes:'Independent CSS animation sequence adapted to the LUNEVRA palette. Replay it from the preview to inspect the timing.', inspiration:{name:'Magic UI · Text Animate',url:'https://v3.magicui.design/docs/components/text-animate',licence:'MIT · reference only',notes:'The upstream repository is MIT licensed. This preview independently implements a short staggered reveal using CSS; no Magic UI source was copied. Reviewed 2026-11-01.'} },
  { id:'lunar-signal', name:'Lunar signal', category:'Transitions', description:'A light sweep opens a masked headline, then resolves into a crisp call to action.', tags:['transition','reveal','signal','hero'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'signalReveal', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Use the short signal sweep to introduce a hero message. Keep the key action immediately available.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-11-01', notes:'Original LUNEVRA transition study. The key action remains visible in the reduced-motion state.' },
  { id:'signal-type', name:'Signal type', category:'Typography', description:'An expressive signal sweep for a headline, with a reduced motion state.', tags:['type','reveal','motion'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'type', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Replace the sample title with short display copy.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-26', notes:'Original LUNEVRA study.' },
  { id:'soft-grid', name:'Soft grid', category:'Backgrounds', description:'A low contrast technical grid with a gentle, cursor responsive glow.', tags:['background','grid','interactive'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'grid', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Use as a decorative background layer behind page content.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-25', notes:'Original LUNEVRA study.' },
  { id:'graphite-panel', name:'Graphite panel', category:'Cards & UI', description:'A precise, elevated surface for tools, status and short content.', tags:['card','surface','ui'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'panel', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Use for concise status or feature content.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-23', notes:'Original LUNEVRA study.' },
  { id:'line-nav', name:'Line navigation', category:'Navigation', description:'Compact navigation that makes the current location easy to scan.', tags:['navigation','underline','ui'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'nav', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Replace the sample links and wire them to your application routes.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-20', notes:'Visual study only. Sample links are not connected to application navigation.' },
  { id:'slow-drift', name:'Slow drift', category:'Transitions', description:'A restrained, looping drift for a mark or a small decorative object.', tags:['loop','motion','ambient'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'drift', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Keep the element decorative and provide a static state for reduced motion.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-19', notes:'Original LUNEVRA study.' },
  { id:'depth-field', name:'Depth field', category:'3D & WebGL', description:'A layered depth composition built without a WebGL dependency.', tags:['depth','parallax','layers'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'depth', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Use as a decorative depth treatment; no WebGL runtime is required.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-17', notes:'CSS perspective study. Not a WebGL component.' },
  { id:'cursor-field', name:'Cursor field', category:'Interactive effects', description:'Pointer responsive field. Move the pointer across the preview surface.', tags:['pointer','interactive','field'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'cursor', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Keep decorative; preserve a visible keyboard focus style on any interactive content.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-15', notes:'Pointer response is provided by CSS hover, not JavaScript.' },
  { id:'pulse-meter', name:'Pulse meter', category:'Utilities', description:'A small animated status signal with a static reduced motion state.', tags:['status','signal','utility'], framework:'HTML + CSS', dependencies:[], author:'LUNEVRA Technologies', sourceUrl:'', previewKind:'pulse', previewAvailable:true, licence:originalLicence, reducedMotion:'Static', installation:'No dependencies. Copy the HTML and CSS source files.', usage:'Only use LIVE for a real live status. The preview label is illustrative.', sourceFiles:['src/preview/documents.ts'], createdAt:'2026-10-12', notes:'The displayed sample status is illustrative, not connected to a service.' },
  { id:'react-bits-reference', name:'React Bits · discovery reference', category:'Typography', description:'Discovery reference for typography and visual effect components. No exact component selected or reviewed yet.', tags:['third-party','discovery','react'], framework:'React', dependencies:['React'], author:'React Bits', sourceUrl:'https://reactbits.dev/', previewKind:'unavailable', previewAvailable:false, licence:{...reviewLicence,name:'Unknown',status:'Unknown',reference:'https://reactbits.dev/',notes:'Library-level discovery link only; no component-level source or licence review has been completed.'}, reducedMotion:'Unknown', installation:'Unavailable until an exact component is selected and reviewed.', usage:'Research entry only. Not executable.', sourceFiles:[], createdAt:'2026-10-10', notes:'No component is claimed as imported, tested or approved.' },
  { id:'magic-ui-reference', name:'Magic UI · discovery reference', category:'Backgrounds', description:'Discovery reference for animated landing page and background components. No exact component selected or reviewed yet.', tags:['third-party','discovery','react'], framework:'React', dependencies:['React'], author:'Magic UI', sourceUrl:'https://magicui.design/', previewKind:'unavailable', previewAvailable:false, licence:{...reviewLicence,name:'Unknown',status:'Unknown',reference:'https://magicui.design/',notes:'Library-level discovery link only; no component-level source or licence review has been completed.'}, reducedMotion:'Unknown', installation:'Unavailable until an exact component is selected and reviewed.', usage:'Research entry only. Not executable.', sourceFiles:[], createdAt:'2026-10-08', notes:'No component is claimed as imported, tested or approved.' },
]

export function validateRegistry(records: RegistryRecord[]): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const record of records) {
    if (!record.id.trim() || seen.has(record.id)) errors.push(`Missing or duplicate component ID: ${record.id}`)
    seen.add(record.id)
    if (!record.name.trim() || !record.description.trim()) errors.push(`${record.id}: name and description are required`)
    if (!categories.includes(record.category)) errors.push(`${record.id}: unknown category`)
    if (record.previewAvailable && record.previewKind === 'unavailable') errors.push(`${record.id}: preview adapter missing`)
    if (!record.previewAvailable && record.previewKind !== 'unavailable') errors.push(`${record.id}: unavailable entry has an executable adapter`)
    if (record.sourceUrl && !/^https:\/\//.test(record.sourceUrl)) errors.push(`${record.id}: source must use HTTPS`)
    if (record.inspiration && (!record.inspiration.name.trim() || !/^https:\/\//.test(record.inspiration.url) || !record.inspiration.licence.trim() || !record.inspiration.notes.trim())) errors.push(`${record.id}: inspiration needs a source, licence note and adaptation details`)
  }
  return errors
}

export const components: ComponentRecord[] = componentRecords.map(record => ({
  ...record,
  license: record.licence.name,
  source: record.sourceUrl,
  kind: record.previewKind,
  preview: record.previewAvailable,
  date: record.createdAt,
}))
export const registryIssues = validateRegistry(componentRecords)
