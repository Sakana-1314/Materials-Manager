import { describe, expect, it } from 'vitest'
import {
  hasPendingDraft,
  memoDraftKey,
  pruneMemoDrafts,
  readMemoDrafts,
  removeMemoDraft,
  writeMemoDraft,
} from './memoDrafts'

describe('memoDrafts', () => {
  it('按用户与备忘录生成互不串号的草稿主键', () => {
    expect(memoDraftKey(1, 2)).toBe('1:2')
    expect(memoDraftKey(1, 2)).not.toBe(memoDraftKey(1, 3))
    expect(memoDraftKey(2, 1)).not.toBe(memoDraftKey(1, 2))
  })

  it('只有本地草稿与服务端内容不一致时才算未保存', () => {
    const memo = { title: '标题', content: '正文' }
    expect(hasPendingDraft({ title: '标题', content: '正文' }, memo)).toBe(false)
    expect(hasPendingDraft({ title: '新标题', content: '正文' }, memo)).toBe(true)
    expect(hasPendingDraft({ title: '标题', content: '新正文' }, memo)).toBe(true)
  })

  it('IndexedDB 不可用时静默降级，不抛错也不阻塞页面', async () => {
    expect(typeof indexedDB).toBe('undefined')

    await expect(readMemoDrafts(1)).resolves.toEqual([])
    await expect(
      writeMemoDraft({
        key: memoDraftKey(1, 2),
        userId: 1,
        memoId: 2,
        title: '标题',
        content: '正文',
        editedAt: 1,
      }),
    ).resolves.toBeUndefined()
    await expect(removeMemoDraft(1, 2)).resolves.toBeUndefined()
    await expect(pruneMemoDrafts(1, [2, 3])).resolves.toBeUndefined()
  })
})
