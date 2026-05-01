import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * En dev (`vite`), on remplace `__PROSPECT_DATA__` par le contenu de
 * `prospect-data.example.json` pour que le site rende immédiatement.
 *
 * En build (`vite build`), le placeholder est conservé tel quel : c'est
 * le Worker (Module 3) qui fera la substitution à la volée à partir des
 * données stockées dans D1.
 */
function prospectDataInjection(): Plugin {
  return {
    name: 'prospect-data-injection',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.server == null) return html; // build phase → keep placeholder
        const file = path.resolve(__dirname, 'prospect-data.example.json');
        const json = readFileSync(file, 'utf-8').trim();
        return html.replace('__PROSPECT_DATA__', json);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), prospectDataInjection()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Single bundle to keep Worker substitution + caching simple
        inlineDynamicImports: true
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
