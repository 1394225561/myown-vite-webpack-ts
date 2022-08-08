import { defineConfig } from 'vite'
// 增加vite支持，使用vite开发
import vue from '@vitejs/plugin-vue'
// 处理最终输出的 html 的时候(SPA 应用总会有一个出口 html) 让 Vite 与 Webpack 保持一致，做代码上的兼容
import htmlTemplate from 'vite-plugin-html-template'
// Vite 中的环境变量为 import.meta 但 Webpack 上还是用的process，通过插件让 Webpack 和 Vite 统一
import EnvironmentPlugin from 'vite-plugin-environment'
// 自动导入 CompositionAPI
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      store: '/src/store'
    }
  },
  plugins: [
    vue(),
    htmlTemplate(),
    EnvironmentPlugin('all', { prefix: 'VUE_APP_' }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true
      },
      dts: './src/types/auto-imports.d.ts'
    })
  ]
})
