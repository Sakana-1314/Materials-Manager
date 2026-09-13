import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MEMO_FONT_SIZE_DEFAULT,
  MEMO_FONT_SIZE_STORAGE_KEY,
  normalizeMemoFontSize,
  readMemoFontSize,
  writeMemoFontSize,
} from './memoFontSize'

beforeEach(() => localStorage.clear())

describe('memoFontSize', () => {
  it('未写入过偏好时默认 16px', () => {
    expect(localStorage.getItem(MEMO_FONT_SIZE_STORAGE_KEY)).toBeNull()
    expect(readMemoFontSize()).toBe(MEMO_FONT_SIZE_DEFAULT)
    expect(MEMO_FONT_SIZE_DEFAULT).toBe(16)
  })

  it('写入后可按浏览器本地记录读取回来', () => {
    expect(writeMemoFontSize(20)).toBe(20)
    expect(localStorage.getItem(MEMO_FONT_SIZE_STORAGE_KEY)).toBe('20')
    expect(readMemoFontSize()).toBe(20)
  })

  it('归一化：接受数字与数字字符串，非法 / 越界值回落默认档位', () => {
    expect(normalizeMemoFontSize(18)).toBe(18)
    expect(normalizeMemoFontSize('20')).toBe(20)
    expect(normalizeMemoFontSize(' 24 ')).toBe(24)
    for (const invalid of [null, undefined, '', 'abc', '17', 17, 99, {}, NaN, Infinity]) {
      expect(normalizeMemoFontSize(invalid)).toBe(MEMO_FONT_SIZE_DEFAULT)
    }
  })

  it('本地存的非法 / 越界值按默认档位处理，且不会被原样写回', () => {
    localStorage.setItem(MEMO_FONT_SIZE_STORAGE_KEY, 'abc')
    expect(readMemoFontSize()).toBe(MEMO_FONT_SIZE_DEFAULT)

    expect(writeMemoFontSize(99)).toBe(MEMO_FONT_SIZE_DEFAULT)
    expect(localStorage.getItem(MEMO_FONT_SIZE_STORAGE_KEY)).toBe(String(MEMO_FONT_SIZE_DEFAULT))
  })

  it('localStorage 不可用时静默降级：读走默认值，写不抛错', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(readMemoFontSize()).toBe(MEMO_FONT_SIZE_DEFAULT)
    expect(writeMemoFontSize(24)).toBe(24)
  })
})
