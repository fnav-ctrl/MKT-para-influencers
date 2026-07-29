"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset, updatePassword, type AuthState } from "@/app/auth/actions";

const inputCls =
  "w-full rounded-xl border border-tinta/15 bg-white px-4 py-2.5 text-tinta placeholder:text-tinta/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Un segundo…" : children}
    </Button>
  );
}

function Mensajes({ state }: { state: AuthState }) {
  return (
    <>
      {state.error && (
        <p className="rounded-lg bg-coral-50 px-3 py-2 text-sm text-coral-600">{state.error}</p>
      )}
      {state.message && (
        <p className="rounded-lg bg-tinta/5 px-3 py-2 text-sm text-tinta/80">{state.message}</p>
      )}
    </>
  );
}

export function PedirResetForm() {
  const [state, action] = useFormState<AuthState, FormData>(requestPasswordReset, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className={inputCls} placeholder="vos@ejemplo.com" />
      </div>
      <Mensajes state={state} />
      <Submit>Enviar enlace</Submit>
    </form>
  );
}

export function NuevaClaveForm() {
  const [state, action] = useFormState<AuthState, FormData>(updatePassword, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Nueva contraseña</label>
        <input id="password" name="password" type="password" required minLength={8} className={inputCls} placeholder="Mínimo 8 caracteres" />
      </div>
      <Mensajes state={state} />
      <Submit>Guardar contraseña</Submit>
    </form>
  );
}
