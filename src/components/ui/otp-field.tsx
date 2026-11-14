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
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '@/lib/utils';
import { useWebOtp } from '@/lib/use-web-otp';
import { Icon } from './icon';

export interface OTPFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseOTPField.Root>, 'onChange' | 'length'> {
  id?: string;
  center?: boolean;
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
  className?: string;
}

const OTP_PATTERNS: Record<string, RegExp | undefined> = {
  numeric: /^\d+$/,
  alpha: /^[\p{L}]+$/u,
  alphanumeric: /^[\p{L}\d]+$/u,
};

const OTPFieldComponent = React.forwardRef<HTMLDivElement, OTPFieldProps>(({
  id,
  center = false,
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

  const handleValueComplete = React.useCallback(
    (val: string, eventDetails?: BaseOTPField.Root.CompleteEventDetails) => {
      onComplete?.(val, eventDetails);
      onValueComplete?.(val, eventDetails);
    },
    [onComplete, onValueComplete]
  );

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const isControlled = value !== undefined;

  useWebOtp({
    enabled: Boolean(autoExtractSmsOtp && !disabled && !readOnly),
    onCodeReceived: (receivedCode) => {
      const stripped = receivedCode.replace(/\s/g, '');
      const normalized = normalizeValue ? normalizeValue(stripped) : stripped;
      const pattern = OTP_PATTERNS[validationType];
      if (normalized.length !== length || (pattern && !pattern.test(normalized))) return;
      if (!isControlled) setInternalValue(normalized);
      onValueChange?.(normalized);
      handleValueComplete(normalized);
    },
  });

  return (
    <BaseField.Root
      ref={containerRef}
      invalid={Boolean(error)}
      className={cn('@container flex flex-col gap-1.5 w-full', className)}
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

      <BaseOTPField.Root
        ref={ref}
        id={id}
        length={length}
        value={isControlled ? value : internalValue}
        onValueChange={(next, details) => {
          if (!isControlled) setInternalValue(next);
          onValueChange?.(next, details);
        }}
        onValueComplete={handleValueComplete}
        onValueInvalid={onValueInvalid}
        normalizeValue={normalizeValue}
        name={name}
        form={form}
        required={required}
        readOnly={readOnly}
        autoFocus={autoFocus}
        disabled={disabled}
        autoSubmit={autoSubmit}
        mask={mask}
        validationType={validationType}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-label={!label ? 'One-time passcode' : undefined}
        className={cn('flex gap-1.5 @sm:gap-2 items-center', center ? 'justify-center' : 'justify-start')}
        {...props}
      >
        {children ? (
          children
        ) : (
          Array.from({ length }, (_, idx) => (
            <React.Fragment key={idx}>
              {showSeparator && idx === sepIndex && (
                <BaseOTPField.Separator
                  className="text-on-surface-variant/60 flex items-center justify-center font-bold px-1 select-none"
                  aria-hidden="true"
                >
                  –
                </BaseOTPField.Separator>
              )}
              <BaseOTPField.Input
                pattern={pattern}
                aria-label={`Character ${idx + 1} of ${length}`}
                className={cn(
                  'w-10 min-w-10 @sm:w-12 h-12 min-h-[48px] text-center font-mono text-xl font-bold tabular-nums rounded-lg',
                  'border bg-surface text-on-surface transition-[border-color,box-shadow] shrink-0',
                  'border-outline hover:border-on-surface-variant/80',
                  'focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
                  'disabled:bg-surface-container/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
                  error && 'border-error focus-visible:border-error focus-visible:outline-error'
                )}
              />
            </React.Fragment>
          ))
        )}
      </BaseOTPField.Root>

      {error ? (
        <BaseField.Error className="text-xs text-error font-sans flex items-center gap-1 mt-1">
          <Icon name="error" size="xs" className="leading-none text-error" />
          <span>{error}</span>
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
});

OTPFieldComponent.displayName = 'OTPField';

// Compound export mapping Base UI primitives
export const OTPField = Object.assign(OTPFieldComponent, {
  Root: BaseOTPField.Root,
  Input: BaseOTPField.Input,
  Separator: BaseOTPField.Separator,
});

// Re-export Base UI primitives for compound composition
export { BaseOTPField };
export const OTPFieldRoot = BaseOTPField.Root;
export const OTPFieldInput = BaseOTPField.Input;
export const OTPFieldSeparator = BaseOTPField.Separator;

export default OTPField;
