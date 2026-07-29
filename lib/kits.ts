import type { VolSlug } from "./types";

// Config de entregables y upsell. Los valores marcados COMPLETAR FLOR se cargan
// cuando estén definidos (links de kits, curso y código de descuento).

// Link de descarga del kit por volumen.
// COMPLETAR FLOR: reemplazar por las URLs reales (Notion/Drive/página propia).
export const KIT_URLS: Record<VolSlug, string | null> = {
  vol1: null, // COMPLETAR FLOR
  vol2: null, // COMPLETAR FLOR
  vol3: null, // COMPLETAR FLOR
};

// Curso completo (upsell). COMPLETAR FLOR: link real de checkout del curso.
export const CURSO_URL: string | null = null; // ej: "https://mktparainfluencers.com/curso"
export const CURSO_PRECIO_USD = 157;

// Código de descuento exclusivo para quienes compraron los 3 volúmenes.
// COMPLETAR FLOR: definir el código real (y cargarlo también en la plataforma
// del curso para que sea válido).
export const SERIE_COMPLETA_CODE: string | null = null; // ej: "SERIE100"

export function kitUrl(vol: VolSlug): string | null {
  return KIT_URLS[vol] ?? null;
}
