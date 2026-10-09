import {
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  HeartHandshake,
  Map,
  Pill,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { useAuthStore } from "../store/auth";
import { api, ApiError } from "../lib/api";
import { formatDateTime } from "../lib/date";
import type { PublicDashboardStats, IpcpLevel } from "../types";

interface StatCard {
  label: string;
  value: number;
  caption: string;
  icon: LucideIcon;
  tone: "high" | "moderate" | "low" | "neutral";
}

const STAT_TONE_STYLES: Record<StatCard["tone"], string> = {
  high: "bg-red-100 text-red-600",
  moderate: "bg-amber-100 text-amber-600",
  low: "bg-mint-soft text-primary-dark",
  neutral: "bg-mint-soft text-primary",
};

const SEVERITY_STYLES: Record<"alert" | "critical", string> = {
  alert: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

const SEVERITY_LABELS: Record<"alert" | "critical", string> = {
  alert: "Fuera de rango",
  critical: "Crítico",
};

/**
 * Las tarjetas se derivan de `/dashboard/stats` y `/patients/ipcp`.
 *
 * Dos tarjetas usan niveles IPCP (Prioridad Alta / Moderada),
 * dos usan stats operativos existentes (Próximas citas / Pacientes activos).
 */
function buildStatCards(
  stats: PublicDashboardStats | null,
  ipcpCounts: Record<IpcpLevel, number>,
): StatCard[] {
  return [
    {
      label: "Prioridad Alta",
      value: ipcpCounts.high,
      caption: "Pacientes con IPCP alto",
      icon: AlertTriangle,
      tone: "high",
    },
    {
      label: "Prioridad Moderada",
      value: ipcpCounts.moderate,
      caption: "Pacientes con IPCP moderado",
      icon: AlertCircle,
      tone: "moderate",
    },
    {
      label: "Próximas citas",
      value: stats?.upcomingAppointments ?? 0,
      caption: "En los próximos 7 días",
      icon: CalendarClock,
      tone: "neutral",
    },
    {
      label: "Pacientes activos",
      value: stats?.activePatients ?? 0,
      caption: "Con seguimiento activo",
      icon: Users,
      tone: "low",
    },
  ];
}

const QUICK_ACTIONS: {
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
}[] = [
  {
    label: "Mapa IPCP",
    description: "Ubica pacientes por prioridad",
    icon: Map,
    to: "/app/priority-map",
  },
  {
    label: "Alertas",
    description: "Revisa eventos críticos",
    icon: AlertTriangle,
    to: "/app/alerts",
  },
  {
    label: "Medicamentos",
    description: "Controla la adherencia",
    icon: Pill,
    to: "/app/patients",
  },
  {
    label: "Cuidadores",
    description: "Contacta personas de apoyo",
    icon: HeartHandshake,
    to: "/app/caregivers",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<PublicDashboardStats | null>(null);
  const [ipcpCounts, setIpcpCounts] = useState<Record<IpcpLevel, number>>({
    high: 0,
    moderate: 0,
    low: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.getDashboardStats(),
      api.getPatientsIpcp({ limit: 1000 }), // obtener todos para conteos
    ])
      .then(([dashboardStats, ipcpBatch]) => {
        if (!active) return;
        setStats(dashboardStats);

        const counts: Record<IpcpLevel, number> = { high: 0, moderate: 0, low: 0 };
        for (const patient of ipcpBatch.data) {
          counts[patient.level]++;
        }
        setIpcpCounts(counts);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar las estadísticas",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const statCards = stats ? buildStatCards(stats, ipcpCounts) : [];
  const criticalCount = ipcpCounts.high;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">
            Panel de control
          </h1>
          <p className="mt-1 max-w-2xl font-body text-sm text-muted">
            Supervisa el estado de los pacientes y prioriza la atención según el
            IPCP.
          </p>
        </div>
        <Button
          onClick={() => navigate("/app/patients/new")}
          className="shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          Nuevo paciente
        </Button>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <div className="flex flex-col justify-between gap-2 rounded-2xl bg-mint-soft-2 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-bold text-navy">
            ¡Hola, {user?.name ?? "Administrador"}! 👋
          </p>
          <p className="mt-1 font-body text-sm text-muted">
            {loading ? (
              "Calculando el estado de los pacientes…"
            ) : (
              <>
                Hay{" "}
                <span className="font-semibold text-red-600">
                  {criticalCount} pacientes en prioridad alta
                </span>{" "}
                que requieren seguimiento cercano.
              </>
            )}
          </p>
        </div>
        <span className="whitespace-nowrap font-body text-xs font-medium text-primary-dark">
          {stats ? `Actualizado ${formatDateTime(stats.generatedAt)}` : "—"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-line bg-white"
              />
            ))
          : statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-white p-5 shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <p className="font-body text-xs font-medium text-muted">
                    {stat.label}
                  </p>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${STAT_TONE_STYLES[stat.tone]}`}
                  >
                    <stat.icon size={16} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-navy">
                  {stat.value}
                </p>
                <p className="mt-1 font-body text-xs text-muted">
                  {stat.caption}
                </p>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-navy">
              Pacientes que necesitan más atención
            </h2>
            <Link
              to="/app/patients"
              className="font-body text-xs font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="mt-3 flex flex-col divide-y divide-line">
            {loading ? (
              <p className="py-6 text-center font-body text-sm text-muted">
                Cargando…
              </p>
            ) : stats && stats.attention.length > 0 ? (
              stats.attention.map((patient) => {
                const severity =
                  patient.severity === "critical" ? "critical" : "alert";
                return (
                  <Link
                    key={patient.id}
                    to={`/app/patients/${patient.id}`}
                    className="flex items-center gap-3 py-3 transition hover:bg-surface"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-body text-xs font-bold ${SEVERITY_STYLES[severity]}`}
                    >
                      {patient.indicatorValue ?? "—"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-navy">
                        {patient.name}
                      </p>
                      <p className="truncate font-body text-xs text-muted">
                        {patient.indicatorName ?? "Indicador"}
                        {patient.indicatorUnit
                          ? ` · ${patient.indicatorValue ?? "—"} ${patient.indicatorUnit}`
                          : ""}
                        {patient.indicatorDateHour
                          ? ` · ${formatDateTime(patient.indicatorDateHour)}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 font-body text-xs font-medium ${SEVERITY_STYLES[severity]}`}
                    >
                      {SEVERITY_LABELS[severity]}
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="py-6 text-center font-body text-sm text-muted">
                Ningún paciente con indicadores fuera de rango.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <h2 className="font-display text-sm font-bold text-navy">
            Acciones rápidas
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col gap-2 rounded-xl bg-mint-soft p-3 transition hover:bg-mint-line/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
                  <action.icon size={16} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-navy">
                    {action.label}
                  </p>
                  <p className="font-body text-xs text-muted">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
