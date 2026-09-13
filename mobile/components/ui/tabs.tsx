import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import { Platform } from 'react-native';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col', className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'border-border w-full flex-row items-center justify-center gap-8 border-b',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext();
  const isActive = props.value === value;

  return (
    <TextClassContext.Provider
      value={cn(
        'text-body font-body text-muted-foreground',
        isActive && 'font-heading-medium text-primary',
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          'flex-row items-center justify-center gap-1.5 border-b-2 border-transparent pb-3',
          isActive && 'border-primary',
          Platform.select({
            web: 'cursor-default whitespace-nowrap transition-colors focus-visible:outline-1 disabled:pointer-events-none',
          }),
          props.disabled && 'opacity-50',
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(Platform.select({ web: 'flex-1 outline-none' }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
