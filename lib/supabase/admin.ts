import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con service_role. Bypassa RLS. USAR SOLO server-side y solo en
// contextos de confianza (webhook de Mercado Pago, tareas internas).
// NUNCA importar esto en código que llegue al cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
