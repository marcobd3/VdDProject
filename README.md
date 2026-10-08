# Val do Dubra en datos

Web de divulgación que reúne, con su fuente al lado, los datos públicos sobre el concello de **Val do Dubra** (A Coruña, Galicia): población, territorio, parroquias, historia, economía, política, patrimonio, fiestas y curiosidades.

Está pensada para vecinos de Val do Dubra y alrededores. No es una web oficial del Concello.

## Idiomas

La web está en **gallego** (idioma por defecto, en la raíz `/`), **castellano** (`/es/`) e **inglés** (`/en/`). Cada página tiene un selector de idioma en la cabecera y enlaces `hreflang` entre versiones; el sitemap también las relaciona.

- Los textos de la interfaz están en `src/i18n/gl.ts`, `es.ts` y `en.ts` (los tres con la misma forma; TypeScript avisa si falta alguno).
- En `datos.json` y `fuentes.json`, cada texto traducible es un objeto `{ "gl": …, "es": …, "en": … }`. Los nombres propios y los títulos de artículos citados se dejan como cadena simple.
- Las descargas son comunes: el JSON incluye los tres idiomas y los CSV van en gallego.

## Tecnología

- [Astro](https://astro.build) 7 con salida 100 % estática: HTML pre-renderizado, sin framework en el cliente.
- Gráficos en SVG generados al compilar (línea, barras, hemiciclo, gofre). Solo hay unos ~3 KB de JavaScript, como mejora progresiva: tooltips, tema, contadores y filtro de fuentes.
- Tipografías autoalojadas (Fraunces e Inter vía Fontsource), sin peticiones a terceros.
- SEO: metadatos Open Graph y Twitter, URL canónica, `sitemap-index.xml`, `robots.txt` y datos estructurados JSON-LD (`WebSite`, `AdministrativeArea`, `Dataset`).
- Accesibilidad: HTML semántico, enlace para saltar al contenido, foco visible, gráficos con descripción y tabla de datos, contraste AA, `prefers-reduced-motion`, modo oscuro y estilos de impresión.

## Estructura

```
src/
  data/
    fuentes.json   ← catálogo de fuentes (id, organismo, url, tipo, temas)
    datos.json     ← todos los datos; cada valor o bloque cita ids de fuentes.json
  components/      ← Chapter, Stat, LineChart, HBars, Hemicycle, Refs, SourceLine…
  i18n/            ← idiomas: gl.ts (por defecto), es.ts, en.ts y utilidades
  layouts/Base.astro
  pages/
    [...lang]/     ← páginas en los tres idiomas (/, /es/, /en/)
      index.astro    ← la web (12 capítulos)
      fuentes.astro  ← catálogo con buscador y filtros
      datos/         ← página de datos abiertos
    datos/         ← descargas JSON y CSV
  styles/global.css
```

Para **añadir o corregir un dato**, edita `src/data/datos.json`. Para añadir una fuente, edítala en `src/data/fuentes.json` y cítala por su `id`. Si una página cita un `id` que no existe, la compilación falla, así que no puede quedar ninguna referencia rota.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/ (gallego), /es/, /en/
npm run build    # genera dist/
npm run preview
```

## Publicación

Se publica en **Vercel** (https://vd-d-project.vercel.app). Vercel detecta Astro automáticamente: comando `npm run build`, carpeta de salida `dist` y Node 22.12 o superior (fijado en `package.json`). Cada push a `main` despliega la web.

La URL canónica se toma de `VERCEL_PROJECT_PRODUCTION_URL`. Para otro dominio o una subcarpeta:

```bash
SITE_URL=https://midominio.gal BASE_PATH=/subcarpeta npm run build
```

## Fuentes

El catálogo completo está en `/fuentes/`. Las principales son INE (padrón y censos), IGE (ficha municipal), Agencia Tributaria (IRPF por municipios), BOE y DOG, Concello de Val do Dubra, Turismo de Galicia, Enciclopedia Galega Universal, City Population, Foro-Ciudad, Telencuestas (censo electoral) y prensa local. Cuando dos fuentes no coinciden, la web lo indica.
