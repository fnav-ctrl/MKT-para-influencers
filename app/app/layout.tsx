import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-tinta/10 bg-crema/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/app" className="font-serif text-base">
            Monetizá tu Influencia
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {profile?.nombre && (
              <span className="hidden text-tinta/60 sm:inline">Hola, {profile.nombre}</span>
            )}
            <form action={signOut}>
              <button className="text-tinta/60 hover:text-coral-600">Salir</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
