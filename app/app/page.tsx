import Link from "next/link";
import type { Metadata } from "next";
import { getProductsWithAccess } from "@/lib/queries";
import { ComprarButton } from "@/components/checkout/ComprarButton";

export const metadata: Metadata = { title: "Mis volúmenes" };

const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function DashboardPage() {
  const products = await getProductsWithAccess();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-serif text-3xl">Tus volúmenes</h1>
      <p className="mt-1 text-tinta/60">
        Desbloqueá cada volumen y hacé los ejercicios adentro.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {products.map((p, i) => (
          <article
            key={p.id}
            className="flex flex-col rounded-2xl border border-tinta/10 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm uppercase tracking-wide text-coral-600">
                Volumen {i + 1}
              </span>
              {p.desbloqueado ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Desbloqueado
                </span>
              ) : (
                <span aria-hidden className="text-tinta/30">🔒</span>
              )}
            </div>

            <h2 className="mt-2 font-serif text-lg leading-snug">{p.titulo}</h2>

            <div className="mt-6 flex-1" />

            {p.desbloqueado ? (
              <Link
                href={`/app/${p.slug}`}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600"
              >
                Entrar
              </Link>
            ) : (
              <div className="mt-2">
                <p className="mb-3 font-serif text-2xl text-tinta">{money(p.precio_ars)}</p>
                <ComprarButton slug={p.slug} label="Comprar" />
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
