import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPreference } from "@/lib/mercadopago";
import { isVolSlug, VOL_SLUGS } from "@/lib/products";
import { COMBO_SLUG, comboPriceArs } from "@/lib/kits";
import type { Product } from "@/lib/types";

const bodySchema = z.object({ slug: z.string() });

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const slug = parsed.data.slug;
  const isCombo = slug === COMBO_SLUG;
  if (!isCombo && !isVolSlug(slug)) {
    return NextResponse.json({ error: "Producto inválido" }, { status: 400 });
  }

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // Volúmenes que el usuario ya tiene aprobados.
  const { data: owned } = await supabase
    .from("purchases")
    .select("products(slug)")
    .eq("status", "approved");
  const ownedSlugs = new Set(
    (owned ?? []).map((p) => (p.products as { slug?: string } | null)?.slug),
  );

  // === Combo: los 3 volúmenes con 10% off ===
  if (isCombo) {
    if (VOL_SLUGS.some((s) => ownedSlugs.has(s))) {
      return NextResponse.json(
        { error: "Ya tenés uno o más volúmenes. Comprá los que te faltan por separado." },
        { status: 409 },
      );
    }
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("slug", VOL_SLUGS as unknown as string[])
      .eq("activo", true)
      .order("orden");
    const vols = (products ?? []) as Product[];
    if (vols.length !== 3) {
      return NextResponse.json({ error: "Catálogo incompleto" }, { status: 404 });
    }

    const { data: created, error } = await admin
      .from("purchases")
      .insert(vols.map((v) => ({ user_id: user.id, product_id: v.id, status: "pending" })))
      .select("id");
    if (error || !created || created.length !== 3) {
      return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 });
    }
    const ids = created.map((c) => c.id);
    const total = comboPriceArs(vols.map((v) => v.precio_ars));

    try {
      const pref = await mpPreference().create({
        body: {
          items: [
            {
              id: "serie",
              title: "Monetizá tu Influencia · Serie completa (3 volúmenes) · 10% off",
              quantity: 1,
              unit_price: total,
              currency_id: "ARS",
            },
          ],
          external_reference: ids.join(","),
          payer: { email: user.email ?? undefined },
          back_urls: {
            success: `${siteUrl}/compra/retorno?purchase=${ids[0]}`,
            pending: `${siteUrl}/compra/retorno?purchase=${ids[0]}`,
            failure: `${siteUrl}/compra/retorno?purchase=${ids[0]}`,
          },
          auto_return: "approved",
          notification_url: `${siteUrl}/api/webhooks/mp`,
          metadata: { combo: true, user_id: user.id },
        },
      });
      return NextResponse.json({ init_point: pref.init_point, purchase_id: ids[0] });
    } catch {
      return NextResponse.json({ error: "No pudimos conectar con Mercado Pago" }, { status: 502 });
    }
  }

  // === Volumen individual ===
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle<Product>();
  if (!product) {
    return NextResponse.json({ error: "Producto no disponible" }, { status: 404 });
  }
  if (ownedSlugs.has(slug)) {
    return NextResponse.json({ error: "Ya tenés este volumen" }, { status: 409 });
  }

  const { data: purchase, error: purchaseErr } = await admin
    .from("purchases")
    .insert({ user_id: user.id, product_id: product.id, status: "pending" })
    .select("id")
    .single();
  if (purchaseErr || !purchase) {
    return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 });
  }

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
  } catch {
    return NextResponse.json({ error: "No pudimos conectar con Mercado Pago" }, { status: 502 });
  }
}
