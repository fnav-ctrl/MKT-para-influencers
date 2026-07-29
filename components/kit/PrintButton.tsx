"use client";

import { Button } from "@/components/ui/Button";

// Dispara el diálogo de impresión del navegador → "Guardar como PDF".
export function PrintButton() {
  return (
    <div className="no-print">
      <Button onClick={() => window.print()}>Descargar / Imprimir PDF</Button>
    </div>
  );
}
