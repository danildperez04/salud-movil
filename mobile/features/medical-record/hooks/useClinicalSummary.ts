// features/medical-record/hooks/useClinicalSummary.ts
import type { InfoRow } from '@/components/ui/info-rows-card';
import { MEDICAL_RECORD_LABELS, MORE_LABELS } from '@/constants/labels';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { formatIsoDateShort } from '@/lib/date-format';
import { useAppStore } from '@/store';
import { calculateAge, isOngoingDiagnosis } from '../domain/clinical-summary';
import { useDiagnoses, usePatientProfile } from './useMedicalRecord';

const labels = MEDICAL_RECORD_LABELS.summary;

/** Reúne perfil, diagnósticos y medicamentos en las filas del resumen clínico. */
export function useClinicalSummary() {
  const user = useAppStore((state) => state.user);
  const { data: profile, isLoading: loadingProfile } = usePatientProfile();
  const { data: diagnoses, isLoading: loadingDiagnoses } = useDiagnoses();
  const { data: medications, isLoading: loadingMedications } = useMedications();

  const ongoingConditions = (diagnoses ?? [])
    .filter((diagnosis) => isOngoingDiagnosis(diagnosis.status))
    .map((diagnosis) => diagnosis.name);
  const activeMedications = (medications ?? []).filter((medication) => medication.active).length;

  const rows: InfoRow[] = profile
    ? [
        { id: 'age', title: labels.age, subtitle: labels.years(calculateAge(profile.birthDate)) },
        {
          id: 'blood-type',
          title: labels.bloodType,
          subtitle: profile.bloodType || labels.notRegistered,
        },
        {
          id: 'conditions',
          title: labels.conditions,
          subtitle:
            ongoingConditions.length > 0 ? ongoingConditions.join(' · ') : labels.noConditions,
        },
        {
          id: 'medications',
          title: labels.medications,
          subtitle: labels.medicationsCount(activeMedications),
        },
      ]
    : [];

  return {
    isLoading: loadingProfile || loadingDiagnoses || loadingMedications,
    patientName: user?.name ?? MORE_LABELS.fallbackName,
    updatedAt: profile ? formatIsoDateShort(profile.updatedAt) : undefined,
    rows,
    emergencyContact: profile?.emergencyContact,
  };
}
