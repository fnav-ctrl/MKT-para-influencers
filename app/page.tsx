import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { getProductsWithAccess } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { COMBO_DISCOUNT, comboPriceArs } from "@/lib/kits";

const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

// Descripción breve + entregables de cada volumen (para la home).
const INFO: Record<string, { desc: string; entregables: string[] }> = {
  vol1: {
    desc: "Ponele precio a tu trabajo con un método, no adivinando.",
    entregables: [
      "Tu Tarifa Mínima Viable (TMV)",
      "Tres paquetes de precios listos para mandar",
      "Tu media kit y tu presupuesto",
    ],
  },
  vol2: {
    desc: "Dejá de improvisar: leé y dirigí tu negocio como dueña.",
    entregables: [
      "Canvas de Influencia",
      "Radiografía financiera de 6 meses",
      "Tablero de 5 métricas + roadmap de 90 días",
    ],
  },
  vol3: {
    desc: "Defendé tu precio en la mesa y dejá de depender del mail.",
    entregables: [
      "Tu pipeline de marcas",
      "Guiones de negociación palabra por palabra",
      "Checklist de contrato y sistema de cobro",
    ],
  },
};

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
          {products.map((p, i) => {
            const info = INFO[p.slug];
            return (
              <article
                key={p.id}
                className="flex flex-col rounded-2xl border border-tinta/10 bg-white p-6"
              >
                <span className="font-serif text-sm uppercase tracking-wide text-coral-600">
                  Volumen {i + 1}
                </span>
                <h2 className="mt-2 font-serif text-xl leading-snug">{p.titulo}</h2>
                {info && (
                  <p className="mt-3 text-sm leading-relaxed text-tinta/70">{info.desc}</p>
                )}
                {info && (
                  <ul className="mt-4 space-y-1.5 text-sm text-tinta/70">
                    {info.entregables.map((e) => (
                      <li key={e} className="flex gap-2">
                        <span aria-hidden className="text-coral-600">✓</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-6 font-serif text-3xl text-tinta">{money(p.precio_ars)}</p>
                <p className="text-sm text-tinta/50">o USD {p.precio_usd}</p>
                <div className="mt-auto pt-6">
                  <ButtonLink
                    href={user ? "/app" : "/registro"}
                    variant={i === 0 ? "primary" : "outline"}
                    className="w-full"
                  >
                    {p.desbloqueado ? "Leer" : "Comprar"}
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* Promo serie completa: 10% off comprando los 3 */}
        {products.length === 3 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-coral-600/30 bg-coral-50/50 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-serif text-lg text-tinta">
                Llevate los 3 volúmenes con {Math.round(COMBO_DISCOUNT * 100)}% OFF
              </p>
              <p className="mt-1 text-sm text-tinta/60">
                <span className="line-through">
                  {money(products.reduce((a, p) => a + p.precio_ars, 0))}
                </span>{" "}
                <span className="font-medium text-tinta">
                  {money(comboPriceArs(products.map((p) => p.precio_ars)))}
                </span>{" "}
                pagando la serie completa.
              </p>
            </div>
            <ButtonLink href={user ? "/app" : "/registro"} variant="primary">
              Quiero los 3
            </ButtonLink>
          </div>
        )}
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
