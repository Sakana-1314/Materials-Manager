import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { NButton, NCard, NDialogProvider, NEmpty, NInput, NMessageProvider, NSpace } from 'naive-ui'
import { createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import type { Memo } from '@/api/generated'
import { memoApi } from '@/api/memos'
import MemosView from './MemosView.vue'

vi.mock('@/api/memos', () => ({
  memoApi: {
    listMemos: vi.fn(),
    createMemo: vi.fn(),
    updateMemo: vi.fn(),
    deleteMemo: vi.fn(),
  },
}))

const api = vi.mocked(memoApi)

const memo = (overrides: Partial<Memo> = {}): Memo => ({
  id: 1,
  title: '标题',
  content: '正文',
  created_at: '2026-09-10T07:12:25Z',
  updated_at: '2026-09-10T07:12:25Z',
  version: 1,
  ...overrides,
})

const Host = defineComponent({
  render: () =>
    h(NDialogProvider, null, {
      default: () => h(NMessageProvider, null, { default: () => h(MemosView) }),
    }),
})

let wrapper: VueWrapper | null = null

async function mountView(memos: Memo[]): Promise<VueWrapper> {
  api.listMemos.mockResolvedValue(memos)
  localStorage.setItem(
    'auth_user',
    JSON.stringify({ id: 7, username: 'tester', role: 'SUPER_ADMIN' }),
  )
  wrapper = mount(Host, {
    attachTo: document.body,
    global: {
      plugins: [createPinia()],
      // 单测环境未启用 unplugin-vue-components，需显式注册模板里的 n-* 组件。
      components: {
        NButton,
        NCard,
        NDialogProvider,
        NEmpty,
        NInput,
        NMessageProvider,
        NSpace,
      },
    },
  })
  await flushPromises()
  return wrapper
}

/** 在指定范围内按可见文字找按钮。 */
function buttonByText(root: ParentNode | null, text: string): HTMLButtonElement | undefined {
  return [...(root?.querySelectorAll('button') ?? [])].find((button) =>
    button.textContent?.trim().includes(text),
  ) as HTMLButtonElement | undefined
}

function pageButton(text: string): HTMLButtonElement | undefined {
  return buttonByText(wrapper?.element as ParentNode, text)
}

/** 弹窗按钮（naive-ui 弹窗渲染在 .n-dialog 内）。 */
function dialogButton(text: string): HTMLButtonElement | undefined {
  return buttonByText(document.querySelector('.n-dialog'), text)
}

function listButtons(): HTMLButtonElement[] {
  return [...(wrapper?.element as ParentNode).querySelectorAll<HTMLButtonElement>('.memo-item')]
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.innerHTML = ''
})

describe('MemosView 编辑与保存', () => {
  it('编辑内容不会自动保存，点击保存才提交一次', async () => {
    api.updateMemo.mockResolvedValue(memo({ content: '新内容', version: 2 }))
    const view = await mountView([memo()])

    await view.get('textarea').setValue('新内容')
    await flushPromises()

    expect(api.updateMemo).not.toHaveBeenCalled()
    expect(view.text()).toContain('未保存')

    pageButton('保存')?.click()
    await flushPromises()

    expect(api.updateMemo).toHaveBeenCalledTimes(1)
    expect(api.updateMemo).toHaveBeenCalledWith(1, { title: '标题', content: '新内容', version: 1 })
    expect(view.text()).toContain('已保存')
  })

  it('保存请求在途时连续点击只发一次请求', async () => {
    const pending = deferred<Memo>()
    api.updateMemo.mockReturnValue(pending.promise)
    const view = await mountView([memo()])

    await view.get('textarea').setValue('新内容')
    const saveButton = pageButton('保存')
    saveButton?.click()
    saveButton?.click()
    saveButton?.click()
    await flushPromises()

    expect(api.updateMemo).toHaveBeenCalledTimes(1)

    pending.resolve(memo({ content: '新内容', version: 2 }))
    await flushPromises()
    expect(view.text()).toContain('已保存')
  })

  it('未保存的修改在切换备忘录后仍保留，并继续显示未保存', async () => {
    const view = await mountView([memo(), memo({ id: 2, title: '第二条', content: '第二条正文' })])

    await view.get('textarea').setValue('草稿内容')
    await flushPromises()

    listButtons()[1].click()
    await flushPromises()
    expect(view.get('textarea').element.value).toBe('第二条正文')

    listButtons()[0].click()
    await flushPromises()
    expect(view.get('textarea').element.value).toBe('草稿内容')
    expect(view.text()).toContain('未保存')
    expect(api.updateMemo).not.toHaveBeenCalled()
  })
})

describe('MemosView 新建与删除确认', () => {
  it('新建必须先经弹窗确认，请求在途时忽略重复确认', async () => {
    const view = await mountView([memo()])
    pageButton('新建备忘录')?.click()
    await flushPromises()

    expect(api.createMemo).not.toHaveBeenCalled()

    const pending = deferred<Memo>()
    api.createMemo.mockReturnValue(pending.promise)
    const confirm = dialogButton('新建')
    expect(confirm).toBeTruthy()
    confirm?.click()
    confirm?.click()
    await flushPromises()
    expect(api.createMemo).toHaveBeenCalledTimes(1)

    pending.resolve(memo({ id: 9, title: '未命名备忘录', content: '' }))
    await flushPromises()
    expect(view.text()).toContain('未命名备忘录')
  })

  it('删除必须先经弹窗确认，确认后调用删除接口', async () => {
    api.deleteMemo.mockResolvedValue(undefined as never)
    const view = await mountView([memo()])

    pageButton('删除')?.click()
    await flushPromises()
    expect(api.deleteMemo).not.toHaveBeenCalled()

    dialogButton('删除')?.click()
    await flushPromises()

    expect(api.deleteMemo).toHaveBeenCalledWith(1)
    expect(view.text()).toContain('还没有备忘录')
  })
})
