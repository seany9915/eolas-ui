import * as React from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '@/lib/utils';

export interface OTPFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (code: string) => void;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  autoSubmit?: boolean;
  mask?: boolean;
  validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none';
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  showSeparator?: boolean;
  separatorIndex?: number;
  className?: string;
}

const OTPFieldComponent = React.forwardRef<HTMLDivElement, OTPFieldProps>(({
  label,
  description,
  error,
  length = 6,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  name,
  required,
  readOnly,
  autoFocus,
  disabled,
  autoSubmit,
  mask,
  validationType = 'numeric',
  inputMode,
  pattern,
  showSeparator = false,
  separatorIndex,
  className,
}, ref) => {
  const sepIndex = separatorIndex ?? Math.floor(length / 2);

  return (
    <BaseField.Root
      ref={ref}
      invalid={Boolean(error)}
      className={cn('flex flex-col gap-1.5 w-full', className)}
    >
      {label && (
        <BaseField.Label className="font-label text-sm font-semibold text-on-surface flex items-center justify-between">
          <span>{label}</span>
          {required && (
            <span className="text-sm text-on-surface-variant font-normal">(required)</span>
          )}
        </BaseField.Label>
      )}

      {description && (
        <BaseField.Description className="text-sm text-on-surface-variant font-sans">
          {description}
        </BaseField.Description>
      )}

      <BaseOTPField.Root
        length={length}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange?.(val)}
        onValueComplete={(val) => onComplete?.(val)}
        name={name}
        required={required}
        readOnly={readOnly}
        autoFocus={autoFocus}
        disabled={disabled}
        autoSubmit={autoSubmit}
        mask={mask}
        validationType={validationType}
        inputMode={inputMode}
        aria-label={!label ? 'One-time passcode' : undefined}
        className="flex gap-1.5 sm:gap-2 justify-start items-center"
      >
        {Array.from({ length }, (_, idx) => (
          <React.Fragment key={idx}>
            {showSeparator && idx === sepIndex && (
              <BaseOTPField.Separator
                className="text-outline flex items-center justify-center font-bold px-0.5 select-none"
                aria-hidden="true"
              >
                –
              </BaseOTPField.Separator>
            )}
            <BaseOTPField.Input
              pattern={pattern}
              className={cn(
                'w-10 sm:w-12 h-12 min-h-[48px] text-center font-heading text-lg sm:text-xl font-bold rounded',
                'border-[1px] bg-surface text-on-surface transition-colors shrink-0',
                'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary',
                'disabled:bg-surface-variant/30 disabled:border-outline-variant disabled:text-on-surface-variant disabled:cursor-not-allowed',
                error ? 'border-error focus:border-error focus:outline-error' : 'border-outline'
              )}
            />
          </React.Fragment>
        ))}
      </BaseOTPField.Root>

      {error ? (
        <BaseField.Error
          match
          className="flex items-center gap-1.5 text-sm font-semibold text-error font-sans data-[starting-style]:opacity-0 transition-opacity duration-[var(--duration-quick)]"
        >
          <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
            error
          </span>
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
              <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
                error
              </span>
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
export { BaseOTPField };
export const OTPFieldRoot = BaseOTPField.Root;
export const OTPFieldInput = BaseOTPField.Input;
export const OTPFieldSeparator = BaseOTPField.Separator;

export default OTPField;
