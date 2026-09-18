/**
 * Backward-compatibility alias for NumberField.
 * Canonical primitive resides at @/components/ui/number-field.
 * For OTP Passcode input, import directly from @/components/ui/otp-field.
 */
export { NumberField, BaseNumberField, NumberFieldRoot, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from './number-field';
export type { NumberFieldProps } from './number-field';

// Legacy alias
export { NumberField as Stepper } from './number-field';
export type { NumberFieldProps as StepperProps } from './number-field';
