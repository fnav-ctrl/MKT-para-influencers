import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mpPayment, verifyMpSignature } from "@/lib/mercadopago";
import { sendPurchaseEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Webhook de Mercado Pago. El desbloqueo del contenido depende SOLO de acá,
// nunca del redirect de vuelta (el usuario puede cerrar la pestaña).
export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  // data.id puede venir por querystring o en el body.
  const body = await request.json().catch(() => ({}) as Record<string, unknown>);
  const dataId =
    url.searchParams.get("data.id") ??
    ((body as { data?: { id?: string } }).data?.id ?? null);
  const type =
    url.searchParams.get("type") ??
    (body as { type?: string }).type ??
    (body as { topic?: string }).topic ??
    null;

  // 1. Validar firma
  const valid = verifyMpSignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
  });
  if (!valid) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  // Solo nos interesan notificaciones de pago.
  if (type !== "payment" || !dataId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // 2. Traer el pago real desde la API de MP (no confiar en el body).
  let payment;
  try {
    payment = await mpPayment().get({ id: dataId });
  } catch {
    // 200 igual para que MP no reintente infinito si el id no existe.
    return NextResponse.json({ ok: true, note: "payment not found" });
  }

  const externalRef = payment.external_reference;
  const status = payment.status; // approved | pending | rejected | refunded | ...
  if (!externalRef) {
    return NextResponse.json({ ok: true, note: "sin external_reference" });
  }

  // El external_reference puede ser un id (volumen individual) o varios ids
  // separados por coma (combo de la serie completa).
  const purchaseIds = externalRef.split(",").map((s) => s.trim()).filter(Boolean);

  // 3. Mapear estado de MP → estado de purchase e idempotente-mente actualizar.
  const admin = createAdminClient();
  let nuevoStatus: "pending" | "approved" | "refunded" | null = null;
  if (status === "approved") nuevoStatus = "approved";
  else if (status === "refunded" || status === "charged_back") nuevoStatus = "refunded";

  if (nuevoStatus) {
    for (const purchaseId of purchaseIds) {
      // Estado actual: para no reprocesar y mandar el email una sola vez.
      const { data: actual } = await admin
        .from("purchases")
        .select("status, user_id, products(slug, titulo)")
        .eq("id", purchaseId)
        .maybeSingle();

      const yaAprobada = actual?.status === "approved";

      await admin
        .from("purchases")
        .update({ status: nuevoStatus, mp_payment_id: String(payment.id) })
        .eq("id", purchaseId);

      if (nuevoStatus === "approved" && !yaAprobada && actual?.user_id) {
        const prod = actual.products as { slug?: string; titulo?: string } | null;
        const { data: userData } = await admin.auth.admin.getUserById(actual.user_id);
        const email = userData?.user?.email;
        if (email && prod?.slug && prod?.titulo) {
          await sendPurchaseEmail(email, prod.titulo, prod.slug);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
