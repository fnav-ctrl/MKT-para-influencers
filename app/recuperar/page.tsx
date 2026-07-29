import Link from "next/link";
import type { Metadata } from "next";
import { PedirResetForm } from "@/components/auth/RecuperarForm";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 font-serif text-lg text-tinta">
        Monetizá tu Influencia
      </Link>
      <h1 className="mb-1 font-serif text-3xl">Recuperá tu contraseña</h1>
      <p className="mb-8 text-tinta/60">Te mandamos un enlace para crear una nueva.</p>

      <PedirResetForm />

      <p className="mt-6 text-center text-sm text-tinta/60">
        <Link href="/login" className="font-semibold text-coral-600">
          Volver a ingresar
        </Link>
      </p>
    </main>
  );
}
