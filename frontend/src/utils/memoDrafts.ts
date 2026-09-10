/**
 * 备忘录「未保存草稿」的本地暂存（IndexedDB）。
 *
 * 备忘录改为「点击保存才提交」后，未保存的修改不能只留在内存：刷新页面、
 * 切换备忘录、离开页面都不能丢，因此把草稿落到浏览器 IndexedDB。
 *
 * 约定：
 * - 本地写入不产生任何服务端请求，不影响后端并发；保存成功后立即删除草稿。
 * - 草稿按「用户 + 备忘录」隔离（`${userId}:${memoId}`），同一浏览器多账号互不干扰。
 * - IndexedDB 不可用（隐私模式、老浏览器、SSR）时全部接口静默降级为无操作，
 *   页面功能不受影响，只是失去「刷新后仍保留未保存修改」的能力。
 */

const DB_NAME = 'materials-manager'
const DB_VERSION = 1
const DRAFT_STORE = 'memo-drafts'
const USER_INDEX = 'userId'

export interface MemoDraftRecord {
  /** 复合主键，见 memoDraftKey。 */
  key: string
  userId: number
  memoId: number
  title: string
  content: string
  /** 最后一次本地修改时间（epoch ms），用于状态栏「未保存 时间」。 */
  editedAt: number
}

export const memoDraftKey = (userId: number, memoId: number): string => `${userId}:${memoId}`

/** 本地草稿与服务端内容是否存在差异（完全一致时不必显示「未保存」）。 */
export const hasPendingDraft = (
  draft: Pick<MemoDraftRecord, 'title' | 'content'>,
  memo: { title: string; content: string },
): boolean => draft.title !== memo.title || draft.content !== memo.content

let dbPromise: Promise<IDBDatabase | null> | null = null

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }
    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION)
    } catch {
      resolve(null)
      return
    }
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        const store = db.createObjectStore(DRAFT_STORE, { keyPath: 'key' })
        store.createIndex(USER_INDEX, 'userId')
      }
    }
    request.onsuccess = () => resolve(request.result)
    // 打开失败（含被其它标签页阻塞）时降级为内存态，不让页面卡住。
    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })
  return dbPromise
}

/**
 * 在草稿表中执行一次事务。
 * 成功返回请求结果（无请求时为 null）；任何失败都返回 null，由调用方按「无草稿」处理。
 */
async function withDraftStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | null,
): Promise<T | null> {
  const db = await openDb()
  if (!db) return null
  return new Promise<T | null>((resolve) => {
    let transaction: IDBTransaction
    try {
      transaction = db.transaction(DRAFT_STORE, mode)
    } catch {
      resolve(null)
      return
    }
    let result: T | null = null
    const request = run(transaction.objectStore(DRAFT_STORE))
    if (request) request.onsuccess = () => (result = request.result)
    transaction.oncomplete = () => resolve(result)
    transaction.onerror = () => resolve(null)
    transaction.onabort = () => resolve(null)
  })
}

/** 读取某用户在当前浏览器的全部未保存草稿。 */
export async function readMemoDrafts(userId: number): Promise<MemoDraftRecord[]> {
  const records = await withDraftStore<MemoDraftRecord[]>('readonly', (store) =>
    store.index(USER_INDEX).getAll(userId),
  )
  return records ?? []
}

/** 写入（或覆盖）一条草稿。 */
export async function writeMemoDraft(record: MemoDraftRecord): Promise<void> {
  await withDraftStore('readwrite', (store) => store.put(record))
}

/** 删除一条草稿（保存成功、或备忘录已被删除时调用）。 */
export async function removeMemoDraft(userId: number, memoId: number): Promise<void> {
  await withDraftStore('readwrite', (store) => store.delete(memoDraftKey(userId, memoId)))
}

/** 清理服务端已不存在的备忘录草稿，避免本地残留脏数据。 */
export async function pruneMemoDrafts(userId: number, keepMemoIds: number[]): Promise<void> {
  const keys = await withDraftStore<IDBValidKey[]>('readonly', (store) =>
    store.index(USER_INDEX).getAllKeys(userId),
  )
  if (!keys?.length) return
  const keep = new Set(keepMemoIds.map((id) => memoDraftKey(userId, id)))
  const stale = keys.filter((key) => typeof key === 'string' && !keep.has(key))
  if (!stale.length) return
  await withDraftStore('readwrite', (store) => {
    for (const key of stale) store.delete(key)
    return null
  })
}
