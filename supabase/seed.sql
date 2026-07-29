-- =============================================================
-- Seed de catálogo y capítulos. Ejecutar después de 0001_init.sql.
-- Precios en placeholder → CONFIRMAR con Flor antes de producción.
-- (El curso completo se referencia a USD 157; los precios de cada
--  volumen los define Flor.)
-- =============================================================

-- Precio definido por Flor: ARS 69.000 cada volumen.
-- precio_usd es placeholder → COMPLETAR FLOR si se vende en USD.
insert into public.products (slug, titulo, precio_ars, precio_usd, orden, activo)
values
  ('vol1', 'Vol. 1 · Cuánto Cobrar',              69000, 59, 1, true),
  ('vol2', 'Vol. 2 · Tu Negocio de Influencia',   69000, 59, 2, true),
  ('vol3', 'Vol. 3 · Negociá como un Negocio',    69000, 59, 3, true)
on conflict (slug) do update
  set titulo = excluded.titulo,
      precio_ars = excluded.precio_ars,
      precio_usd = excluded.precio_usd,
      orden = excluded.orden,
      activo = excluded.activo;

-- Helper: inserta capítulos para un producto por su slug.
-- El slug del capítulo debe coincidir con content/<vol>/<slug>.mdx

-- ---------- Vol. 1 — Cuánto Cobrar ----------
insert into public.chapters (product_id, orden, slug, titulo)
select p.id, c.orden, c.slug, c.titulo
from public.products p
join (values
  (1,  'introduccion',        'Antes de empezar'),
  (2,  'cobrando-mal',        'Por qué estás cobrando mal'),
  (3,  'tu-tmv',              'Tu TMV: Tarifa Mínima Viable'),
  (4,  'presupuesto-marca',   'Cómo arma el presupuesto una marca'),
  (5,  'modelos-ingresos',    'Los seis modelos de ingresos'),
  (6,  'del-precio-al-paquete','Del precio suelto al paquete'),
  (7,  'lo-que-nadie-cobra',  'Lo que casi nadie cobra'),
  (8,  'media-kit',           'Media kit en una página'),
  (9,  'mandar-presupuesto',  'Cómo mandás el presupuesto'),
  (10, 'cierre',              'Tu kit y lo que sigue')
) as c(orden, slug, titulo) on true
where p.slug = 'vol1'
on conflict (product_id, slug) do update
  set orden = excluded.orden, titulo = excluded.titulo;

-- ---------- Vol. 2 — Tu Negocio de Influencia ----------
insert into public.chapters (product_id, orden, slug, titulo)
select p.id, c.orden, c.slug, c.titulo
from public.products p
join (values
  (1, 'introduccion',    'Antes de empezar'),
  (2, 'cambio-de-chip',  'El cambio de chip'),
  (3, 'canvas',          'Tu Canvas de Influencia'),
  (4, 'radiografia',     'Radiografía financiera'),
  (5, 'metricas',        'Tus 5 métricas de negocio'),
  (6, 'semaforo',        'El diagnóstico: tu semáforo'),
  (7, 'priorizar-mix',   'Priorizar tu mix de ingresos'),
  (8, 'roadmap',         'Tu roadmap de 90 días'),
  (9, 'cierre',          'El negocio que ya empezaste')
) as c(orden, slug, titulo) on true
where p.slug = 'vol2'
on conflict (product_id, slug) do update
  set orden = excluded.orden, titulo = excluded.titulo;

-- ---------- Vol. 3 — Negociá como un Negocio ----------
insert into public.chapters (product_id, orden, slug, titulo)
select p.id, c.orden, c.slug, c.titulo
from public.products p
join (values
  (1, 'introduccion',  'Antes de empezar'),
  (2, 'antes-del-mail','La negociación empieza antes del primer mail'),
  (3, 'pipeline',      'Tu pipeline de marcas'),
  (4, 'anatomia',      'Anatomía de la negociación'),
  (5, 'guiones',       'Los guiones: qué decir'),
  (6, 'contrato',      'El contrato que te protege'),
  (7, 'cobrar',        'Cobrar (que es distinto de facturar)'),
  (8, 'recompra',      'Después de la campaña: la recompra'),
  (9, 'cierre',        'Ya no dependés de que suene el mail')
) as c(orden, slug, titulo) on true
where p.slug = 'vol3'
on conflict (product_id, slug) do update
  set orden = excluded.orden, titulo = excluded.titulo;
