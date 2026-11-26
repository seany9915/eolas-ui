'use client';

/**
 * Meter primitive (@base-ui/react/meter).
 *
 * Base UI Documentation: https://base-ui.com/react/components/meter
 *
 * TAXONOMY & USAGE:
 * - Displays a graphical meter representing a scalar value within a known range (e.g. disk space, battery level, audio volume).
 * - For task progress towards completion, use Progress instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, semantic tokens, and motion restraint.
 */
import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cn, composeClassName } from '@/lib/utils';

export interface MeterProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseMeter.Root>, 'value' | 'children'> {
  value: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';
}

const colorRoleClasses: Record<'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success', string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary border border-outline',
  warning: 'bg-warning',
  error: 'bg-error',
  success: 'bg-success',
};

const MeterContext = React.createContext<{ colorRole: NonNullable<MeterProps['colorRole']> }>({
  colorRole: 'primary',
});

export const MeterRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMeter.Root> & {
    colorRole?: MeterProps['colorRole'];
  }
>(({ className, colorRole = 'primary', ...props }, ref) => {
  const meterContextValue = React.useMemo(() => ({ colorRole }), [colorRole]);

  return (
    <MeterContext.Provider value={meterContextValue}>
      <BaseMeter.Root
        ref={ref}
        data-slot="meter"
        className={composeClassName('flex flex-col gap-1.5 w-full', className)}
        {...props}
      />
    </MeterContext.Provider>
  );
});
MeterRoot.displayName = 'MeterRoot';

export const MeterLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseMeter.Label>
>(({ className, ...props }, ref) => (
  <BaseMeter.Label
    ref={ref}
    data-slot="meter-label"
    className={composeClassName('font-label text-sm font-semibold text-on-surface', className)}
    {...props}
  />
));
MeterLabel.displayName = 'MeterLabel';

export const MeterValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseMeter.Value>
>(({ className, ...props }, ref) => (
  <BaseMeter.Value
    ref={ref}
    data-slot="meter-value"
    className={composeClassName('font-mono text-sm font-bold text-on-surface tabular-nums', className)}
    {...props}
  />
));
MeterValue.displayName = 'MeterValue';

export const MeterTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMeter.Track>
>(({ className, ...props }, ref) => (
  <BaseMeter.Track
    ref={ref}
    data-slot="meter-track"
    className={composeClassName(
      'w-full h-3 rounded-full bg-surface-container-high overflow-hidden relative border border-outline-variant',
      className
    )}
    {...props}
  />
));
MeterTrack.displayName = 'MeterTrack';

export const MeterIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMeter.Indicator> & {
    colorRole?: MeterProps['colorRole'];
  }
>(({ className, colorRole: colorRoleProp, ...props }, ref) => {
  const { colorRole: contextColorRole } = React.useContext(MeterContext);
  const resolvedRole = colorRoleProp ?? contextColorRole;
  return (
    <BaseMeter.Indicator
      ref={ref}
      data-slot="meter-indicator"
      className={composeClassName(
        cn(
          'h-full transition-[width] duration-[var(--duration-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none forced-colors:bg-[Highlight]',
          colorRoleClasses[resolvedRole]
        ),
        className
      )}
      {...props}
    />
  );
});
MeterIndicator.displayName = 'MeterIndicator';

const MeterComponent = React.forwardRef<HTMLDivElement, MeterProps>(({
  value,
  min = 0,
  max = 100,
  label,
  description,
  format,
  locale,
  'aria-valuetext': ariaValueText,
  getAriaValueText,
  children,
  className,
  colorRole = 'primary',
  ...props
}, ref) => {
  // Composable compound usage
  if (children) {
    return (
      <MeterRoot
        ref={ref}
        value={value}
        min={min}
        max={max}
        format={format}
        locale={locale}
        colorRole={colorRole}
        {...(ariaValueText !== undefined ? { 'aria-valuetext': ariaValueText } : {})}
        getAriaValueText={getAriaValueText}
        className={className}
        {...props}
      >
        {children}
      </MeterRoot>
    );
  }

  return (
    <MeterRoot
      ref={ref}
      value={value}
      min={min}
      max={max}
      format={format}
      locale={locale}
      colorRole={colorRole}
      {...(ariaValueText !== undefined ? { 'aria-valuetext': ariaValueText } : {})}
      getAriaValueText={getAriaValueText}
      className={className}
      {...props}
    >
      {(label || value !== undefined) && (
        <div className="flex items-center justify-between font-label text-sm font-semibold text-on-surface">
          {label && <MeterLabel>{label}</MeterLabel>}
          <MeterValue>
            {(formattedValue, val) => {
              if (formattedValue) return formattedValue;
              const pct = max === min ? 0 : Math.round(((val - min) / (max - min)) * 100);
              return `${pct}%`;
            }}
          </MeterValue>
        </div>
      )}
      {description && (
        <span className="font-sans text-sm text-on-surface-variant block">
          {description}
        </span>
      )}
      <MeterTrack>
        <MeterIndicator colorRole={colorRole} />
      </MeterTrack>
    </MeterRoot>
  );
});

MeterComponent.displayName = 'Meter';

// Compound export mapping Base UI primitives
export const Meter = Object.assign(MeterComponent, {
  Root: MeterRoot,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  Value: MeterValue,
  Label: MeterLabel,
});

// Re-export Base UI primitives for compound composition
export { BaseMeter };

export default Meter;
