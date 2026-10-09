// features/notifications/hooks/useNotificationSettings.ts
import type { SwitchRow } from '@/components/ui/switch-rows-card';
import { NOTIFICATION_SETTINGS_LABELS } from '@/constants/labels';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { useAppStore } from '@/store';
import type { NotificationPreferences } from '@/types/preferences';

const labels = NOTIFICATION_SETTINGS_LABELS;

const CATEGORIES: { key: keyof NotificationPreferences; title: string; subtitle: string }[] = [
  { key: 'medications', ...labels.medications },
  { key: 'appointments', ...labels.appointments },
  { key: 'indicators', ...labels.indicators },
  { key: 'news', ...labels.news },
];

/**
 * Qué avisos quiere recibir el usuario. Se guarda al confirmar.
 * TODO: sincronizar con el backend y con las notificaciones locales.
 */
export function useNotificationSettings() {
  const saved = useAppStore((state) => state.notificationPreferences);
  const setNotificationPreferences = useAppStore((state) => state.setNotificationPreferences);
  const { draft, update, save } = useSettingsDraft(saved, setNotificationPreferences);

  const rows: SwitchRow[] = CATEGORIES.map(({ key, title, subtitle }) => ({
    id: key,
    title,
    subtitle,
    checked: draft[key],
    onCheckedChange: (checked) => update(key, checked),
  }));

  return { rows, save };
}
