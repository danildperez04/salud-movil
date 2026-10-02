import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api, ApiError } from "../../lib/api";
import type { PublicCaregiverDetail, PublicPatientLink } from "../../types";
import { Alert } from "../../components/ui/Alert";
import { PersonalDataCard } from "./caregiver-detail/PersonalDataCard";
import { LinkedPatientsTable } from "./caregiver-detail/LinkedPatientsTable";

export default function CaregiverDetail() {
  const { id } = useParams<{ id: string }>();
  const [caregiver, setCaregiver] = useState<PublicCaregiverDetail | null>(
    null,
  );
  const [patients, setPatients] = useState<PublicPatientLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    const caregiverId = id;
    let cancelled = false;
    async function load() {
      try {
        const [caregiverData, patientsData] = await Promise.all([
          api.getCaregiver(caregiverId),
          api.getCaregiverPatients(caregiverId),
        ]);
        if (cancelled) {
          return;
        }
        setCaregiver(caregiverData);
        setPatients(patientsData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo cargar la información del cuidador",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>;
  }

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (!caregiver) {
    return <Alert>Cuidador no encontrado</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {caregiver.name}
          </h1>
          <p className="text-sm text-slate-500">{caregiver.email}</p>
        </div>
        <Link
          to={`/app/caregivers/${caregiver.id}/edit`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PersonalDataCard caregiver={caregiver} />
      </div>

      <LinkedPatientsTable patients={patients} />
    </div>
  );
}
