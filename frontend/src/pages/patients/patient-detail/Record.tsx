import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../../../lib/api";
import type { PublicMedicalRecord } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { RecordForm } from "./RecordForm";
import type { RecordFormValue } from "./types";

interface ExpedienteTabProps {
  patientId: string;
  record: PublicMedicalRecord | null;
  onSaved: (record: PublicMedicalRecord) => void;
}

export function Record({ patientId, record, onSaved }: ExpedienteTabProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    form: RecordFormValue,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const saved = await api.updateMedicalRecord(patientId, {
        primaryDiagnosis: form.primaryDiagnosis,
        medicalHistory: form.medicalHistory,
        allergies: form.allergies,
        ...(form.bloodType ? { bloodType: form.bloodType } : {}),
      });
      onSaved(saved);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo guardar el expediente",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Expediente clínico">
      <RecordForm
        key={record?.updateDate ?? "empty"}
        initial={record}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel={record ? "Guardar expediente" : "Crear expediente"}
      />
    </Card>
  );
}
