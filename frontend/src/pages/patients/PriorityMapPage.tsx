import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { api, ApiError } from "../../lib/api";
import { Alert } from "../../components/ui/Alert";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import type { IpcpSummary, IpcpBatchFilters } from "../../types";

const levelLabels: Record<string, string> = {
  high: "Alta",
  moderate: "Moderada",
  low: "Baja",
};

interface LevelSection {
  level: "high" | "moderate" | "low";
  label: string;
  color: string;
  bgColor: string;
  patients: IpcpSummary[];
}

const LEVEL_CONFIG: Record<"high" | "moderate" | "low", { label: string; color: string; bgColor: string }> = {
  high: { label: "Alta", color: "text-red-600", bgColor: "bg-red-50" },
  moderate: { label: "Moderada", color: "text-amber-600", bgColor: "bg-amber-50" },
  low: { label: "Baja", color: "text-emerald-600", bgColor: "bg-emerald-50" },
};

export default function PriorityMapPage() {
  const [allPatients, setAllPatients] = useState<IpcpSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        limit: 1000,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setAllPatients(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo cargar el mapa de prioridad",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (value: string) => {
    setFilters((f) => ({ ...f, search: value }));
  };

  const handleLevelChange = (level: "high" | "moderate" | "low" | undefined) => {
    setFilters((f) => ({ ...f, level }));
  };

  const getAdherenceColor = (score: number | null) => {
    if (score === null) return "text-slate-400";
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-emerald-600";
  };

  const getAppointmentColor = (score: number | null) => {
    if (score === null) return "text-slate-400";
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-emerald-600";
  };

  const sections: LevelSection[] = [
    { level: "high", ...LEVEL_CONFIG.high, patients: [] },
    { level: "moderate", ...LEVEL_CONFIG.moderate, patients: [] },
    { level: "low", ...LEVEL_CONFIG.low, patients: [] },
  ];

  for (const patient of allPatients) {
    const section = sections.find((s) => s.level === patient.level);
    if (section) section.patients.push(patient);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mapa de prioridad IPCP</h1>
          <p className="text-sm text-slate-500">
            Vista agrupada por nivel de prioridad.
          </p>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <Card className="mb-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Buscar por nombre, email…"
            value={filters.search ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-64"
            label={<label className="font-body text-xs font-medium text-muted">Buscar</label>}
          />
          <select
            value={filters.level ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value as "high" | "moderate" | "low" | undefined }))}
            className="w-40 border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="high">Alta</option>
            <option value="moderate">Moderada</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.level} className={`border-l-4 ${section.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-navy">
                    Prioridad {section.label}
                    <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-white/50">
                      {section.patients.length}
                    </span>
                  </h3>
                </div>
                <Badge variant={section.level === "high" ? "danger" : section.level === "moderate" ? "warning" : "success"}>
                  {section.patients.length}
                </Badge>
              </div>

              {section.patients.length === 0 ? (
                <p className="mt-3 text-center text-sm text-muted py-4">
                  No hay pacientes en este nivel.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {section.patients.map((patient) => (
                    <Link
                      key={patient.id}
                      to={`/app/patients/${patient.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-body text-xs font-bold bg-white/80">
                          {patient.score} · {patient.level}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-body text-sm font-semibold text-navy">
                            {patient.name}
                          </p>
                          <p className="truncate font-body text-xs text-muted">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted shrink-0">
                        <span className={getAdherenceColor(patient.adherenceScore)}>
                          {patient.adherenceScore !== null ? `${patient.adherenceScore}%` : "—"}
                        </span>
                        <span className={getAppointmentColor(patient.appointmentScore)}>
                          {patient.appointmentScore !== null ? `${patient.appointmentScore}%` : "—"}
                        </span>
                        <span>
                          {patient.trendScore !== null
                            ? patient.trendScore === 100
                              ? "⬇"
                              : patient.trendScore === 50
                              ? "⏸"
                              : "⬆"
                            : "—"}
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
