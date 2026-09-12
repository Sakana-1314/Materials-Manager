import type { DialogApi } from 'naive-ui'

export interface ImportConfirmOptions {
  /** 弹窗标题，如「全量更新华星总库存」 */
  title: string
  /** 确认前正文，通常回显文件名与替换范围 */
  content: string
  /** 导入进行中的正文提示 */
  runningText: string
  /** 确认按钮文案，默认「确认全量更新」 */
  confirmText?: string
  /** 执行导入；内部不再自行提示错误，由 onError 统一处理 */
  run: () => Promise<void>
  /** 导入失败或重复提交时的提示回调 */
  onError?: (error: unknown) => void
}

/**
 * 全量更新导入的确认弹窗。
 *
 * 命令式弹窗（`useDialog().warning`）不会自动为确认按钮加 loading，点击后弹窗会一直
 * 保持打开且按钮可点，容易重复提交（后端对同类任务返回 409）。这里在确认后立刻把
 * 确认/取消按钮置为禁用并切换为进行中文案；naive-ui 会在 onPositiveClick 返回的
 * Promise resolve 后自动关闭弹窗，成功路径无需手工关闭。
 */
export function useImportConfirm(dialog: DialogApi) {
  return function confirmImport(options: ImportConfirmOptions): void {
    const { title, content, runningText, confirmText = '确认全量更新', run, onError } = options
    const instance = dialog.warning({
      draggable: true,
      title,
      content,
      positiveText: confirmText,
      negativeText: '取消',
      // 导入期间不允许通过遮罩点击 / Esc 关掉唯一进度反馈，避免关掉后重复提交
      maskClosable: false,
      closeOnEsc: false,
      positiveButtonProps: { type: 'primary' },
      onPositiveClick: async () => {
        instance.positiveButtonProps = { type: 'primary', loading: true, disabled: true }
        instance.negativeButtonProps = { disabled: true }
        instance.content = runningText
        try {
          await run()
        } catch (error) {
          // 兜底捕获，避免 naive-ui 内部出现未处理的 Promise 拒绝；提示交给调用方
          onError?.(error)
        }
      },
    })
  }
}
