import { defineConfig } from 'vite'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: 'fanscale',
  build: {
    outDir: 'dist',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: path.resolve('fanscale/docs'),
          dest: 'docs',
        },
      ],
    }),
  ],
})
