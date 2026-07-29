import { PLANILLA_PRECIOS_URL } from "@/lib/kits";

// Ejercicio de la planilla de precios (Google Sheets). Abre una copia editable
// propia para que cada usuario arme el precio de cada contenido con su TMV.
export function PlanillaPrecios() {
  return (
    <div className="my-6 rounded-2xl border border-tinta/10 bg-white p-5">
      <p className="mb-1 font-serif text-lg text-tinta">
        Tu planilla de precios
      </p>
      <p className="mb-4 text-sm text-tinta/60">
        Abrí tu propia copia y armá el precio de cada tipo de contenido tomando tu
        TMV como piso. Se abre en Google Sheets y elegís Usar plantilla (hacer una
        copia).
      </p>
      <a
        href={PLANILLA_PRECIOS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600"
      >
        Abrir la planilla de precios
      </a>
    </div>
  );
}
