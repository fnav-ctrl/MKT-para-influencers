"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Estado = "pending" | "approved" | "refunded" | "error";

// Hace polling suave del estado de la compra. El desbloqueo real lo hace el
// webhook; acá solo esperamos a que se refleje.
export function RetornoCliente({ purchaseId }: { purchaseId: string }) {
  const [estado, setEstado] = useState<Estado>("pending");
  const [slug, setSlug] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    if (estado === "approved") return;
    let activo = true;

    const tick = async () => {
      try {
        const res = await fetch(`/api/checkout/status?purchase=${purchaseId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!activo) return;
        if (data.status) setEstado(data.status as Estado);
        if (data.slug) setSlug(data.slug);
      } catch {
        /* reintenta */
      } finally {
        if (activo) setIntentos((n) => n + 1);
      }
    };

    const id = setTimeout(tick, intentos === 0 ? 500 : 3000);
    return () => {
      activo = false;
      clearTimeout(id);
    };
  }, [purchaseId, intentos, estado]);

  if (estado === "approved") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>
        <h1 className="font-serif text-3xl">¡Listo! Ya es tuyo.</h1>
        <p className="mt-2 text-tinta/60">Tu volumen está desbloqueado.</p>
        <Link
          href={slug ? `/app/${slug}` : "/app"}
          className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Empezar a leer
        </Link>
      </div>
    );
  }

  if (estado === "refunded") {
    return (
      <div className="text-center">
        <h1 className="font-serif text-3xl">Pago reembolsado</h1>
        <p className="mt-2 text-tinta/60">
          Este pago fue devuelto. Si es un error, escribinos.
        </p>
        <Link href="/app" className="mt-6 inline-flex text-coral-600 hover:underline">
          Volver a mis volúmenes
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-tinta/15 border-t-coral" />
      <h1 className="font-serif text-2xl">Procesando tu pago…</h1>
      <p className="mt-2 text-tinta/60">
        Puede tardar unos segundos. No cierres esta página.
      </p>
      <Link href="/app" className="mt-6 inline-flex text-sm text-tinta/50 hover:text-tinta">
        Ir a mis volúmenes
      </Link>
    </div>
  );
}
