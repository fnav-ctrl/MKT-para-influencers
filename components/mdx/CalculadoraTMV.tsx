"use client";

import { useExercise } from "./ChapterProvider";

// Vol 1 · Cap 2 — Calculadora de Tarifa Mínima Viable (TMV).
// Los 8 pasos calculan la TMV en vivo y la guardan bajo la clave "tmv"
// para poder encadenarla en el Vol 2 (regla de oro del brief).
//
// COMPLETAR FLOR: confirmar la fórmula exacta del ebook. Esta es una
// implementación coherente pero debe validarse contra el método original.

type Pasos = {
  ingresoNeto: string;
  gastosFijos: string;
  impuestosPct: string;
  semanasDescanso: string;
  horasSemana: string;
  noFacturablePct: string;
  colaboracionesMes: string;
  margenPct: string;
};

const PASOS: {
  key: keyof Pasos;
  label: string;
  sufijo: string;
  ayuda: string;
}[] = [
  { key: "ingresoNeto", label: "1. Ingreso neto mensual que querés", sufijo: "$", ayuda: "Lo que te querés llevar a casa." },
  { key: "gastosFijos", label: "2. Gastos fijos del negocio", sufijo: "$/mes", ayuda: "Herramientas, edición, contadora…" },
  { key: "impuestosPct", label: "3. Impuestos", sufijo: "%", ayuda: "Lo que se va en impuestos." },
  { key: "semanasDescanso", label: "4. Semanas de descanso al año", sufijo: "sem", ayuda: "Vacaciones y semanas sin facturar." },
  { key: "horasSemana", label: "5. Horas facturables por semana", sufijo: "hs", ayuda: "Horas reales de trabajo cobrable." },
  { key: "noFacturablePct", label: "6. Tiempo no facturable", sufijo: "%", ayuda: "Admin, prospección, reuniones." },
  { key: "colaboracionesMes", label: "7. Colaboraciones por mes", sufijo: "u", ayuda: "Proyectos promedio al mes." },
  { key: "margenPct", label: "8. Margen de rentabilidad", sufijo: "%", ayuda: "Colchón para crecer, no solo sobrevivir." },
];

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (n: number) =>
  n > 0
    ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    : "—";

export function CalculadoraTMV({ exerciseKey = "tmv" }: { exerciseKey?: string }) {
  const { answers, update } = useExercise<{ pasos: Pasos; tmvHora: number; tmvColaboracion: number }>(
    exerciseKey,
    {
      pasos: {
        ingresoNeto: "",
        gastosFijos: "",
        impuestosPct: "",
        semanasDescanso: "",
        horasSemana: "",
        noFacturablePct: "",
        colaboracionesMes: "",
        margenPct: "",
      },
      tmvHora: 0,
      tmvColaboracion: 0,
    },
  );

  const p = answers.pasos;

  // Cálculo en vivo
  const brutoMensual =
    ((num(p.ingresoNeto) + num(p.gastosFijos)) / Math.max(1 - num(p.impuestosPct) / 100, 0.01)) *
    (1 + num(p.margenPct) / 100);
  const semanasFacturables = Math.max(52 - num(p.semanasDescanso), 1);
  const horasAnuales =
    semanasFacturables * num(p.horasSemana) * Math.max(1 - num(p.noFacturablePct) / 100, 0.01);
  const tmvHora = horasAnuales > 0 ? (brutoMensual * 12) / horasAnuales : 0;
  const tmvColaboracion =
    num(p.colaboracionesMes) > 0 ? brutoMensual / num(p.colaboracionesMes) : 0;

  const setPaso = (key: keyof Pasos, v: string) => {
    const pasos = { ...p, [key]: v };
    // Recalcular con los valores nuevos antes de guardar.
    const bm =
      ((num(pasos.ingresoNeto) + num(pasos.gastosFijos)) /
        Math.max(1 - num(pasos.impuestosPct) / 100, 0.01)) *
      (1 + num(pasos.margenPct) / 100);
    const sf = Math.max(52 - num(pasos.semanasDescanso), 1);
    const ha = sf * num(pasos.horasSemana) * Math.max(1 - num(pasos.noFacturablePct) / 100, 0.01);
    update({
      pasos,
      tmvHora: ha > 0 ? (bm * 12) / ha : 0,
      tmvColaboracion: num(pasos.colaboracionesMes) > 0 ? bm / num(pasos.colaboracionesMes) : 0,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {PASOS.map((paso) => (
          <label key={paso.key} className="block">
            <span className="block text-sm font-medium text-tinta/80">{paso.label}</span>
            <span className="mb-1 block text-xs text-tinta/45">{paso.ayuda}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={p[paso.key]}
                onChange={(e) => setPaso(paso.key, e.target.value)}
                className="w-full rounded-xl border border-tinta/15 bg-crema/50 px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
              <span className="w-12 shrink-0 text-sm text-tinta/50">{paso.sufijo}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="md:sticky md:top-6 md:self-start">
        <div className="rounded-2xl bg-tinta p-6 text-crema">
          <p className="font-serif text-sm uppercase tracking-wide text-coral">Tu TMV</p>
          <div className="mt-4">
            <p className="text-xs text-crema/60">Por hora</p>
            <p className="font-serif text-3xl">{money(tmvHora)}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-crema/60">Por colaboración</p>
            <p className="font-serif text-3xl">{money(tmvColaboracion)}</p>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-crema/60">
            Es tu piso. Por debajo de este número, estás perdiendo plata. Todo lo
            que cobres de más es rentabilidad real.
          </p>
        </div>
      </div>
    </div>
  );
}
