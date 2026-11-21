'use client';

/**
 * Textarea primitive.
 *
 * Base UI Integration: Works seamlessly with Base UI Field context (<Field.Control> or <Field>).
 *
 * TAXONOMY & USAGE:
 * - Use Textarea for multi-line freeform text input and notes.
 * - Supports modern CSS `field-sizing: content` via `autoGrow` prop for zero-layout-shift auto-expansion.
 * - Follows DESIGN.md Tier B interactive controls:
 *   - 0.5rem corner radius (rounded) matching Button and Input as primary form controls.
 *   - Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary).
 *   - WCAG 2.2 SC 2.5.8 touch target compliance.
 * - For complex multi-line prompt composers with attachment toolbars, compose with <InputGroup>
 *   (@/components/ui/input-group) or <PromptInput> (@/components/ui/prompt-input).
 */
import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cn, composeClassName } from '@/lib/utils';

export type TextareaVariant = 'default' | 'unstyled' | 'ghost';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style'> {
  error?: boolean | string;
  variant?: TextareaVariant;
  /**
   * When true, automatically adjusts the height of the textarea to fit its content
   * using modern CSS `field-sizing: content` without JavaScript recalculations.
   * @default false
   */
  autoGrow?: boolean;
  /** Base UI Field.Control value change callback */
  onValueChange?: BaseField.Control.Props['onValueChange'];
  className?: BaseField.Control.Props['className'];
  style?: BaseField.Control.Props['style'];
}

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      style,
      error,
      variant = 'default',
      autoGrow = false,
      id,
      name,
      value,
      defaultValue,
      disabled,
      autoFocus,
      onValueChange,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'w-full font-sans text-base',
      variant === 'default' && [
        'min-h-[80px] p-3 rounded',
        'bg-surface text-on-surface transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
        'border border-outline focus-visible:border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
        'disabled:bg-surface-container/30 disabled:border-outline-variant disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        'data-[disabled]:bg-surface-container/30 data-[disabled]:border-outline-variant data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
        'aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:outline-error',
        'data-[invalid]:border-error data-[invalid]:focus-visible:border-error data-[invalid]:focus-visible:outline-error',
        'user-invalid:border-error user-invalid:focus-visible:border-error user-invalid:focus-visible:outline-error',
        error && 'border-error focus-visible:border-error focus-visible:outline-error',
      ],
      (variant === 'unstyled' || variant === 'ghost') && [
        'bg-transparent text-on-surface border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none p-0 resize-none',
        'disabled:bg-transparent disabled:border-none disabled:text-on-surface-variant/60 disabled:cursor-not-allowed',
        'data-[disabled]:bg-transparent data-[disabled]:border-none data-[disabled]:text-on-surface-variant/60 data-[disabled]:cursor-not-allowed',
      ],
      autoGrow && '[field-sizing:content] min-h-[3lh] max-h-[12lh] h-auto resize-none'
    );

    const invalidProps = error
      ? { 'aria-invalid': true as const }
      : ariaInvalid !== undefined
        ? { 'aria-invalid': ariaInvalid }
        : {};

    return (
      <BaseField.Control
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        autoFocus={autoFocus}
        onValueChange={onValueChange}
        className={composeClassName(baseClasses, className)}
        style={style}
        render={<textarea ref={ref} data-slot="textarea" {...invalidProps} {...props} />}
      />
    );
  }
);
TextareaComponent.displayName = 'Textarea';

export const Textarea = TextareaComponent;
export const TextareaRoot = TextareaComponent;

export default Textarea;
