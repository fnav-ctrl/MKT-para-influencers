import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CURSO_URL, CURSO_PRECIO_USD, SERIE_COMPLETA_CODE } from "@/lib/kits";
import { VOL_SLUGS } from "@/lib/products";

// Indica si el usuario compró los 3 volúmenes y, en ese caso, devuelve el
// código de descuento para el curso.
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ completa: false }, { status: 200 });

  const { data } = await supabase
    .from("purchases")
    .select("products(slug)")
    .eq("status", "approved");

  const owned = new Set(
    (data ?? []).map((p) => (p.products as { slug?: string } | null)?.slug).filter(Boolean),
  );
  const completa = VOL_SLUGS.every((s) => owned.has(s));

  return NextResponse.json({
    completa,
    code: completa ? SERIE_COMPLETA_CODE : null,
    cursoUrl: CURSO_URL,
    precio: CURSO_PRECIO_USD,
  });
}
