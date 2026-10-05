import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "../../lib/api";
import type { PublicMedicalRecord, PublicPatient } from "../../types";
import { Alert } from "../../components/ui/Alert";
import { MedicalRecordCard } from "./patient-detail/MedicalRecordCard";

/**
 * Página propia del expediente clínico. Recicla `MedicalRecordCard` (antes
 * una pestaña dentro de PatientDetail) como el cuerpo de esta pantalla, a la
 * que ahora se llega desde el botón "Expediente" en el encabezado del
 * paciente.
 */
export default function PatientRecord() {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<PublicPatient | null>(null);
  const [record, setRecord] = useState<PublicMedicalRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void api
      .getPatient(id)
      .then((loaded) => {
        if (!cancelled) {
          setPatient(loaded);
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

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void api
      .getMedicalRecord(id)
      .then((loaded) => {
        if (!cancelled) {
          setRecord(loaded);
        }
      })
      .catch((err) => {
        // Un 404 aquí solo significa "el paciente aún no tiene expediente
        // creado", no un error real: se deja `record` en null para que
        // MedicalRecordCard muestre el formulario en modo "crear".
        if (
          !cancelled &&
          !(err instanceof ApiError && err.statusCode === 404)
        ) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar el expediente",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return <Alert>{error}</Alert>;
  }
  if (!patient || !id) {
    return (
      <p className="py-8 text-center font-body text-sm text-muted">Cargando…</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/app/patients/${id}`}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver a {patient.name}
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-navy">
          Expediente clínico
        </h1>
        <p className="font-body text-sm text-muted">
          {patient.name} · {patient.healthCenterName}
        </p>
      </div>
      <MedicalRecordCard patientId={id} record={record} onSaved={setRecord} />
    </div>
  );
}
