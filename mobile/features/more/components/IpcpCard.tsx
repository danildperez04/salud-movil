// features/more/components/IpcpCard.tsx
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ShieldCheck } from '@/lib/icons';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ipcpRoutes } from '@/features/ipcp/routes';

/** Acceso al IPCP desde "Más". */
export function IpcpCard() {
  const { t } = useTranslation('more');

  return (
    <Pressable
      onPress={() => router.push(ipcpRoutes.overview)}
      accessibilityRole="button"
      accessibilityLabel={`${t('ipcp.title')}. ${t('ipcp.cta')}`}
      className="bg-brand-blue gap-4 rounded-3xl p-5 shadow-lg shadow-black/10 active:opacity-90"
    >
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <ShieldCheck size={24} color="#77D1B5" />
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-body font-heading-semibold text-white">{t('ipcp.title')}</Text>
          <Text className="text-caption font-body text-white/70">{t('ipcp.description')}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1 self-start rounded-full bg-white/15 py-1.5 pr-2 pl-3">
        <Text className="text-caption font-body-semibold text-white">{t('ipcp.cta')}</Text>
        <ChevronRight size={14} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}
