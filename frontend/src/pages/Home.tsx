import {
  AlertCircle,
  AlertTriangle,
  HeartHandshake,
  Map,
  Plus,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/auth";
import { getPriorityLevel, PRIORITY_STYLES } from "../lib//priority";

// ---------------------------------------------------------------------------
// TODO: todo lo de esta sección es DATA MOCK. El backend todavía no expone
// el cálculo de IPCP ni los contadores del panel — cuando exista, reemplazar
// estos arrays por la respuesta real del API (ver lib/api.ts) sin tocar el
// JSX de abajo, ya que ambos consumen la misma forma de datos.
// ---------------------------------------------------------------------------

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

const MOCK_STATS: StatCard[] = [
  {
    label: "Prioridad alta",
    value: 3,
    caption: PRIORITY_STYLES.high.range,
    icon: AlertTriangle,
    tone: "high",
  },
  {
    label: "Prioridad moderada",
    value: 3,
    caption: PRIORITY_STYLES.moderate.range,
    icon: AlertCircle,
    tone: "moderate",
  },
  {
    label: "Prioridad baja",
    value: 2,
    caption: PRIORITY_STYLES.low.range,
    icon: UserCheck,
    tone: "low",
  },
  {
    label: "Pacientes activos",
    value: 8,
    caption: "Con seguimiento activo",
    icon: Users,
    tone: "neutral",
  },
];

interface MockPatientAlert {
  name: string;
  center: string;
  minutesAgo: number;
  score: number;
}

const MOCK_ATTENTION_LIST: MockPatientAlert[] = [
  {
    name: "Jorge Gutiérrez",
    center: "Centro de Salud Carlos Núñez Téllez",
    minutesAgo: 8,
    score: 92,
  },
  {
    name: "Julio Reyes",
    center: "Centro de Salud Carlos Núñez Téllez",
    minutesAgo: 13,
    score: 84,
  },
  {
    name: "Sofía Mendoza",
    center: "Hospital Regional",
    minutesAgo: 40,
    score: 76,
  },
  {
    name: "María López",
    center: "Centro de Salud Carlos Núñez Téllez",
    minutesAgo: 25,
    score: 63,
  },
];

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
    label: "Cuidadores",
    description: "Contacta personas de apoyo",
    icon: HeartHandshake,
    to: "/app/caregivers",
  },
];

// ---------------------------------------------------------------------------

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const highPriorityCount = MOCK_STATS[0].value;

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

      <div className="flex flex-col justify-between gap-2 rounded-2xl bg-mint-soft-2 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-bold text-navy">
            ¡Hola, {user?.name ?? "Administrador"}! 👋
          </p>
          <p className="mt-1 font-body text-sm text-muted">
            Hay{" "}
            <span className="font-semibold text-red-600">
              {highPriorityCount} pacientes en prioridad alta
            </span>{" "}
            que requieren seguimiento cercano.
          </p>
        </div>
        <span className="whitespace-nowrap font-body text-xs font-medium text-primary-dark">
          Actualizado hace 2 min
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
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
            <p className="mt-1 font-body text-xs text-muted">{stat.caption}</p>
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
            {MOCK_ATTENTION_LIST.map((patient) => {
              const level = getPriorityLevel(patient.score);
              return (
                <div
                  key={patient.name}
                  className="flex items-center gap-3 py-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${PRIORITY_STYLES[level].badge}`}
                  >
                    {patient.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-semibold text-navy">
                      {patient.name}
                    </p>
                    <p className="truncate font-body text-xs text-muted">
                      {patient.center} · Hace {patient.minutesAgo} min
                    </p>
                  </div>
                  {/* Placeholder: sin id de paciente real detrás de este mock,
                      no se navega todavía a un detalle específico. */}
                  <span className="shrink-0 font-body text-xs font-medium text-primary">
                    Ver
                  </span>
                </div>
              );
            })}
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
