// features/ipcp/components/DriversCard.tsx
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { IPCP_LABELS } from '@/constants/labels';
import { statusColors } from '@/lib/tokens';
import type { IpcpDriver, IpcpTrend } from '../domain/ipcp-model';
import { DRIVER_ICONS, withAlpha } from './ipcp-visuals';

const labels = IPCP_LABELS.result;

function describeDriver(driver: IpcpDriver): string {
  switch (driver.code) {
    case 'criticalReading':
      return labels.drivers.criticalReading(labels.indicators[driver.indicator]);
    case 'elevatedReadings':
      return labels.drivers.elevatedReadings(labels.indicators[driver.indicator]);
    case 'lowAdherence':
      return labels.drivers.lowAdherence(Math.round(driver.rate * 100));
    case 'worseningTrend':
      return labels.drivers.worseningTrend(labels.indicators[driver.indicator]);
    case 'monitoringLapse':
      return driver.days === null
        ? labels.drivers.neverRecorded(labels.indicators[driver.indicator])
        : labels.drivers.monitoringLapse(driver.days, labels.indicators[driver.indicator]);
    case 'missedAppointments':
      return labels.drivers.missedAppointments(driver.count);
  }
}

type DriversCardProps = {
  drivers: IpcpDriver[];
  trend: IpcpTrend;
  /** 0-1: parte de la información posible con la que se calculó */
  coverage: number;
};

/** Por qué el IPCP dio ese resultado: los motivos, la tendencia y qué tan completos son los datos. */
export function DriversCard({ drivers, trend, coverage }: DriversCardProps) {
  return (
    <View className="bg-card border-border gap-4 rounded-3xl border p-5 shadow-lg shadow-black/5">
      <Text role="heading" className="text-body font-heading-semibold text-foreground">
        {labels.driversTitle}
      </Text>

      {drivers.length === 0 ? (
        <Text className="text-small font-body text-muted-foreground">{labels.noDrivers}</Text>
      ) : (
        <View className="gap-3">
          {drivers.map((driver, index) => {
            const Icon = DRIVER_ICONS[driver.code];
            const color =
              driver.code === 'criticalReading' ? statusColors.danger : statusColors.warning;
            return (
              <View
                key={`${driver.code}:${index}`}
                className="bg-background border-border flex-row items-center gap-4 rounded-2xl border p-3"
              >
                <View
                  className="h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: withAlpha(color, '1A') }}
                >
                  <Icon size={20} color={color} />
                </View>
                <Text className="text-small font-body-medium text-foreground flex-1">
                  {describeDriver(driver)}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {trend !== 'unknown' && (
        <Text className="text-small font-body text-muted-foreground">{labels.trend[trend]}</Text>
      )}

      {coverage < 1 && (
        <Text className="text-caption font-body text-muted-foreground">
          {labels.coverage(Math.round(coverage * 100))}
        </Text>
      )}
    </View>
  );
}
