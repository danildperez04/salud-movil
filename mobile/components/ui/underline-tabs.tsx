// components/ui/underline-tabs.tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type UnderlineTabOption<T extends string> = { value: T; label: string };

type UnderlineTabsProps<T extends string> = {
  options: readonly UnderlineTabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

/**
 * Pestañas con subrayado, a ancho completo. Solo dibuja la barra: el contenido
 * lo decide quien la usa según `value`.
 */
export function UnderlineTabs<T extends string>({
  options,
  value,
  onValueChange,
}: UnderlineTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as T)}>
      <TabsList className="gap-0 px-6">
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className="flex-1">
            <Text
              className={cn(
                'text-body font-heading-semibold',
                value === option.value ? 'text-primary' : 'text-secondary-steel',
              )}
            >
              {option.label}
            </Text>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
