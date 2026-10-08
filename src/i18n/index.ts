import gl from './gl';
import es from './es';
import en from './en';
import { url } from '../lib/datos';

/** Idiomas da web. O galego é o predeterminado e vive na raíz; o resto, en /es/ e /en/. */
export const langs = ['gl', 'es', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'gl';

export const langNames: Record<Lang, string> = { gl: 'Galego', es: 'Español', en: 'English' };
export const locales: Record<Lang, string> = { gl: 'gl-ES', es: 'es-ES', en: 'en-GB' };
export const ogLocales: Record<Lang, string> = { gl: 'gl_ES', es: 'es_ES', en: 'en_GB' };

const dicts = { gl, es, en };
export type UI = typeof gl;

/** Texto dos JSON de datos: cadea común a todos os idiomas ou obxecto { gl, es, en }. */
export type Texto = string | Record<Lang, string>;
export const tr = (v: Texto, lang: Lang): string => (typeof v === 'string' ? v : v[lang]);

const esLang = (s: string | undefined): s is Lang => langs.includes(s as Lang);

/** Idioma dunha URL segundo o seu primeiro segmento despois do base path. */
export function langFromUrl(u: URL): Lang {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const seg = u.pathname.slice(base.length).split('/').filter(Boolean)[0];
  return esLang(seg) ? seg : defaultLang;
}

/** Ruta dentro dun idioma: href('fuentes/', 'es') → /es/fuentes/ */
export function href(path: string, lang: Lang): string {
  return url(lang === defaultLang ? path : `${lang}/${path.replace(/^\//, '')}`);
}

/** A mesma páxina noutro idioma. */
export function switchHref(u: URL, to: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const segs = u.pathname.slice(base.length).split('/').filter(Boolean);
  if (esLang(segs[0])) segs.shift();
  const rest = segs.join('/');
  return href(rest && u.pathname.endsWith('/') ? `${rest}/` : rest, to);
}

/** Parámetros para getStaticPaths das rutas [...lang]. */
export const langPaths = () => langs.map((l) => ({ params: { lang: l === defaultLang ? undefined : l } }));

/** Todo o necesario para pintar unha páxina no idioma da URL. */
export function useI18n(u: URL) {
  const lang = langFromUrl(u);
  const loc = locales[lang];
  const n = (valor: number, decimales?: number): string => {
    const dec = decimales ?? (Number.isInteger(valor) ? 0 : undefined);
    return new Intl.NumberFormat(loc, {
      useGrouping: 'always',
      minimumFractionDigits: dec ?? 1,
      maximumFractionDigits: dec ?? 2,
    } as Intl.NumberFormatOptions).format(valor);
  };
  return {
    lang,
    t: dicts[lang] as UI,
    tr: (v: Texto) => tr(v, lang),
    n,
    pct: (parte: number, total: number, dec = 1) => n((parte / total) * 100, dec),
    /** Signo de porcentaxe: «12 %» en galego e castelán, «12%» en inglés. */
    pc: (s: string | number) => (lang === 'en' ? `${s}%` : `${s} %`),
    lista: (xs: string[]) => new Intl.ListFormat(loc, { type: 'conjunction' }).format(xs),
    data: (iso: string) => new Date(iso).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
    href: (path = '') => href(path, lang),
  };
}
