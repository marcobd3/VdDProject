import type { APIRoute } from 'astro';
import { fuentes } from '../../lib/datos';
import { csv } from '../../lib/csv';
import { tr } from '../../i18n';

// Os CSV van no idioma predeterminado (galego)

export const GET: APIRoute = () =>
  new Response(csv(['id', 'nombre', 'organismo', 'tipo', 'temas', 'url', 'nota'], fuentes.map((f) => [f.id, tr(f.nombre, 'gl'), tr(f.organismo, 'gl'), f.tipo, f.temas.join('|'), f.url, tr(f.nota, 'gl')])), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
