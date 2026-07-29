import Link from "next/link";
import { kitHref } from "@/lib/kits";
import type { VolSlug } from "@/lib/types";

// "Descargá tu kit": lleva a la página imprimible con TODOS los ejercicios que
// completaste en el volumen (guardar como PDF desde el navegador).
export function DescargaKit({ vol }: { vol: VolSlug }) {
  return (
    <Link
      href={kitHref(vol)}
      className="my-6 inline-flex items-center gap-2 rounded-full bg-tinta px-5 py-3 text-sm font-semibold text-crema transition hover:bg-tinta/90"
    >
      📦 Descargar tu kit (tus ejercicios en PDF)
    </Link>
  );
}
