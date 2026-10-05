import { useEffect, useState } from "react";
import { Pill, Plus, Trash2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ConfirmDeleteModal } from "../../../components/ui/ConfirmDeleteModal";
import { Badge } from "../../../components/ui/Badge";
import { api, ApiError } from "../../../lib/api";
import { formatDate } from "../../../lib/date";
import { useCatalogueStore } from "../../../store/catalogues";
import type {
  CreateMedicationSchedulePayload,
  PublicMedication,
} from "../../../types";

/** Días de la semana en el orden que usa `date_hour` en PostgreSQL (0 = domingo). */
const WEEK_DAYS = [
  { value: 1, short: "Lun" },
  { value: 2, short: "Mar" },
  { value: 3, short: "Mié" },
  { value: 4, short: "Jue" },
  { value: 5, short: "Vie" },
  { value: 6, short: "Sáb" },
  { value: 0, short: "Dom" },
];

const WEEK_DAY_LABELS: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

interface DraftSchedule extends CreateMedicationSchedulePayload {
  /** clave estable para React, porque el array se reordena y edita */
  key: string;
}

const EMPTY_FORM = {
  drugName: "",
  dose: "",
  instructions: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  active: true,
  routeAdministrationId: "",
};

const emptySchedule = (index: number): DraftSchedule => ({
  key: `s-${index}-${Math.random().toString(36).slice(2, 8)}`,
  hour: "08:00",
  timesPerDay: 1,
  days: [1, 3, 5],
});

function formatSchedule(schedule: {
  hour: string;
  timesPerDay: number;
  days: number[];
}): string {
  const days =
    schedule.days.length === 7
      ? "todos los días"
      : schedule.days.map((day) => WEEK_DAY_LABELS[day] ?? day).join(", ");
  const times =
    schedule.timesPerDay === 1
      ? "1 vez"
      : `${schedule.timesPerDay} veces`;
  return `${schedule.hour} · ${times} · ${days}`;
}

interface MedicationsPanelProps {
  patientId: string;
}

/**
 * Prescripción y control de medicamentos del paciente.
 *
 * No cierra HU-23/24/26: esas describen al *paciente* registrando su
 * medicamento desde el móvil y son de jarey. Esto es el flujo del personal de
 * salud, que ninguna HU cubre.
 */
