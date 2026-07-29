import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RetornoCliente } from "./RetornoCliente";

export const metadata: Metadata = { title: "Procesando tu pago" };

export default async function RetornoPage({
  searchParams,
}: {
  searchParams: { purchase?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const purchaseId = searchParams.purchase;
  if (!purchaseId) redirect("/app");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <RetornoCliente purchaseId={purchaseId} />
    </main>
  );
}
