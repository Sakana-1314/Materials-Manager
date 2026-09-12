import { describe, expect, it } from 'vitest'
import { dateToTimestamp, formatDate, toShanghaiDate } from './time'

describe('日期工具', () => {
  it('空日期返回 null，不回落到今天（可选日期必须保持留空）', () => {
    expect(dateToTimestamp(null)).toBeNull()
    expect(dateToTimestamp(undefined)).toBeNull()
    expect(dateToTimestamp('')).toBeNull()
  })

  it('日期字符串解析为东八区当日零点时间戳', () => {
    expect(dateToTimestamp('2026-07-19')).toBe(Date.parse('2026-07-19T00:00:00+08:00'))
  })

  it('时间戳与日期字符串双向一致', () => {
    const timestamp = dateToTimestamp('2026-07-19') as number
    expect(toShanghaiDate(timestamp)).toBe('2026-07-19')
  })

  it('展示空日期为占位符', () => {
    expect(formatDate('')).toBe('—')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('2026-07-19')).toBe('2026/07/19')
  })
})
