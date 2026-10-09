// features/emergency/hooks/useEmergencyMode.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import type { InfoTileData } from '@/components/ui/info-tile';
import { EMERGENCY_LABELS } from '@/constants/labels';
import { useMedications } from '@/features/medications/hooks/useMedications';
import { isOngoingDiagnosis } from '@/features/medical-record/domain/clinical-summary';
import {
  useAllergies,
  useDiagnoses,
  usePatientProfile,
} from '@/features/medical-record/hooks/useMedicalRecord';
import { externalLinks, openExternalLink } from '@/lib/external-links';
import { joinParts } from '@/lib/text-format';
import { useEmergencyContacts } from './useEmergencyContacts';

const labels = EMERGENCY_LABELS;

/** Datos esenciales del paciente, contactos y acciones del "Modo emergencia". */
export function useEmergencyMode() {
  const { data: profile } = usePatientProfile();
  const { data: allergies } = useAllergies();
  const { data: diagnoses } = useDiagnoses();
  const { data: medications } = useMedications();
  const { data: contacts, isLoading: isLoadingContacts } = useEmergencyContacts();

  // la ubicación no se comparte por defecto ni se recuerda entre emergencias
  const [shareLocation, setShareLocation] = useState(false);

  const conditions = (diagnoses ?? [])
    .filter((diagnosis) => isOngoingDiagnosis(diagnosis.status))
    .map((diagnosis) => diagnosis.name);
  const activeMedications = (medications ?? [])
    .filter((medication) => medication.active)
    .map((medication) => medication.drugName);

  const tiles: InfoTileData[] = [
    {
      id: 'blood-type',
      label: labels.bloodType,
      value: profile?.bloodType || labels.notRegistered,
    },
    {
      id: 'allergies',
      label: labels.allergies,
      value: joinParts((allergies ?? []).map((allergy) => allergy.name)) || labels.none,
    },
    { id: 'conditions', label: labels.conditions, value: joinParts(conditions) || labels.none },
    {
      id: 'medications',
      label: labels.medications,
      value: joinParts(activeMedications) || labels.noMedications,
    },
  ];

  return {
    tiles,
    contacts: contacts ?? [],
    isLoadingContacts,
    shareLocation,
    setShareLocation,
    callContact: (phone: string) => openExternalLink(externalLinks.phone(phone)),
    // TODO: enviar la alerta (y la ubicación si está activada) cuando exista el backend de emergencias
    requestHelp: () => Alert.alert(labels.sosTitle, labels.sosMessage, [{ text: labels.sosOk }]),
  };
}
