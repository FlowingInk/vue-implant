/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['vue']
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['src/**/__test__/**/*.test.ts'],
  },
})
