import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Chapter, Product, VolSlug } from "@/lib/types";

export interface ProductWithAccess extends Product {
  desbloqueado: boolean;
}

// Catálogo con estado de acceso del usuario actual (si hay sesión).
export async function getProductsWithAccess(): Promise<ProductWithAccess[]> {
  const supabase = createClient();

  const [{ data: products }, { data: { user } }] = await Promise.all([
    supabase.from("products").select("*").eq("activo", true).order("orden"),
    supabase.auth.getUser(),
  ]);

  let approvedIds = new Set<string>();
  if (user) {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("product_id")
      .eq("status", "approved");
    approvedIds = new Set((purchases ?? []).map((p) => p.product_id));
  }

  return (products ?? []).map((p) => ({
    ...(p as Product),
    desbloqueado: approvedIds.has(p.id),
  }));
}

export async function getProductBySlug(slug: VolSlug): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Product) ?? null;
}

// ¿El usuario actual compró (approved) este producto?
export async function hasAccess(productId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("purchases")
    .select("id")
    .eq("product_id", productId)
    .eq("status", "approved")
    .limit(1)
    .maybeSingle();
  return !!data;
}

export interface VolumeData {
  product: Product;
  chapters: Chapter[];
  completedChapterIds: Set<string>;
}

// Índice del volumen: capítulos + progreso. Solo si hay acceso.
export async function getVolumeData(slug: VolSlug): Promise<VolumeData | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  if (!(await hasAccess(product.id))) return null;

  const supabase = createClient();
  const [{ data: chapters }, { data: progress }] = await Promise.all([
    supabase.from("chapters").select("*").eq("product_id", product.id).order("orden"),
    supabase.from("progress").select("chapter_id"),
  ]);

  return {
    product,
    chapters: (chapters as Chapter[]) ?? [],
    completedChapterIds: new Set((progress ?? []).map((p) => p.chapter_id)),
  };
}

export async function getChapter(
  slug: VolSlug,
  chapterSlug: string,
): Promise<{ product: Product; chapter: Chapter } | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  if (!(await hasAccess(product.id))) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("chapters")
    .select("*")
    .eq("product_id", product.id)
    .eq("slug", chapterSlug)
    .maybeSingle();
  if (!data) return null;
  return { product, chapter: data as Chapter };
}

// Respuestas guardadas de un capítulo: exercise_key -> answers.
export async function getChapterAnswers(
  chapterId: string,
): Promise<Record<string, Record<string, unknown>>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("exercise_answers")
    .select("exercise_key, answers")
    .eq("chapter_id", chapterId);
  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) {
    map[row.exercise_key] = row.answers ?? {};
  }
  return map;
}
