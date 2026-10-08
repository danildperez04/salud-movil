import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { api, ApiError } from "../../lib/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Card } from "../../components/ui/Card";
import type { IpcpSummary, IpcpBatchFilters } from "../../types";

const levelLabels: Record<string, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};

const columns = [
  {
    header: "Paciente",
    render: (row: IpcpSummary) => (
      <a
        href={`/app/patients/${row.id}`}
        className="text-primary hover:underline font-medium"
      >
        {row.name}
      </a>
    ),
  },
  {
    header: "IPCP",
    render: (row: IpcpSummary) => <span>{row.score} · {row.level}</span>,
  },
  {
    header: "Nivel",
    render: (row: IpcpSummary) => <span className="capitalize">{levelLabels[row.level] ?? row.level}</span>,
  },
  {
    header: "Desviación",
    render: (row: IpcpSummary) =>
      row.deviationScore !== null ? (
        <span className={`font-mono ${row.deviationScore >= 70 ? "text-red-600" : row.deviationScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.deviationScore}/100
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Adherencia",
    render: (row: IpcpSummary) =>
      row.adherenceScore !== null ? (
        <span className={`font-mono ${row.adherenceScore >= 70 ? "text-red-600" : row.adherenceScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.adherenceScore}%
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Controles",
    render: (row: IpcpSummary) =>
      row.appointmentScore !== null ? (
        <span className={`font-mono ${row.appointmentScore >= 70 ? "text-red-600" : row.appointmentScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.appointmentScore}%
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Tendencia",
    render: (row: IpcpSummary) =>
      row.trendScore !== null ? (
        <span className={`font-mono ${row.trendScore === 100 ? "text-red-600" : row.trendScore === 50 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.trendScore === 100 ? "Empeora" : row.trendScore === 50 ? "Estable" : "Mejora"}
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Acciones",
    render: (row: IpcpSummary) => (
      <a
        href={`/app/patients/${row.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        Ver detalle
      </a>
    ),
  },
];

const levelLabels: Record<string, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};

export default function PriorityPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<IpcpSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<IpcpBatchFilters>({
    level: undefined,
    search: "",
    sortBy: "score",
    sortOrder: "desc",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPatientsIpcp({
        level: filters.level,
        search: filters.search,
        page,
        limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo cargar la lista de prioridades",
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const content = loading ? (
    <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
  ) : data.length > 0 ? (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            {columns.map((column) => (
              <th key={column.header} className="px-3 py-2 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.header} className="px-3 py-3 align-top">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-body text-sm text-muted">
          Mostrando {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} de {total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  ) : (
    <p className="py-8 text-center font-body text-sm text-muted">
      No hay pacientes con estos filtros.
    </p>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prioridad IPCP</h1>
          <p className="text-sm text-slate-500">
            Lista de pacientes ordenada por índice de prioridad. Filtra y ordena
            para priorizar la atención.
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Buscar por nombre, email…"
            value={filters.search ?? ""}
            onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
            className="w-64"
            label={<label className="font-body text-xs font-medium text-muted">Buscar</label>}
          />
          <Select
            value={filters.level ?? ""}
            onChange={(e) => { setFilters(f => ({ ...f, level: e.target.value as "high" | "moderate" | "low" | undefined })); setPage(1); }}
            label={<label className="font-body text-xs font-medium text-muted">Nivel</label>}
            options={[
              { value: "", label: "Todos" },
              { value: "high", label: "Alta" },
              { value: "moderate", label: "Moderada" },
              { value: "low", label: "Baja" },
            ]}
            className="w-40"
          />
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
        ) : data.length > 0 ? (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  {columns.map((column) => (
                    <th key={column.header} className="px-3 py-2 font-semibold">
                      {column.header}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {columns.map((column) => (
                      <td key={column.header} className="px-3 py-3 align-top">
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-body text-sm text-muted">
                Mostrando {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} de {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="py-8 text-center font-body text-sm text-muted">
            No hay pacientes con estos filtros.
          </p>
        )}
      </Card>
    </div>
  );
}

const levelLabels: Record<string, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};

const columns = [
  {
    header: "Paciente",
    render: (row: IpcpSummary) => (
      <a
        href={`/app/patients/${row.id}`}
        className="text-primary hover:underline font-medium"
      >
        {row.name}
      </a>
    ),
  },
  {
    header: "IPCP",
    render: (row: IpcpSummary) => <span>{row.score} · {row.level}</span>,
  },
  {
    header: "Nivel",
    render: (row: IpcpSummary) => <span className="capitalize">{levelLabels[row.level] ?? row.level}</span>,
  },
  {
    header: "Desviación",
    render: (row: IpcpSummary) =>
      row.deviationScore !== null ? (
        <span className={`font-mono ${row.deviationScore >= 70 ? "text-red-600" : row.deviationScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.deviationScore}/100
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Adherencia",
    render: (row: IpcpSummary) =>
      row.adherenceScore !== null ? (
        <span className={`font-mono ${row.adherenceScore >= 70 ? "text-red-600" : row.adherenceScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.adherenceScore}%
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Controles",
    render: (row: IpcpSummary) =>
      row.appointmentScore !== null ? (
        <span className={`font-mono ${row.appointmentScore >= 70 ? "text-red-600" : row.adherenceScore >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.appointmentScore}%
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Tendencia",
    render: (row: IpcpSummary) =>
      row.trendScore !== null ? (
        <span className={`font-mono ${row.trendScore === 100 ? "text-red-600" : row.trendScore === 50 ? "text-amber-600" : "text-emerald-600"}`}>
          {row.trendScore === 100 ? "Empeora" : row.trendScore === 50 ? "Estable" : "Mejora"}
        </span>
      ) : <span>—</span>,
  },
  {
    header: "Acciones",
    render: (row: IpcpSummary) => (
      <a
        href={`/app/patients/${row.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        Ver detalle
      </a>
    ),
  },
];

const levelLabels: Record<string, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};
