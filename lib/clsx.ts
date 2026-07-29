// Mini utilidad tipo clsx: concatena clases y descarta valores falsy.
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
