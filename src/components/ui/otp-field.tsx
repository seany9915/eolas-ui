import * as React from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '@/lib/utils';

export interface OTPFieldProps {
  label?: string;
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
  className?: string;
}

const OTPFieldComponent: React.FC<OTPFieldProps> = ({
  label,
  length = 4,
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
  validationType,
  inputMode,
  pattern,
  className,
}) => {
  return (
    <BaseField.Root className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <BaseField.Label className="font-label text-xs font-semibold text-on-surface-variant">
          {label}
        </BaseField.Label>
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
          <BaseOTPField.Input
            key={idx}
            pattern={pattern}
            className="w-10 sm:w-12 h-12 min-h-[48px] text-center font-heading text-lg sm:text-xl font-bold rounded-md border-[1px] border-outline bg-surface text-on-surface focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary transition-colors disabled:opacity-40 shrink-0"
          />
        ))}
      </BaseOTPField.Root>
    </BaseField.Root>
  );
};

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
