-- =============================================================
-- Plataforma "Monetizá tu Influencia" — esquema inicial
-- Ejecutar en el SQL editor de Supabase (o via CLI).
-- =============================================================

-- ---------- Extensiones ----------
create extension if not exists "pgcrypto";

-- ---------- profiles ----------
-- Espejo de auth.users con datos de perfil.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  nombre     text,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug in ('vol1','vol2','vol3')),
  titulo     text not null,
  precio_ars integer not null,
  precio_usd integer not null,
  orden      integer not null,
  activo     boolean not null default true
);

-- ---------- purchases ----------
create table if not exists public.purchases (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  product_id    uuid not null references public.products (id) on delete restrict,
  mp_payment_id text,
  status        text not null default 'pending'
                check (status in ('pending','approved','refunded')),
  created_at    timestamptz not null default now()
);

-- Un usuario aprobado no debería tener dos compras aprobadas del mismo producto.
create unique index if not exists purchases_user_product_approved_uidx
  on public.purchases (user_id, product_id)
  where status = 'approved';

create index if not exists purchases_user_idx on public.purchases (user_id);

-- ---------- chapters ----------
-- Metadata de capítulos; el contenido MDX vive en /content del repo.
create table if not exists public.chapters (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  orden      integer not null,
  slug       text not null,
  titulo     text not null,
  unique (product_id, slug)
);

-- ---------- exercise_answers ----------
create table if not exists public.exercise_answers (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  chapter_id   uuid not null references public.chapters (id) on delete cascade,
  exercise_key text not null,
  answers      jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  unique (user_id, chapter_id, exercise_key)
);

-- ---------- progress ----------
create table if not exists public.progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  chapter_id   uuid not null references public.chapters (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

-- =============================================================
-- Trigger: crear profile al registrarse un usuario
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, new.raw_user_meta_data ->> 'nombre')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Helper: ¿el usuario compró (approved) este producto?
-- =============================================================
create or replace function public.has_approved_purchase(p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.purchases
    where user_id = auth.uid()
      and product_id = p_product_id
      and status = 'approved'
  );
$$;

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles         enable row level security;
alter table public.products         enable row level security;
alter table public.purchases        enable row level security;
alter table public.chapters         enable row level security;
alter table public.exercise_answers enable row level security;
alter table public.progress         enable row level security;

-- profiles: cada quien lee/edita el suyo
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- products: catálogo público (solo lectura)
drop policy if exists "products_select_all" on public.products;
create policy "products_select_all" on public.products
  for select using (true);

-- purchases: cada quien ve las suyas. La escritura la hace el server
-- (service_role, que bypassa RLS) desde el webhook / checkout.
drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = user_id);

-- chapters: solo se listan los capítulos de un producto comprado (approved)
drop policy if exists "chapters_select_if_purchased" on public.chapters;
create policy "chapters_select_if_purchased" on public.chapters
  for select using (public.has_approved_purchase(product_id));

-- exercise_answers: cada quien lee/escribe lo suyo
drop policy if exists "answers_all_own" on public.exercise_answers;
create policy "answers_all_own" on public.exercise_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- progress: cada quien lee/escribe lo suyo
drop policy if exists "progress_all_own" on public.progress;
create policy "progress_all_own" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
