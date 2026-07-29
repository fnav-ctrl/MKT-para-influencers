import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getVolumeData } from "@/lib/queries";
import { isVolSlug } from "@/lib/products";
import { BarraProgreso } from "@/components/mdx/BarraProgreso";

export async function generateMetadata({
  params,
}: {
  params: { vol: string };
}): Promise<Metadata> {
  if (!isVolSlug(params.vol)) return {};
  const data = await getVolumeData(params.vol);
  return { title: data?.product.titulo ?? "Volumen" };
}

export default async function VolumeIndexPage({
  params,
}: {
  params: { vol: string };
}) {
  if (!isVolSlug(params.vol)) notFound();

  const data = await getVolumeData(params.vol);
  // Sin acceso (o volumen inexistente) → al dashboard.
  if (!data) redirect("/app");

  const { product, chapters, completedChapterIds } = data;
  const hechos = chapters.filter((c) => completedChapterIds.has(c.id)).length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/app" className="text-sm text-tinta/50 hover:text-tinta">
        ← Volver
      </Link>
      <h1 className="mt-3 font-serif text-3xl">{product.titulo}</h1>

      <div className="mt-6 max-w-sm">
        <BarraProgreso hechos={hechos} total={chapters.length} />
      </div>

      <ol className="mt-8 space-y-2">
        {chapters.map((c, i) => {
          const done = completedChapterIds.has(c.id);
          return (
            <li key={c.id}>
              <Link
                href={`/app/${params.vol}/${c.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-tinta/10 bg-white p-4 transition hover:border-coral/40"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    done ? "bg-emerald-100 text-emerald-700" : "bg-tinta/5 text-tinta/60"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="flex-1 font-medium text-tinta">{c.titulo}</span>
                <span className="text-tinta/30">→</span>
              </Link>
            </li>
          );
        })}
        {chapters.length === 0 && (
          <li className="rounded-2xl border border-dashed border-tinta/15 p-6 text-center text-tinta/50">
            Los capítulos de este volumen se están cargando.
          </li>
        )}
      </ol>
    </main>
  );
}
