import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../_site/assets',
    emptyOutDir: false, // Don't empty outDir since 11ty also writes here
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/assets/js/main.js'),
        styles: resolve(__dirname, 'src/assets/css/main.css')
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  },
  css: {
    devSourcemap: true
  }
});
