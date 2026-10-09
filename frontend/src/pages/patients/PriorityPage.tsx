import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { api, ApiError } from "../../lib/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Table } from "../../components/ui/Table";
import type { Column } from "../../components/ui/Table";
import { IpcpBadge } from "../../components/patients/IpcpBadge";
import { useAuthStore } from "../../store/auth";
import type {
  HealthCenterItem,
  IpcpLevel,
  IpcpSummary,
} from "../../types";

/** Espera antes de disparar la petición mientras el usuario sigue escribiendo. */
const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

const LEVEL_LABELS: Record<IpcpLevel, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};

const SORT_OPTIONS = [
  { value: "score:desc", label: "IPCP más alto primero" },
  { value: "score:asc", label: "IPCP más bajo primero" },
  { value: "name:asc", label: "Nombre (A-Z)" },
] as const;

/** Mismos umbrales que `IpcpBadge`: 70 alto, 40 medio, por debajo, en rango. */
function metricColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score >= 70) return "text-red-600";
  if (score >= 40) return "text-amber-600";
  return "text-emerald-600";
}

function Metric({
  score,
  unit = "",
}: {
  score: number | null;
  unit?: string;
}) {
  if (score === null) {
    return <span className="text-slate-400">—</span>;
  }
  return (
    <span className={`font-mono ${metricColor(score)}`}>
      {score}
      {unit}
    </span>
  );
}

function trendLabel(score: number | null): string {
  if (score === null) return "—";
  if (score === 100) return "Empeora";
  if (score === 50) return "Estable";
  return "Mejora";
}

const columns: Column<IpcpSummary>[] = [
  {
    header: "Paciente",
    render: (row) => (
      <div>
        <Link
          to={`/app/patients/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.name}
        </Link>
        <p className="text-xs text-slate-500">{row.email}</p>
      </div>
    ),
  },
  {
    header: "IPCP",
    render: (row) => <IpcpBadge score={row.score} level={row.level} />,
  },
  {
    header: "Nivel",
    render: (row) => (
      <span className="text-slate-700">{LEVEL_LABELS[row.level]}</span>
    ),
  },
  {
    header: "Desviación",
    render: (row) => <Metric score={row.deviationScore} unit="/100" />,
  },
  {
    header: "Adherencia",
    render: (row) => <Metric score={row.adherenceScore} unit="%" />,
  },
  {
    header: "Controles",
    render: (row) => <Metric score={row.appointmentScore} unit="%" />,
  },
  {
    header: "Tendencia",
    render: (row) => (
      <span className={metricColor(row.trendScore)}>{trendLabel(row.trendScore)}</span>
    ),
  },
  {
    header: "Acciones",
    render: (row) => (
      <Link
        to={`/app/patients/${row.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        Ver detalle
      </Link>
    ),
  },
];

/**
 * Listado paginado del IPCP (HU-32, HU-33).
 *
 * El filtro de nivel viaja al servidor y la página se recalcula allá: si se
 * filtrara en el navegador, cada página mostraría un puñado de filas del nivel
 * pedido mientras el total seguiría hablando de todos los pacientes.
 */
export default function PriorityPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<IpcpLevel | "">("");
  const [healthCenterId, setHealthCenterId] = useState("");
  const [sort, setSort] = useState<string>("score:desc");
  const [page, setPage] = useState(1);

  const [centers, setCenters] = useState<HealthCenterItem[]>([]);
  const [rows, setRows] = useState<IpcpSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Distingue el montaje de las ediciones para no aplicarle debounce a la
  // primera carga, que sí debe salir disparada.
  const isFirstRunRef = useRef(true);
  // Descarta respuestas lentas de búsquedas anteriores.
  const requestIdRef = useRef(0);

  // El catálogo de centros es solo para el admin: al personal de salud el
  // servidor le fija su propio centro y aquí no hay nada que elegir.
  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    let active = true;
    api
      .getHealthCenters()
      .then((data) => {
        if (active) {
          setCenters(data);
        }
      })
      .catch(() => {
        // Sin catálogo el filtro no se pinta, pero el listado sigue sirviendo.
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;

    const handle = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      const [sortBy, sortOrder] = sort.split(":");
      setLoading(true);
      setError(null);
      api
        .getPatientsIpcp({
          search: search.trim() || undefined,
          level: level || undefined,
          healthCenterId: healthCenterId || undefined,
          sortBy: sortBy as "score" | "level" | "name",
          sortOrder: sortOrder as "asc" | "desc",
          page,
          limit: PAGE_SIZE,
        })
        .then((response) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setRows(response.data);
          setTotal(response.total);
          setTotalPages(response.totalPages);
          setPage(response.page);
        })
        .catch((err) => {
          if (requestIdRef.current !== requestId) {
            return;
          }
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar la lista de prioridades",
          );
        })
        .finally(() => {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        });
    }, delay);

    return () => clearTimeout(handle);
  }, [search, level, healthCenterId, sort, page]);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prioridad IPCP</h1>
        <p className="text-sm text-slate-500">
          Lista de pacientes ordenada por índice de prioridad. Filtra y ordena
          para priorizar la atención.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <Input
            label="Buscar"
            type="search"
            placeholder="Nombre o correo…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <Select
            label="Nivel"
            value={level}
            onChange={(event) => {
              setLevel(event.target.value as IpcpLevel | "");
              setPage(1);
            }}
            className="w-40"
          >
            <option value="">Todos</option>
            <option value="high">Alta</option>
            <option value="moderate">Moderada</option>
            <option value="low">Baja</option>
          </Select>
          {isAdmin ? (
            <Select
              label="Centro de salud"
              value={healthCenterId}
              onChange={(event) => {
                setHealthCenterId(event.target.value);
                setPage(1);
              }}
              className="w-56"
            >
              <option value="">Todos los centros</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </Select>
          ) : null}
          <Select
            label="Ordenar por"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="w-56"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {error ? <Alert>{error}</Alert> : null}

      <Card>
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
        ) : (
          <>
            <Table
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              emptyMessage="No hay pacientes con estos filtros."
            />
            {total > 0 ? (
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  Mostrando {from}–{to} de {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page >= totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </Card>
    </div>
  );
}
