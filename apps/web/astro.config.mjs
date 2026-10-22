import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [svelte()],
  output: 'static',
  devToolbar: { enabled: false },
  // Inline CSS removes the render-blocking stylesheet request on first paint.
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
    server: { proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: false } } },
  },
});
