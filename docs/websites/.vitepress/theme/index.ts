import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

// 站点主题：在默认主题之上注册自定义的「二级 tab」组件（Tabs / TabsContent），
// 让长文档可以按子主题分块，而不是一直往下滚。
import Tabs from './components/Tabs.vue'
import TabsContent from './components/TabsContent.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Tabs', Tabs)
    app.component('TabsContent', TabsContent)
  },
} satisfies Theme
