"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import type { AuthState } from "@/app/auth/actions";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Un segundo…" : children}
    </Button>
  );
}

const inputCls =
  "w-full rounded-xl border border-tinta/15 bg-white px-4 py-2.5 text-tinta placeholder:text-tinta/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

export function AuthForm({
  action,
  cta,
  mode,
  next,
}: {
  action: Action;
  cta: string;
  mode: "login" | "registro";
  next?: string;
}) {
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {mode === "registro" && (
        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            required
            className={inputCls}
            placeholder="Cómo te llamás"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputCls}
          placeholder="vos@ejemplo.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          className={inputCls}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-coral-50 px-3 py-2 text-sm text-coral-600">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="rounded-lg bg-tinta/5 px-3 py-2 text-sm text-tinta/80">
          {state.message}
        </p>
      )}

      <SubmitButton>{cta}</SubmitButton>
    </form>
  );
}
