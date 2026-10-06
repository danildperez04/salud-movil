import { useEffect, useState } from "react";
import { CalendarClock, Pill } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { api, ApiError } from "../../../lib/api";
import { formatDateTime } from "../../../lib/date";
import type { PublicReminder } from "../../../types";

/** Ventana de eventos próximos que se muestran. */
const WINDOW_DAYS = 7;

function reminderLine(reminder: PublicReminder): string {
  return reminder.type === "medication"
    ? `${reminder.title} · ${reminder.dose}`
    : `${reminder.title} · ${reminder.specialty}`;
}

/**
 * Próximos eventos de seguimiento del paciente: tomas de medicamento y citas,
 * unificados desde `GET /patients/:id/reminders`.
 *
 * Reemplaza a un timeline inventado que mostraba una "Alerta por SatO₂ baja"
 * que no corresponde a ningún indicador del catálogo.
 */
export function FollowUpCard({ patientId }: { patientId: string }) {
  const [reminders, setReminders] = useState<PublicReminder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getPatientReminders(patientId, WINDOW_DAYS)
      .then((data) => {
        if (active) {
          setReminders(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar los eventos de seguimiento",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [patientId]);

  return (
    <Card title="Seguimiento">
      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1].map((index) => (
            <div key={index} className="h-10 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Alert>{error}</Alert>
      ) : reminders.length === 0 ? (
        <p className="py-4 text-center font-body text-sm text-muted">
          Sin eventos en los próximos {WINDOW_DAYS} días.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {reminders.map((reminder) => (
            <li
              key={`${reminder.type}-${reminder.id}`}
              className="flex gap-3 border-l-2 border-primary pl-3"
            >
              <span className="mt-0.5 text-primary" aria-hidden="true">
                {reminder.type === "medication" ? (
                  <Pill size={14} />
                ) : (
                  <CalendarClock size={14} />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-medium text-navy">
                  {reminderLine(reminder)}
                </p>
                <p className="font-body text-xs text-muted">
                  {formatDateTime(reminder.dateHour)}
                  {reminder.type === "medication" && reminder.confirmedAt
                    ? " · tomada"
                    : ""}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}