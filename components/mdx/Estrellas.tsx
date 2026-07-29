"use client";

import { useExercise } from "./ChapterProvider";

// Feedback con estrellas (1-5) + comentario opcional. Persiste como cualquier
// ejercicio (tabla exercise_answers, RLS por usuario). Flor puede exportar las
// respuestas por exercise_key para leer el feedback de la serie.
export function Estrellas({
  exerciseKey,
  titulo = "¿Qué te parecieron estos volúmenes?",
}: {
  exerciseKey: string;
  titulo?: string;
}) {
  const { answers, update } = useExercise(exerciseKey, { valor: 0, comentario: "" });
  const valor = (answers.valor as number) ?? 0;
  const comentario = (answers.comentario as string) ?? "";

  return (
    <div className="rounded-2xl border border-tinta/10 bg-white p-5">
      <p className="text-sm font-medium text-tinta/80">{titulo}</p>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label={titulo}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={valor === n}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
            onClick={() => update({ valor: n })}
            className="text-2xl leading-none transition-transform hover:scale-110"
          >
            <span className={n <= valor ? "text-coral" : "text-tinta/20"}>★</span>
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 w-full rounded-xl border border-tinta/15 bg-crema/50 px-4 py-2.5 text-tinta placeholder:text-tinta/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        rows={2}
        placeholder="¿Algo que quieras contarnos? (opcional)"
        value={comentario}
        onChange={(e) => update({ comentario: e.target.value })}
      />
    </div>
  );
}
