import type { VolSlug } from "./types";

// Config de entregables, planilla, promo y upsell.

// Planilla de precios (Google Sheets, link "hacer una copia").
// Cada usuario abre su propia copia editable.
export const PLANILLA_PRECIOS_URL =
  "https://docs.google.com/spreadsheets/d/1Nnw6AHpyX9lBYV3yGLBBn4_W05ap5l4xoLHsX8M2JT0/template/preview";

// El "kit" del volumen ahora es el PDF con los ejercicios que hizo el usuario:
// se genera desde /app/<vol>/kit (página imprimible → guardar como PDF).
export function kitHref(vol: VolSlug): string {
  return `/app/${vol}/kit`;
}

// Promo: comprando los 3 volúmenes, 10% off sobre la suma de los precios.
export const COMBO_DISCOUNT = 0.1; // 10%
export const COMBO_SLUG = "serie";

export function comboPriceArs(volPricesArs: number[]): number {
  const total = volPricesArs.reduce((a, b) => a + b, 0);
  return Math.round(total * (1 - COMBO_DISCOUNT));
}

// Curso completo (upsell). COMPLETAR FLOR: link real de checkout del curso.
export const CURSO_URL: string | null = null;
export const CURSO_PRECIO_USD = 157;

// Código de descuento para quienes compraron los 3 volúmenes (post-serie → curso).
// COMPLETAR FLOR: definir el código real.
export const SERIE_COMPLETA_CODE: string | null = null;
