"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Crea la purchase pending + preferencia MP y redirige a Checkout Pro.
export function ComprarButton({
  slug,
  label = "Comprar",
  className,
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function comprar() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? "No pudimos iniciar el pago.");
      }
      window.location.href = data.init_point;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={comprar} disabled={loading} className="w-full">
        {loading ? "Redirigiendo…" : label}
      </Button>
      {error && <p className="mt-2 text-xs text-coral-600">{error}</p>}
    </div>
  );
}
