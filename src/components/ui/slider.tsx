import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cn } from '@/lib/utils';

export interface SliderProps {
  label: string;
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenValues?: number;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  orientation?: 'horizontal' | 'vertical';
  name?: string;
  disabled?: boolean;
  className?: string;
}

const SliderComponent: React.FC<SliderProps> = ({
  label,
  value,
  defaultValue = 50,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenValues,
  format,
  locale,
  orientation = 'horizontal',
  name,
  disabled,
  className,
}) => {
  const isRange = Array.isArray(value ?? defaultValue);

  return (
    <BaseSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      minStepsBetweenValues={minStepsBetweenValues}
      format={format}
      locale={locale}
      orientation={orientation}
      name={name}
      disabled={disabled}
      className={cn('flex flex-col gap-2 w-full', className)}
    >
      <div className="flex justify-between items-center font-label text-sm font-semibold text-on-surface">
        <BaseSlider.Label>{label}</BaseSlider.Label>
        <BaseSlider.Value className="text-on-surface-variant font-mono text-xs">
          {(formattedValues, values) =>
            formattedValues.length > 0
              ? formattedValues.join(' - ')
              : values.join(' - ')
          }
        </BaseSlider.Value>
      </div>
      <BaseSlider.Control className="relative flex items-center w-full h-8 touch-none select-none cursor-pointer">
        <BaseSlider.Track className="relative h-2 w-full rounded-full bg-surface-variant">
          <BaseSlider.Indicator className="h-full rounded-full bg-primary" />
          {isRange ? (
            <>
              <BaseSlider.Thumb
                index={0}
                aria-label="Minimum value"
                className="block w-5 h-5 rounded-full bg-primary border-2 border-surface shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-110 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] cursor-grab active:cursor-grabbing"
              />
              <BaseSlider.Thumb
                index={1}
                aria-label="Maximum value"
                className="block w-5 h-5 rounded-full bg-primary border-2 border-surface shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-110 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] cursor-grab active:cursor-grabbing"
              />
            </>
          ) : (
            <BaseSlider.Thumb
              aria-label={label}
              className="block w-5 h-5 rounded-full bg-primary border-2 border-surface shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-110 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] cursor-grab active:cursor-grabbing"
            />
          )}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
};

// Compound export mapping Base UI primitives
export const Slider = Object.assign(SliderComponent, {
  Root: BaseSlider.Root,
  Label: BaseSlider.Label,
  Value: BaseSlider.Value,
  Control: BaseSlider.Control,
  Track: BaseSlider.Track,
  Indicator: BaseSlider.Indicator,
  Thumb: BaseSlider.Thumb,
});

// Re-export Base UI primitives for compound composition
export { BaseSlider };
export const SliderRoot = BaseSlider.Root;
export const SliderLabel = BaseSlider.Label;
export const SliderValue = BaseSlider.Value;
export const SliderControl = BaseSlider.Control;
export const SliderTrack = BaseSlider.Track;
export const SliderIndicator = BaseSlider.Indicator;
export const SliderThumb = BaseSlider.Thumb;

