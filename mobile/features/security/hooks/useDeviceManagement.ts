// features/security/hooks/useDeviceManagement.ts
import { Alert } from 'react-native';
import { COMMON_LABELS, SECURITY_LABELS } from '@/constants/labels';
import { useCloseOtherSessions, useCloseSession, useDeviceSessions } from './useSecurity';

const { devices } = SECURITY_LABELS;

/** Sesiones activas y las acciones para cerrarlas. */
export function useDeviceManagement() {
  const { data, isLoading } = useDeviceSessions();
  const closeSession = useCloseSession();
  const closeOthers = useCloseOtherSessions();

  const sessions = data ?? [];

  const confirmCloseOthers = () =>
    Alert.alert(devices.closeOthersTitle, devices.closeOthersMessage, [
      { text: COMMON_LABELS.cancel, style: 'cancel' },
      { text: devices.closeOthers, style: 'destructive', onPress: () => closeOthers.mutate() },
    ]);

  return {
    sessions,
    isLoading,
    hasOtherSessions: sessions.some((session) => !session.isCurrent),
    close: (id: string) => closeSession.mutate(id),
    confirmCloseOthers,
    isBusy: closeSession.isPending || closeOthers.isPending,
    isError: closeSession.isError || closeOthers.isError,
  };
}
