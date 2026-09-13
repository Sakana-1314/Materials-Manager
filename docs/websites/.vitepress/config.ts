import { defineConfig } from 'vitepress'

/**
 * 站点源码在 pages/（srcDir），构建产物在 .vitepress/dist/。
 * base 必须与 GitHub Pages 的仓库路径一致：https://sakana-1314.github.io/Electrical-Manager/
 */
export default defineConfig({
  base: '/Electrical-Manager/',
  srcDir: 'pages',
  lang: 'zh-CN',
  title: 'HXNI 电气无忧',
  description: '华星镍业电气车间电气业务管理系统：库存、申购、采购跟踪一体化，逐步扩展到电气车间其他业务。',
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2080f0' }],
    ['link', { rel: 'icon', href: '/Electrical-Manager/logo.png' }],
  ],
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'HXNI 电气无忧',
    outline: { level: [2, 3], label: '本页目录' },
    nav: [
      { text: '功能', link: '/#功能' },
      { text: '使用指南', link: '/guide' },
      { text: '接口约定', link: '/api-error-conventions' },
      { text: '开发方案', link: '/development-plan' },
    ],
    sidebar: [
      {
        text: '入门',
        items: [
          { text: '功能总览', link: '/' },
          { text: '使用与部署指南', link: '/guide' },
        ],
      },
      {
        text: '开发约定',
        items: [
          { text: '开发方案', link: '/development-plan' },
          { text: 'API 错误与状态码约定', link: '/api-error-conventions' },
          { text: 'UI 设计规范', link: '/ui-design-guidelines' },
        ],
      },
      {
        text: '部署与测试',
        items: [
          { text: '前后端分离部署', link: '/frontend-separated-deployment' },
          { text: '人工功能测试方案', link: '/manual-functional-test-plan' },
        ],
      },
    ],
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    lastUpdatedText: '最后更新',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    footer: {
      message: '本系统为华星镍业检修维护部电气自动化车间内部使用',
      copyright: '版权归 Sakana-1314 所有',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Sakana-1314/Electrical-Manager' }],
  },
})
