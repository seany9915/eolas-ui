'use client';

/**
 * OTPField primitive (@base-ui/react/otp-field).
 *
 * Base UI Documentation: https://base-ui.com/react/components/otp-field
 *
 * TAXONOMY & USAGE:
 * - Use OTPField for one-time passcode inputs, verification pins, and multi-digit authentication codes.
 * - Supports automatic focus advancement, paste distribution, character masking, and validation types.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint.
 */
import * as React from 'react';
import { flushSync } from 'react-dom';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { Field as BaseField } from '@base-ui/react/field';
import { cn, composeClassName } from '@/lib/utils';
import { useWebOtp } from '@/lib/use-web-otp';
import { Icon } from './icon';

export type OTPFieldSize = 'sm' | 'md' | 'lg';

export interface OTPFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseOTPField.Root>, 'onChange' | 'length'> {
  id?: string;
  center?: boolean;
  size?: OTPFieldSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails?: BaseOTPField.Root.ChangeEventDetails) => void;
  /**
   * Callback fired when all OTP slots are complete.
   * Alias for Base UI's official `onValueComplete`.
   */
  onComplete?: (code: string, eventDetails?: BaseOTPField.Root.CompleteEventDetails) => void;
  /**
   * Official Base UI callback fired when all OTP slots are complete.
   */
  onValueComplete?: (value: string, eventDetails?: BaseOTPField.Root.CompleteEventDetails) => void;
  /**
   * Callback fired when entered text contains characters rejected by validation or normalization.
   */
  onValueInvalid?: (value: string, eventDetails: BaseOTPField.Root.InvalidEventDetails) => void;
  /**
   * Normalization function running before validation filtering.
   */
  normalizeValue?: (value: string) => string;
  name?: string;
  form?: string;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  autoSubmit?: boolean;
  mask?: boolean;
  validationType?: BaseOTPField.Root.ValidationType;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  pattern?: string;
  showSeparator?: boolean;
  separatorIndex?: number;
  /** Whether to listen for and auto-fill incoming SMS OTPs via the WebOTP API on supported mobile browsers */
  autoExtractSmsOtp?: boolean;
  containerRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
}

const OTP_PATTERNS: Record<string, RegExp | undefined> = {
  numeric: /^\d+$/,
  alpha: /^[\p{L}]+$/u,
  alphanumeric: /^[\p{L}\d]+$/u,
};

function assignRef<T>(target: React.Ref<T> | undefined, value: T | null) {
  if (typeof target === 'function') {
    target(value);
  } else if (target && typeof target === 'object') {
    (target as React.MutableRefObject<T | null>).current = value;
  }
}

const otpSizeClasses: Record<OTPFieldSize, { single: string; wide: string }> = {
  sm: { single: 'w-10 min-w-10 h-11 min-h-[44px] text-lg', wide: '@md:w-11 @sm:w-11' },
  md: { single: 'w-10 min-w-10 h-12 min-h-[48px] text-xl', wide: '' },
  lg: { single: 'w-12 min-w-12 h-14 min-h-[56px] text-2xl', wide: '@md:w-14 @sm:w-14' },
};

