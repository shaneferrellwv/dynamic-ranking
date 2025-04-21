import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  root: 'fanscale',
  build: {
    outDir: 'dist',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'docs/**/*',
          dest: 'docs',
        },
        {
          src: 'custom-rank/**/*',
          dest: 'custom',
        },
      ],
    }),
  ],
})
