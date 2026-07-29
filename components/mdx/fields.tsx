"use client";

import { useExercise } from "./ChapterProvider";

const inputCls =
  "w-full rounded-xl border border-tinta/15 bg-crema/50 px-4 py-2.5 text-tinta placeholder:text-tinta/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

// Campo de texto que persiste bajo exercise_key.
export function CampoTexto({
  exerciseKey,
  label,
  placeholder,
  multiline,
}: {
  exerciseKey: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const { answers, update } = useExercise(exerciseKey, { valor: "" });
  const valor = (answers.valor as string) ?? "";

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-tinta/80">{label}</span>
      {multiline ? (
        <textarea
          className={inputCls}
          rows={4}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => update({ valor: e.target.value })}
        />
      ) : (
        <input
          type="text"
          className={inputCls}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => update({ valor: e.target.value })}
        />
      )}
    </label>
  );
}

// Campo numérico que persiste bajo exercise_key.
export function CampoNumero({
  exerciseKey,
  label,
  placeholder,
  sufijo,
}: {
  exerciseKey: string;
  label: string;
  placeholder?: string;
  sufijo?: string;
}) {
  const { answers, update } = useExercise(exerciseKey, { valor: "" });
  const valor = (answers.valor as string) ?? "";

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-tinta/80">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          className={inputCls}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => update({ valor: e.target.value })}
        />
        {sufijo ? <span className="text-sm text-tinta/50">{sufijo}</span> : null}
      </div>
    </label>
  );
}

// Lista dinámica de campos de texto (agregar/quitar filas).
export function ListaCampos({
  exerciseKey,
  label,
  placeholder,
  min = 1,
}: {
  exerciseKey: string;
  label: string;
  placeholder?: string;
  min?: number;
}) {
  const { answers, update } = useExercise(exerciseKey, {
    items: Array.from({ length: min }, () => ""),
  });
  const items = (answers.items as string[]) ?? [""];

  const setItem = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    update({ items: next });
  };
  const add = () => update({ items: [...items, ""] });
  const remove = (i: number) =>
    update({ items: items.filter((_, idx) => idx !== i) });

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-tinta/80">{label}</span>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              className={inputCls}
              placeholder={placeholder}
              value={it}
              onChange={(e) => setItem(i, e.target.value)}
            />
            {items.length > min && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Quitar"
                className="shrink-0 rounded-full px-2 text-lg text-tinta/40 hover:text-coral-600"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-3 text-sm font-semibold text-coral-600 hover:underline"
      >
        + Agregar
      </button>
    </div>
  );
}
