import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Read the same repository-root .env file used by the API setup.
  envDir: fileURLToPath(new URL('../../', import.meta.url)),
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
