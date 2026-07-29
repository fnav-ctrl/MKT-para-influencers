import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { VolSlug } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Lee el MDX de un capítulo desde el repo. Devuelve null si no existe.
export async function readChapterSource(
  vol: VolSlug,
  chapterSlug: string,
): Promise<string | null> {
  // Sanitizar el slug para evitar path traversal.
  if (!/^[a-z0-9-]+$/.test(chapterSlug)) return null;
  const file = path.join(CONTENT_DIR, vol, `${chapterSlug}.mdx`);
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}
