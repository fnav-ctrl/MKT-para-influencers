import { clsx } from "@/lib/clsx";

// Barra de progreso del volumen. Presentacional: recibe hechos/total.
export function BarraProgreso({
  hechos,
  total,
  className,
}: {
  hechos: number;
  total: number;
  className?: string;
}) {
  const pct = total > 0 ? Math.round((hechos / total) * 100) : 0;
  return (
    <div className={clsx("w-full", className)}>
      <div className="mb-1 flex items-center justify-between text-xs text-tinta/50">
        <span>
          {hechos} / {total} capítulos
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-tinta/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-coral transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
