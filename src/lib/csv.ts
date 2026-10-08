const celda = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV con BOM para que Excel lo abra con tildes correctas. */
export const csv = (cabecera: string[], filas: unknown[][]) =>
  '﻿' + [cabecera, ...filas].map((f) => f.map(celda).join(',')).join('\n') + '\n';
