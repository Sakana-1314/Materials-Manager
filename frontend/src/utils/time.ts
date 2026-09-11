export const formatShanghaiTime = (value?: string): string => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export const toIsoWithTimezone = (timestamp: number): string => {
  const date = new Date(timestamp)
  const shanghai = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
  const offsetMs = shanghai.getTime() - date.getTime()
  const adjusted = new Date(date.getTime() + offsetMs)
  const base = adjusted.toISOString().slice(0, 19)
  return `${base}+08:00`
}

export const toShanghaiDate = (timestamp: number): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestamp))
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

/**
 * 日期字符串（YYYY-MM-DD）→ 东八区当日零点时间戳。
 *
 * 空值必须返回 null：可选日期（集港日期、发船日期等）留空时日期选择器应保持为空，
 * 不能默认成今天——否则打开一条未填写该字段的记录就会看到“今日日期”，直接保存还会把今天写进库里。
 */
export const dateToTimestamp = (value?: string | null): number | null =>
  value ? new Date(`${value}T00:00:00+08:00`).getTime() : null

export const formatDate = (value?: string): string => (value ? value.replace(/-/g, '/') : '—')
