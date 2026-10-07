// features/more/components/IpcpCard.tsx
import { ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MORE_LABELS } from '@/constants/labels';

// TODO: conectar a la pantalla del IPCP cuando exista; mientras tanto es solo informativa.
export function IpcpCard() {
  return (
    <View className="bg-brand-blue gap-4 rounded-3xl p-5 shadow-lg shadow-black/10">
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <ShieldCheck size={24} color="#77D1B5" />
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-body font-heading-semibold text-white">
            {MORE_LABELS.ipcp.title}
          </Text>
          <Text className="text-caption font-body text-white/70">
            {MORE_LABELS.ipcp.description}
          </Text>
        </View>
      </View>

      <View className="self-start rounded-full bg-white/15 px-3 py-1.5">
        <Text className="text-caption font-body-semibold text-white">{MORE_LABELS.comingSoon}</Text>
      </View>
    </View>
  );
}
