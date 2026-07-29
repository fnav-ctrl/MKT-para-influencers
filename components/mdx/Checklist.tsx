"use client";

import { useExercise } from "./ChapterProvider";

// Vol 3 · Cap 5 (contrato) y checklist de brief. Lista de ítems chequeables
// que persisten su estado.
export function Checklist({
  exerciseKey,
  items,
}: {
  exerciseKey: string;
  items: string[];
}) {
  const { answers, update } = useExercise<{ marcados: Record<string, boolean> }>(
    exerciseKey,
    { marcados: {} },
  );

  const toggle = (item: string) =>
    update({ marcados: { ...answers.marcados, [item]: !answers.marcados[item] } });

  const hechos = items.filter((i) => answers.marcados[i]).length;

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item) => {
          const marcado = !!answers.marcados[item];
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-tinta/10 bg-white p-3 hover:border-tinta/20">
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => toggle(item)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-coral"
                />
                <span className={marcado ? "text-tinta/40 line-through" : "text-tinta"}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-tinta/50">
        {hechos} de {items.length} listos
      </p>
    </div>
  );
}
