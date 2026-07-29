"use client";

import { useChapter } from "./ChapterProvider";

// Contenedor de ejercicio con título y estado de guardado.
export function Ejercicio({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  const { saveState } = useChapter();

  const estado =
    saveState === "saving"
      ? { label: "Guardando…", cls: "text-tinta/50" }
      : saveState === "saved"
        ? { label: "Guardado ✓", cls: "text-emerald-600" }
        : saveState === "error"
          ? { label: "Error al guardar", cls: "text-coral-600" }
          : { label: "Se guarda solo", cls: "text-tinta/40" };

  return (
    <section className="my-8 rounded-2xl border border-tinta/10 bg-white p-5 shadow-sm md:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg text-tinta">{titulo}</h3>
        <span className={`shrink-0 text-xs ${estado.cls}`}>{estado.label}</span>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
