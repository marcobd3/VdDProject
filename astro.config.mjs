// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Por defecto se publica en la raíz del dominio (Vercel). En Vercel se usa su URL de producción.
// Para otro dominio o subcarpeta: SITE_URL=https://midominio.gal BASE_PATH=/subcarpeta npm run build
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'https://vd-d-project.vercel.app');
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Galego na raíz (idioma predeterminado), castelán en /es/ e inglés en /en/
  integrations: [sitemap({ i18n: { defaultLocale: 'gl', locales: { gl: 'gl-ES', es: 'es-ES', en: 'en-GB' } } })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
