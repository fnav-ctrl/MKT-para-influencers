"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 6 — Matriz de mix de ingresos.
// Puntuás cada modelo de negocio (1-5) en varios criterios y la matriz
// muestra el ganador (mayor puntaje total).
const MODELOS_DEFAULT = [
  "Colaboraciones con marcas",
  "Producto propio",
  "Membresía / comunidad",
  "Servicios / consultoría",
  "Afiliados",
];
const CRITERIOS_DEFAULT = ["Disfrute", "Rentabilidad", "Escalabilidad", "Facilidad hoy"];

type Data = { puntajes: Record<string, Record<string, number>> };

export function MatrizMix({
  exerciseKey = "matriz-mix",
  modelos = MODELOS_DEFAULT,
  criterios = CRITERIOS_DEFAULT,
}: {
  exerciseKey?: string;
  modelos?: string[];
  criterios?: string[];
}) {
  const { answers, update } = useExercise<Data>(exerciseKey, { puntajes: {} });

  const get = (modelo: string, crit: string) => answers.puntajes[modelo]?.[crit] ?? 0;
  const set = (modelo: string, crit: string, v: number) => {
    const fila = { ...(answers.puntajes[modelo] ?? {}), [crit]: v };
    update({ puntajes: { ...answers.puntajes, [modelo]: fila } });
  };
  const total = (modelo: string) =>
    criterios.reduce((sum, c) => sum + get(modelo, c), 0);

  const totales = modelos.map((m) => ({ modelo: m, total: total(m) }));
  const max = Math.max(...totales.map((t) => t.total), 0);
  const ganador = max > 0 ? totales.find((t) => t.total === max)?.modelo : null;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-tinta/60">
              <th className="p-2">Modelo</th>
              {criterios.map((c) => (
                <th key={c} className="p-2 text-center font-medium">{c}</th>
              ))}
              <th className="p-2 text-center font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {modelos.map((modelo) => {
              const esGanador = modelo === ganador;
              return (
                <tr
                  key={modelo}
                  className={`border-t border-tinta/10 ${esGanador ? "bg-coral-50/60" : ""}`}
                >
                  <td className="p-2 font-medium text-tinta">{modelo}</td>
                  {criterios.map((c) => (
                    <td key={c} className="p-2 text-center">
                      <select
                        value={get(modelo, c)}
                        onChange={(e) => set(modelo, c, Number(e.target.value))}
                        className="rounded-lg border border-tinta/15 bg-crema/40 px-2 py-1 focus:border-coral focus:outline-none"
                      >
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n || "–"}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="p-2 text-center font-serif text-lg text-tinta">
                    {total(modelo)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {ganador && (
        <p className="rounded-xl bg-tinta px-4 py-3 text-crema">
          Tu foco sugerido: <strong className="text-coral">{ganador}</strong>. Es
          el modelo con mayor puntaje en tu mix. Empezá por ahí.
        </p>
      )}
    </div>
  );
}
