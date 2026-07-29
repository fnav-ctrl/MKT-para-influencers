import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getVolumeData, getChapterAnswers, getAllUserAnswers } from "@/lib/queries";
import { readChapterSource } from "@/lib/content";
import { isVolSlug } from "@/lib/products";
import { mdxComponents } from "@/components/mdx";
import { ChapterProvider } from "@/components/mdx/ChapterProvider";
import { MarcarCompletado } from "@/components/mdx/MarcarCompletado";

export async function generateMetadata({
  params,
}: {
  params: { vol: string; cap: string };
}): Promise<Metadata> {
  if (!isVolSlug(params.vol)) return {};
  const data = await getVolumeData(params.vol);
  const chapter = data?.chapters.find((c) => c.slug === params.cap);
  return { title: chapter?.titulo ?? "Capítulo" };
}

export default async function ChapterPage({
  params,
}: {
  params: { vol: string; cap: string };
}) {
  if (!isVolSlug(params.vol)) notFound();

  const data = await getVolumeData(params.vol);
  if (!data) redirect("/app"); // sin acceso

  const idx = data.chapters.findIndex((c) => c.slug === params.cap);
  if (idx === -1) notFound();
  const chapter = data.chapters[idx];
  const siguiente = data.chapters[idx + 1];

  const source = await readChapterSource(params.vol, params.cap);
  if (source === null) {
    // Metadata existe pero falta el archivo MDX en /content.
    return (
      <main className="mx-auto max-w-lectura px-6 py-10">
        <Link href={`/app/${params.vol}`} className="text-sm text-tinta/50">
          ← {data.product.titulo}
        </Link>
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-tinta/60">
          <p className="font-serif text-lg">{chapter.titulo}</p>
          <p className="mt-2 text-sm">Este capítulo todavía no tiene contenido cargado.</p>
        </div>
      </main>
    );
  }

  const [initialAnswers, referencias] = await Promise.all([
    getChapterAnswers(chapter.id),
    getAllUserAnswers(), // para encadenar datos entre volúmenes
  ]);
  const completado = data.completedChapterIds.has(chapter.id);

  return (
    <main className="mx-auto max-w-lectura px-6 py-10">
      <div className="mb-6 flex items-center justify-between text-sm">
        <Link href={`/app/${params.vol}`} className="text-tinta/50 hover:text-tinta">
          ← {data.product.titulo}
        </Link>
        <span className="text-tinta/40">
          Cap. {idx + 1} de {data.chapters.length}
        </span>
      </div>

      <ChapterProvider
        chapterId={chapter.id}
        initialAnswers={initialAnswers}
        referencias={referencias}
      >
        <article className="prosa">
          <MDXRemote source={source} components={mdxComponents} />
        </article>

        <MarcarCompletado
          chapterId={chapter.id}
          completadoInicial={completado}
          siguienteHref={siguiente ? `/app/${params.vol}/${siguiente.slug}` : undefined}
        />
      </ChapterProvider>
    </main>
  );
}
