import { ref, type Ref } from 'vue'
import { AppError } from '@/api/client'
import type { ExcelImportJob } from '@/api/generated'

export interface UseImportJobOptions {
  /** 提交文件并返回导入任务（可能抛 IMPORT_IN_PROGRESS） */
  start: (file: File) => Promise<ExcelImportJob>
  /** 轮询单个任务状态 */
  poll: (jobId: number) => Promise<ExcelImportJob>
  /** 轮询间隔（毫秒），默认 1500 */
  intervalMs?: number
}

export interface UseImportJob {
  /** 是否正在导入中（提交 + 轮询期间为 true） */
  running: Ref<boolean>
  /**
   * 执行一次导入：提交 → 轮询到终态 → 成功返回 result / 失败抛 AppError；
   * 已有导入进行中时直接抛 AppError(IMPORT_IN_PROGRESS)，不重复提交。
   */
  run: (file: File) => Promise<Record<string, unknown> | null>
}

/**
 * 异步导入任务的统一轮询逻辑（物料编码库 / 华星库存共用）。
 * 后端导入已异步化：提交秒回 202 + job id，前端轮询到 SUCCEEDED/FAILED。
 */
export function useImportJob(options: UseImportJobOptions): UseImportJob {
  const { start, poll, intervalMs = 1500 } = options
  const running = ref(false)

  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

  async function run(file: File): Promise<Record<string, unknown> | null> {
    // 同步重入保护：挡住双击在同一 tick 内触发的第二次提交（第一次调用已同步置位）
    if (running.value) {
      throw new AppError({
        code: 'IMPORT_IN_PROGRESS',
        message: '导入正在进行中，请稍候',
        request_id: '',
      })
    }
    running.value = true
    try {
      let current = await start(file)
      while (current.status === 'PENDING' || current.status === 'RUNNING') {
        await sleep(intervalMs)
        current = await poll(current.id)
      }
      if (current.status === 'FAILED') {
        throw new AppError({
          code: current.error_code ?? 'IMPORT_FAILED',
          message: current.error_message ?? '导入失败',
          request_id: '',
        })
      }
      return current.result ?? null
    } finally {
      running.value = false
    }
  }

  return { running, run }
}
