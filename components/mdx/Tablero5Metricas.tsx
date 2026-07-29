"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 4 — Tablero de 5 métricas de negocio con zona sana / alerta.
// Cada métrica define su texto de zona sana y de alerta; si tiene umbral +
// dirección (`peor`), se marca la alerta automáticamente según el valor.
export type MetricaDef = {
  key: string;
  label: string;
  unidad: string;
  sana: string;
  alerta: string;
  umbral?: number;
  peor?: "alto" | "bajo"; // hacia dónde está la alerta
};

const METRICAS_DEFAULT: MetricaDef[] = [
  {
    key: "ingreso-prom",
    label: "Ingreso mensual promedio",
    unidad: "$",
    sana: "Estable o subiendo",
    alerta: "3 meses seguidos bajando",
  },
  {
    key: "concentracion",
    label: "Concentración de clientes",
    unidad: "%",
    sana: "Ninguna marca > 40%",
    alerta: "Una marca > 40%",
    umbral: 40,
    peor: "alto",
  },
  {
    key: "recurrente",
    label: "Ingreso recurrente",
    unidad: "%",
    sana: "> 30%",
    alerta: "< 15%",
    umbral: 15,
    peor: "bajo",
  },
  {
    key: "recompra",
    label: "Recompra de marcas",
    unidad: "%",
    sana: "> 50%",
    alerta: "< 30%",
    umbral: 30,
    peor: "bajo",
  },
  {
    key: "valor-pieza",
    label: "Valor promedio por pieza",
    unidad: "$",
    sana: "Sube cada trimestre",
    alerta: "Plano hace 6 meses",
  },
];

type Data = { valores: Record<string, string> };

function esAlerta(m: MetricaDef, raw: string): boolean | null {
  if (m.umbral === undefined || !m.peor) return null;
  const v = parseFloat(raw);
  if (raw === "" || !Number.isFinite(v)) return null;
  return m.peor === "alto" ? v > m.umbral : v < m.umbral;
}

export function Tablero5Metricas({
  exerciseKey = "tablero",
  metricas = METRICAS_DEFAULT,
}: {
  exerciseKey?: string;
  metricas?: MetricaDef[];
}) {
  const { answers, update } = useExercise<Data>(exerciseKey, { valores: {} });

  const set = (key: string, v: string) =>
    update({ valores: { ...answers.valores, [key]: v } });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metricas.map((m) => {
        const raw = answers.valores[m.key] ?? "";
        const alerta = esAlerta(m, raw);
        return (
          <div
            key={m.key}
            className={`rounded-2xl border p-4 ${
              alerta === true
                ? "border-coral bg-coral-50/50"
                : alerta === false
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-tinta/10 bg-white"
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
            <p className="mt-2 text-xs text-tinta/45">
              <span className="text-emerald-600">Sana:</span> {m.sana} ·{" "}
              <span className="text-coral-600">Alerta:</span> {m.alerta}
            </p>
          </div>
        );
      })}
    </div>
  );
}
