'use client';

/**
 * Checkbox primitive (@base-ui/react/checkbox).
 *
 * Base UI Documentation: https://base-ui.com/react/components/checkbox
 *
 * TAXONOMY & USAGE:
 * - Use Checkbox for multi-selection or binary on/off options within forms or lists.
 * - Supports three states: unchecked, checked, and indeterminate (mixed).
 * - Supports parent-child tree checkboxes via the `parent` prop.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius (rounded-xs / 4px on box, rounded 8px on row),
 *   floating 2px focus ring, flush primary fill on check, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 */
import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cn, composeClassName } from '@/lib/utils';
import { Icon } from './icon';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'onChange' | 'checked'> {
  checked?: boolean | 'indeterminate';
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | string;
  compact?: boolean;
}

const CheckboxComponent = React.forwardRef<HTMLElement, CheckboxProps>(
  (
    {
      label,
      value,
      name,
      form,
      required = false,
      readOnly = false,
      checked,
      defaultChecked,
      indeterminate,
      parent,
      onCheckedChange,
      disabled = false,
      id,
      description,
      error,
      compact = false,
      className,
      inputRef,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorText = typeof error === 'string' && error ? error : undefined;
    const errorId = errorText ? `${checkboxId}-error` : undefined;
    const describedBy = [props['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    const isIndeterminate = indeterminate ?? (checked === 'indeterminate');
    const isChecked = checked === 'indeterminate' ? false : checked;
    const hasOuterWrapper = Boolean(label || description || errorText);
    const isClassNameFn = typeof className === 'function';

    const checkboxNode = (
      <BaseCheckbox.Root
        ref={ref}
        data-slot="checkbox"
        id={checkboxId}
        value={value}
        name={name}
        form={form}
        required={required}
        readOnly={readOnly}
        checked={isChecked}
        defaultChecked={defaultChecked}
        indeterminate={isIndeterminate}
        parent={parent}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        inputRef={inputRef}
        className={composeClassName(
          cn(
            'relative size-5 rounded-sm border bg-surface transition-[background-color,border-color,box-shadow] motion-reduce:transition-none flex items-center justify-center shrink-0 cursor-pointer select-none after:absolute after:-inset-3 after:content-[\'\']',
            'data-[checked]:bg-primary data-[checked]:border-primary text-on-primary',
            'data-[indeterminate]:bg-primary data-[indeterminate]:border-primary text-on-primary',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'data-[disabled]:bg-surface-container-high/50 data-[disabled]:border-outline-variant data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
            error ? 'border-error focus-visible:outline-error' : 'border-outline hover:border-on-surface'
          ),
          !hasOuterWrapper || isClassNameFn ? className : undefined
        )}
        {...props}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={describedBy}
      >
        {children ?? <BaseCheckbox.Indicator
          data-slot="checkbox-indicator"
          render={(indicatorProps, state) => (
            <span
              {...indicatorProps}
              className="flex items-center justify-center transition-[transform,opacity] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none data-[starting-style]:scale-75 data-[starting-style]:opacity-0"
            >
              <Icon
                name={state.indeterminate ? 'remove' : 'check'}
                size="xs"
                className="font-bold text-on-primary select-none leading-none"
              />
            </span>
          )}
        />}
      </BaseCheckbox.Root>
    );

    const descriptionNode = description && (
      <span id={descriptionId} className="font-sans text-sm text-on-surface-variant mt-0.5">
        {description}
      </span>
    );
    const errorNode = errorText && (
      <span id={errorId} className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1">
        <Icon name="error" size="sm" className="shrink-0" />
        <span>{errorText}</span>
      </span>
    );

    if (!label) {
      if (!descriptionNode && !errorNode) return checkboxNode;
      return (
        <div className={cn('flex flex-col', !isClassNameFn ? className : undefined)}>
          {checkboxNode}
          {descriptionNode}
          {errorNode}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'flex items-start gap-3 group rounded transition-colors motion-reduce:transition-none',
          compact
            ? 'p-1'
            : 'w-full min-h-[44px] py-2 px-3 hover:bg-state-hover',
          'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-60 has-[[data-disabled]]:hover:bg-transparent',
          disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
          !isClassNameFn ? className : undefined
        )}
      >
        <div className="relative flex items-center justify-center size-6 mt-0.5">
          {checkboxNode}
        </div>
        <div className="flex flex-col flex-1 min-w-0 break-words">
          <label
            htmlFor={checkboxId}
            className="font-sans text-sm font-medium text-on-surface cursor-pointer select-none group-has-[[data-disabled]]:cursor-not-allowed group-has-[[data-disabled]]:text-on-surface-variant"
          >
            {label}
          </label>
          {descriptionNode}
          {errorNode}
        </div>
      </div>
    );
  }
);
CheckboxComponent.displayName = 'Checkbox';

// Compound export mapping Base UI primitives
export const Checkbox = Object.assign(CheckboxComponent, {
  Root: BaseCheckbox.Root,
  Indicator: BaseCheckbox.Indicator,
});

// Re-export Base UI primitives for compound composition
export { BaseCheckbox };
export const CheckboxRoot = BaseCheckbox.Root;
export const CheckboxIndicator = BaseCheckbox.Indicator;
export default Checkbox;
