import { KIT_URLS } from "@/lib/kits";
import type { VolSlug } from "@/lib/types";

// Botón de descarga del kit del volumen. Si todavía no hay link cargado,
// muestra un estado "en preparación" (visible para Flor en dev).
export function DescargaKit({ vol }: { vol: VolSlug }) {
  const url = KIT_URLS[vol];

  if (!url) {
    return (
      <div className="my-6 rounded-xl border border-dashed border-tinta/20 bg-white px-5 py-4 text-sm text-tinta/50">
        📦 El kit descargable de este volumen está en preparación.
        <span className="ml-1 text-tinta/35">(COMPLETAR FLOR: cargar link en lib/kits.ts)</span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 inline-flex items-center gap-2 rounded-full bg-tinta px-5 py-3 text-sm font-semibold text-crema transition hover:bg-tinta/90"
    >
      📦 Descargar el kit de este volumen
    </a>
  );
}
