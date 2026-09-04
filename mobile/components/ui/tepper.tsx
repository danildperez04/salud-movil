// components/ui/stepper.tsx
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type StepperStep = {
  label: string;
};

type StepperProps = {
  steps: StepperStep[];
  /** índice del paso activo, 0-based */
  currentStep: number;
  className?: string;
};

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <View className={cn('w-full', className)}>
      <View className="flex-row items-center">
        {steps.map((_, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <View
                className={cn(
                  'h-8 w-8 items-center justify-center rounded-full',
                  isCompleted || isActive ? 'bg-primary' : 'bg-muted',
                )}
              >
                <Text
                  className={cn(
                    'text-small font-heading-semibold',
                    isCompleted || isActive ? 'text-primary-foreground' : 'text-muted-foreground',
                  )}
                >
                  {index + 1}
                </Text>
              </View>
              {!isLast && (
                <View className={cn('h-0.5 flex-1', isCompleted ? 'bg-primary' : 'bg-muted')} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View className="mt-2 flex-row justify-between">
        {steps.map((step, index) => (
          <Text
            key={index}
            className={cn(
              'text-caption font-body',
              index === currentStep ? 'text-primary font-body-semibold' : 'text-muted-foreground',
            )}
          >
            {step.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export { Stepper };
