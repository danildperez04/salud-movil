// features/security/hooks/useBiometricSettings.ts
import type { SwitchRow } from '@/components/ui/switch-rows-card';
import { SECURITY_LABELS } from '@/constants/labels';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { useAppStore } from '@/store';
import type { SecurityPreferences } from '@/types/preferences';

const { biometric: labels } = SECURITY_LABELS;

const METHODS: { key: keyof SecurityPreferences; title: string; subtitle: string }[] = [
  { key: 'fingerprint', ...labels.fingerprint },
  { key: 'faceRecognition', ...labels.face },
  { key: 'pinFallback', ...labels.pin },
];

/**
 * Métodos de acceso rápido. Se guardan al confirmar.
 * TODO: pedir el desbloqueo con expo-local-authentication al abrir la app.
 */
export function useBiometricSettings() {
  const saved = useAppStore((state) => state.securityPreferences);
  const setSecurityPreferences = useAppStore((state) => state.setSecurityPreferences);
  const { draft, update, save } = useSettingsDraft(saved, setSecurityPreferences);

  const rows: SwitchRow[] = METHODS.map(({ key, title, subtitle }) => ({
    id: key,
    title,
    subtitle,
    checked: draft[key],
    onCheckedChange: (checked) => update(key, checked),
  }));

  return { rows, save };
}
