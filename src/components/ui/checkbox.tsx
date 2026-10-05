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
import { cn } from '@/lib/utils';

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

    const isIndeterminate = indeterminate ?? (checked === 'indeterminate');
    const isChecked = checked === 'indeterminate' ? false : checked;

    const checkboxNode = (
      <BaseCheckbox.Root
        ref={ref}
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
        className={cn(
          'size-5 rounded-xs border bg-surface transition-[background-color,border-color,box-shadow] flex items-center justify-center shrink-0 cursor-pointer select-none',
          'data-[checked]:bg-primary data-[checked]:border-primary text-on-primary',
          'data-[indeterminate]:bg-primary data-[indeterminate]:border-primary text-on-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'data-[disabled]:bg-surface-variant/40 data-[disabled]:border-outline-variant data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
          error ? 'border-error focus-visible:outline-error' : 'border-outline',
          !label && className
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          render={(indicatorProps, state) => (
            <span
              {...indicatorProps}
              className="flex items-center justify-center transition-[transform,opacity] duration-[var(--duration-quick)] ease-[var(--ease-standard)] data-[starting-style]:scale-75 data-[starting-style]:opacity-0"
            >
              <span
                className="material-symbols-outlined text-sm font-bold text-on-primary select-none"
                aria-hidden="true"
              >
                {state.indeterminate ? 'remove' : 'check'}
              </span>
            </span>
          )}
        />
      </BaseCheckbox.Root>
    );

    if (!label) {
      return checkboxNode;
    }

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group rounded transition-colors',
          compact
            ? 'p-1'
            : 'w-full min-h-[44px] py-2 px-3 hover:bg-surface-variant/30',
          disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
          className
        )}
      >
        <div className="relative flex items-center justify-center min-w-[24px] h-6 mt-0.5">
          {checkboxNode}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-sans text-sm font-medium text-on-surface select-none group-disabled:text-on-surface-variant">
            {label}
          </span>
          {description && (
            <span className="font-sans text-sm text-on-surface-variant select-none mt-0.5">
              {description}
            </span>
          )}
          {typeof error === 'string' && error && (
            <span className="flex items-center gap-1 font-sans text-sm font-semibold text-error mt-1 select-none">
              <span className="material-symbols-outlined text-base shrink-0" aria-hidden="true">
                error
              </span>
              <span>{error}</span>
            </span>
          )}
        </div>
      </label>
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
