import { useEffect, useState } from "react";
import { CalendarPlus, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ConfirmDeleteModal } from "../../../components/ui/ConfirmDeleteModal";
import { Badge } from "../../../components/ui/Badge";
import { api, ApiError } from "../../../lib/api";
import { formatDateTime } from "../../../lib/date";
import { useAuthStore } from "../../../store/auth";
import { useCatalogueStore } from "../../../store/catalogues";
import type { PublicAppointment, PublicStaff } from "../../../types";

/**
 * Variante de `Badge` por estado. `Badge` no acepta `className`, solo
 * `variant`, así que el color se mapea aquí en vez de componer clases.
 */
const STATE_VARIANTS: Record<string, 'success' | 'danger' | 'neutral' | 'primary'> =
  {
    Scheduled: 'primary',
    Completed: 'success',
    Cancelled: 'danger',
    'No show': 'neutral',
  };

const STATE_LABELS: Record<string, string> = {
  Scheduled: "Programada",
  Completed: "Atendida",
  Cancelled: "Cancelada",
  "No show": "No asistió",
};

interface AppointmentsPanelProps {
  patientId: string;
  /** Centro del paciente: el backend exige que el personal sea del mismo centro. */
  patientCenterId: string;
}

/** Valor para `<input type="datetime-local">` desde un ISO. */
function toLocalInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const EMPTY_FORM = {
  dateHour: toLocalInput(new Date().toISOString()),
  reason: "",
  appointmentTypeId: "",
  healthcareWorkerId: "",
  durationMinutes: "30",
};

/**
 * Agenda de citas del paciente: listado, alta, edición, cancelación y cambio de
 * estado (HU-18, HU-19, HU-20 y HU-22).
 */
