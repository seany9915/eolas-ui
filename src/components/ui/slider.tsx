'use client';

/**
 * Slider primitive (@base-ui/react/slider).
 *
 * Base UI Documentation: https://base-ui.com/react/components/slider
 *
 * TAXONOMY & USAGE:
 * - Allows users to make selections from a range of values along a horizontal or vertical track.
 * - Supports single-value or multi-thumb range selections with collision behaviors ('push', 'swap', 'none').
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant touch targets, and motion restraint.
 */
import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { composeClassName } from '@/lib/utils';

export interface SliderProps<Value extends number | readonly number[] = number | readonly number[]>
  extends Omit<
    BaseSlider.Root.Props<Value>,
    'value' | 'defaultValue' | 'onValueChange' | 'onValueCommitted'
  > {
  label?: React.ReactNode;
  description?: React.ReactNode;
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (
    value: Value extends number ? number : Value,
    eventDetails: BaseSlider.Root.ChangeEventDetails
  ) => void;
  onValueCommitted?: (
    value: Value extends number ? number : Value,
    eventDetails: BaseSlider.Root.CommitEventDetails
  ) => void;
}

const SLIDER_ROOT_BASE_CLASS =
  'flex flex-col gap-2 w-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40';

function SliderComponentInner<Value extends number | readonly number[] = number | readonly number[]>(
  {
    label,
    description,
    value,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenValues,
    thumbCollisionBehavior,
    format,
    locale,
    orientation = 'horizontal',
    name,
    disabled,
    children,
    className,
    ...props
  }: SliderProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const rangeValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : null;
  const isRange = rangeValues !== null;
  const thumbCount = rangeValues ? rangeValues.length : 1;
  const effectiveDefaultValue = value === undefined ? defaultValue : undefined;
  const effectiveMinSteps = minStepsBetweenValues ?? (isRange ? 1 : 0);
  const effectiveCollision = thumbCollisionBehavior ?? (isRange ? 'none' : 'push');
  const labelText = typeof label === 'string' && label.trim() ? label.trim() : undefined;
  const rootClassName = composeClassName(SLIDER_ROOT_BASE_CLASS, className);

  // Composable compound usage
  if (children) {
    return (
      <BaseSlider.Root<Value>
        ref={ref}
        data-slot="slider"
        value={value}
        defaultValue={effectiveDefaultValue}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        min={min}
        max={max}
        step={step}
        minStepsBetweenValues={effectiveMinSteps}
        thumbCollisionBehavior={effectiveCollision}
        format={format}
        locale={locale}
        orientation={orientation}
        name={name}
        disabled={disabled}
        className={rootClassName}
        {...props}
      >
        {children}
      </BaseSlider.Root>
    );
  }

  return (
    <BaseSlider.Root<Value>
      ref={ref}
      data-slot="slider"
      value={value}
      defaultValue={effectiveDefaultValue}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      min={min}
      max={max}
      step={step}
      minStepsBetweenValues={effectiveMinSteps}
      thumbCollisionBehavior={effectiveCollision}
      format={format}
      locale={locale}
      orientation={orientation}
      name={name}
      disabled={disabled}
      className={rootClassName}
      {...props}
    >
      {(label || value !== undefined) && (
        <div className="flex justify-between items-center font-label text-sm font-semibold text-on-surface">
          {label && <BaseSlider.Label>{label}</BaseSlider.Label>}
          <BaseSlider.Value className="text-on-surface-variant font-mono text-sm font-medium tabular-nums">
            {(formattedValues, values) =>
              formattedValues.length > 0
                ? formattedValues.join(' - ')
                : values.join(' - ')
            }
          </BaseSlider.Value>
        </div>
      )}

      {description && (
        <span className="font-sans text-sm text-on-surface-variant">
          {description}
        </span>
      )}

      <BaseSlider.Control data-slot="slider-control" className="relative flex items-center w-full h-11 touch-none select-none cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=vertical]:justify-center data-[orientation=vertical]:w-11 data-[orientation=vertical]:h-full">
        <BaseSlider.Track data-slot="slider-track" className="relative h-2 w-full rounded-full bg-surface-container-high border border-outline data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
          <BaseSlider.Indicator data-slot="slider-range" className="rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
          {isRange ? (
            Array.from({ length: thumbCount }, (_, thumbIndex) => (
              <BaseSlider.Thumb
                key={thumbIndex}
                data-slot="slider-thumb"
                index={thumbIndex}
                aria-label={
                  thumbCount === 2
                    ? thumbIndex === 0
                      ? labelText
                        ? `${labelText} minimum`
                        : 'Minimum value'
                      : labelText
                        ? `${labelText} maximum`
                        : 'Maximum value'
                    : labelText
                      ? `${labelText} thumb ${thumbIndex + 1}`
                      : `Slider value ${thumbIndex + 1}`
                }
                className="relative block size-5 rounded-full border-2 border-on-primary bg-primary shadow-ambient hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary cursor-pointer after:absolute after:-inset-3 after:content-[''] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
              />
            ))
          ) : (
            <BaseSlider.Thumb
              data-slot="slider-thumb"
              aria-label={labelText ?? 'Slider value'}
              className="relative block size-5 rounded-full border-2 border-on-primary bg-primary shadow-ambient hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary cursor-pointer after:absolute after:-inset-3 after:content-[''] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            />
          )}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

const SliderComponent = React.forwardRef(SliderComponentInner) as (<
  Value extends number | readonly number[] = number | readonly number[]
>(
  props: SliderProps<Value> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
SliderComponent.displayName = 'Slider';

export const SliderControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Control>
>((props, ref) => <BaseSlider.Control ref={ref} data-slot="slider-control" {...props} />);
SliderControl.displayName = 'SliderControl';

export const SliderTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Track>
>((props, ref) => <BaseSlider.Track ref={ref} data-slot="slider-track" {...props} />);
SliderTrack.displayName = 'SliderTrack';

export const SliderIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Indicator>
>((props, ref) => <BaseSlider.Indicator ref={ref} data-slot="slider-range" {...props} />);
SliderIndicator.displayName = 'SliderIndicator';

export const SliderThumb = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Thumb>
>((props, ref) => <BaseSlider.Thumb ref={ref} data-slot="slider-thumb" {...props} />);
SliderThumb.displayName = 'SliderThumb';

// Compound export mapping Base UI primitives
export const Slider = Object.assign(SliderComponent, {
  Root: BaseSlider.Root,
  Label: BaseSlider.Label,
  Value: BaseSlider.Value,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
});

// Re-export Base UI primitives for compound composition
export { BaseSlider };
export const SliderRoot = BaseSlider.Root;
export const SliderLabel = BaseSlider.Label;
export const SliderValue = BaseSlider.Value;

export default Slider;
