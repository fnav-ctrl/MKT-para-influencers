import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(searchParams.next || "/app");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 font-serif text-lg text-tinta">
        Monetizá tu Influencia
      </Link>
      <h1 className="mb-1 font-serif text-3xl">Ingresá a tu cuenta</h1>
      <p className="mb-8 text-tinta/60">Seguí donde lo dejaste.</p>

      <AuthForm action={signIn} cta="Ingresar" mode="login" next={searchParams.next} />

      <p className="mt-4 text-center text-sm">
        <Link href="/recuperar" className="text-tinta/50 hover:text-tinta">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="mt-6 text-center text-sm text-tinta/60">
        ¿Todavía no tenés cuenta?{" "}
        <Link href="/registro" className="font-semibold text-coral-600">
          Registrate
        </Link>
      </p>
    </main>
  );
}
