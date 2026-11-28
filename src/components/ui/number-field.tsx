'use client';

/**
 * NumberField primitive (@base-ui/react/number-field).
 *
 * Base UI Documentation: https://base-ui.com/react/components/number-field
 *
 * TAXONOMY & USAGE:
 * - Use NumberField for numerical inputs with step buttons, keyboard scrubbing,
 *   wheel scrubbing, and localized formatting.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint.
 */
import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';
import { Icon } from './icon';

export type NumberFieldSize = 'sm' | 'md' | 'lg';

export interface NumberFieldProps extends BaseNumberField.Root.Props {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  /** Synchronizes control height with sibling Input/Button tiers: sm (44px), md (48px), lg (56px). */
  size?: NumberFieldSize;
}

const numberFieldSizeStyles: Record<NumberFieldSize, { group: string; button: string; input: string }> = {
  sm: { group: 'h-11 min-h-11', button: 'h-full w-11 min-w-11 shrink-0', input: 'h-full text-sm' },
  md: { group: 'h-12 min-h-12', button: 'h-full w-12 min-w-12 shrink-0', input: 'h-full text-base' },
  lg: { group: 'h-14 min-h-14', button: 'h-full w-14 min-w-14 shrink-0', input: 'h-full text-lg' },
};

const NumberFieldComponent = React.forwardRef<HTMLDivElement, NumberFieldProps>(({
  label,
  description,
  error,
  size = 'md',
  step = 1,
  smallStep = 0.1,
  largeStep = 10,
  allowOutOfRange = false,
  allowWheelScrub = false,
  snapOnStep = false,
  required,
  id,
  children,
  className,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const rootClassName = composeClassName('flex flex-col items-start gap-1.5 w-fit max-w-full', className);

  // Composable compound usage
  if (children) {
    return (
      <BaseNumberField.Root
        ref={ref}
        step={step}
        smallStep={smallStep}
        largeStep={largeStep}
        allowOutOfRange={allowOutOfRange}
        allowWheelScrub={allowWheelScrub}
        snapOnStep={snapOnStep}
        required={required}
        id={id}
        className={rootClassName}
        {...props}
      >
        {children}
      </BaseNumberField.Root>
    );
  }

  return (
    <BaseNumberField.Root
      ref={ref}
      step={step}
      smallStep={smallStep}
      largeStep={largeStep}
      allowOutOfRange={allowOutOfRange}
      allowWheelScrub={allowWheelScrub}
      snapOnStep={snapOnStep}
      required={required}
      id={inputId}
      className={rootClassName}
      {...props}
    >
      {label && (
        <label htmlFor={inputId} className="font-label text-sm font-semibold text-on-surface cursor-pointer flex items-center justify-between gap-2 w-full max-w-full">
          <span>{label}</span>
          {required && (
            <span className="text-sm text-on-surface-variant font-normal">(required)</span>
          )}
        </label>
      )}

      {description && (
        <span id={descriptionId} className="font-sans text-sm text-on-surface-variant max-w-full break-words">
          {description}
        </span>
      )}

      <BaseNumberField.Group
        data-slot="number-field-group"
        className={cn(
          'inline-flex w-fit max-w-full items-stretch rounded border bg-surface overflow-hidden',
          numberFieldSizeStyles[size].group,
          'transition-[border-color,box-shadow] motion-reduce:transition-none',
          error
            ? 'border-error focus-within:border-error has-[:focus-visible]:border-error has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-1 has-[:focus-visible]:outline-error'
            : 'border-outline hover:border-on-surface-variant/80 has-[:focus-visible]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-1 has-[:focus-visible]:outline-primary',
          'data-[disabled]:opacity-50 data-[disabled]:bg-surface-container-low data-[disabled]:pointer-events-none'
        )}
      >
        <BaseNumberField.Decrement
          data-slot="number-field-decrement"
          aria-label="Decrease value"
          className={cn(
            numberFieldSizeStyles[size].button,
            'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] motion-reduce:active:scale-100 transition-colors motion-reduce:transition-none disabled:opacity-40 data-[disabled]:opacity-40 border-e border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary forced-colors:border-[ButtonText] cursor-pointer select-none'
          )}
        >
          <Icon name="remove" size="sm" aria-hidden="true" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          data-slot="number-field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            numberFieldSizeStyles[size].input,
            'min-w-[4rem] w-20 max-w-full [field-sizing:content] px-2 text-center font-mono font-semibold text-on-surface tabular-nums bg-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0'
          )}
        />
        <BaseNumberField.Increment
          data-slot="number-field-increment"
          aria-label="Increase value"
          className={cn(
            numberFieldSizeStyles[size].button,
            'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] motion-reduce:active:scale-100 transition-colors motion-reduce:transition-none disabled:opacity-40 data-[disabled]:opacity-40 border-s border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary forced-colors:border-[ButtonText] cursor-pointer select-none'
          )}
        >
          <Icon name="add" size="sm" aria-hidden="true" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>

      {error && (
        <span id={errorId} className="flex items-center gap-1 font-sans text-sm font-semibold text-error select-none max-w-full break-words">
          <Icon name="error" size="sm" className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </span>
      )}
    </BaseNumberField.Root>
  );
});

NumberFieldComponent.displayName = 'NumberField';

