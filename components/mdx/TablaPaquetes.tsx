"use client";

import { useExercise } from "./ChapterProvider";

// Vol 1 · Cap 5 — Armá tus 3 paquetes.
// El precio del paquete básico sugiere el intermedio (×1,8) y el premium (×3).
type Paquete = { nombre: string; incluye: string };
type Data = { basico: string; paquetes: [Paquete, Paquete, Paquete] };

const money = (n: number) =>
  n > 0
    ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    : "—";

const NIVELES = ["Básico", "Intermedio", "Premium"] as const;
const MULT = [1, 1.8, 3];

export function TablaPaquetes({ exerciseKey = "paquetes" }: { exerciseKey?: string }) {
  const { answers, update } = useExercise<Data>(exerciseKey, {
    basico: "",
    paquetes: [
      { nombre: "", incluye: "" },
      { nombre: "", incluye: "" },
      { nombre: "", incluye: "" },
    ],
  });

  const basico = parseFloat(answers.basico) || 0;

  const setBasico = (v: string) => update({ basico: v });
  const setPaquete = (i: number, patch: Partial<Paquete>) => {
    const paquetes = [...answers.paquetes] as Data["paquetes"];
    paquetes[i] = { ...paquetes[i], ...patch };
    update({ paquetes });
  };

  return (
    <div>
      <label className="mb-5 block max-w-xs">
        <span className="mb-1 block text-sm font-medium text-tinta/80">
          Precio de tu paquete básico
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={answers.basico}
          onChange={(e) => setBasico(e.target.value)}
          placeholder="Ej: 50000"
          className="w-full rounded-xl border border-tinta/15 bg-crema/50 px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        {NIVELES.map((nivel, i) => {
          const sugerido = basico * MULT[i];
          const destacado = i === 1;
          return (
            <div
              key={nivel}
              className={`rounded-2xl border p-4 ${
                destacado
                  ? "border-coral bg-coral-50/50"
                  : "border-tinta/10 bg-white"
              }`}
            >
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-serif text-sm uppercase tracking-wide text-tinta/60">
                  {nivel}
                </span>
                <span className="font-serif text-lg text-tinta">{money(sugerido)}</span>
              </div>
              <input
                type="text"
                value={answers.paquetes[i].nombre}
                onChange={(e) => setPaquete(i, { nombre: e.target.value })}
                placeholder="Nombre del paquete"
                className="mb-2 w-full rounded-lg border border-tinta/15 bg-crema/40 px-3 py-2 text-sm focus:border-coral focus:outline-none"
              />
              <textarea
                value={answers.paquetes[i].incluye}
                onChange={(e) => setPaquete(i, { incluye: e.target.value })}
                placeholder="Qué incluye…"
                rows={4}
                className="w-full rounded-lg border border-tinta/15 bg-crema/40 px-3 py-2 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-tinta/45">
        Precios sugeridos: básico × 1,8 (intermedio) y × 3 (premium). Ajustalos a
        tu criterio.
      </p>
    </div>
  );
}
