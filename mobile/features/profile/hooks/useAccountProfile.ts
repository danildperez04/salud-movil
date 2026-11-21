// features/profile/hooks/useAccountProfile.ts
import type { InfoTileData } from '@/components/ui/info-tile';
import { MORE_LABELS, PROFILE_LABELS, ROLE_LABELS } from '@/constants/labels';
import { usePatientProfile } from '@/features/medical-record/hooks/useMedicalRecord';
import { getInitials } from '@/features/more/domain/user-initials';
import { formatIsoDateShort } from '@/lib/date-format';
import { useAppStore } from '@/store';
import { usePatientMe } from './usePatientMe';

const { fields, notRegistered } = PROFILE_LABELS;

/** Datos personales de la cuenta: sesión, ficha del paciente y perfil clínico. */
export function useAccountProfile() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const { data: patient } = usePatientMe();
  const { data: profile } = usePatientProfile();

  const name = user?.name ?? MORE_LABELS.fallbackName;
  const role = user ? (ROLE_LABELS[user.role] ?? user.role) : '';

  const tiles: InfoTileData[] = [
    { id: 'name', label: fields.name, value: name },
    { id: 'nup', label: fields.nup, value: patient?.dni || notRegistered },
    {
      id: 'birth-date',
      label: fields.birthDate,
      value: profile ? formatIsoDateShort(profile.birthDate) : notRegistered,
    },
    { id: 'blood-type', label: fields.bloodType, value: profile?.bloodType || notRegistered },
    { id: 'phone', label: fields.phone, value: user?.phoneNumber || notRegistered },
    { id: 'email', label: fields.email, value: user?.email || notRegistered },
  ];

  return {
    name,
    initials: getInitials(name),
    subtitle: PROFILE_LABELS.subtitle(role),
    tiles,
    logout: () => logout(),
  };
}
