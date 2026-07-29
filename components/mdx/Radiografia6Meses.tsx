"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 3 — Radiografía financiera de 6 meses.
// Ingresos y egresos por mes → resultado, promedio real, volatilidad y sueldo.
type Fila = { ingresos: string; egresos: string };
// Además de los meses, persistimos el promedio y el sueldo calculados para
// poder encadenarlos en el capítulo de métricas (regla de oro).
type Data = { meses: Fila[]; promedio: number; sueldo: number };

const MESES = 6;
const vacio = (): Fila[] => Array.from({ length: MESES }, () => ({ ingresos: "", egresos: "" }));

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    : "—";

export function Radiografia6Meses({ exerciseKey = "radiografia" }: { exerciseKey?: string }) {
  const { answers, update } = useExercise<Data>(exerciseKey, {
    meses: vacio(),
    promedio: 0,
    sueldo: 0,
  });
  const meses = answers.meses?.length === MESES ? answers.meses : vacio();

  const derivar = (filas: Fila[]) => {
    const res = filas.map((m) => num(m.ingresos) - num(m.egresos));
    const con = filas.filter((m) => m.ingresos !== "" || m.egresos !== "").length;
    const prom = con > 0 ? res.reduce((a, b) => a + b, 0) / con : 0;
    return { prom, sueldo: prom > 0 ? prom * 0.8 : 0 };
  };

  const set = (i: number, campo: keyof Fila, v: string) => {
    const next = meses.map((m, idx) => (idx === i ? { ...m, [campo]: v } : m));
    const d = derivar(next);
    update({ meses: next, promedio: d.prom, sueldo: d.sueldo });
  };

  const resultados = meses.map((m) => num(m.ingresos) - num(m.egresos));
  const conDatos = meses.filter((m) => m.ingresos !== "" || m.egresos !== "").length;
  const promedio = conDatos > 0 ? resultados.reduce((a, b) => a + b, 0) / conDatos : 0;
  const ingresosArr = meses.map((m) => num(m.ingresos)).filter((n) => n > 0);
  const volatilidad =
    ingresosArr.length > 1 ? Math.max(...ingresosArr) / Math.min(...ingresosArr) : 0;
  const sueldo = promedio > 0 ? promedio * 0.8 : 0;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-tinta/60">
              <th className="p-2">Mes</th>
              <th className="p-2">Ingresos</th>
              <th className="p-2">Egresos</th>
              <th className="p-2 text-right">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((m, i) => (
              <tr key={i} className="border-t border-tinta/10">
                <td className="p-2 text-tinta/50">Mes {i + 1}</td>
                <td className="p-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={m.ingresos}
                    onChange={(e) => set(i, "ingresos", e.target.value)}
                    className="w-28 rounded-lg border border-tinta/15 bg-crema/40 px-2 py-1 focus:border-coral focus:outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={m.egresos}
                    onChange={(e) => set(i, "egresos", e.target.value)}
                    className="w-28 rounded-lg border border-tinta/15 bg-crema/40 px-2 py-1 focus:border-coral focus:outline-none"
                  />
                </td>
                <td
                  className={`p-2 text-right font-medium ${resultados[i] < 0 ? "text-coral-600" : "text-tinta"}`}
                >
                  {m.ingresos === "" && m.egresos === "" ? "—" : money(resultados[i])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-tinta p-4 text-crema">
          <p className="text-xs text-crema/60">Tu sueldo real (promedio)</p>
          <p className="font-serif text-2xl">{money(promedio)}</p>
        </div>
        <div className="rounded-xl border border-tinta/10 bg-white p-4">
          <p className="text-xs text-tinta/50">Volatilidad (mejor ÷ peor mes)</p>
          <p className="font-serif text-2xl text-tinta">
            {volatilidad > 0 ? `${volatilidad.toFixed(1)}×` : "—"}
          </p>
          {volatilidad >= 2 && (
            <p className="mt-1 text-xs text-coral-600">Alta: apuntá a 6 meses de reserva.</p>
          )}
        </div>
        <div className="rounded-xl border border-tinta/10 bg-white p-4">
          <p className="text-xs text-tinta/50">Sueldo a pagarte (× 0,8)</p>
          <p className="font-serif text-2xl text-tinta">{money(sueldo)}</p>
          <p className="mt-1 text-xs text-tinta/45">El 20% alimenta la reserva.</p>
        </div>
      </div>
    </div>
  );
}
