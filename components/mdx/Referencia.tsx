"use client";

import { useReferencia } from "./ChapterProvider";

// Muestra (read-only) un valor guardado en otro capítulo/volumen. El corazón
// del "encadenado": tu TMV del Vol 1 aparece acá donde el Vol 2 la necesita.
//
// path admite notación con puntos para entrar al jsonb, ej: "pasos.valorHora"
// o directamente "tmv".
function leer(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function Referencia({
  exerciseKey,
  path = "",
  label,
  formato = "texto",
  vacio = "Todavía no lo calculaste",
}: {
  exerciseKey: string;
  path?: string;
  label: string;
  formato?: "texto" | "moneda";
  vacio?: string;
}) {
  const data = useReferencia(exerciseKey);
  const raw = path ? leer(data, path) : data;

  let display: string;
  if (raw === undefined || raw === null || raw === "") {
    display = vacio;
  } else if (formato === "moneda") {
    const n = typeof raw === "number" ? raw : parseFloat(String(raw));
    display = Number.isFinite(n) ? money(n) : vacio;
  } else {
    display = String(raw);
  }

  return (
    <div className="my-4 flex items-center justify-between gap-4 rounded-xl border border-dashed border-coral/40 bg-coral-50/40 px-4 py-3">
      <span className="text-sm font-medium text-tinta/70">{label}</span>
      <span className="font-serif text-lg text-tinta">{display}</span>
    </div>
  );
}
