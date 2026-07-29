import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { NuevaClaveForm } from "@/components/auth/RecuperarForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default async function ActualizarClavePage() {
  // Se llega acá tras el enlace de reset (que ya creó sesión vía /auth/callback).
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/recuperar");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="mb-1 font-serif text-3xl">Elegí tu nueva contraseña</h1>
      <p className="mb-8 text-tinta/60">Con esto ya podés volver a ingresar.</p>
      <NuevaClaveForm />
    </main>
  );
}
