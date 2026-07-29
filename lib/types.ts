// Tipos del dominio. Reflejan el modelo de datos de Supabase (ver
// supabase/migrations/0001_init.sql). Mantener en sync con la DB.

export type VolSlug = "vol1" | "vol2" | "vol3";

export type PurchaseStatus = "pending" | "approved" | "refunded";

export interface Profile {
  id: string;
  nombre: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: VolSlug;
  titulo: string;
  precio_ars: number;
  precio_usd: number;
  orden: number;
  activo: boolean;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  mp_payment_id: string | null;
  status: PurchaseStatus;
  created_at: string;
}

export interface Chapter {
  id: string;
  product_id: string;
  orden: number;
  slug: string;
  titulo: string;
}

export interface ExerciseAnswer {
  id: string;
  user_id: string;
  chapter_id: string;
  exercise_key: string;
  answers: Record<string, unknown>;
  updated_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  chapter_id: string;
  completed_at: string;
}
