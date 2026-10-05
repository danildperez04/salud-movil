import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, FileText, Pencil, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { api, ApiError } from "../../lib/api";
import { getMockIpcp } from "../../lib/ipcp";
import type { PublicCaregiverLink, PublicPatient } from "../../types";
import { Alert } from "../../components/ui/Alert";
import { getButtonClassName } from "../../components/ui/buttonStyles";
import { PatientOverviewCard } from "./patient-detail/PatientOverviewCard";
import { HealthIndicatorsCard } from "./patient-detail/HealthIndicatorsCard";
import { AppointmentsPanel } from "./patient-detail/AppointmentsPanel";
import { CaregiverSummaryCard } from "./patient-detail/CaregiverSummaryCard";
import { FollowUpCard } from "./patient-detail/FollowUpCard";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<PublicPatient | null>(null);
  const [caregivers, setCaregivers] = useState<PublicCaregiverLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void api
      .getPatient(id)
      .then((patient) => {
        if (!cancelled) {
          setPatient(patient);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar el paciente",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // La tarjeta "Cuidador / persona de apoyo" del hero necesita esta lista
  // siempre disponible (ya no depende de abrir una pestaña "Cuidadores",
  // que se eliminó junto con la gestión de vínculos desde esta pantalla).
  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void api
      .getPatientCaregivers(id)
      .then((list) => {
        if (!cancelled) {
          setCaregivers(list);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [id]);

  /** Tras vincular un cuidador se recarga la lista de vínculos del paciente. */
  const reloadCaregivers = async () => {
    if (!id) return;
    const list = await api.getPatientCaregivers(id);
    setCaregivers(list);
  };

  if (error) {
    return <Alert>{error}</Alert>;
  }
  if (!patient || !id) {
    return (
      <p className="py-8 text-center font-body text-sm text-muted">Cargando…</p>
    );
  }

  // MOCK: el IPCP real todavía no existe en el backend (ver lib/ipcp.ts). El
  // módulo del índice es el Bloque 2.D del plan; hasta entonces la tarjeta de
  // resumen usa el hash provisional.
  const ipcp = getMockIpcp(patient.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/app/patients"
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver a pacientes
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">
              {patient.name}
            </h1>
            <p className="font-body text-sm text-muted">
              {/* Sin campo "NUP" en el backend: usamos la cédula como
                  aproximación. Ajusta si el backend termina exponiendo un
                  identificador dedicado. */}
              {patient.dni ? `NUP ${patient.dni}` : patient.email} ·{" "}
              {patient.healthCenterName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/app/patients/${id}/edit`}
              className={getButtonClassName("ghost")}
            >
              <Pencil size={16} aria-hidden="true" /> Editar
            </Link>
            <Link
              to={`/app/patients/${id}/record`}
              className={getButtonClassName("ghost")}
            >
              <FileText size={16} aria-hidden="true" /> Expediente
            </Link>
            <a
              href={`https://wa.me/505${patient.phoneNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className={getButtonClassName("secondary")}
            >
              <FaWhatsapp size={16} aria-hidden="true" /> WhatsApp
            </a>
            <a
              href={`tel:${patient.phoneNumber}`}
              className={getButtonClassName("primary")}
            >
              <Phone size={16} aria-hidden="true" /> Llamar
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <PatientOverviewCard patient={patient} ipcp={ipcp} />
          <HealthIndicatorsCard patientId={patient.id} />
          <AppointmentsPanel
            patientId={patient.id}
            patientCenterId={patient.healthCenterId}
          />
        </div>
        <div className="flex flex-col gap-6">
          <CaregiverSummaryCard
            patientId={patient.id}
            caregivers={caregivers}
            onLinked={reloadCaregivers}
          />
          <FollowUpCard patientId={patient.id} />
        </div>
      </div>
    </div>
  );
}
