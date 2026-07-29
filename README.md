# Monetizá tu Influencia

Plataforma web de la serie **Monetizá tu Influencia** (3 volúmenes): cursos de
texto interactivo donde los ejercicios se completan online y quedan guardados.

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Mercado
Pago**. Deploy en Vercel.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar credenciales
npm run dev
```

Luego, en Supabase, ejecutar en orden:

1. `supabase/migrations/0001_init.sql` — esquema, RLS y triggers.
2. `supabase/seed.sql` — catálogo de volúmenes y capítulos del Vol. 1.

Configurar el webhook de Mercado Pago hacia `<SITE_URL>/api/webhooks/mp`.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Desarrollo en `localhost:3000` |
| `npm run build` | Build de producción |
| `npm run typecheck` | Chequeo de tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint |

## Documentación para asistentes de IA

Ver [`CLAUDE.md`](./CLAUDE.md): estructura, convenciones, componentes MDX
interactivos, reglas de seguridad y roadmap por fases.
