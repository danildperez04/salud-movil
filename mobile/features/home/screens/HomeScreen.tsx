// features/home/screens/HomeScreen.tsx
import { router } from 'expo-router';
import { Bell, Calendar, FileText, LineChart, Pill } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Text } from '@/components/ui/text';
import { HOME_LABELS } from '@/constants/labels';
import { HealthIndicatorCard } from '@/features/health-indicators/components/HealthIndicatorCard';
import { useAppStore } from '@/store';
import { QuickActionCard } from '../components/QuickActionCard';

export default function HomeScreen() {
  const user = useAppStore((state) => state.user);
  const firstName = user?.name?.split(' ')[0] ?? '';

  const today = new Date()
    .toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-14 px-6 pt-4 pb-10">
      <View className="mx-4 mt-8 flex-row items-start justify-between">
        <View className="h-11 flex-1 gap-0.5">
          <Text className="text-h3 font-heading">
            {HOME_LABELS.greetingPrefix} {firstName} 👋
          </Text>
          <Text className="text-small text-secondary">{today}</Text>
        </View>
        {/* TODO: conectar a notificaciones reales cuando exista ese módulo */}
        <Pressable className="border-border h-11 w-11 items-center justify-center rounded-full border">
          <Bell size={18} color="#2DB79A" />
        </Pressable>
      </View>
      <View className="bg-card flex-row items-center justify-between rounded-3xl p-5 shadow-lg shadow-black/5">
        <View className="flex-1 gap-1.5 pr-5">
          <Text className="text-small font-body text-muted-foreground">
            {HOME_LABELS.statusTitle}
          </Text>
          <Text className="text-body font-heading-medium text-foreground">
            {HOME_LABELS.statusHeadline}
          </Text>
          <Text className="text-small font-body text-primary">{HOME_LABELS.statusSubtitle}</Text>
        </View>
        <CircularProgress value={75} size={72} strokeWidth={7}>
          <Text className="text-body font-heading-semibold text-foreground">75%</Text>
        </CircularProgress>
      </View>

      <View className="gap-4">
        <View className="flex-row gap-4">
          <QuickActionCard
            icon={Calendar}
            title={HOME_LABELS.quickActions.appointments.title}
            subtitle={HOME_LABELS.quickActions.appointments.subtitle}
            onPress={() => router.push('/(app)/(tabs)/appointments')}
          />
          <QuickActionCard
            icon={Pill}
            title={HOME_LABELS.quickActions.medications.title}
            subtitle={HOME_LABELS.quickActions.medications.subtitle}
            onPress={() => router.push('/(app)/(tabs)/medications')}
          />
        </View>
        <View className="flex-row gap-4">
          <QuickActionCard
            icon={LineChart}
            title={HOME_LABELS.quickActions.indicators.title}
            subtitle={HOME_LABELS.quickActions.indicators.subtitle}
            onPress={() => router.push('/(app)/health-indicators')}
          />
          <QuickActionCard
            icon={FileText}
            title={HOME_LABELS.quickActions.medicalRecord.title}
            subtitle={HOME_LABELS.quickActions.medicalRecord.subtitle}
            onPress={() => router.push('/(app)/medical-record')}
          />
        </View>
      </View>

      {/* TODO: reemplazar por el indicador más reciente real cuando
          health-indicators tenga controlador/servicio en el backend */}
      <HealthIndicatorCard typeName="Glucose" value={110} unit="mg/dL" status="normal" />
    </ScrollView>
  );
}
