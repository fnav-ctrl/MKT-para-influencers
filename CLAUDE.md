# CLAUDE.md

Guía para asistentes de IA (Claude Code y similares) que trabajan en este
repositorio. Leé este archivo antes de empezar cualquier tarea.

> **Estado actual del repo:** vacío. Todavía no hay código, documentos ni
> historial de commits. Este archivo describe el propósito del workspace, las
> convenciones y las herramientas disponibles para que el trabajo arranque de
> forma consistente. **Actualizá esta sección y las siguientes a medida que se
> agregue contenido real** (estructura de carpetas, scripts, stack, etc.).

---

## 1. Qué es este workspace

- **Proyecto:** `MKT-para-influencers` — trabajo de marketing enfocado en
  influencers.
- **Organización:** **Freelo** (agencia de marketing). Fundadora: **Flor
  Naveiro** (`flor@freeloagencia.com`).
- **Naturaleza:** es un workspace de **marketing y estrategia**, no un proyecto
  de software tradicional. El "output" esperado son estrategias, copies,
  campañas, contenidos, documentos, análisis y assets — no necesariamente
  código de aplicación.
- **Idioma de trabajo:** **español** (equipo en Argentina). Escribí entregables,
  comentarios y commits en español salvo que se pida lo contrario. Los nombres
  de skills y herramientas se mantienen en su forma original.

---

## 2. Cómo trabajar acá (lo más importante)

La forma principal de ejecutar tareas en este workspace es a través de las
**skills** disponibles, no reinventando procesos. Antes de responder "a mano"
una consulta de negocio, marketing o estrategia, revisá si hay una skill que
cubra el caso y usala.

### Skills específicas de Freelo / Flor (usar con prioridad)

| Skill | Cuándo usarla |
|-------|---------------|
| `ceo-freelo` | Decisiones de negocio, estrategia, pricing, finanzas, equipo, coaching ejecutivo para Flor. Se activa también cuando Flor comparte un dilema sin pedir algo puntual. |
| `marketing-estratega` | Estrategia de marketing 360°, planes de lanzamiento, funnels, redes, pricing, posicionamiento, briefs de clientes de Freelo. |
| `copywriter-creativa` | Copy, ideas creativas, conceptos de campaña, naming, taglines, contenido para redes, branding para Freelo y sus clientes. |
| `ask-vilma` | Preguntas sobre negocio/IA/marketing respondidas con el criterio y metodología de Vilma Núñez. **No inventa**: si Vilma no lo dijo, lo aclara. |
| `ritual-semanal` | Planificación de lunes y retrospectiva de viernes de Flor (dimensiones: Freelo/CEO, Personal/Eze, Bebé/Maternidad). |

### Skills de marketing de propósito general

Hay una biblioteca amplia de skills de marketing disponibles. Elegí la más
específica al pedido. Algunas de las más usadas:

- **Estrategia/planeamiento:** `marketing-ideas`, `content-strategy`,
  `launch-strategy`, `pricing-strategy`, `site-architecture`,
  `product-marketing-context`.
- **Copy y contenido:** `copywriting`, `copy-editing`, `social-content`,
  `lead-magnets`, `competitor-alternatives`.
- **Conversión (CRO):** `page-cro`, `signup-flow-cro`, `onboarding-cro`,
  `form-cro`, `popup-cro`, `paywall-upgrade-cro`.
- **Adquisición:** `paid-ads`, `cold-email`, `email-sequence`,
  `referral-program`, `community-marketing`, `programmatic-seo`, `seo-audit`.
- **Investigación:** `customer-research`, `marketing-psychology`.
- **Ventas / RevOps:** `sales-enablement`, `revops`.

> Empezá por `product-marketing-context` cuando arranques un proyecto nuevo:
> crea `.agents/product-marketing-context.md` con producto, audiencia y
> posicionamiento que el resto de las skills referencian.

### Skills de documentos y entregables

- `docx`, `pptx`, `xlsx`, `pdf` — crear/editar Word, PowerPoint, Excel, PDF.
- `dataviz` — leer **antes** de crear cualquier gráfico o visualización.
- `artifact-design` / `artifact-capabilities` — para publicar páginas/artefactos.

---

## 3. Convenciones

- **Idioma:** español para todo el contenido de cara al equipo/cliente.
- **Tono y criterio:** respetá la voz de Freelo y de cada skill. `ask-vilma` y
  `ceo-freelo` tienen reglas propias (no inventar, actuar como sparring, etc.);
  seguilas al pie.
- **No inventar datos:** si falta información (números, contexto de cliente,
  decisiones previas), pedila antes de asumir.
- **Archivos temporales:** usá el scratchpad de la sesión, no el repo, para
  borradores intermedios que no son entregables.
- **Estructura de carpetas:** todavía no está definida. Cuando se cree,
  documentala en la sección 5.

---

## 4. Flujo de git

- **Rama de trabajo designada:** `claude/claude-md-docs-ex38nc`. Desarrollá y
  commiteá ahí; no pushees a otra rama sin permiso explícito.
- **Push:** usá `git push -u origin <rama>`. Ante errores de red, reintentá con
  backoff exponencial (2s, 4s, 8s, 16s).
- **Commits:** mensajes claros y descriptivos, en español.
- **Pull requests:** **no** abras un PR salvo que se pida explícitamente.
- El repo no tiene commits todavía: el primer commit inicializa la historia.

---

## 5. Estructura del repositorio

_Vacío por ahora._ A medida que se agregue contenido, documentá acá:

- Carpetas principales y qué contiene cada una.
- Dónde viven estrategias, copies, campañas, assets y documentos.
- Cualquier script, stack o herramienta de build (si el proyecto incorpora
  código).
- Comandos habituales (tests, lint, build) cuando existan.

---

## 6. Mantenimiento de este archivo

Cuando cambie la realidad del repo, actualizá CLAUDE.md:

- Al agregar código o estructura → completá la sección 5 y quitá el aviso de
  "repo vacío" de arriba.
- Al incorporar nuevas skills, convenciones o flujos → reflejalos en las
  secciones 2–4.
- Mantené la tabla de skills alineada con lo que realmente se usa.
