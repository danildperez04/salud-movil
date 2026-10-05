import type { PublicPatient } from "../../../types";
import type { IpcpMock } from "../../../lib/ipcp";
import { Card } from "../../../components/ui/Card";
import { IpcpBadge } from "../../../components/patients/IpcpBadge";
import { getInitials } from "../../../lib/initials";
import { ageOf } from "../../../lib/age";

interface PatientOverviewCardProps {
  patient: PublicPatient;
  ipcp: IpcpMock;
}

export function PatientOverviewCard({
  patient,
  ipcp,
}: PatientOverviewCardProps) {
  // Antes eran datos mock ("Última evaluación", "Seguimiento"). Ahora la
  // tarjeta absorbe los campos que vivían en la pestaña "Datos" (eliminada),
  // así que ya no hay placeholders: todo viene del paciente real.
  // "Fecha de nacimiento" se resume como "Edad" para no repetir información.
  const fields: { label: string; value: string }[] = [
    { label: "Edad", value: ageOf(patient.dateOfBirth) },
    { label: "Género", value: patient.genreName },
    { label: "Usuario", value: patient.username },
    { label: "Cédula", value: patient.dni ?? "—" },
    { label: "Teléfono", value: patient.phoneNumber },
    { label: "Centro de salud", value: patient.healthCenterName },
    { label: "Municipio", value: patient.municipalityName },
    { label: "Dirección", value: patient.address },
    {
      label: "Contacto de emergencia",
      value: `${patient.emergencyContactName} · ${patient.emergencyContactPhoneNumber}`,
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint-soft font-display text-base font-bold text-primary-dark">
          {getInitials(patient.name)}
        </span>
        <div>
          <IpcpBadge score={ipcp.score} level={ipcp.level} />
          {/* El teléfono ya aparece en la grilla de abajo ("Teléfono"), así
              que aquí solo dejamos el correo para no repetirlo. */}
          <p className="mt-1 font-body text-xs text-muted">{patient.email}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="font-body text-xs uppercase tracking-wide text-muted">
              {field.label}
            </p>
            <p className="mt-0.5 font-body text-sm font-semibold text-navy">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
