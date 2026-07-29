"use client";

import { useExercise } from "./ChapterProvider";

// Captura de mail para novedades del lanzamiento del curso. Persiste como
// ejercicio (exercise_answers, RLS por usuario). COMPLETAR FLOR: para producción,
// sincronizar estos mails con la audiencia de Resend (o exportarlos por
// exercise_key) para armar la lista de espera del lanzamiento.
export function NovedadesLanzamiento({
  exerciseKey = "v3-novedades",
  texto = "Anotate acá si querés recibir novedades del lanzamiento del curso.",
}: {
  exerciseKey?: string;
  texto?: string;
}) {
  const { answers, update } = useExercise(exerciseKey, { email: "" });
  const email = (answers.email as string) ?? "";
  const ok = /.+@.+\..+/.test(email);

  return (
    <div className="rounded-2xl border border-coral/30 bg-coral-50/60 p-5">
      <p className="text-sm font-medium text-tinta/80">{texto}</p>
      <input
        type="email"
        inputMode="email"
        placeholder="tu@email.com"
        className="mt-3 w-full rounded-xl border border-tinta/15 bg-white px-4 py-2.5 text-tinta placeholder:text-tinta/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        value={email}
        onChange={(e) => update({ email: e.target.value })}
      />
      {ok && (
        <p className="mt-2 text-sm text-emerald-700">
          ✓ Listo, te vamos a avisar del lanzamiento.
        </p>
      )}
    </div>
  );
}
