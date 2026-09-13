// components/ui/spinner.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('items-center justify-center', {
  variants: {
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const sizeMap = {
  sm: 'small',
  default: 'small',
  lg: 'large',
} as const;

type SpinnerProps = ViewProps &
  VariantProps<typeof spinnerVariants> & {
    color?: string;
  };

function Spinner({ className, size = 'default', color, ...props }: SpinnerProps) {
  return (
    <View className={cn(spinnerVariants({ size }), className)} {...props}>
      <ActivityIndicator size={sizeMap[size ?? 'default']} color={color ?? '#2DB79A'} />
    </View>
  );
}

export { Spinner };
