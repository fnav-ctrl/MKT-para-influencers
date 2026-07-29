"use client";

import { useExercise } from "./ChapterProvider";

// Vol 2 · Cap 2 — Canvas de Influencia (9 casilleros).
const CASILLEROS = [
  { key: "propuesta", n: 1, label: "Propuesta de valor", q: "¿Qué obtiene una marca con vos que no obtiene con otro creador?" },
  { key: "audiencias", n: 2, label: "Tus audiencias", q: "Edad, intereses, qué compran, qué te creen que a otros no." },
  { key: "clientes", n: 3, label: "Tus clientes", q: "Son las MARCAS (y tu comunidad si tenés producto propio). ¿Cuál es tu marca ideal?" },
  { key: "canales", n: 4, label: "Tus canales", q: "¿Dónde vive tu contenido y dónde te encuentran las marcas?" },
  { key: "relacion", n: 5, label: "Relación con la comunidad", q: "¿Consumo pasivo, conversación, comunidad que compra?" },
  { key: "ingresos", n: 6, label: "Fuentes de ingreso", q: "Los 6 modelos del Vol 1: ¿cuáles usás y cuánto pesa cada uno?" },
  { key: "recursos", n: 7, label: "Recursos clave", q: "Equipos, tiempo, habilidades, tu credibilidad." },
  { key: "actividades", n: 8, label: "Actividades clave", q: "¿Qué hacés cada semana que genera el negocio?" },
  { key: "costos", n: 9, label: "Estructura de costos", q: "Los costos fijos del Vol 1, cap 2. Ya los tenés." },
];

type Data = { casilleros: Record<string, string>; rojos: Record<string, boolean> };

export function Canvas9({ exerciseKey = "canvas" }: { exerciseKey?: string }) {
  const { answers, update } = useExercise<Data>(exerciseKey, {
    casilleros: {},
    rojos: {},
  });

  const setTexto = (key: string, v: string) =>
    update({ casilleros: { ...answers.casilleros, [key]: v } });
  const toggleRojo = (key: string) =>
    update({ rojos: { ...answers.rojos, [key]: !answers.rojos[key] } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CASILLEROS.map((c) => {
        const rojo = !!answers.rojos[c.key];
        return (
          <div
            key={c.key}
            className={`rounded-xl border p-3 ${rojo ? "border-coral bg-coral-50/50" : "border-tinta/10 bg-white"}`}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <span className="font-serif text-sm text-tinta">
                {c.n}. {c.label}
              </span>
              <button
                type="button"
                onClick={() => toggleRojo(c.key)}
                title="Marcar como flojo (rojo)"
                className={`h-4 w-4 shrink-0 rounded-full border ${rojo ? "border-coral bg-coral" : "border-tinta/30"}`}
                aria-pressed={rojo}
                aria-label="Marcar casillero en rojo"
              />
            </div>
            <p className="mb-2 text-xs text-tinta/45">{c.q}</p>
            <textarea
              rows={3}
              value={answers.casilleros[c.key] ?? ""}
              onChange={(e) => setTexto(c.key, e.target.value)}
              className="w-full rounded-lg border border-tinta/15 bg-crema/40 px-2 py-1.5 text-sm focus:border-coral focus:outline-none"
            />
          </div>
        );
      })}
    </div>
  );
}
