import datos from '../data/datos.json';
import fuentes from '../data/fuentes.json';

export { datos, fuentes };

export type Fuente = (typeof fuentes)[number];

const porId = new Map(fuentes.map((f) => [f.id, f]));
const indice = new Map(fuentes.map((f, i) => [f.id, i + 1]));

/** Número de la fuente en el catálogo (1, 2, 3…). */
export const numFuente = (id: string) => indice.get(id) ?? 0;

export function fuente(id: string): Fuente {
  const f = porId.get(id);
  if (!f) throw new Error(`Fuente desconocida: ${id}`);
  return f;
}

/** Une una ruta con el base path del sitio. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

const entero = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 0 } as Intl.NumberFormatOptions);
const decimal = new Intl.NumberFormat('es-ES', { useGrouping: 'always', minimumFractionDigits: 1, maximumFractionDigits: 2 } as Intl.NumberFormatOptions);

/** Formatea números con separadores españoles (3.680; 33,9). */
export function n(valor: number, decimales?: number): string {
  if (decimales !== undefined) {
    return new Intl.NumberFormat('es-ES', { useGrouping: 'always', minimumFractionDigits: decimales, maximumFractionDigits: decimales } as Intl.NumberFormatOptions).format(valor);
  }
  return Number.isInteger(valor) ? entero.format(valor) : decimal.format(valor);
}

export const pct = (parte: number, total: number, dec = 1) => n((parte / total) * 100, dec);

export const tipos: Record<string, string> = {
  oficial: 'Organismos oficiales',
  estadistica: 'Portales estadísticos',
  enciclopedia: 'Enciclopedias y wikis',
  prensa: 'Prensa',
  turismo: 'Turismo y guías',
  directorio: 'Directorios',
};
