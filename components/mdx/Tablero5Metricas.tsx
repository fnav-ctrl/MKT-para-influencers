"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 4 — Tablero de 5 métricas con zona sana / alerta automática.
// Cada métrica define un umbral mínimo sano; si el valor cargado queda por
// debajo, se marca en alerta.
type Metrica = { key: string; label: string; unidad: string; umbral: number };

const METRICAS_DEFAULT: Metrica[] = [
  { key: "ingresos", label: "Ingresos del mes", unidad: "$", umbral: 0 },
  { key: "margen", label: "Margen neto", unidad: "%", umbral: 20 },
  { key: "colaboraciones", label: "Colaboraciones cerradas", unidad: "u", umbral: 2 },
  { key: "tarifaProm", label: "Tarifa promedio", unidad: "$", umbral: 0 },
  { key: "horas", label: "Horas trabajadas", unidad: "hs", umbral: 0 },
];

type Data = { valores: Record<string, string> };

export function Tablero5Metricas({
  exerciseKey = "tablero",
  metricas = METRICAS_DEFAULT,
}: {
  exerciseKey?: string;
  metricas?: Metrica[];
}) {
  const { answers, update } = useExercise<Data>(exerciseKey, { valores: {} });

  const set = (key: string, v: string) =>
    update({ valores: { ...answers.valores, [key]: v } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {metricas.map((m) => {
        const raw = answers.valores[m.key] ?? "";
        const val = parseFloat(raw);
        const cargada = raw !== "" && Number.isFinite(val);
        const alerta = cargada && m.umbral > 0 && val < m.umbral;
        return (
          <div
            key={m.key}
            className={`rounded-2xl border p-4 ${
              alerta ? "border-coral bg-coral-50/50" : "border-tinta/10 bg-white"
            }`}
          >
            <p className="mb-2 text-sm font-medium text-tinta/70">{m.label}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={raw}
                onChange={(e) => set(m.key, e.target.value)}
                className="w-full rounded-lg border border-tinta/15 bg-crema/40 px-3 py-2 font-serif text-lg focus:border-coral focus:outline-none"
              />
              <span className="text-sm text-tinta/50">{m.unidad}</span>
            </div>
            {cargada && (
              <p className={`mt-2 text-xs font-semibold ${alerta ? "text-coral-600" : "text-emerald-600"}`}>
                {alerta ? `Alerta · piso sano ${m.umbral}${m.unidad}` : "Zona sana ✓"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
