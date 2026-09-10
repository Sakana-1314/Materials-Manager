<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import type { Memo } from '@/api/generated'
import { memoApi } from '@/api/memos'
import { formatShanghaiTime } from '@/utils/time'

const message = useMessage()
const dialog = useDialog()

const memos = ref<Memo[]>([])
const activeId = ref<number | null>(null)
const loading = ref(true)

interface MemoDraft {
  title: string
  content: string
  dirty: boolean
  saving: boolean
  failed: boolean
}

/** 各备忘录的本地草稿（未保存修改也在其中），key = memo id。 */
const drafts = reactive(new Map<number, MemoDraft>())

function ensureDraft(id: number, title: string, content: string): MemoDraft {
  let draft = drafts.get(id)
  if (!draft) {
    draft = { title, content, dirty: false, saving: false, failed: false }
    drafts.set(id, draft)
  }
  return draft
}

function draftOf(id: number): MemoDraft | undefined {
  return drafts.get(id)
}

const activeDraft = computed(() => (activeId.value == null ? undefined : draftOf(activeId.value)))

/** 顶部 tab 标签：有未保存修改时给出红点提醒。 */
function isActiveDirty(id: number): boolean {
  return id === activeId.value && (draftOf(id)?.dirty ?? false)
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

async function loadMemos(): Promise<void> {
  loading.value = true
  try {
    const list = await memoApi.listMemos()
    memos.value = list
    for (const memo of list) ensureDraft(memo.id, memo.title, memo.content)
    if (!activeId.value || !list.some((memo) => memo.id === activeId.value)) {
      activeId.value = list[0]?.id ?? null
    }
  } catch (error) {
    message.error(error instanceof Error ? error.message : '加载备忘录失败')
  } finally {
    loading.value = false
  }
}

/** 立即保存指定备忘录（跳过 debounce）。 */
async function saveMemo(id: number): Promise<void> {
  const memo = memos.value.find((item) => item.id === id)
  const draft = drafts.get(id)
  if (!memo || !draft || !draft.dirty) return
  draft.saving = true
  try {
    const updated = await memoApi.updateMemo(id, {
      title: draft.title,
      content: draft.content,
      version: memo.version,
    })
    memo.title = updated.title
    memo.content = updated.content
    memo.version = updated.version
    memo.updated_at = updated.updated_at
    draft.dirty = false
    draft.failed = false
  } catch (error) {
    draft.failed = true
    message.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    draft.saving = false
  }
}

function markDirtyAndSchedule(): void {
  const id = activeId.value
  if (id == null) return
  const draft = draftOf(id)
  if (!draft) return
  draft.dirty = true
  draft.failed = false
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    void saveMemo(id)
  }, 1000)
}

/** 立即保存当前备忘录（状态栏按钮 / Ctrl+S）。 */
function saveNow(): void {
  const id = activeId.value
  if (id == null) return
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  void saveMemo(id)
}

/** 切换 tab 前先把旧的未保存内容落盘，避免丢修改。 */
watch(activeId, async (newId, oldId) => {
  if (oldId != null) {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    const oldDraft = drafts.get(oldId)
    if (oldDraft?.dirty) await saveMemo(oldId)
  }
  if (newId != null) {
    const memo = memos.value.find((item) => item.id === newId)
    if (memo) ensureDraft(memo.id, memo.title, memo.content)
  }
})

async function handleAdd(): Promise<void> {
  const currentId = activeId.value
  if (currentId != null) {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    const draft = drafts.get(currentId)
    if (draft?.dirty) await saveMemo(currentId)
  }
  try {
    const created = await memoApi.createMemo()
    memos.value.unshift(created)
    ensureDraft(created.id, created.title, created.content)
    activeId.value = created.id
  } catch (error) {
    message.error(error instanceof Error ? error.message : '新建备忘录失败')
  }
}

