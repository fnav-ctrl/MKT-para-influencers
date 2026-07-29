import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getKitData } from "@/lib/queries";
import { isVolSlug } from "@/lib/products";
import { PrintButton } from "@/components/kit/PrintButton";

export const metadata: Metadata = { title: "Tu kit" };

// Etiqueta legible para cada clave de ejercicio (fallback: prettify).
const LABELS: Record<string, string> = {
  "v1-auditoria": "Auditoría de tus 5 colaboraciones",
  tmv: "Tu TMV (Tarifa Mínima Viable)",
  "v1-brecha": "Tu brecha vs. el mercado",
  "v1-mix-hoy": "Tu mix de ingresos hoy",
  "v1-mix-momento": "En qué momento estás",
  "v1-mix-sumar": "Modelo a sumar en 90 días",
  "v1-mix-marcas": "Marcas para activarlo",
  paquetes: "Tus tres paquetes",
  "v1-regalado": "Plata que regalaste",
  "v1-regalado-detalle": "Detalle de lo regalado",
  "v1-mediakit-linea": "Tu línea de presentación",
  "v1-mediakit-numeros": "Tus números (90 días)",
  "v1-mediakit-prueba": "Tus mejores piezas / logos",
  "v1-template-fijo": "Tu template de propuesta",
  "v1-template-seguimiento": "Tu mail de seguimiento",
};

function prettify(key: string): string {
  return LABELS[key] ?? key.replace(/^v\d-/, "").replace(/-/g, " ");
}

const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    : "—";

// Renderiza el valor guardado de un ejercicio según su forma.
function AnswerValue({ a }: { a: Record<string, unknown> }) {
  if (a == null || Object.keys(a).length === 0) return <p className="text-tinta/40">—</p>;

  if ("valor" in a) return <p className="whitespace-pre-wrap">{String(a.valor) || "—"}</p>;

  if ("items" in a && Array.isArray(a.items)) {
    return (
      <ul className="list-disc pl-5">
        {(a.items as string[]).filter(Boolean).map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    );
  }

  if ("marcados" in a) {
    const m = a.marcados as Record<string, boolean>;
    return (
      <ul className="list-none pl-0">
        {Object.entries(m).map(([k, v]) => (
          <li key={k}>{v ? "✓" : "○"} {k}</li>
        ))}
      </ul>
    );
  }

  if ("tmv" in a && "pasos" in a) {
    const p = a.pasos as Record<string, string>;
    return (
      <div>
        <p className="font-serif text-xl">{money(Number(a.tmv))}</p>
        <p className="text-sm text-tinta/60">
          Costos fijos {p.costosFijos}, piezas/mes {p.piezasMes}, horas/pieza {p.horasPieza},
          valor hora {p.valorHora}
        </p>
      </div>
    );
  }

  if ("paquetes" in a && Array.isArray(a.paquetes)) {
    const basico = Number(a.basico) || 0;
    const niveles = ["Básico", "Recomendado", "Completo"];
    const mult = [1, 1.8, 3];
    return (
      <ul className="list-none pl-0 space-y-1">
        {(a.paquetes as { nombre: string; incluye: string }[]).map((pq, i) => (
          <li key={i}>
            <strong>{niveles[i]}</strong> · {money(basico * mult[i])} — {pq.nombre || "(sin nombre)"}: {pq.incluye}
          </li>
        ))}
      </ul>
    );
  }

  if ("estados" in a) {
    const e = a.estados as Record<string, string>;
    return <ul className="list-disc pl-5">{Object.entries(e).map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>;
  }
  if ("valores" in a) {
    const v = a.valores as Record<string, string>;
    return <ul className="list-disc pl-5">{Object.entries(v).map(([k, val]) => <li key={k}>{k}: {val}</li>)}</ul>;
  }
  if ("casilleros" in a) {
    const c = a.casilleros as Record<string, string>;
    return <ul className="list-disc pl-5">{Object.entries(c).filter(([, val]) => val).map(([k, val]) => <li key={k}>{k}: {val}</li>)}</ul>;
  }

  // fallback legible
  return <pre className="whitespace-pre-wrap text-sm text-tinta/70">{JSON.stringify(a, null, 2)}</pre>;
}

export default async function KitPage({ params }: { params: { vol: string } }) {
  if (!isVolSlug(params.vol)) notFound();
  const data = await getKitData(params.vol);
  if (!data) redirect("/app");

  const conContenido = data.capitulos.filter((c) => c.answers.length > 0);

  return (
    <main className="mx-auto max-w-lectura px-6 py-10">
      <div className="no-print mb-6 flex items-center justify-between gap-4">
        <Link href={`/app/${params.vol}`} className="text-sm text-tinta/50 hover:text-tinta">
          ← Volver al volumen
        </Link>
        <PrintButton />
      </div>

      <h1 className="font-serif text-3xl">Tu kit · {data.product.titulo}</h1>
      <p className="mt-1 text-tinta/60">
        Todo lo que completaste en este volumen, en un solo lugar. Descargalo como PDF
        con el botón de arriba.
      </p>

      {conContenido.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-tinta/50">
          Todavía no completaste ejercicios en este volumen. Hacelos y volvé a
          descargar tu kit.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {conContenido.map((c) => (
            <section key={c.orden} className="break-inside-avoid">
              <h2 className="border-b border-tinta/10 pb-1 font-serif text-xl">{c.titulo}</h2>
              <div className="mt-3 space-y-4">
                {c.answers.map((e) => (
                  <div key={e.exercise_key}>
                    <p className="text-sm font-semibold text-tinta/70">{prettify(e.exercise_key)}</p>
                    <div className="mt-1 text-tinta/90">
                      <AnswerValue a={e.answers} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
