/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: "VueImplant",
      fileName: 'vue-implant'
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['vue']
  },
  plugins: [vue(), dts({
    rollupTypes: true,
    tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
    outDir: 'dist/types',

    exclude: ['./__test__/**/*.test.ts'],
    include: ['src/**/*.ts']
  })],
  test: {
    silent: true,
    environment: 'jsdom',
    include: ['./__test__/**/*.test.ts'],
  },
})