function handleClose(name: string | number): void {
  const id = Number(name)
  const memo = memos.value.find((item) => item.id === id)
  if (!memo) return
  const hasUnsaved = draftOf(id)?.dirty ?? false
  dialog.warning({
    draggable: true,
    title: '删除备忘录',
    content: hasUnsaved
      ? `「${memo.title}」有尚未保存的修改，删除后不可恢复。确定删除吗？`
      : `确定删除「${memo.title}」吗？删除后不可恢复。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await memoApi.deleteMemo(id)
        drafts.delete(id)
        const index = memos.value.findIndex((item) => item.id === id)
        if (index >= 0) memos.value.splice(index, 1)
        if (memos.value.length === 0) {
          // 删空后自动补一条空白备忘录，保证页面始终可继续编辑。
          const created = await memoApi.createMemo()
          memos.value.push(created)
          ensureDraft(created.id, created.title, created.content)
          activeId.value = created.id
        } else if (activeId.value === id) {
          activeId.value = memos.value[Math.min(index, memos.value.length - 1)].id
        } else if (activeId.value === null) {
          activeId.value = memos.value[0].id
        }
      } catch (error) {
        message.error(error instanceof Error ? error.message : '删除失败')
        return false
      }
    },
  })
}

/** 状态栏：正在保存 / 保存失败 / 有未保存修改 / 已保存。 */
const saveStatus = computed(() => {
  const draft = activeDraft.value
  if (!draft) return { type: 'idle', text: '' }
  if (draft.saving) return { type: 'saving', text: '正在保存…' }
  if (draft.failed) return { type: 'error', text: '保存失败，请重试' }
  if (draft.dirty) return { type: 'dirty', text: '有未保存的修改' }
  const memo = memos.value.find((item) => item.id === activeId.value)
  return { type: 'saved', text: memo ? `已保存 ${formatShanghaiTime(memo.updated_at)}` : '' }
})

function onGlobalKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    saveNow()
  }
}

onBeforeUnmount(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  const id = activeId.value
  if (id != null) {
    const draft = drafts.get(id)
    if (draft?.dirty) void saveMemo(id)
  }
})

void loadMemos()
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">备忘录</h1>
      </div>
      <n-button type="primary" secondary @click="handleAdd">新建备忘录</n-button>
    </div>

    <n-card class="memo-card">
      <n-spin :show="loading">
        <n-empty
          v-if="!loading && memos.length === 0"
          size="large"
          description="还没有备忘录，新建一条开始记录吧"
        >
          <template #extra>
            <n-button type="primary" @click="handleAdd">新建备忘录</n-button>
          </template>
        </n-empty>

        <n-tabs
          v-else
          v-model:value="activeId"
          type="line"
          closable
          addable
          class="memo-tabs"
          @add="handleAdd"
          @close="handleClose"
        >
          <n-tab-pane v-for="memo in memos" :key="memo.id" :name="memo.id">
            <template #tab>
              <span class="memo-tab">
                <span class="memo-tab-title">{{ draftOf(memo.id)?.title ?? memo.title }}</span>
                <span v-if="isActiveDirty(memo.id)" class="memo-dirty-dot" title="有未保存的修改" />
              </span>
            </template>

            <div v-if="activeDraft" class="memo-editor" @keydown="onGlobalKeydown">
              <n-input
                v-model:value="activeDraft.title"
                class="memo-title-input"
                placeholder="备忘录标题"
                maxlength="64"
                show-count
                @update:value="markDirtyAndSchedule"
              />
              <n-input
                v-model:value="activeDraft.content"
                type="textarea"
                class="memo-content-input"
                placeholder="在这里记录纯文本内容，输入后自动保存（Ctrl+S 立即保存）…"
                :autosize="{ minRows: 12, maxRows: 32 }"
                maxlength="10000"
                show-count
                @update:value="markDirtyAndSchedule"
              />
              <div class="memo-statusbar">
                <span class="memo-status" :class="`memo-status--${saveStatus.type}`">
                  {{ saveStatus.text }}
                </span>
                <n-button size="small" secondary :disabled="activeDraft.saving" @click="saveNow">
                  立即保存
                </n-button>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-spin>
    </n-card>
  </div>
</template>

<style scoped>
.memo-tabs {
  min-height: 420px;
}

.memo-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
}

.memo-tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-dirty-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--color-warning);
}

.memo-editor {
  display: grid;
  gap: 12px;
  padding: 14px 4px 4px;
}

.memo-title-input {
  max-width: 480px;
}

.memo-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.memo-status {
  color: var(--color-text-muted);
  font-size: 13px;
}

.memo-status--saving,
.memo-status--dirty {
  color: var(--color-warning);
}

.memo-status--error {
  color: var(--color-danger);
}
</style>
