import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { api, ApiError } from "../../lib/api";
import { Alert } from "../../components/ui/Alert";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { IpcpSummary, IpcpLevel, IpcpBatchFilters } from "../../types";

/** Espera antes de disparar la petición mientras el usuario sigue escribiendo. */
const SEARCH_DEBOUNCE_MS = 400;
/** El mapa pinta el panel completo de una vez: el servidor lo sabe servir. */
const FULL_PANEL_LIMIT = 1000;

const LEVEL_CONFIG: Record<
  IpcpLevel,
  { label: string; color: string; chip: string }
> = {
  high: { label: "Alta", color: "border-red-500", chip: "bg-red-100 text-red-700" },
  moderate: {
    label: "Moderada",
    color: "border-amber-500",
    chip: "bg-amber-100 text-amber-700",
  },
  low: {
    label: "Baja",
    color: "border-emerald-500",
    chip: "bg-emerald-100 text-emerald-700",
  },
};

const LEVEL_ORDER: IpcpLevel[] = ["high", "moderate", "low"];

/** Mismo umbral que `IpcpBadge`: 70 alto, 40 medio, por debajo, en rango. */
function scoreColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score >= 70) return "text-red-600";
  if (score >= 40) return "text-amber-600";
  return "text-emerald-600";
}

function trendSymbol(score: number | null): string {
  if (score === null) return "—";
  if (score === 100) return "⬇ empeora";
  if (score === 50) return "— estable";
  return "⬆ mejora";
}

/**
 * Mapa de prioridad (HU-33): el mismo listado que `/app/priority`, agrupado
 * por nivel para ver de un vistazo en qué cajón cae cada paciente.
 *
 * La agrupación es del navegador porque el nivel no se guarda: se recalcula en
 * cada lectura y con `limit=1000` el panel entero cabe en una sola respuesta.
 */
export default function PriorityMapPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<IpcpLevel | "">("");
  const [patients, setPatients] = useState<IpcpSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFirstRunRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;

    const handle = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      const filters: IpcpBatchFilters = {
        search: search.trim() || undefined,
        level: level || undefined,
        limit: FULL_PANEL_LIMIT,
        sortBy: "score",
        sortOrder: "desc",
      };
      setLoading(true);
      setError(null);
      api
        .getPatientsIpcp(filters)
        .then((response) => {
          if (requestIdRef.current === requestId) {
            setPatients(response.data);
          }
        })
        .catch((err) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar el mapa de prioridad",
          );
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        });
    }, delay);

    return () => clearTimeout(handle);
  }, [search, level]);

  const sections = LEVEL_ORDER.map((sectionLevel) => ({
    level: sectionLevel,
    ...LEVEL_CONFIG[sectionLevel],
    patients: patients.filter((patient) => patient.level === sectionLevel),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Mapa de prioridad IPCP
        </h1>
        <p className="text-sm text-slate-500">
          Vista agrupada por nivel de prioridad.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <Input
            label="Buscar"
            type="search"
            placeholder="Nombre o correo…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64"
          />
          <Select
            label="Nivel"
            value={level}
            onChange={(event) =>
              setLevel(event.target.value as IpcpLevel | "")
            }
            className="w-40"
          >
            <option value="">Todos</option>
            <option value="high">Alta</option>
            <option value="moderate">Moderada</option>
            <option value="low">Baja</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((skeleton) => (
            <Card key={skeleton} className="animate-pulse">
              <div className="mb-4 h-8 w-3/4 rounded bg-slate-200" />
              <div className="space-y-3">
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <Card
              key={section.level}
              className={`border-l-4 ${section.color}`}
              title={`Prioridad ${section.label}`}
              actions={
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${section.chip}`}
                >
                  {section.patients.length}
                </span>
              }
            >
              {section.patients.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  No hay pacientes en este nivel.
                </p>
              ) : (
                <div className="space-y-2">
                  {section.patients.map((patient) => (
                    <Link
                      key={patient.id}
                      to={`/app/patients/${patient.id}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                          {patient.score}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {patient.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 flex shrink-0 flex-col items-end gap-0.5 text-xs text-slate-500">
                        <span className={scoreColor(patient.adherenceScore)}>
                          Adherencia{" "}
                          {patient.adherenceScore !== null
                            ? `${patient.adherenceScore}%`
                            : "—"}
                        </span>
                        <span className={scoreColor(patient.appointmentScore)}>
                          Controles{" "}
                          {patient.appointmentScore !== null
                            ? `${patient.appointmentScore}%`
                            : "—"}
                        </span>
                        <span className={scoreColor(patient.trendScore)}>
                          {trendSymbol(patient.trendScore)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
