import "server-only";

import { Resend } from "resend";

// Wrapper de Resend. Si no hay RESEND_API_KEY configurada, los envíos son
// no-op silenciosos (útil en dev / antes de configurar el dominio).
const FROM = process.env.EMAIL_FROM ?? "Monetizá tu Influencia <hola@example.com>";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

async function enviar(to: string, subject: string, html: string) {
  const resend = client();
  if (!resend) {
    // Sin API key: no rompemos el flujo, solo no enviamos.
    return { skipped: true as const };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return { sent: true as const };
  } catch {
    // No dejamos que un fallo de email rompa el flujo de negocio.
    return { error: true as const };
  }
}

function layout(titulo: string, cuerpo: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1A1A2E">
    <h1 style="font-family:Georgia,serif;color:#1A1A2E">${titulo}</h1>
    ${cuerpo}
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
    <p style="font-size:12px;color:#999">Monetizá tu Influencia · Un producto de Freelo Creative Studio</p>
  </div>`;
}

export function sendWelcomeEmail(to: string, nombre?: string | null) {
  const hola = nombre ? `Hola ${nombre},` : "Hola,";
  return enviar(
    to,
    "Bienvenida a Monetizá tu Influencia",
    layout(
      "Bienvenida 👋",
      `<p>${hola}</p>
       <p>Tu cuenta está lista. Desde tu panel podés comprar cada volumen y hacer
       los ejercicios online — quedan guardados y se encadenan entre volúmenes.</p>
       <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/app" style="color:#FF6B5B">Ir a mis volúmenes →</a></p>`,
    ),
  );
}

export function sendPurchaseEmail(to: string, tituloProducto: string, vol: string) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/app/${vol}`;
  return enviar(
    to,
    `Ya tenés acceso: ${tituloProducto}`,
    layout(
      "¡Listo! Ya es tuyo 🎉",
      `<p>Confirmamos tu compra de <strong>${tituloProducto}</strong>.</p>
       <p>Ya está desbloqueado en tu cuenta.</p>
       <p><a href="${link}" style="color:#FF6B5B">Empezar a leer →</a></p>`,
    ),
  );
}
