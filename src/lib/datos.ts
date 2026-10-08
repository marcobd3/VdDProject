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
