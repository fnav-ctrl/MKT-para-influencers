"use client";

import { useEffect, useState } from "react";

type Estado = {
  completa: boolean;
  code: string | null;
  cursoUrl: string | null;
  precio: number;
};

// CTA final de la serie. Si el usuario compró los 3 volúmenes, revela el código
// de descuento para el curso. Si no, lo invita a completar la serie.
export function SerieCompletaCTA() {
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    fetch("/api/serie-completa", { cache: "no-store" })
      .then((r) => r.json())
      .then(setEstado)
      .catch(() => setEstado(null));
  }, []);

  if (!estado) return null;

  return (
    <div className="my-8 rounded-2xl bg-tinta p-6 text-crema">
      <p className="font-serif text-sm uppercase tracking-wide text-coral">
        Monetizá tu Influencia · el curso
      </p>
      <p className="mt-2 text-lg">
        El método completo en video, con plantillas guiadas y acompañamiento.
      </p>

      {estado.completa ? (
        <div className="mt-4">
          <p className="text-crema/70">
            Compraste los 3 volúmenes. Tu descuento exclusivo para el curso:
          </p>
          {estado.code ? (
            <p className="mt-2 inline-block rounded-lg border border-coral/50 bg-coral/10 px-4 py-2 font-mono text-xl tracking-widest text-coral">
              {estado.code}
            </p>
          ) : (
            <p className="mt-2 text-sm text-crema/50">
              (COMPLETAR FLOR: cargar el código en lib/kits.ts)
            </p>
          )}
          {estado.cursoUrl && (
            <a
              href={estado.cursoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
            >
              Ir al curso
            </a>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-crema/70">
          Comprá los 3 volúmenes de la serie para desbloquear tu descuento exclusivo
          al curso.
        </p>
      )}
    </div>
  );
}
