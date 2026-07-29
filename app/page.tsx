import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { getProductsWithAccess } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default async function LandingPage() {
  const [products, supabase] = await Promise.all([
    getProductsWithAccess(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-serif text-lg">Monetizá tu Influencia</span>
        <div className="flex items-center gap-2">
          {user ? (
            <ButtonLink href="/app" variant="primary">
              Ir a mis volúmenes
            </ButtonLink>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-sm font-medium text-tinta/70 hover:text-tinta">
                Ingresar
              </Link>
              <ButtonLink href="/registro" variant="primary">
                Crear cuenta
              </ButtonLink>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-12 text-center md:pt-20">
        <p className="mb-4 font-serif text-sm uppercase tracking-[0.2em] text-coral-600">
          Tu negocio en 3 volúmenes
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-6xl">
          Convertí tu influencia en un negocio rentable y sostenible.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-tinta/70">
          No es un PDF más, es un sistema interactivo que te guía paso a paso a
          vivir de tu influencia.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href={user ? "/app" : "/registro"} variant="primary">
            Quiero empezar
          </ButtonLink>
          <ButtonLink href="#volumenes" variant="outline">
            Ver los volúmenes
          </ButtonLink>
        </div>
      </section>

      {/* Volúmenes */}
      <section id="volumenes" className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p, i) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl border border-tinta/10 bg-white p-6"
            >
              <span className="font-serif text-sm uppercase tracking-wide text-coral-600">
                Volumen {i + 1}
              </span>
              <h2 className="mt-2 font-serif text-xl leading-snug">{p.titulo}</h2>
              <p className="mt-4 font-serif text-3xl text-tinta">{money(p.precio_ars)}</p>
              <p className="text-sm text-tinta/50">o USD {p.precio_usd}</p>
              <div className="mt-6">
                <ButtonLink
                  href={user ? "/app" : "/registro"}
                  variant={i === 0 ? "primary" : "outline"}
                  className="w-full"
                >
                  {p.desbloqueado ? "Leer" : "Comprar"}
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl">Todo tu trabajo, en un solo lugar.</h2>
        <p className="mx-auto mt-4 max-w-xl text-tinta/70">
          Tu Tarifa Mínima Viable, tus paquetes, tu semáforo del negocio. Los
          calculás una vez y los tenés siempre a mano, no en un cuaderno perdido.
        </p>
      </section>

      <footer className="border-t border-tinta/10 py-8 text-center text-sm text-tinta/40">
        Monetizá tu Influencia · Hecho para tener siempre a mano.
      </footer>
    </main>
  );
}
