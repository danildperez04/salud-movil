import type { IpcpLevel } from "../../types";

const LEVEL_STYLES: Record<IpcpLevel, string> = {
  high: "bg-red-100 text-red-700",
  moderate: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const LEVEL_LABELS: Record<IpcpLevel, string> = {
  low: "Baja",
  moderate: "Moderada",
  high: "Alta",
};

interface IpcpBadgeProps {
  score: number;
  level: IpcpLevel;
}

/**
 * Pastilla "64 · Moderada" con el IPCP del paciente.
 *
 * El score viene de `GET /patients/:id/ipcp`, no de un hash: es una regla
 * determinista sobre datos medidos. Los pesos y cortes son provisionales,
 * pendientes de validación médica.
 */
export function IpcpBadge({ score, level }: IpcpBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_STYLES[level]}`}
      title="Índice de Prioridad de Control del Paciente. Regla explicable, no diagnóstica."
    >
      IPCP {score} · {LEVEL_LABELS[level]}
    </span>
  );
}