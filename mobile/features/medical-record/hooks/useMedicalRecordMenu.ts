// features/medical-record/hooks/useMedicalRecordMenu.ts
import type { Href } from 'expo-router';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { isOngoingDiagnosis } from '../domain/clinical-summary';
import { recordRoutes } from '../routes';
import { useAllergies, useDiagnoses } from './useMedicalRecord';

const labels = MEDICAL_RECORD_LABELS.menu;

export type RecordMenuItem = {
  id: 'summary' | 'diagnosis' | 'history' | 'allergies' | 'documents' | 'labs';
  title: string;
  subtitle: string;
  href: Href;
};

/** Entradas del índice del expediente; los subtítulos reflejan lo que hay registrado. */
export function useMedicalRecordMenu(): RecordMenuItem[] {
  const { data: diagnoses } = useDiagnoses();
  const { data: allergies } = useAllergies();

  const ongoingConditions = (diagnoses ?? [])
    .filter((diagnosis) => isOngoingDiagnosis(diagnosis.status))
    .map((diagnosis) => diagnosis.name);
  const allergyCount = allergies?.length ?? 0;

  return [
    {
      id: 'summary',
      title: labels.summary.title,
      subtitle: labels.summary.subtitle,
      href: recordRoutes.summary,
    },
    {
      id: 'diagnosis',
      title: labels.diagnosis.title,
      subtitle:
        ongoingConditions.length > 0 ? ongoingConditions.join(', ') : labels.diagnosis.empty,
      href: recordRoutes.diagnosis,
    },
    {
      id: 'history',
      title: labels.history.title,
      subtitle: labels.history.subtitle,
      href: recordRoutes.history,
    },
    {
      id: 'allergies',
      title: labels.allergies.title,
      subtitle: allergyCount > 0 ? labels.allergies.some(allergyCount) : labels.allergies.none,
      href: recordRoutes.allergies,
    },
    {
      id: 'documents',
      title: labels.documents.title,
      subtitle: labels.documents.subtitle,
      href: recordRoutes.documents,
    },
    {
      id: 'labs',
      title: labels.labs.title,
      subtitle: labels.labs.subtitle,
      href: recordRoutes.labs,
    },
  ];
}
