import type { VolSlug } from "./types";

// Orden canónico de los volúmenes de la serie.
export const VOL_SLUGS: VolSlug[] = ["vol1", "vol2", "vol3"];

export function isVolSlug(value: string): value is VolSlug {
  return (VOL_SLUGS as string[]).includes(value);
}
