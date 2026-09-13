<script setup lang="ts">
import { provide, ref } from 'vue'

/**
 * 页面内的二级 tab 容器。
 *
 * 用法（tab 列表写在 Tabs 上，内容由同名 TabsContent 提供，两侧在 SSR 与客户端都一致）：
 *
 *   <Tabs :tabs="[{ id: 'a', title: '标题 A' }, { id: 'b', title: '标题 B' }]">
 *     <TabsContent id="a">…</TabsContent>
 *     <TabsContent id="b">…</TabsContent>
 *   </Tabs>
 */
const props = defineProps<{
  tabs: { id: string; title: string }[]
  group?: string
}>()

const activeId = ref(props.tabs[0]?.id ?? '')

const uid = `tabs-${Math.random().toString(36).slice(2, 9)}`

provide('tabs-state', { activeId, uid })

const group = props.group
</script>

<template>
  <div class="tabs" :data-group="group">
    <nav class="tabs-nav" role="tablist">
      <button
        v-for="item in props.tabs"
        :key="item.id"
        type="button"
        role="tab"
        class="tabs-nav-button"
        :class="{ active: item.id === activeId }"
        :aria-selected="item.id === activeId ? 'true' : 'false'"
        @click="activeId = item.id"
      >
        {{ item.title }}
      </button>
    </nav>
    <div class="tabs-body">
      <slot />
    </div>
  </div>
</template>
