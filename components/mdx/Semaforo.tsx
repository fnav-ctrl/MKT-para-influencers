"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 5 — Semáforo de 6 áreas del negocio (verde/amarillo/rojo).
const AREAS_DEFAULT = [
  "Finanzas",
  "Oferta y precios",
  "Contenido",
  "Comunidad",
  "Marcas / clientes",
  "Vos (energía y tiempo)",
];

type Color = "verde" | "amarillo" | "rojo" | "";
type Data = { estados: Record<string, Color> };

const COLORS: { value: Color; label: string; cls: string }[] = [
  { value: "verde", label: "Bien", cls: "bg-emerald-500" },
  { value: "amarillo", label: "Atención", cls: "bg-amber-400" },
  { value: "rojo", label: "Urgente", cls: "bg-coral" },
];

export function Semaforo({
  exerciseKey = "semaforo",
  areas = AREAS_DEFAULT,
}: {
  exerciseKey?: string;
  areas?: string[];
}) {
  const { answers, update } = useExercise<Data>(exerciseKey, { estados: {} });

  const set = (area: string, color: Color) =>
    update({ estados: { ...answers.estados, [area]: color } });

  return (
    <ul className="space-y-2">
      {areas.map((area) => {
        const actual = answers.estados[area] ?? "";
        return (
          <li
            key={area}
            className="flex flex-col gap-2 rounded-xl border border-tinta/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-tinta">{area}</span>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set(area, c.value)}
                  aria-pressed={actual === c.value}
                  className={`h-8 rounded-full px-3 text-xs font-semibold text-white transition ${c.cls} ${
                    actual === c.value ? "ring-2 ring-tinta ring-offset-1" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
