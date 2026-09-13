import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  value?: string;
}

const ToggleComponent: React.FC<ToggleProps> = ({
  pressed,
  defaultPressed,
  onPressedChange,
  ariaLabel,
  children,
  disabled,
  className,
  value,
}) => {
  return (
    <BaseToggle
      value={value}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center h-12 px-4 min-h-[48px] rounded-[0.5rem] font-label text-sm font-semibold transition-colors cursor-pointer select-none',
        'border-[1px] border-outline bg-surface text-on-surface hover:bg-surface-container',
        'data-[pressed]:bg-primary data-[pressed]:border-primary data-[pressed]:text-on-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </BaseToggle>
  );
};

// Compound export mapping Base UI primitives
export const Toggle = Object.assign(ToggleComponent, {
  Root: BaseToggle,
});

export { BaseToggle };
export const ToggleRoot = BaseToggle;
