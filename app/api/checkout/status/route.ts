import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Estado de una purchase para el polling de la página de retorno.
// RLS asegura que el usuario solo ve las suyas.
export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("purchase");
  if (!id) return NextResponse.json({ error: "falta purchase" }, { status: 400 });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data } = await supabase
    .from("purchases")
    .select("status, products(slug)")
    .eq("id", id)
    .maybeSingle();

  if (!data) return NextResponse.json({ error: "no encontrada" }, { status: 404 });

  const slug = (data.products as { slug?: string } | null)?.slug ?? null;
  return NextResponse.json({ status: data.status, slug });
}