export function MedicationsPanel({ patientId }: MedicationsPanelProps) {
  const routeAdministrations = useCatalogueStore(
    (s) => s.routeAdministrations,
  );
  const [medications, setMedications] = useState<PublicMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PublicMedication | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [schedules, setSchedules] = useState<DraftSchedule[]>([
    emptySchedule(0),
  ]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<PublicMedication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    let active = true;
    api
      .getPatientMedications(patientId)
      .then((data) => {
        if (active) {
          setMedications(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar los medicamentos",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [patientId, reloadKey]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSchedules([emptySchedule(0)]);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (medication: PublicMedication) => {
    setEditing(medication);
    setForm({
      drugName: medication.drugName,
      dose: medication.dose,
      instructions: medication.instructions ?? "",
      startDate: medication.startDate,
      endDate: medication.endDate ?? "",
      active: medication.active,
      routeAdministrationId: String(medication.routeAdministrationId),
    });
    setSchedules(
      medication.schedules.length > 0
        ? medication.schedules.map((schedule) => ({
            key: `edit-${schedule.id}`,
            hour: schedule.hour,
            timesPerDay: schedule.timesPerDay,
            days: schedule.days,
          }))
        : [emptySchedule(0)],
    );
    setFormError(null);
    setFormOpen(true);
  };

  const toggleDay = (index: number, day: number) => {
    setSchedules((current) =>
      current.map((schedule, position) => {
        if (position !== index) return schedule;
        const days = schedule.days.includes(day)
          ? schedule.days.filter((value) => value !== day)
          : [...schedule.days, day];
        return { ...schedule, days };
      }),
    );
  };

  const handleSave = async () => {
    if (!form.drugName.trim() || !form.dose.trim()) {
      setFormError("El fármaco y la dosis son obligatorios");
      return;
    }
    if (!form.routeAdministrationId) {
      setFormError("Selecciona la vía de administración");
      return;
    }
    if (form.endDate && form.endDate < form.startDate) {
      setFormError("La fecha de fin no puede ser anterior a la de inicio");
      return;
    }
    const invalid = schedules.find(
      (schedule) =>
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.hour) ||
        schedule.timesPerDay < 1 ||
        schedule.timesPerDay > 4 ||
        schedule.days.length === 0,
    );
    if (invalid) {
      setFormError(
        "Cada horario necesita una hora válida (HH:mm), entre 1 y 4 tomas y al menos un día",
      );
      return;
    }

    setSaving(true);
    setFormError(null);
    const payload = {
      drugName: form.drugName.trim(),
      dose: form.dose.trim(),
      ...(form.instructions.trim()
        ? { instructions: form.instructions.trim() }
        : {}),
      startDate: form.startDate,
      ...(form.endDate ? { endDate: form.endDate } : {}),
      active: form.active,
      routeAdministrationId: Number(form.routeAdministrationId),
      // El backend borra lógicamente los horarios anteriores y crea los nuevos,
      // y regenera los recordatorios de la ventana.
      schedules: schedules.map(({ hour, timesPerDay, days }) => ({
        hour,
        timesPerDay,
        days: [...days].sort((a, b) => a - b),
      })),
    };
    try {
      if (editing) {
        await api.updatePatientMedication(patientId, editing.id, payload);
      } else {
        await api.createPatientMedication(patientId, payload);
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "No se pudo guardar el medicamento",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (medication: PublicMedication) => {
    try {
      await api.updatePatientMedication(patientId, medication.id, {
        active: !medication.active,
      });
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo actualizar el medicamento",
      );
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deletePatientMedication(patientId, toDelete.id);
      setToDelete(null);
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo eliminar",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      title="Medicamentos"
      actions={
        <Button variant="secondary" onClick={openCreate}>
          <Plus size={14} aria-hidden="true" />
          Prescribir
        </Button>
      }
    >
      {error ? <Alert>{error}</Alert> : null}

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1].map((index) => (
            <div key={index} className="h-14 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : medications.length === 0 ? (
        <p className="py-4 text-center font-body text-sm text-muted">
          Este paciente no tiene medicamentos prescritos.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {medications.map((medication) => (
            <li key={medication.id} className="flex flex-col gap-2 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-navy">
                    {medication.drugName} {medication.dose}
                  </p>
                  <p className="font-body text-xs text-muted">
                    {medication.routeAdministrationName} · desde{" "}
                    {formatDate(medication.startDate)}
                    {medication.endDate
                      ? ` hasta ${formatDate(medication.endDate)}`
                      : ""}
                  </p>
                  {medication.instructions ? (
                    <p className="font-body text-xs text-slate-600">
                      {medication.instructions}
                    </p>
                  ) : null}
                </div>
                <Badge variant={medication.active ? "success" : "neutral"}>
                  {medication.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <ul className="flex flex-col gap-0.5">
                {medication.schedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="flex items-center gap-2 font-body text-xs text-muted"
                  >
                    <Pill size={12} className="text-primary" aria-hidden="true" />
                    {formatSchedule(schedule)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => openEdit(medication)}>
                  Editar
                </Button>
                <Button variant="ghost" onClick={() => toggleActive(medication)}>
                  {medication.active ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => setToDelete(medication)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <Modal
          title={editing ? "Editar medicamento" : "Prescribir medicamento"}
          onClose={() => setFormOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Guardar
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3">
            {formError ? <Alert>{formError}</Alert> : null}

            <Input
              label="Fármaco"
              value={form.drugName}
              onChange={(event) =>
                setForm({ ...form, drugName: event.target.value })
              }
              placeholder="Losartán"
            />
            <Input
              label="Dosis"
              value={form.dose}
              onChange={(event) => setForm({ ...form, dose: event.target.value })}
              placeholder="50 mg"
            />
            <Input
              label="Indicaciones (opcional)"
              value={form.instructions}
              onChange={(event) =>
                setForm({ ...form, instructions: event.target.value })
              }
              placeholder="1 tableta por toma, después del desayuno"
            />
            <Select
              label="Vía de administración"
              value={form.routeAdministrationId}
              onChange={(event) =>
                setForm({ ...form, routeAdministrationId: event.target.value })
              }
            >
              <option value="">Selecciona…</option>
              {routeAdministrations.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </Select>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="Desde"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm({ ...form, startDate: event.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Hasta (opcional)"
                  type="date"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm({ ...form, endDate: event.target.value })
                  }
                />
              </div>
            </div>

            <label className="flex items-center gap-2 font-body text-sm text-navy">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm({ ...form, active: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Medicamento activo
            </label>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Horarios de toma
              </p>
              {schedules.map((schedule, index) => (
                <div
                  key={schedule.key}
                  className="flex flex-col gap-2 rounded-lg bg-surface p-3"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-28">
                      <Input
                        label="Hora"
                        type="time"
                        value={schedule.hour}
                        onChange={(event) =>
                          setSchedules((current) =>
                            current.map((item, position) =>
                              position === index
                                ? { ...item, hour: event.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        label="Tomas/día"
                        type="number"
                        min={1}
                        max={4}
                        value={schedule.timesPerDay}
                        onChange={(event) =>
                          setSchedules((current) =>
                            current.map((item, position) =>
                              position === index
                                ? {
                                    ...item,
                                    timesPerDay: Number(event.target.value),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </div>
                    {schedules.length > 1 ? (
                      <Button
                        variant="ghost"
                        className="text-red-600"
                        onClick={() =>
                          setSchedules((current) =>
                            current.filter((_, position) => position !== index),
                          )
                        }
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {WEEK_DAYS.map((day) => {
                      const active = schedule.days.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(index, day.value)}
                          className={`rounded-lg px-2 py-1 font-body text-xs transition ${
                            active
                              ? "bg-primary text-white"
                              : "bg-white text-slate-600 hover:bg-mint-soft"
                          }`}
                          aria-pressed={active}
                        >
                          {day.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <Button
                variant="secondary"
                className="self-start"
                onClick={() =>
                  setSchedules((current) => [
                    ...current,
                    emptySchedule(current.length),
                  ])
                }
              >
                <Plus size={14} aria-hidden="true" />
                Añadir horario
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}

      {toDelete ? (
        <ConfirmDeleteModal
          title="Eliminar medicamento"
          message={
            <>
              ¿Seguro que deseas eliminar{" "}
              <strong>
                {toDelete.drugName} {toDelete.dose}
              </strong>
              ? Se borrará junto con sus horarios y recordatorios.
            </>
          }
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      ) : null}
    </Card>
  );
}