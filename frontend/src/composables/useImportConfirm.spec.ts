import { describe, expect, it, vi } from 'vitest'
import type { DialogApi, DialogOptions, DialogReactive } from 'naive-ui'
import { useImportConfirm } from './useImportConfirm'

/** 命令式弹窗的极简替身：warning 返回传入的 options 对象本身，便于断言被改写的字段。 */
function setupDialog() {
  const created: DialogReactive[] = []
  const dialog = {
    warning: vi.fn((options: DialogOptions) => {
      const instance = options as DialogReactive
      created.push(instance)
      return instance
    }),
  } as unknown as DialogApi
  return { dialog, created }
}

const options = {
  title: '全量更新二级库',
  content: '确认导入“a.xlsx”吗？',
  runningText: '正在导入并全量更新，请勿重复提交…',
  run: async () => {},
}

describe('useImportConfirm', () => {
  it('以给定文案创建弹窗，并禁止遮罩点击与 Esc 关闭', () => {
    const { dialog, created } = setupDialog()

    useImportConfirm(dialog)({ ...options })

    expect(dialog.warning).toHaveBeenCalledTimes(1)
    const instance = created[0]
    expect(instance.title).toBe('全量更新二级库')
    expect(instance.content).toBe('确认导入“a.xlsx”吗？')
    expect(instance.positiveText).toBe('确认全量更新')
    expect(instance.negativeText).toBe('取消')
    expect(instance.maskClosable).toBe(false)
    expect(instance.closeOnEsc).toBe(false)
    expect(instance.positiveButtonProps).toEqual({ type: 'primary' })
  })

  it('确认后确认按钮进入 loading 与禁用，正文切换为进行中提示', async () => {
    const { dialog, created } = setupDialog()
    const run = vi.fn(async () => {})
    useImportConfirm(dialog)({ ...options, run })

    const instance = created[0]
    const pending = instance.onPositiveClick?.(new MouseEvent('click'))

    expect(instance.positiveButtonProps).toEqual({ type: 'primary', loading: true, disabled: true })
    expect(instance.negativeButtonProps).toEqual({ disabled: true })
    expect(instance.content).toBe(options.runningText)

    await pending
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('导入失败时不产生未处理的拒绝，并把错误交给 onError', async () => {
    const { dialog, created } = setupDialog()
    const error = new Error('导入失败')
    const onError = vi.fn()
    useImportConfirm(dialog)({
      ...options,
      run: async () => {
        throw error
      },
      onError,
    })

    await expect(created[0].onPositiveClick?.(new MouseEvent('click'))).resolves.toBeUndefined()
    expect(onError).toHaveBeenCalledWith(error)
  })
})
