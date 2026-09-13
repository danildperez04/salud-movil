import type { ElementType, ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type FadeInOnScrollProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function FadeInOnScroll({
  children,
  className = '',
  as: Tag = 'div',
}: FadeInOnScrollProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}