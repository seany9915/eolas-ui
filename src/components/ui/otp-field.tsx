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

export interface OTPFieldProps {
  id?: string;
  center?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails?: BaseOTPField.Root.ChangeEventDetails) => void;
  onComplete?: (code: string, eventDetails?: BaseOTPField.Root.CompleteEventDetails) => void;
  name?: string;
  form?: string;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  autoSubmit?: boolean;
  mask?: boolean;
  validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none';
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  pattern?: string;
  showSeparator?: boolean;
  separatorIndex?: number;
  /** Whether to listen for and auto-fill incoming SMS OTPs via the WebOTP API on supported mobile browsers */
  autoExtractSmsOtp?: boolean;
  children?: React.ReactNode;
  className?: string;
}

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
  children,
  className,
}, ref) => {
  const sepIndex = separatorIndex ?? Math.floor(length / 2);

  useWebOtp({
    enabled: Boolean(autoExtractSmsOtp && !disabled && !readOnly),
    onCodeReceived: (receivedCode) => {
      onValueChange?.(receivedCode);
      onComplete?.(receivedCode);
    },
  });

  return (
    <BaseField.Root
      ref={ref}
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
        id={id}
        length={length}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onValueComplete={onComplete}
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
                className={cn(
                  'w-11 min-w-[44px] @sm:w-12 h-12 min-h-[48px] text-center font-mono text-xl font-bold tabular-nums rounded',
                  'border bg-surface text-on-surface transition-[border-color,box-shadow] shrink-0',
                  'focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
                  error ? 'border-error focus-visible:border-error focus-visible:outline-error' : 'border-outline-variant hover:border-outline'
                )}
              />
            </React.Fragment>
          ))
        )}
      </BaseOTPField.Root>

      {error ? (
        <BaseField.Error
          match
          className="flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]"
        >
          <Icon name="error" size="sm" className="shrink-0 select-none" />
          <span>{error}</span>
        </BaseField.Error>
      ) : (
        <BaseField.Error
          className="flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]"
          render={(elementProps) => (
            <div
              {...elementProps}
              className={cn(
                'flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]',
                elementProps.className
              )}
            >
              <Icon name="error" size="sm" className="shrink-0 select-none" />
              <span>{elementProps.children}</span>
            </div>
          )}
        />
      )}
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
export { BaseOTPField, useWebOtp };
export const OTPFieldRoot = BaseOTPField.Root;
export const OTPFieldInput = BaseOTPField.Input;
export const OTPFieldSeparator = BaseOTPField.Separator;

export default OTPField;
