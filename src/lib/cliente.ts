// Interacciones ligeras: tema, tooltips de gráficos, aparición al hacer scroll,
// contadores y resaltado del índice. Todo es mejora progresiva.

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Tema ---
document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.addEventListener('click', () => {
  const actual = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nuevo = actual === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nuevo;
  try { localStorage.setItem('tema', nuevo); } catch { /* sin almacenamiento */ }
});

// --- Tooltips ---
document.querySelectorAll<HTMLElement>('.chart-wrap').forEach((wrap) => {
  const svg = wrap.querySelector('svg');
  const tip = wrap.querySelector<HTMLElement>('.chart-tip');
  const guide = wrap.querySelector<SVGLineElement>('.hover-line');
  if (!svg || !tip) return;
  const show = (el: Element) => {
    const vb = svg.viewBox.baseVal;
    const box = svg.getBoundingClientRect();
    const k = box.width / vb.width;
    const x = Number(el.getAttribute('data-x')) * k;
    const y = Number(el.getAttribute('data-y')) * k;
    tip.innerHTML = el.getAttribute('data-tip') ?? '';
    const half = tip.offsetWidth / 2;
    tip.style.left = `${Math.min(Math.max(x, half), box.width - half)}px`;
    tip.style.top = `${y}px`;
    tip.toggleAttribute('data-show', true);
    if (guide) {
      guide.setAttribute('x1', el.getAttribute('data-x')!);
      guide.setAttribute('x2', el.getAttribute('data-x')!);
      guide.style.opacity = '0.6';
    }
  };
  const hide = () => { tip.removeAttribute('data-show'); if (guide) guide.style.opacity = '0'; };
  wrap.querySelectorAll('[data-tip]').forEach((el) => {
    el.addEventListener('pointerenter', () => show(el));
    el.addEventListener('focus', () => show(el));
    el.addEventListener('pointerleave', hide);
    el.addEventListener('blur', hide);
  });
});

// --- Aparición y contadores ---
const fmt = (v: number, dec: number) =>
  new Intl.NumberFormat(root.lang || 'gl', { useGrouping: 'always', minimumFractionDigits: dec, maximumFractionDigits: dec } as Intl.NumberFormatOptions).format(v);

const contar = (el: HTMLElement) => {
  const fin = Number(el.dataset.count);
  const dec = Number(el.dataset.decimals ?? 0);
  if (!Number.isFinite(fin) || reduce) return;
  const t0 = performance.now();
  const dur = 1200;
  const paso = (t: number) => {
    const p = Math.min((t - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(fin * e, dec);
    if (p < 1) requestAnimationFrame(paso);
    else el.textContent = fmt(fin, dec);
  };
  requestAnimationFrame(paso);
};

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target as HTMLElement;
      el.classList.add('is-in');
      if (el.dataset.count) contar(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll<HTMLElement>('.fade, .reveal, [data-count]').forEach((el) => io.observe(el));

  // --- Índice activo ---
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('.toc a[href*="#"]').forEach((a) => links.set(a.hash.slice(1), a));
  if (links.size) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        const a = links.get(en.target.id);
        a?.classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
} else {
  document.querySelectorAll('.fade, .reveal').forEach((el) => el.classList.add('is-in'));
}

// --- Filtro del catálogo de fuentes ---
const lista = document.querySelector<HTMLElement>('[data-sources]');
if (lista) {
  const q = document.querySelector<HTMLInputElement>('[data-sources-q]');
  const chips = document.querySelectorAll<HTMLButtonElement>('[data-tipo]');
  const count = document.querySelector<HTMLElement>('[data-sources-count]');
  let tipo = 'todos';
  const aplicar = () => {
    const term = (q?.value ?? '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    let visibles = 0;
    lista.querySelectorAll<HTMLElement>('[data-item]').forEach((li) => {
      const ok = (tipo === 'todos' || li.dataset.tipoItem === tipo) && (!term || (li.dataset.text ?? '').includes(term));
      li.hidden = !ok;
      if (ok) visibles++;
    });
    if (count) count.textContent = String(visibles);
  };
  q?.addEventListener('input', aplicar);
  chips.forEach((c) => c.addEventListener('click', () => {
    tipo = c.dataset.tipo!;
    chips.forEach((o) => o.setAttribute('aria-pressed', String(o === c)));
    aplicar();
  }));
}