export function AppointmentsPanel({
  patientId,
  patientCenterId,
}: AppointmentsPanelProps) {
  const role = useAuthStore((s) => s.user?.role);
  const appointmentTypes = useCatalogueStore((s) => s.appointmentTypes);
  const [appointments, setAppointments] = useState<PublicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PublicAppointment | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [staff, setStaff] = useState<PublicStaff[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toCancel, setToCancel] = useState<PublicAppointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  /**
   * Recargar sin duplicar la petición: las acciones incrementan `reloadKey` y el
   * efecto vuelve a correr. Se evita un `load()` aparte porque la regla
   * `react-hooks/set-state-in-effect` no admite llamar desde el efecto a un
   * callback que hace `setState`.
   */
  const reload = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    let active = true;
    api
      .getPatientAppointments(patientId)
      .then((data) => {
        if (active) {
          setAppointments(
            [...data].sort(
              (a, b) =>
                new Date(b.dateHour).getTime() - new Date(a.dateHour).getTime(),
            ),
          );
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar las citas",
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

  // El admin **debe** elegir personal de salud: `resolveHealthcareWorker` no
  // se lo permite. Y solo se admiten los del centro del paciente, porque el
  // backend responde 404 si pertenecen a otro.
  useEffect(() => {
    if (role !== 'admin') return;
    void api
      .listUsers('health_staff')
      .then((users) =>
        setStaff(
          users.filter(
            (user) => user.healthcareWorker?.healthCenterId === patientCenterId,
          ),
        ),
      )
      .catch(() => undefined);
  }, [role, patientCenterId]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (appointment: PublicAppointment) => {
    setEditing(appointment);
    setForm({
      dateHour: toLocalInput(appointment.dateHour),
      reason: appointment.reason,
      appointmentTypeId: String(appointment.appointmentTypeId),
      healthcareWorkerId: appointment.healthcareWorkerId,
      durationMinutes: appointment.durationMinutes
        ? String(appointment.durationMinutes)
        : "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.dateHour || !form.reason.trim() || !form.appointmentTypeId) {
      setFormError("Fecha, motivo y tipo son obligatorios");
      return;
    }
    if (role === 'admin' && !form.healthcareWorkerId) {
      setFormError("Selecciona el personal de salud que atiende la cita");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      dateHour: new Date(form.dateHour).toISOString(),
      reason: form.reason.trim(),
      appointmentTypeId: Number(form.appointmentTypeId),
      ...(form.durationMinutes
        ? { durationMinutes: Number(form.durationMinutes) }
        : {}),
      ...(form.healthcareWorkerId
        ? { healthcareWorkerId: form.healthcareWorkerId }
        : {}),
    };
    try {
      if (editing) {
        await api.updatePatientAppointment(patientId, editing.id, payload);
      } else {
        await api.createPatientAppointment(patientId, payload);
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "No se pudo guardar la cita",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!toCancel) return;
    const reason = window.prompt("Motivo de la cancelación");
    if (reason === null || reason.trim() === "") return;
    setCancelling(true);
    try {
      await api.cancelPatientAppointment(patientId, toCancel.id, reason.trim());
      setToCancel(null);
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo cancelar la cita",
      );
    } finally {
      setCancelling(false);
    }
  };

  const changeState = async (
    appointment: PublicAppointment,
    state: 'Completed' | 'No show',
  ) => {
    try {
      await api.changePatientAppointmentState(patientId, appointment.id, state);
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo actualizar el estado",
      );
    }
  };

  return (
    <Card
      title="Citas médicas"
      actions={
        <Button variant="secondary" onClick={openCreate}>
          <CalendarPlus size={14} aria-hidden="true" />
          Agendar cita
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
      ) : appointments.length === 0 ? (
        <p className="py-4 text-center font-body text-sm text-muted">
          Este paciente no tiene citas registradas.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {appointments.map((appointment) => {
            const state = appointment.appointmentStateName;
            const isScheduled = state === 'Scheduled';
            return (
              <li key={appointment.id} className="flex flex-col gap-2 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-navy">
                      {appointment.reason}
                    </p>
                    <p className="font-body text-xs text-muted">
                      {formatDateTime(appointment.dateHour)} ·{" "}
                      {appointment.appointmentTypeName} ·{" "}
                      {appointment.healthcareWorkerName}
                    </p>
                    {appointment.cancelReason ? (
                      <p className="font-body text-xs text-red-600">
                        Motivo: {appointment.cancelReason}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={STATE_VARIANTS[state] ?? 'neutral'}>
                    {STATE_LABELS[state] ?? state}
                  </Badge>
                </div>

                {isScheduled ? (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => openEdit(appointment)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-primary"
                      onClick={() => changeState(appointment, 'Completed')}
                    >
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Atendida
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-amber-600"
                      onClick={() => changeState(appointment, 'No show')}
                    >
                      <XCircle size={14} aria-hidden="true" />
                      No asistió
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => setToCancel(appointment)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {formOpen ? (
        <Modal
          title={editing ? "Editar cita" : "Agendar cita"}
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
              label="Fecha y hora"
              type="datetime-local"
              value={form.dateHour}
              onChange={(event) => setForm({ ...form, dateHour: event.target.value })}
            />
            <Input
              label="Motivo"
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              placeholder="Control de hipertensión"
            />
            <Select
              label="Tipo de cita"
              value={form.appointmentTypeId}
              onChange={(event) =>
                setForm({ ...form, appointmentTypeId: event.target.value })
              }
            >
              <option value="">Selecciona…</option>
              {appointmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>

            {role === 'admin' ? (
              <Select
                label="Personal de salud"
                value={form.healthcareWorkerId}
                onChange={(event) =>
                  setForm({ ...form, healthcareWorkerId: event.target.value })
                }
              >
                <option value="">Selecciona…</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </Select>
            ) : null}

            <Input
              label="Duración en minutos (opcional)"
              type="number"
              min={1}
              value={form.durationMinutes}
              onChange={(event) =>
                setForm({ ...form, durationMinutes: event.target.value })
              }
            />
          </div>
        </Modal>
      ) : null}

      {toCancel ? (
        <ConfirmDeleteModal
          title="Cancelar cita"
          message={
            <>
              ¿Seguro que deseas cancelar la cita del{" "}
              <strong>{formatDateTime(toCancel.dateHour)}</strong>? Se te
              pedirá el motivo.
            </>
          }
          onCancel={() => setToCancel(null)}
          onConfirm={handleCancel}
          loading={cancelling}
          confirmLabel="Continuar"
        />
      ) : null}
    </Card>
  );
}