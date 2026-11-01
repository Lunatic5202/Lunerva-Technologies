const databaseName = 'lunevra-observatory'
const databaseVersion = 2
const recordsStore = 'records'
const maxBenchmarkRecords = 500
import type { LicenceReviewRecord } from '../domain/registry'
import { validateTheme, type Theme } from '../domain/themes'

export type WorkspaceData = {
  schemaVersion: 2
  favourites: string[]
  collections: string[]
  collectionItems: Record<string, string[]>
  collectionDetails: Record<string, { description: string; notes: string; tags: string[] }>
  savedThemes: Theme[]
  theme: Theme
  licenceReviews: Record<string, LicenceReviewRecord>
  recentItems: string[]
}

export type BenchmarkRecord = {
  id: string
  componentId: string
  startedAt: string
  durationMs: number
  warmupMs: number
  viewport: { width: number; height: number }
  userAgent: string
  metrics: { averageFps: number; averageFrameMs: number; frameVarianceMs: number; droppedFrames: number; longTasks: number; heapBytes: number | null }
}

const initialWorkspace: WorkspaceData = {
  schemaVersion: 2,
  favourites: [],
  collections: ['LUNEVRA Website', 'LUNA', 'Game Websites', 'Experimental Animations', 'Commercially Approved'],
  collectionItems: {},
  collectionDetails: {},
  savedThemes: [],
  theme: { name: 'LUNEVRA Original', background: '#08090B', surface: '#101216', raised: '#171A1F', text: '#F2F3F4', muted: '#9299A3', accent: '#75D9E8', border: '#292D33', headingFont: 'Manrope', bodyFont: 'Inter', radius: 3, spacing: 8 },
  licenceReviews: {},
  recentItems: [],
}

let connection: Promise<IDBDatabase> | undefined

function openDatabase() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('This browser does not provide IndexedDB.'))
  if (!connection) connection = new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(recordsStore)) db.createObjectStore(recordsStore, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'))
    request.onblocked = () => reject(new Error('Close another Observatory tab to finish the local data upgrade.'))
  })
  return connection
}

function validStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function objectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function validCollectionItems(value: unknown): value is Record<string, string[]> {
  return objectRecord(value) && Object.values(value).every(validStringArray)
}

function validCollectionDetails(value: unknown): value is WorkspaceData['collectionDetails'] {
  if (!objectRecord(value)) return false
  return Object.values(value).every(detail => objectRecord(detail) && typeof detail.description === 'string' && typeof detail.notes === 'string' && validStringArray(detail.tags))
}

function validLicenceReview(value: unknown): value is LicenceReviewRecord {
  if (!objectRecord(value)) return false
  const statuses = ['Verified', 'Review required', 'Restricted', 'Unknown']
  const permissions = ['Allowed', 'Restricted', 'Review required', 'Unknown']
  return statuses.includes(String(value.status)) && permissions.includes(String(value.commercialUse)) && permissions.includes(String(value.modification)) && permissions.includes(String(value.redistribution)) && ['name', 'version', 'attribution', 'verifiedAt', 'reference', 'notes'].every(key => typeof value[key] === 'string')
}

function validLicenceReviews(value: unknown): value is Record<string, LicenceReviewRecord> {
  return objectRecord(value) && Object.values(value).every(validLicenceReview)
}

function validBenchmark(value: unknown): value is BenchmarkRecord {
  if (!objectRecord(value) || !objectRecord(value.viewport) || !objectRecord(value.metrics)) return false
  const finite = (entry: unknown) => typeof entry === 'number' && Number.isFinite(entry) && entry >= 0
  return typeof value.id === 'string' && typeof value.componentId === 'string' && typeof value.userAgent === 'string' && typeof value.startedAt === 'string' && Number.isFinite(Date.parse(value.startedAt)) && finite(value.durationMs) && finite(value.warmupMs) && finite(value.viewport.width) && finite(value.viewport.height) && finite(value.metrics.averageFps) && finite(value.metrics.averageFrameMs) && finite(value.metrics.frameVarianceMs) && finite(value.metrics.droppedFrames) && finite(value.metrics.longTasks) && (value.metrics.heapBytes === null || finite(value.metrics.heapBytes))
}

function parseLegacy(key: string): unknown {
  try {
    const raw = localStorage.getItem(`obs-${key}`)
    return raw ? JSON.parse(raw) as unknown : undefined
  } catch {
    return undefined
  }
}

