import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // 子路径部署：VITE_BASE_PATH='/Electrical-Manager/demo/' 时资源与路由都挂在该前缀下。
    // 默认 '/' 与既有部署行为完全一致；router 用 import.meta.env.BASE_URL 自动跟随。
    base: env.VITE_BASE_PATH?.trim() || '/',
    plugins: [vue(), Components({ resolvers: [NaiveUiResolver()] })],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    build: { assetsDir: 'yangrucheng-assets' },
    server: {
      port: 5173,
      proxy:
        env.VITE_USE_MOCK === 'false'
          ? { '/api': env.VITE_API_PROXY || 'http://localhost:8000' }
          : undefined,
    },
  }
})
