// features/profile/hooks/useAccountProfile.ts
import { useQuery } from '@tanstack/react-query';
import type { InfoTileData } from '@/components/ui/info-tile';
import { MORE_LABELS, PROFILE_LABELS, ROLE_LABELS } from '@/constants/labels';
import { usePatientProfile } from '@/features/medical-record/hooks/useMedicalRecord';
import { getInitials } from '@/features/more/domain/user-initials';
import { formatIsoDateShort } from '@/lib/date-format';
import { useAppStore } from '@/store';
import { fetchMockAccountExtras } from '../api/mock-account';

const { fields, notRegistered, noDisability } = PROFILE_LABELS;

/** Datos personales de la cuenta: sesión, perfil clínico y datos extra. */
export function useAccountProfile() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const { data: patient } = usePatientProfile();
  const { data: extras } = useQuery({
    queryKey: ['account', 'extras'],
    queryFn: fetchMockAccountExtras,
  });

  const name = user?.name ?? MORE_LABELS.fallbackName;
  const role = user ? (ROLE_LABELS[user.role] ?? user.role) : '';

  const tiles: InfoTileData[] = [
    { id: 'name', label: fields.name, value: name },
    { id: 'nup', label: fields.nup, value: extras?.nup ?? notRegistered },
    {
      id: 'birth-date',
      label: fields.birthDate,
      value: patient ? formatIsoDateShort(patient.birthDate) : notRegistered,
    },
    { id: 'blood-type', label: fields.bloodType, value: patient?.bloodType || notRegistered },
    { id: 'phone', label: fields.phone, value: user?.phoneNumber || notRegistered },
    { id: 'email', label: fields.email, value: user?.email || notRegistered },
    { id: 'caregiver', label: fields.caregiver, value: extras?.caregiver ?? notRegistered },
    { id: 'disability', label: fields.disability, value: extras?.disability ?? noDisability },
  ];

  return {
    name,
    initials: getInitials(name),
    subtitle: PROFILE_LABELS.subtitle(role),
    tiles,
    logout: () => logout(),
  };
}
