import type { APIRoute } from 'astro';
import { datos } from '../../lib/datos';
import { csv } from '../../lib/csv';
import { tr } from '../../i18n';

export const GET: APIRoute = () => {
  const p = datos.poblacion;
  const filas = [
    ...p.historica.map((r) => ['historica', r.anio, r.valor, r.fuente, r.nota ? tr(r.nota, 'gl') : '']),
    ...p.padron.map((r) => ['padron', r.anio, r.valor, p.padronFuentes.join('|'), '']),
  ];
  return new Response(csv(['serie', 'anio', 'habitantes', 'fuente', 'nota'], filas), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
};
