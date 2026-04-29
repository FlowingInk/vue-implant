import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vue-implant/core': resolve(__dirname, 'packages/core/src'),
      '@vue-implant/vue': resolve(__dirname, 'packages/vue/src'),
      '@vue-implant/react': resolve(__dirname, 'packages/react/src'),
    },
  },
  root: resolve(__dirname, 'demo'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true
  }
})
