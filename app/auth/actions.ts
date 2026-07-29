"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";

function clientIp(): string {
  const h = headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const credentials = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const rl = rateLimit(`login:${clientIp()}`, { limit: 8, windowSec: 60 });
  if (!rl.ok) {
    return { error: `Demasiados intentos. Probá de nuevo en ${rl.retryAfterSec}s.` };
  }

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Email o contraseña incorrectos." };
  }

  const next = (formData.get("next") as string) || "/app";
  redirect(next.startsWith("/") ? next : "/app");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const rl = rateLimit(`signup:${clientIp()}`, { limit: 5, windowSec: 60 });
  if (!rl.ok) {
    return { error: `Demasiados intentos. Probá de nuevo en ${rl.retryAfterSec}s.` };
  }

  const schema = credentials.extend({
    nombre: z.string().min(2, "Decinos tu nombre").max(80),
  });
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    nombre: formData.get("nombre"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
  }

  const supabase = createClient();
  const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nombre: parsed.data.nombre },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    return { error: "No pudimos crear la cuenta. ¿Ya estás registrada?" };
  }

  // Email de bienvenida (no bloqueante; no-op si no hay RESEND_API_KEY).
  await sendWelcomeEmail(parsed.data.email, parsed.data.nombre);

  return {
    message:
      "Te enviamos un email para confirmar tu cuenta. Revisá tu bandeja (y el spam).",
  };
}

// --- Recuperación de contraseña ---

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const rl = rateLimit(`reset:${clientIp()}`, { limit: 5, windowSec: 60 });
  if (!rl.ok) {
    return { error: `Demasiados intentos. Probá de nuevo en ${rl.retryAfterSec}s.` };
  }

  const email = z.string().email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Email inválido" };

  const supabase = createClient();
  const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/auth/callback?next=/auth/actualizar-clave`,
  });

  // Respuesta neutra: no revelamos si el email existe.
  return {
    message:
      "Si ese email tiene una cuenta, te enviamos un enlace para restablecer la contraseña.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .safeParse(formData.get("password"));
  if (!password.success) {
    return { error: password.error.errors[0]?.message ?? "Contraseña inválida" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "El enlace expiró. Pedí uno nuevo." };
  }

  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { error: "No pudimos actualizar la contraseña." };

  redirect("/app");
}

export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const rl = rateLimit(`magic:${clientIp()}`, { limit: 5, windowSec: 60 });
  if (!rl.ok) {
    return { error: `Demasiados intentos. Probá de nuevo en ${rl.retryAfterSec}s.` };
  }

  const email = z.string().email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Email inválido" };

  const supabase = createClient();
  const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: "No pudimos enviar el enlace. Probá de nuevo." };

  return { message: "Te enviamos un enlace de acceso a tu email." };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
