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
          src: 'docs/**/*', // this now resolves to fanscale/docs/**
          dest: 'docs',
        },
        {
          src: 'custom-rank/**/*', // resolves to fanscale/custom-rank/**
          dest: 'custom',
        },
      ],
    }),
     
  ],
})