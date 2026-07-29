import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegistroPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 font-serif text-lg text-tinta">
        Monetizá tu Influencia
      </Link>
      <h1 className="mb-1 font-serif text-3xl">Creá tu cuenta</h1>
      <p className="mb-8 text-tinta/60">
        Gratis. Después comprás el volumen que quieras.
      </p>

      <AuthForm action={signUp} cta="Crear cuenta" mode="registro" />

      <p className="mt-6 text-center text-sm text-tinta/60">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-semibold text-coral-600">
          Ingresá
        </Link>
      </p>
    </main>
  );
}
