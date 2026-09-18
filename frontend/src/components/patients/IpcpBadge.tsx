import type { IpcpLevel } from "../../lib/ipcp";

const LEVEL_STYLES: Record<IpcpLevel, string> = {
  Alta: "bg-red-100 text-red-700",
  Moderada: "bg-amber-100 text-amber-700",
  Baja: "bg-emerald-100 text-emerald-700",
};

interface IpcpBadgeProps {
  score: number;
  level: IpcpLevel;
}

/**
 * Pastilla "92 · Alta" / "63 · Moderada" / "18 · Baja" que muestra el IPCP
 * (real o mock) de un paciente en la lista y en su ficha.
 */
export function IpcpBadge({ score, level }: IpcpBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_STYLES[level]}`}
      title="Índice de Prioridad de Control del Paciente (simulado)"
    >
      {score} · {level}
    </span>
  );
}
