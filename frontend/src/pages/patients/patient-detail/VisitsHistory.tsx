import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Alert } from "../../../components/ui/Alert";
import { api, ApiError } from "../../../lib/api";
import { formatDate, formatDateTime } from "../../../lib/date";
import type { PublicMedicalVisit } from "../../../types";

interface VisitsHistoryProps {
  patientId: string;
  visits: PublicMedicalVisit[];
  /** Tras registrar una consulta, el padre recarga el expediente. */
  onRegistered: () => void;
}

const EMPTY_FORM = {
  visitDate: new Date().toISOString().slice(0, 10),
  diagnosis: "",
  observations: "",
  treatment: "",
  nextVisitDate: "",
};

/**
 * Historial cronológico de consultas (HU-11) y alta de consulta (HU-10).
 *
 * Antes `record.visits` venía en la respuesta del expediente y nadie lo
 * renderizaba, y `api.createMedicalVisit` estaba implementado sin usar.
 */
export function VisitsHistory({
  patientId,
  visits,
  onRegistered,
}: VisitsHistoryProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...visits].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
  );

  const handleSubmit = async () => {
    setError(null);
    if (!form.diagnosis.trim() || !form.observations.trim()) {
      setError("El diagnóstico y las observaciones son obligatorios");
      return;
    }
    setSaving(true);
    try {
      await api.createMedicalVisit(patientId, {
        visitDate: form.visitDate,
        diagnosis: form.diagnosis.trim(),
        observations: form.observations.trim(),
        treatment: form.treatment.trim(),
        ...(form.nextVisitDate ? { nextVisitDate: form.nextVisitDate } : {}),
      });
      setForm(EMPTY_FORM);
      setOpen(false);
      onRegistered();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo registrar la consulta",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="Consultas registradas"
      actions={
        <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
          {open ? "Cancelar" : "Registrar consulta"}
        </Button>
      }
    >
      {open ? (
        <div className="mb-5 flex flex-col gap-3 rounded-xl bg-surface p-4">
          {error ? <Alert>{error}</Alert> : null}
          <Input
            label="Fecha de la consulta"
            type="date"
            value={form.visitDate}
            onChange={(event) =>
              setForm({ ...form, visitDate: event.target.value })
            }
          />
          <Input
            label="Diagnóstico"
            value={form.diagnosis}
            onChange={(event) =>
              setForm({ ...form, diagnosis: event.target.value })
            }
            placeholder="Hipertensión arterial"
          />
          <Input
            label="Observaciones"
            value={form.observations}
            onChange={(event) =>
              setForm({ ...form, observations: event.target.value })
            }
            placeholder="TA 150/115 mmHg. Refiere continuar tratamiento."
          />
          <Input
            label="Tratamiento"
            value={form.treatment}
            onChange={(event) =>
              setForm({ ...form, treatment: event.target.value })
            }
            placeholder="Losartán 50 mg c/24 h"
          />
          <Input
            label="Próxima consulta (opcional)"
            type="date"
            value={form.nextVisitDate}
            onChange={(event) =>
              setForm({ ...form, nextVisitDate: event.target.value })
            }
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} loading={saving}>
              Guardar consulta
            </Button>
          </div>
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <p className="py-4 text-center font-body text-sm text-muted">
          Este paciente aún no tiene consultas registradas.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {sorted.map((visit) => (
            <li key={visit.id} className="border-l-2 border-primary pl-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-primary" aria-hidden="true">
                  <Stethoscope size={14} />
                </span>
                <p className="font-body text-sm font-semibold text-navy">
                  {visit.diagnosis}
                </p>
                <p className="font-body text-xs text-muted">
                  {formatDate(visit.visitDate)}
                </p>
              </div>
              <p className="mt-1 font-body text-sm text-slate-700">
                {visit.observations}
              </p>
              {visit.treatment ? (
                <p className="mt-0.5 font-body text-sm text-slate-600">
                  <span className="font-medium">Tratamiento:</span>{" "}
                  {visit.treatment}
                </p>
              ) : null}
              <p className="mt-1 font-body text-xs text-muted">
                Registrada por {visit.healthcareWorkerName} ·{" "}
                {formatDateTime(visit.visitDate)}
                {visit.nextVisitDate
                  ? ` · próxima: ${formatDate(visit.nextVisitDate)}`
                  : ""}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}