export const NumberFieldRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Root
    ref={ref}
    data-slot="number-field"
    className={composeClassName('flex flex-col items-start gap-1.5 w-fit max-w-full', className)}
    {...props}
  />
));
NumberFieldRoot.displayName = 'NumberFieldRoot';

export const NumberFieldGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Group> & { size?: NumberFieldSize; error?: boolean }
>(({ className, size = 'md', error, ...props }, ref) => (
  <BaseNumberField.Group
    ref={ref}
    data-slot="number-field-group"
    className={composeClassName(
      cn(
        'inline-flex w-fit max-w-full items-stretch rounded border bg-surface overflow-hidden',
        numberFieldSizeStyles[size].group,
        'transition-[border-color,box-shadow] motion-reduce:transition-none',
        error
          ? 'border-error focus-within:border-error has-[:focus-visible]:border-error has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-1 has-[:focus-visible]:outline-error'
          : 'border-outline hover:border-on-surface-variant/80 has-[:focus-visible]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-1 has-[:focus-visible]:outline-primary',
        'data-[disabled]:opacity-50 data-[disabled]:bg-surface-container-low data-[disabled]:pointer-events-none'
      ),
      className
    )}
    {...props}
  />
));
NumberFieldGroup.displayName = 'NumberFieldGroup';

export const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Input> & { inputSize?: NumberFieldSize }
>(({ className, inputSize = 'md', ...props }, ref) => (
  <BaseNumberField.Input
    ref={ref}
    data-slot="number-field-input"
    className={composeClassName(
      cn(
        numberFieldSizeStyles[inputSize].input,
        'min-w-[4rem] w-20 max-w-full [field-sizing:content] px-2 text-center font-mono font-semibold text-on-surface tabular-nums bg-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0'
      ),
      className
    )}
    {...props}
  />
));
NumberFieldInput.displayName = 'NumberFieldInput';

export const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Decrement> & { size?: NumberFieldSize }
>(({ className, size = 'md', children, render, nativeButton, 'aria-label': ariaLabel = 'Decrease value', ...props }, ref) => (
  <BaseNumberField.Decrement
    ref={ref}
    data-slot="number-field-decrement"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    aria-label={ariaLabel}
    className={
      render
        ? className
        : composeClassName(
            cn(
              numberFieldSizeStyles[size].button,
              'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] motion-reduce:active:scale-100 transition-colors motion-reduce:transition-none disabled:opacity-40 data-[disabled]:opacity-40 border-e border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary forced-colors:border-[ButtonText] cursor-pointer select-none'
            ),
            className
          )
    }
    {...props}
  >
    {children !== undefined ? (
      children
    ) : render ? undefined : (
      <Icon name="remove" size="sm" aria-hidden="true" />
    )}
  </BaseNumberField.Decrement>
));
NumberFieldDecrement.displayName = 'NumberFieldDecrement';

export const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Increment> & { size?: NumberFieldSize }
>(({ className, size = 'md', children, render, nativeButton, 'aria-label': ariaLabel = 'Increase value', ...props }, ref) => (
  <BaseNumberField.Increment
    ref={ref}
    data-slot="number-field-increment"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    aria-label={ariaLabel}
    className={
      render
        ? className
        : composeClassName(
            cn(
              numberFieldSizeStyles[size].button,
              'flex items-center justify-center text-on-surface-variant hover:bg-state-hover hover:text-on-surface active:bg-surface-container-high active:scale-[0.96] motion-reduce:active:scale-100 transition-colors motion-reduce:transition-none disabled:opacity-40 data-[disabled]:opacity-40 border-s border-outline-variant focus-visible:outline-none focus-visible:bg-surface-container-low focus-visible:text-primary forced-colors:border-[ButtonText] cursor-pointer select-none'
            ),
            className
          )
    }
    {...props}
  >
    {children !== undefined ? (
      children
    ) : render ? undefined : (
      <Icon name="add" size="sm" aria-hidden="true" />
    )}
  </BaseNumberField.Increment>
));
NumberFieldIncrement.displayName = 'NumberFieldIncrement';

export const NumberFieldScrubArea = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.ScrubArea>
>(({ className, ...props }, ref) => (
  <BaseNumberField.ScrubArea
    ref={ref}
    data-slot="number-field-scrub-area"
    className={composeClassName('cursor-ew-resize select-none', className)}
    {...props}
  />
));
NumberFieldScrubArea.displayName = 'NumberFieldScrubArea';

export const NumberFieldScrubAreaCursor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.ScrubAreaCursor>
>(({ className, children, ...props }, ref) => (
  <BaseNumberField.ScrubAreaCursor
    ref={ref}
    data-slot="number-field-scrub-area-cursor"
    className={composeClassName('drop-shadow-sm text-on-surface', className)}
    {...props}
  >
    {children ?? (
      <svg
        width="26"
        height="14"
        viewBox="0 0 26 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M19.5 5.5L23.5 7L19.5 8.5M6.5 5.5L2.5 7L6.5 8.5M4 7H22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </BaseNumberField.ScrubAreaCursor>
));
NumberFieldScrubAreaCursor.displayName = 'NumberFieldScrubAreaCursor';

// Compound export mapping Base UI primitives
export const NumberField = Object.assign(NumberFieldComponent, {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
});

// Re-export Base UI primitives for compound composition
export { BaseNumberField };
export const NumberFieldScrubAreaCursorPrimitive = BaseNumberField.ScrubAreaCursor;

export default NumberField;