const OTPFieldComponent = React.forwardRef<HTMLDivElement, OTPFieldProps>(({
  id,
  center = false,
  size = 'md',
  label,
  description,
  error,
  length = 6,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  onValueComplete,
  onValueInvalid,
  normalizeValue,
  name,
  form,
  required,
  readOnly,
  autoFocus,
  disabled,
  autoSubmit,
  mask,
  validationType = 'numeric',
  inputMode,
  autoComplete = 'one-time-code',
  pattern,
  showSeparator = false,
  separatorIndex,
  autoExtractSmsOtp,
  containerRef,
  children,
  className,
  ...props
}, ref) => {
  const sepIndex = separatorIndex ?? Math.floor(length / 2);
  const hasFieldWrapper = Boolean(label || description || error);
  const isClassNameFn = typeof className === 'function';
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const mergedRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const currentValue = value ?? internalValue;
  const isComplete = currentValue.length >= length;

  const handleValueChange = React.useCallback(
    (nextVal: string, eventDetails?: BaseOTPField.Root.ChangeEventDetails) => {
      if (value === undefined) {
        setInternalValue(nextVal);
      }
      onValueChange?.(nextVal, eventDetails);
    },
    [value, onValueChange]
  );

  const handleValueComplete = React.useCallback(
    (val: string, eventDetails?: BaseOTPField.Root.CompleteEventDetails) => {
      if (value === undefined) {
        setInternalValue(val);
      }
      onComplete?.(val, eventDetails);
      onValueComplete?.(val, eventDetails);
    },
    [value, onComplete, onValueComplete]
  );

  useWebOtp({
    enabled: Boolean(autoExtractSmsOtp && !disabled && !readOnly && !isComplete),
    onCodeReceived: (receivedCode) => {
      const stripped = receivedCode.replace(/\s/g, '');
      const normalized = normalizeValue ? normalizeValue(stripped) : stripped;
      const otpPattern = OTP_PATTERNS[validationType];
      if (normalized.length !== length || (otpPattern && !otpPattern.test(normalized))) return;

      // Deliver received SMS OTP through the first slot input so Base UI runs its native
      // uncontrolled/controlled pipeline (onValueChange, onValueComplete) without
      // forcing controlled mode, flushing synchronously before requestSubmit().
      const firstInput = rootRef.current?.querySelector<HTMLInputElement>('input');
      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )?.set;
      if (firstInput && nativeValueSetter) {
        flushSync(() => {
          nativeValueSetter.call(firstInput, normalized);
          firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
        if (autoSubmit) {
          firstInput.form?.requestSubmit();
        }
        return;
      }

      flushSync(() => {
        handleValueChange(normalized);
        handleValueComplete(normalized);
      });
      if (autoSubmit) {
        firstInput?.form?.requestSubmit();
      }
    },
  });

  const sizeConfig = otpSizeClasses[size] || otpSizeClasses.md;
  const responsiveWidthClass = size === 'md' ? (length > 6 ? '@md:w-12' : '@sm:w-12') : sizeConfig.wide;

  const otpRoot = (
    <BaseOTPField.Root
      ref={mergedRootRef}
      id={id}
      length={length}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      onValueComplete={handleValueComplete}
      onValueInvalid={onValueInvalid}
      normalizeValue={normalizeValue}
      name={name}
      form={form}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      autoSubmit={autoSubmit}
      mask={mask}
      validationType={validationType}
      inputMode={inputMode}
      autoComplete={autoComplete}
      aria-label={!label && hasFieldWrapper ? 'One-time passcode' : undefined}
      className={composeClassName(
        cn(
          'flex flex-wrap max-w-full gap-1 @xs:gap-1.5 @sm:gap-2 items-center',
          center ? 'justify-center' : 'justify-start'
        ),
        !hasFieldWrapper || isClassNameFn ? className : undefined
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        Array.from({ length }, (_, idx) => (
          <React.Fragment key={idx}>
            {showSeparator && idx === sepIndex && (
              <BaseOTPField.Separator
                className="text-on-surface-variant/60 flex items-center justify-center font-bold px-0.5 select-none"
                aria-hidden="true"
              >
                –
              </BaseOTPField.Separator>
            )}
            <BaseOTPField.Input
              pattern={pattern}
              autoFocus={idx === 0 ? autoFocus : undefined}
              aria-label={idx === 0 ? undefined : `Character ${idx + 1} of ${length}`}
              className={cn(
                'text-center font-mono font-bold tabular-nums rounded shrink-0',
                sizeConfig.single,
                responsiveWidthClass,
                'border bg-surface text-on-surface transition-[border-color,box-shadow] motion-reduce:transition-none',
                error
                  ? 'border-error focus-visible:border-error focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-error'
                  : 'border-outline hover:border-on-surface-variant/80 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
                'disabled:bg-surface-container-low disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
                'data-[invalid]:border-error data-[invalid]:focus-visible:border-error data-[invalid]:focus-visible:outline-error'
              )}
            />
          </React.Fragment>
        ))
      )}
    </BaseOTPField.Root>
  );

  if (!hasFieldWrapper) {
    return (
      <div ref={containerRef} data-slot="otp-field-container" className="@container w-full max-w-full">
        {otpRoot}
      </div>
    );
  }

  return (
    <BaseField.Root
      ref={containerRef}
      name={name}
      disabled={disabled}
      invalid={Boolean(error)}
      className={cn('@container flex flex-col gap-1.5 w-full', !isClassNameFn ? className : undefined)}
    >
      {label && (
        <BaseField.Label className={cn('font-label text-sm font-semibold text-on-surface flex items-center', center ? 'justify-center' : 'justify-between')}>
          <span>{label}</span>
          {required && (
            <span className="text-sm text-on-surface-variant font-normal">(required)</span>
          )}
        </BaseField.Label>
      )}

      {description && (
        <BaseField.Description className={cn('text-sm text-on-surface-variant font-sans', center && 'text-center')}>
          {description}
        </BaseField.Description>
      )}

      {otpRoot}

      {error ? (
        <BaseField.Error match={true} className="text-sm text-error font-sans font-medium flex items-center gap-1.5 mt-1">
          <Icon name="error" size="xs" className="leading-none text-error shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
});

OTPFieldComponent.displayName = 'OTPField';

export const OTPFieldRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseOTPField.Root>
>(({ className, ...props }, ref) => (
  <BaseOTPField.Root
    ref={ref}
    data-slot="otp-field"
    className={composeClassName('flex flex-wrap max-w-full gap-1 @xs:gap-1.5 @sm:gap-2 items-center', className)}
    {...props}
  />
));
OTPFieldRoot.displayName = 'OTPFieldRoot';

export const OTPFieldInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<typeof BaseOTPField.Input>, 'size'> & { size?: OTPFieldSize; error?: boolean }
>(({ className, size = 'md', error, ...props }, ref) => (
  <BaseOTPField.Input
    ref={ref}
    data-slot="otp-field-input"
    className={composeClassName(
      cn(
        'text-center font-mono font-bold tabular-nums rounded shrink-0',
        otpSizeClasses[size].single,
        'border bg-surface text-on-surface transition-[border-color,box-shadow] motion-reduce:transition-none',
        error
          ? 'border-error focus-visible:border-error focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-error'
          : 'border-outline hover:border-on-surface-variant/80 focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
        'disabled:bg-surface-container-low disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        'data-[invalid]:border-error data-[invalid]:focus-visible:border-error data-[invalid]:focus-visible:outline-error'
      ),
      className
    )}
    {...props}
  />
));
OTPFieldInput.displayName = 'OTPFieldInput';

export const OTPFieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseOTPField.Separator>
>(({ className, children, ...props }, ref) => (
  <BaseOTPField.Separator
    ref={ref}
    data-slot="otp-field-separator"
    className={composeClassName('text-on-surface-variant/60 flex items-center justify-center font-bold px-0.5 select-none', className)}
    aria-hidden="true"
    {...props}
  >
    {children ?? '–'}
  </BaseOTPField.Separator>
));
OTPFieldSeparator.displayName = 'OTPFieldSeparator';

// Compound export mapping Base UI primitives
export const OTPField = Object.assign(OTPFieldComponent, {
  Root: OTPFieldRoot,
  Input: OTPFieldInput,
  Separator: OTPFieldSeparator,
});

// Re-export Base UI primitives for compound composition
export { BaseOTPField };

export default OTPField;
