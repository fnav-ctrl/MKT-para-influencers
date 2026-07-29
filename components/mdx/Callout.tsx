import { clsx } from "@/lib/clsx";

// Caja de "idea fuerza": la cita con borde coral de los ebooks.
export function Callout({
  children,
  tipo = "idea",
}: {
  children: React.ReactNode;
  tipo?: "idea" | "ojo" | "tip";
}) {
  const etiqueta = { idea: "Idea fuerza", ojo: "Ojo con esto", tip: "Tip" }[tipo];
  return (
    <aside
      className={clsx(
        "my-6 rounded-r-xl border-l-4 border-coral bg-coral-50/60 px-5 py-4",
      )}
    >
      <p className="mb-1 font-serif text-xs uppercase tracking-wide text-coral-600">
        {etiqueta}
      </p>
      <div className="text-tinta [&>p]:my-1">{children}</div>
    </aside>
  );
}
