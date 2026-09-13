<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'

/**
 * 单个 tab 面板，必须放在 <Tabs> 内部。
 * 未选中的面板用 v-show 隐藏（内容仍在 DOM 中，便于站内搜索与锚点跳转）。
 */
const props = defineProps<{ id: string }>()

const state = inject<{ activeId: Ref<string>; uid: string }>('tabs-state')

if (!state) {
  throw new Error('<TabsContent> 必须放在 <Tabs> 内部')
}

const active = computed(() => state.activeId.value === props.id)
const panelId = computed(() => `${state.uid}-${props.id}`)
</script>

<template>
  <section v-show="active" class="tabs-panel" :id="panelId" role="tabpanel">
    <slot />
  </section>
</template>
