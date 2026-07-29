"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

// Marca / desmarca el capítulo como completado en la tabla progress.
export function MarcarCompletado({
  chapterId,
  completadoInicial,
  siguienteHref,
}: {
  chapterId: string;
  completadoInicial: boolean;
  siguienteHref?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [completado, setCompletado] = useState(completadoInicial);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    if (completado) {
      await supabase
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId);
      setCompletado(false);
    } else {
      await supabase
        .from("progress")
        .upsert(
          { user_id: user.id, chapter_id: chapterId },
          { onConflict: "user_id,chapter_id" },
        );
      setCompletado(true);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-12 flex flex-col gap-3 border-t border-tinta/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <Button
        onClick={toggle}
        disabled={loading}
        variant={completado ? "outline" : "primary"}
      >
        {completado ? "✓ Capítulo completado" : "Marcar como completado"}
      </Button>
      {siguienteHref && (
        <a
          href={siguienteHref}
          className="text-sm font-semibold text-coral-600 hover:underline"
        >
          Siguiente capítulo →
        </a>
      )}
    </div>
  );
}
