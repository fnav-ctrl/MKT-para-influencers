import { ComprarButton } from "@/components/checkout/ComprarButton";

// CTA de cierre del Vol 2: dispara la compra del Volumen 3.
export function CTAVolumen3() {
  return (
    <div className="my-8 rounded-2xl bg-tinta p-6 text-crema">
      <p className="font-serif text-lg">El último paso</p>
      <p className="mt-1 text-crema/70">
        El Volumen 3 es la negociación: guiones, contratos y un pipeline que nunca se
        apaga.
      </p>
      <div className="mt-4">
        <ComprarButton slug="vol3" label="Quiero el Volumen 3" />
      </div>
    </div>
  );
}