function legacyWorkspace(): WorkspaceData {
  const savedTheme = parseLegacy('theme')
  const theme = validateTheme(savedTheme) ? savedTheme : initialWorkspace.theme
  const savedThemes = parseLegacy('themes')
  return {
    ...initialWorkspace,
    favourites: validStringArray(parseLegacy('favourites')) ? parseLegacy('favourites') as string[] : [],
    collections: validStringArray(parseLegacy('collections')) ? parseLegacy('collections') as string[] : initialWorkspace.collections,
    collectionItems: validCollectionItems(parseLegacy('collection-items')) ? parseLegacy('collection-items') as Record<string, string[]> : {},
    collectionDetails: {},
    savedThemes: Array.isArray(savedThemes) ? savedThemes.filter(validateTheme) : [],
    theme,
    licenceReviews: {},
    recentItems: [],
  }
}

function validWorkspace(value: unknown): value is WorkspaceData {
  if (!objectRecord(value)) return false
  const record = value as Partial<WorkspaceData>
  if (record.schemaVersion !== 2 || !validStringArray(record.favourites) || !validStringArray(record.collections) || !validStringArray(record.recentItems)) return false
  if (!validCollectionItems(record.collectionItems) || !validCollectionDetails(record.collectionDetails) || !validLicenceReviews(record.licenceReviews)) return false
  if (!Array.isArray(record.savedThemes) || !record.savedThemes.every(validateTheme) || !validateTheme(record.theme)) return false
  return true
}

function migrateWorkspace(value: unknown): WorkspaceData | undefined {
  if (!objectRecord(value) || value.schemaVersion !== 1) return undefined
  const collections = validStringArray(value.collections) ? Array.from(new Set(value.collections)) : initialWorkspace.collections
  return {
    schemaVersion: 2,
    favourites: validStringArray(value.favourites) ? value.favourites : [],
    collections,
    collectionItems: validCollectionItems(value.collectionItems) ? value.collectionItems : {},
    collectionDetails: validCollectionDetails(value.collectionDetails) ? value.collectionDetails : {},
    savedThemes: Array.isArray(value.savedThemes) ? value.savedThemes.filter(validateTheme) : [],
    theme: validateTheme(value.theme) ? value.theme : initialWorkspace.theme,
    licenceReviews: validLicenceReviews(value.licenceReviews) ? value.licenceReviews : {},
    recentItems: validStringArray(value.recentItems) ? value.recentItems.slice(0, 40) : [],
  }
}

export async function loadWorkspace(): Promise<WorkspaceData> {
  const db = await openDatabase()
  const existing = await new Promise<unknown>((resolve, reject) => {
    const request = db.transaction(recordsStore, 'readonly').objectStore(recordsStore).get('workspace')
    request.onsuccess = () => resolve(request.result?.value)
    request.onerror = () => reject(request.error)
  })
  if (validWorkspace(existing)) return existing
  const migrated = migrateWorkspace(existing) ?? legacyWorkspace()
  await saveWorkspace(migrated)
  return migrated
}

export async function saveWorkspace(workspace: WorkspaceData): Promise<void> {
  if (!validWorkspace(workspace)) throw new Error('Workspace data did not pass validation.')
  const db = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(recordsStore, 'readwrite')
    transaction.objectStore(recordsStore).put({ key: 'workspace', value: workspace })
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save workspace data.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving workspace data was cancelled.'))
  })
}

export async function loadBenchmarks(): Promise<BenchmarkRecord[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = db.transaction(recordsStore, 'readonly').objectStore(recordsStore).get('benchmarks')
    request.onsuccess = () => resolve(Array.isArray(request.result?.value) ? request.result.value.filter(validBenchmark).slice(-maxBenchmarkRecords) : [])
    request.onerror = () => reject(request.error)
  })
}

export async function saveBenchmarks(records: BenchmarkRecord[]): Promise<void> {
  if (!Array.isArray(records) || !records.every(validBenchmark)) throw new Error('Measurement data did not pass validation.')
  const db = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(recordsStore, 'readwrite')
    transaction.objectStore(recordsStore).put({ key: 'benchmarks', value: records.slice(-maxBenchmarkRecords) })
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save measurements.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving measurements was cancelled.'))
  })
}

export async function exportWorkspace(workspace: WorkspaceData, benchmarks: BenchmarkRecord[]) {
  return { format: 'lunevra-observatory-backup', version: 2, exportedAt: new Date().toISOString(), workspace, benchmarks }
}

export function validateBackup(value: unknown): value is { format: string; version: number; workspace: WorkspaceData; benchmarks: BenchmarkRecord[] } {
  if (!value || typeof value !== 'object') return false
  const backup = value as { format?: unknown; version?: unknown; workspace?: unknown; benchmarks?: unknown }
  return backup.format === 'lunevra-observatory-backup' && backup.version === 2 && validWorkspace(backup.workspace) && Array.isArray(backup.benchmarks) && backup.benchmarks.length <= maxBenchmarkRecords && backup.benchmarks.every(validBenchmark)
}
