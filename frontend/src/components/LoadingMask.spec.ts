import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import LoadingMask from './LoadingMask.vue'

describe('LoadingMask', () => {
  it('does not render the mask when hidden', () => {
    const wrapper = mount(LoadingMask, { props: { show: false } })

    expect(wrapper.find('.loading-mask').exists()).toBe(false)
  })

  it('renders a local overlay with the loading indicator and text', () => {
    const wrapper = mount(LoadingMask, { props: { show: true, text: '正在导入…' } })

    const mask = wrapper.find('.loading-mask')
    expect(mask.exists()).toBe(true)
    expect(mask.attributes('role')).toBe('status')
    expect(mask.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.loading-mask__text').text()).toBe('正在导入…')
  })

  it('renders no text node when text is omitted', () => {
    const wrapper = mount(LoadingMask, { props: { show: true } })

    expect(wrapper.find('.loading-mask').attributes('aria-label')).toBe('加载中')
    expect(wrapper.find('.loading-mask__text').exists()).toBe(false)
  })

  it('hides the mask again when show turns false', async () => {
    const wrapper = mount(LoadingMask, { props: { show: true } })

    await wrapper.setProps({ show: false })
    await nextTick()

    await vi.waitFor(() => expect(wrapper.find('.loading-mask').exists()).toBe(false))
  })
})
