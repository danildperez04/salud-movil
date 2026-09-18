import { useState } from "react";
import type { FormEvent } from "react";
import type { PublicMedicalRecord } from "../../../types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { BLOOD_TYPES, EMPTY_RECORD_FORM } from "./types";
import type { RecordFormValue } from "./types";

interface RecordFormProps {
  initial: PublicMedicalRecord | null;
  onSubmit: (form: RecordFormValue, event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  error: string | null;
  submitLabel: string;
}

export function RecordForm({
  initial,
  onSubmit,
  saving,
  error,
  submitLabel,
}: RecordFormProps) {
  const [form, setForm] = useState<RecordFormValue>(() =>
    initial
      ? {
          primaryDiagnosis: initial.primaryDiagnosis,
          medicalHistory: initial.medicalHistory,
          allergies: initial.allergies,
          bloodType: initial.bloodType ?? "",
        }
      : EMPTY_RECORD_FORM,
  );

  return (
    <form
      onSubmit={(event) => void onSubmit(form, event)}
      className="flex flex-col gap-4"
    >
      {error ? <Alert>{error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Diagnóstico principal"
            value={form.primaryDiagnosis}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                primaryDiagnosis: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Historial médico"
            value={form.medicalHistory}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                medicalHistory: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Alergias"
            value={form.allergies}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                allergies: event.target.value,
              }))
            }
            required
          />
        </div>
        <Select
          label="Grupo sanguíneo (opcional)"
          value={form.bloodType}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              bloodType: event.target.value,
            }))
          }
        >
          <option value="">Sin especificar</option>
          {BLOOD_TYPES.map((bloodType) => (
            <option key={bloodType} value={bloodType}>
              {bloodType}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
