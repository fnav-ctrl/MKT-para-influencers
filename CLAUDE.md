# CLAUDE.md

Guía para asistentes de IA (Claude Code y similares) que trabajan en este
repositorio. Leé este archivo antes de empezar cualquier tarea.

---

## 1. Qué es esto

Plataforma de cursos propia para la serie **Monetizá tu Influencia** (3
volúmenes). Los usuarios se registran, compran volúmenes y cada compra
desbloquea el contenido. El contenido **no es un PDF**: es una experiencia web
interactiva con capítulos navegables, ejercicios que se guardan y upsell interno
de los volúmenes que faltan.

**Regla de oro del producto:** el valor diferencial vs. el ebook es que los
ejercicios **quedan guardados y encadenados** (la TMV del Vol. 1 aparece
pre-cargada donde el Vol. 2 la necesita).

- **Org:** Freelo (agencia). Contacto: `flor@freeloagencia.com`.
- **Idioma de producto y de trabajo:** español (rioplatense). UI, copies,
  comentarios y commits en español.

---

## 2. Stack (decidido — no cambiar sin consultar)

- **Next.js 14 (App Router) + TypeScript + Tailwind** — deploy en **Vercel**.
- **Supabase**: Auth (email+password, magic link como alternativa), Postgres,
  **Row Level Security**.
- **Mercado Pago Checkout Pro** (mercado argentino). No agregar otras pasarelas
  por ahora.
- Contenido de capítulos como **MDX** con componentes React interactivos
  embebidos. Se compila server-side con `next-mdx-remote/rsc`.

---

## 3. Comandos

```bash
npm run dev        # desarrollo (localhost:3000)
npm run build      # build de producción
npm run start      # servir el build
npm run lint       # eslint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

Antes de commitear cambios de código: `npm run typecheck` **y** `npm run build`
deben pasar.

---

## 4. Setup (variables de entorno y base de datos)

1. Copiá `.env.example` a `.env.local` y completá:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo server — **nunca** al cliente)
   - `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
2. En Supabase, correr en orden:
   - `supabase/migrations/0001_init.sql` (esquema + RLS + triggers)
   - `supabase/seed.sql` (catálogo de products + capítulos del Vol. 1)
3. Configurar el webhook de Mercado Pago apuntando a
   `<SITE_URL>/api/webhooks/mp` y pegar el secret en `MP_WEBHOOK_SECRET`.

---

## 5. Estructura del repo

```
app/
  layout.tsx              Root layout (fuentes serif/sans, metadata)
  page.tsx                Landing pública de la serie
  login/ registro/        Auth (Server Actions + formularios)
  auth/actions.ts         signIn / signUp / magic link / signOut
  auth/callback/route.ts  Intercambio de code por sesión (email confirm)
  app/                    Área protegida (requiere sesión)
    layout.tsx            Header + guard de sesión
    page.tsx              Dashboard: 3 volúmenes (desbloqueado / candado)
    [vol]/page.tsx        Índice del volumen (capítulos + progreso)
    [vol]/[cap]/page.tsx  Capítulo: MDX + ejercicios + "completado"
  compra/retorno/         Página de retorno de MP con polling
  api/
    checkout/route.ts         Crea purchase pending + preferencia MP
    checkout/status/route.ts  Estado de la compra (para el polling)
    webhooks/mp/route.ts      Webhook MP (valida firma, desbloquea)
components/
  ui/                     Botones y primitivas
  auth/AuthForm.tsx       Form de login/registro (useFormState)
  checkout/ComprarButton  Dispara el checkout
  mdx/                    Componentes interactivos (ver §6)
lib/
  supabase/               client (browser) / server / admin / middleware
  mercadopago.ts          SDK MP + verifyMpSignature
  queries.ts              Acceso a datos server-side (con chequeo de acceso)
  content.ts              Lee el MDX del capítulo desde /content
  rate-limit.ts           Rate limiter en memoria (login/registro)
  products.ts types.ts clsx.ts
content/
  vol1/*.mdx              Capítulos del Vol. 1 (el slug = nombre de archivo)
supabase/
  migrations/0001_init.sql
  seed.sql
middleware.ts             Refresca sesión + protege /app
```

---

## 6. Componentes MDX interactivos

Viven en `components/mdx/` y se exponen a los capítulos vía
`components/mdx/index.tsx` (mapa `mdxComponents`). Los ejercicios persisten solos
(autosave con debounce) en la tabla `exercise_answers`, vía el contexto
`ChapterProvider` / hook `useExercise`.

