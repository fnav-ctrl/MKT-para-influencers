import { ComprarButton } from "@/components/checkout/ComprarButton";

// CTA de cierre del Vol 1: dispara la compra del Volumen 2.
export function CTAVolumen2() {
  return (
    <div className="my-8 rounded-2xl bg-tinta p-6 text-crema">
      <p className="font-serif text-lg">¿Seguimos?</p>
      <p className="mt-1 text-crema/70">
        El Volumen 2 es tu negocio completo: números, métricas y un plan de 90 días.
      </p>
      <div className="mt-4">
        <ComprarButton slug="vol2" label="Quiero seguir aprendiendo" />
      </div>
    </div>
  );
}
