import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPreference } from "@/lib/mercadopago";
import { isVolSlug } from "@/lib/products";
import type { Product } from "@/lib/types";

const bodySchema = z.object({ slug: z.string() });

export async function POST(request: NextRequest) {
  // 1. Autenticación
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // 2. Validar input
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || !isVolSlug(parsed.data.slug)) {
    return NextResponse.json({ error: "Producto inválido" }, { status: 400 });
  }

  // 3. Producto
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", parsed.data.slug)
    .eq("activo", true)
    .maybeSingle<Product>();
  if (!product) {
    return NextResponse.json({ error: "Producto no disponible" }, { status: 404 });
  }

  // 4. ¿Ya lo compró?
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("product_id", product.id)
    .eq("status", "approved")
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "Ya tenés este volumen" }, { status: 409 });
  }

  // 5. Crear purchase pending (service role: no hay policy de insert para users)
  const admin = createAdminClient();
  const { data: purchase, error: purchaseErr } = await admin
    .from("purchases")
    .insert({ user_id: user.id, product_id: product.id, status: "pending" })
    .select("id")
    .single();
  if (purchaseErr || !purchase) {
    return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 });
  }

  // 6. Preferencia de Mercado Pago
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  try {
    const pref = await mpPreference().create({
      body: {
        items: [
          {
            id: product.slug,
            title: product.titulo,
            quantity: 1,
            unit_price: product.precio_ars,
            currency_id: "ARS",
          },
        ],
        external_reference: purchase.id,
        payer: { email: user.email ?? undefined },
        back_urls: {
          success: `${siteUrl}/compra/retorno?purchase=${purchase.id}`,
          pending: `${siteUrl}/compra/retorno?purchase=${purchase.id}`,
          failure: `${siteUrl}/compra/retorno?purchase=${purchase.id}`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mp`,
        metadata: { purchase_id: purchase.id, user_id: user.id },
      },
    });

    return NextResponse.json({ init_point: pref.init_point, purchase_id: purchase.id });
  } catch (e) {
    return NextResponse.json(
      { error: "No pudimos conectar con Mercado Pago" },
      { status: 502 },
    );
  }
}