- `<Callout tipo="idea|ojo|tip">` — cajas de idea fuerza (borde coral).
- `<Ejercicio titulo>` — contenedor con estado guardado/pendiente.
- `<CampoTexto>`, `<CampoNumero>`, `<ListaCampos>` — inputs que persisten.
- `<CalculadoraTMV>` — Vol 1 cap 2: 8 pasos, calcula la TMV en vivo (clave `tmv`).
- `<TablaPaquetes>` — Vol 1 cap 5: 3 paquetes (básico ×1,8 / ×3).
- `<Semaforo>` — Vol 2 cap 5: 6 áreas verde/amarillo/rojo.
- `<Tablero5Metricas>` — Vol 2 cap 4: métricas con zona sana/alerta.
- `<MatrizMix>` — Vol 2 cap 6: puntuar modelos 1-5, muestra el ganador.
- `<Checklist>` — Vol 3 cap 5 (contrato) y checklist de brief.
- `<BarraProgreso>` — progreso del volumen (presentacional).

**Cada ejercicio necesita un `exerciseKey` único dentro del capítulo.** Para
encadenar entre volúmenes (Fase 2), usar claves estables y globales (ej: `tmv`).

### Agregar un capítulo

1. Crear `content/<vol>/<slug>.mdx`.
2. Insertar la fila en `chapters` (mismo `slug`, ver `supabase/seed.sql`).
3. Usar los componentes de arriba; los `exerciseKey` deben ser únicos.
4. Los bloques `[COMPLETAR FLOR]` del docx original se migran como comentarios
   `{/* COMPLETAR FLOR: ... */}` visibles en el MDX.

---

## 7. Reglas de seguridad (no negociables)

- **Acceso a contenido siempre server-side.** Un capítulo se sirve solo si existe
  `purchases` con `status='approved'` para ese usuario y producto. Se chequea en
  `lib/queries.ts` (`getVolumeData` / `hasAccess`), nunca ocultando el link en el
  cliente.
- **RLS activo** en todas las tablas con datos de usuario. `exercise_answers` y
  `progress`: cada quien solo lee/escribe lo suyo. Las `purchases` las escribe el
  server (service role) desde checkout/webhook.
- **El desbloqueo depende SOLO del webhook de MP**, nunca del redirect de vuelta.
  El webhook valida la firma `x-signature` (`lib/mercadopago.ts`
  `verifyMpSignature`) y consulta el pago real contra la API de MP.
- **`SUPABASE_SERVICE_ROLE_KEY` y `MP_*` son server-only.** Solo se importan
  desde archivos con `import "server-only"`. Nunca exponer al cliente.
- **Rate limiting** en login/registro (`lib/rate-limit.ts`). Es en memoria: para
  multi-instancia migrar a Redis/Upstash.

---

## 8. Diseño

- Fondo claro (`crema #FBF9F6`), tinta `#1A1A2E`, acento coral `#FF6B5B`.
- Tipografía **serif** editorial para títulos (Fraunces), **sans** para UI
  (Inter). Definidas en `app/layout.tsx` vía `next/font`.
- **Mobile-first**: el público lee desde el teléfono.
- Sobrio y editorial, no "plataforma de cursos genérica".
- Tokens en `tailwind.config.ts` (`tinta`, `coral`, `crema`, `font-serif/sans`).

---

## 9. Fases (roadmap)

- **Fase 1 — Núcleo vendible (EN CURSO / implementado):** auth + modelo de datos
  + checkout MP + webhook + Vol 1 interactivo + candados de Vol 2/3 con compra.
  *Con esto se lanza.*
  - Pendiente de Fase 1: migrar el **contenido real del Vol 1** desde el `.docx`
    (hoy hay placeholders marcados `COMPLETAR FLOR`) y **confirmar precios** en
    `supabase/seed.sql` y la **fórmula exacta de la TMV** en `CalculadoraTMV.tsx`.
- **Fase 2:** Vol 2 y Vol 3 migrados + encadenado de datos entre volúmenes +
  progreso completo.
- **Fase 3:** emails transaccionales (Resend), descarga del kit por volumen,
  código de descuento serie completa → curso.

### No hacer (por ahora)

- Sin panel de administración (el contenido se edita en el repo).
- Sin suscripciones/membresías — solo compra única por volumen.
- Sin pasarelas de pago además de Mercado Pago.
- Sin video — esta plataforma es para los volúmenes de texto interactivo.

---

## 10. Flujo de git

- **Rama de trabajo:** `claude/claude-md-docs-ex38nc`. Desarrollá y commiteá ahí;
  no pushees a otra rama sin permiso.
- Commits claros, en español. `git push -u origin <rama>`; ante errores de red,
  reintentar con backoff.
- **No** abrir PR salvo pedido explícito.
- Antes de commitear código: `npm run typecheck` y `npm run build` en verde.

---

## 11. Mantené este archivo al día

Cuando cambie la realidad del repo (nuevos componentes, fases completadas,
cambios de stack o de estructura), actualizá la sección correspondiente.
