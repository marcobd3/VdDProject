// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages por defecto. Para otro dominio: SITE_URL=https://midominio.gal BASE_PATH=/ npm run build
const site = process.env.SITE_URL ?? 'https://marcobd3.github.io';
const base = process.env.BASE_PATH ?? '/VdDProject';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
