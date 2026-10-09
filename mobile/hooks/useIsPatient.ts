// hooks/useIsPatient.ts
import { useAppStore } from '@/store';

/**
 * Los endpoints `/patients/me/...` son solo para pacientes (RolesGuard): un cuidador
 * recibiría 403. Las queries de datos del paciente se activan con esto.
 */
export function useIsPatient() {
  return useAppStore((state) => state.user?.role === 'patient');
}
