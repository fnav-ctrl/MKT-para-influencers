-- =============================================================
-- Seed de catálogo. Ejecutar después de 0001_init.sql.
-- Precios en placeholder → CONFIRMAR con Flor antes de producción.
-- =============================================================

insert into public.products (slug, titulo, precio_ars, precio_usd, orden, activo)
values
  ('vol1', 'Vol. 1 · Tu oferta y tu precio',      29000, 39, 1, true),
  ('vol2', 'Vol. 2 · Tu negocio en números',      29000, 39, 2, true),
  ('vol3', 'Vol. 3 · Marcas, contratos y escala',  29000, 39, 3, true)
on conflict (slug) do update
  set titulo = excluded.titulo,
      precio_ars = excluded.precio_ars,
      precio_usd = excluded.precio_usd,
      orden = excluded.orden,
      activo = excluded.activo;

-- ---------- Capítulos del Vol. 1 ----------
-- El slug debe coincidir con el archivo en content/vol1/<slug>.mdx
insert into public.chapters (product_id, orden, slug, titulo)
select p.id, c.orden, c.slug, c.titulo
from public.products p
join (values
  (1, 'introduccion',    'Empezá por acá'),
  (2, 'calcula-tu-tmv',  'Tu Tarifa Mínima Viable (TMV)'),
  (3, 'tu-oferta',       'Qué vendés en realidad'),
  (4, 'posicionamiento', 'Cómo te ven las marcas'),
  (5, 'tus-paquetes',    'Armá tus 3 paquetes'),
  (6, 'cierre',          'Tu plan de la semana')
) as c(orden, slug, titulo) on true
where p.slug = 'vol1'
on conflict (product_id, slug) do update
  set orden = excluded.orden, titulo = excluded.titulo;
