import "server-only";

import crypto from "node:crypto";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

export function mpClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Falta MP_ACCESS_TOKEN");
  return new MercadoPagoConfig({ accessToken });
}

export function mpPreference() {
  return new Preference(mpClient());
}

export function mpPayment() {
  return new Payment(mpClient());
}

// Valida la firma del webhook de Mercado Pago.
// MP manda: header `x-signature: ts=<ts>,v1=<hash>` y `x-request-id`.
// El manifest a firmar es: `id:<dataId>;request-id:<reqId>;ts:<ts>;`
// y v1 = HMAC-SHA256(manifest, MP_WEBHOOK_SECRET).
export function verifyMpSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    // Sin secret configurado no podemos validar → rechazar por seguridad.
    return false;
  }
  const { xSignature, xRequestId, dataId } = opts;
  if (!xSignature || !dataId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k?.trim(), v?.trim()];
    }),
  ) as { ts?: string; v1?: string };

  if (!parts.ts || !parts.v1) return false;

  // data.id se compara en minúsculas según la doc de MP.
  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId ?? ""};ts:${parts.ts};`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(parts.v1, "hex"),
    );
  } catch {
    return false;
  }
}
