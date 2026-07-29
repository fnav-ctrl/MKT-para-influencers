"use client";

import { useExercise } from "./ChapterProvider";

// Vol 1 · Cap 2 — Calculadora de Tarifa Mínima Viable (TMV).
// Fórmula real del ebook (Ejercicio 2):
//   costo fijo por pieza = costos fijos mensuales ÷ piezas vendibles por mes
//   costo de producción por pieza = horas por pieza × valor hora
//   subtotal = costo fijo por pieza + costo de producción por pieza
//   TMV = subtotal × 1,3 (margen)
// Se guarda bajo la clave "tmv" para encadenarla en el Vol 2.

type Pasos = {
  costosFijos: string; // $/mes
  piezasMes: string; // u
  horasPieza: string; // hs
  valorHora: string; // $
};

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (n: number) =>
  Number.isFinite(n) && n > 0
    ? n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      })
    : "—";

const MARGEN = 1.3;

function calcular(p: Pasos) {
  const costoFijoPieza = num(p.piezasMes) > 0 ? num(p.costosFijos) / num(p.piezasMes) : 0;
  const costoProduccion = num(p.horasPieza) * num(p.valorHora);
  const subtotal = costoFijoPieza + costoProduccion;
  const tmv = subtotal * MARGEN;
  return { costoFijoPieza, costoProduccion, subtotal, tmv };
}

export function CalculadoraTMV({ exerciseKey = "tmv" }: { exerciseKey?: string }) {
  const { answers, update } = useExercise<{ pasos: Pasos; tmv: number }>(exerciseKey, {
    pasos: { costosFijos: "", piezasMes: "", horasPieza: "", valorHora: "" },
    tmv: 0,
  });

  const p = answers.pasos;
  const r = calcular(p);

  const setPaso = (key: keyof Pasos, v: string) => {
    const pasos = { ...p, [key]: v };
    update({ pasos, tmv: calcular(pasos).tmv });
  };

  const campos: { key: keyof Pasos; label: string; sufijo: string; ayuda: string }[] = [
    {
      key: "costosFijos",
      label: "1. Costos fijos mensuales",
      sufijo: "$/mes",
      ayuda: "Equipos prorrateados, software, servicios, formación, impuestos fijos.",
    },
    {
      key: "piezasMes",
      label: "2. Piezas vendibles por mes",
      sufijo: "u",
      ayuda: "Cuántas piezas comerciales producís bien sin fundirte (sano: 4 a 8).",
    },
    {
      key: "horasPieza",
      label: "3. Horas promedio por pieza",
      sufijo: "hs",
      ayuda: "Brief + ángulo + grabar + editar + copy + aprobación + publicar. Contá todo.",
    },
    {
      key: "valorHora",
      label: "4. Tu valor hora",
      sufijo: "$",
      ayuda: "Sueldo de tu nivel ÷ 160 × 1,5 (sin aguinaldo ni vacaciones pagas).",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {campos.map((c) => (
          <label key={c.key} className="block">
            <span className="block text-sm font-medium text-tinta/80">{c.label}</span>
            <span className="mb-1 block text-xs text-tinta/45">{c.ayuda}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={p[c.key]}
                onChange={(e) => setPaso(c.key, e.target.value)}
                className="w-full rounded-xl border border-tinta/15 bg-crema/50 px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
              <span className="w-14 shrink-0 text-sm text-tinta/50">{c.sufijo}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="md:sticky md:top-6 md:self-start">
        <div className="rounded-2xl bg-tinta p-6 text-crema">
          <p className="font-serif text-sm uppercase tracking-wide text-coral">Cálculo en vivo</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-crema/60">5. Costo fijo por pieza (1 ÷ 2)</dt>
              <dd>{money(r.costoFijoPieza)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-crema/60">6. Costo de producción (3 × 4)</dt>
              <dd>{money(r.costoProduccion)}</dd>
            </div>
            <div className="flex justify-between border-t border-crema/15 pt-2">
              <dt className="text-crema/60">7. Subtotal (5 + 6)</dt>
              <dd>{money(r.subtotal)}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-crema/15 pt-4">
            <p className="text-xs text-crema/60">8. Tu TMV (subtotal × 1,3)</p>
            <p className="font-serif text-4xl">{money(r.tmv)}</p>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-crema/60">
            Escribila en grande. De acá en adelante, ningún número que mandes puede
            estar debajo de esta línea.
          </p>
        </div>
      </div>
    </div>
  );
}
