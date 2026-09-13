/**
 * 备忘录编辑区字号偏好（纯浏览器本地，不落库、不产生任何请求）。
 *
 * 约定：
 * - 浏览器级偏好：同一浏览器换账号共享，换浏览器各自独立（不像草稿那样按用户隔离）。
 * - 只接受预设档位，非法 / 越界值一律回落默认 16px，且不把脏值写回本地存储。
 * - localStorage 不可用（隐私模式、老浏览器、SSR）时静默降级为默认值，页面功能不受影响。
 */

export const MEMO_FONT_SIZE_STORAGE_KEY = 'memos.font-size'
export const MEMO_FONT_SIZE_DEFAULT = 16
/** 可选档位，同时作为校验白名单：新增档位只改这里（下拉选项与校验都取自它）。 */
export const MEMO_FONT_SIZE_OPTIONS = [14, 16, 18, 20, 24] as const

export type MemoFontSize = (typeof MEMO_FONT_SIZE_OPTIONS)[number]

/** 归一化为合法档位：数字或数字字符串（如 '18'）可识别，其余一律回落默认值。 */
export function normalizeMemoFontSize(value: unknown): MemoFontSize {
  const size = typeof value === 'string' ? Number(value.trim()) : value
  return MEMO_FONT_SIZE_OPTIONS.includes(size as MemoFontSize)
    ? (size as MemoFontSize)
    : MEMO_FONT_SIZE_DEFAULT
}

/** 读取本地字号偏好（未写入 / 值非法 / 存储不可用时返回默认 16px）。 */
export function readMemoFontSize(): MemoFontSize {
  try {
    return normalizeMemoFontSize(localStorage.getItem(MEMO_FONT_SIZE_STORAGE_KEY))
  } catch {
    return MEMO_FONT_SIZE_DEFAULT
  }
}

/** 写入本地字号偏好；存储不可用时静默失败，仅本次会话生效。返回归一化后的档位。 */
export function writeMemoFontSize(value: number): MemoFontSize {
  const size = normalizeMemoFontSize(value)
  try {
    localStorage.setItem(MEMO_FONT_SIZE_STORAGE_KEY, String(size))
  } catch {
    // 存储不可用（隐私模式 / 配额满）：忽略写入失败，档位仍对当前会话生效。
  }
  return size
}
