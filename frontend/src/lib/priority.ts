export type PriorityLevel = "high" | "moderate" | "low";

/**
 * Umbrales de prioridad según el IPCP (Índice de Prioridad de Control del
 * Paciente). Debe mantenerse igual a lo que defina el backend cuando exista
 * ese cálculo real — por ahora es la misma regla que usamos para los datos
 * mock del dashboard.
 */
export function getPriorityLevel(score: number): PriorityLevel {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export const PRIORITY_STYLES: Record<
  PriorityLevel,
  { badge: string; label: string; range: string }
> = {
  high: {
    badge: "bg-red-100 text-red-600",
    label: "Prioridad alta",
    range: "IPCP 70–100",
  },
  moderate: {
    badge: "bg-amber-100 text-amber-600",
    label: "Prioridad moderada",
    range: "IPCP 40–69",
  },
  low: {
    badge: "bg-mint-soft text-primary-dark",
    label: "Prioridad baja",
    range: "IPCP 0–39",
  },
};
