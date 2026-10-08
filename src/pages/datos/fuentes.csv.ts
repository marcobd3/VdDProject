import type { APIRoute } from 'astro';
import { fuentes } from '../../lib/datos';
import { csv } from '../../lib/csv';

export const GET: APIRoute = () =>
  new Response(csv(['id', 'nombre', 'organismo', 'tipo', 'temas', 'url', 'nota'], fuentes.map((f) => [f.id, f.nombre, f.organismo, f.tipo, f.temas.join('|'), f.url, f.nota])), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
