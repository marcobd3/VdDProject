import type { APIRoute } from 'astro';
import { datos, fuentes } from '../../lib/datos';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ...datos, fuentes }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
