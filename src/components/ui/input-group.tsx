/**
 * InputGroup primitive.
 *
 * Full API reference and feature parity with shadcn/ui Base Input Group specification:
 * https://ui.shadcn.com/docs/components/base/input-group
 *
 * ANATOMY:
 * InputGroup
 * ├── InputGroupInput (or InputGroupTextarea)
 * └── InputGroupAddon (align="inline-start" | "inline-end" | "block-start" | "block-end")
 *     ├── InputGroupButton
 *     └── InputGroupText
 *
 * TAXONOMY & USAGE:
 * - Use InputGroup to attach icons, buttons, text prefixes, suffixes, and action toolbars
 *   to input fields and textareas.
 * - Bridges single-line search/URL fields and multi-line AI chat prompt inputs under a single visual boundary.
 * - Eliminates double-border and double-focus ring artifacts by delegating focus exclusively to InputGroup.
 * - Integrates seamlessly with Base UI Field (<Field.Control>) for accessible label and error wiring.
 * - Supports polymorphic composition via Base UI's `useRender` hook across all sub-components.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Input as BaseInput } from '@base-ui/react/input';
import { Button, type ButtonProps, type ButtonVariant, type ButtonColorRole } from './button';
import { Textarea as BaseTextareaPrimitive } from './textarea';
import { cn } from '@/lib/utils';

// ============================================================================
// InputGroup Root
// ============================================================================

export type InputGroupVariant = 'default' | 'card' | 'ghost' | 'unboxed' | 'floating';
export type InputGroupSize = 'sm' | 'md' | 'lg';

interface InputGroupContextValue {
  disabled?: boolean;
  size: InputGroupSize;
}

const InputGroupContext = React.createContext<InputGroupContextValue>({ size: 'md' });

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  variant?: InputGroupVariant;
  size?: InputGroupSize;
  floating?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export const InputGroupRoot = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      floating = false,
      disabled = false,
      invalid = false,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const isGhost = variant === 'ghost' || variant === 'unboxed';
    const isFloating = floating || variant === 'floating';

    // Corner radius: standard form containers use 16px (rounded-lg) per DESIGN.md
    const roundedClass = isGhost ? 'rounded-none' : 'rounded-lg';

    // Height sizing for horizontal single-line input controls (DESIGN.md lines 368-372)
    const sizeMinHeight = {
      sm: 'has-[input]:min-h-[44px]',
      md: 'has-[input]:min-h-[48px]',
      lg: 'has-[input]:min-h-[56px]',
    }[size];

    const rootClasses = cn(
      '@container group/input-group relative flex w-full transition-[border-color,background-color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
      // Default to row layout for input, switch to column layout if a textarea is present
      'has-[textarea]:flex-col has-[textarea]:items-stretch has-[input]:flex-row has-[input]:items-center',
      sizeMinHeight,
      isGhost
        ? 'bg-transparent border-0 rounded-none p-0 has-[input:focus-visible,textarea:focus-visible]:outline-2 has-[input:focus-visible,textarea:focus-visible]:-outline-offset-2 has-[input:focus-visible,textarea:focus-visible]:outline-primary'
        : cn(
            'border bg-surface text-on-surface',
            roundedClass,
            // Standard state: border-outline, with real CSS outline for focus (Windows High Contrast compatible)
            'border-outline has-[input:focus-visible,textarea:focus-visible]:border-primary has-[input:focus-visible,textarea:focus-visible]:outline-2 has-[input:focus-visible,textarea:focus-visible]:-outline-offset-1 has-[input:focus-visible,textarea:focus-visible]:outline-primary',
            // Invalid state (explicit prop or via inner control validation)
            (invalid || undefined) &&
              'border-error has-[input:focus-visible,textarea:focus-visible]:border-error has-[input:focus-visible,textarea:focus-visible]:outline-error',
            'has-[:invalid]:border-error has-[:invalid]:has-[input:focus-visible,textarea:focus-visible]:border-error has-[:invalid]:has-[input:focus-visible,textarea:focus-visible]:outline-error',
            'has-[[aria-invalid=true]]:border-error has-[[aria-invalid=true]]:has-[input:focus-visible,textarea:focus-visible]:border-error has-[[aria-invalid=true]]:has-[input:focus-visible,textarea:focus-visible]:outline-error',
            'has-[[data-invalid]]:border-error has-[[data-invalid]]:has-[input:focus-visible,textarea:focus-visible]:border-error has-[[data-invalid]]:has-[input:focus-visible,textarea:focus-visible]:outline-error',
            isFloating
              ? 'shadow-ambient bg-surface/95 backdrop-blur-xs [&:not(:focus-within)]:hover:border-outline'
              : '[&:not(:focus-within)]:hover:border-outline/80'
          ),
      disabled && 'opacity-60 bg-surface-container/30 border-outline-variant cursor-not-allowed',
      'has-[:disabled]:opacity-60 has-[:disabled]:bg-surface-container/30 has-[:disabled]:border-outline-variant has-[:disabled]:cursor-not-allowed',
      className
    );

    return (
      <InputGroupContext.Provider value={{ size, disabled }}>
        {useRender({
          render,
          ref,
          defaultTagName: 'div',
          props: {
            'data-slot': 'input-group',
            'data-size': size,
            'data-disabled': disabled ? 'true' : undefined,
            'data-invalid': invalid ? 'true' : undefined,
            role: 'group',
            className: rootClasses,
            children,
            ...props,
          },
        })}
      </InputGroupContext.Provider>
    );
  }
);
InputGroupRoot.displayName = 'InputGroup';

// ============================================================================
// InputGroupInput
// ============================================================================

export interface InputGroupInputProps
  extends React.ComponentPropsWithoutRef<typeof BaseInput> {}

export const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const { size, disabled: groupDisabled } = React.useContext(InputGroupContext);

    return (
      <BaseInput
        ref={ref}
        data-slot="input-group-input"
        data-slot-control="true"
        disabled={disabled ?? groupDisabled}
        className={cn(
          'w-full flex-1 min-w-0 bg-transparent border-0 px-3 py-2 font-sans text-on-surface leading-normal outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none',
          size === 'sm' ? 'text-sm' : 'text-base',
          '[[data-slot=input-group-addon]+&]:pl-1.5',
          '[&:has(+[data-slot=input-group-addon])]:pr-1.5',
          'placeholder:text-on-surface-variant/80',
          'disabled:cursor-not-allowed disabled:text-on-surface-variant/60',
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = 'InputGroupInput';

// ============================================================================
// InputGroupTextarea
// ============================================================================

export interface InputGroupTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  render?: useRender.RenderProp;
  onSubmit?: () => void;
  onFilesPasted?: (files: File[]) => void;
  minRows?: number;
  maxHeight?: number | string;
}

export const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, InputGroupTextareaProps>(
  (
    {
      className,
      onSubmit,
      onFilesPasted,
      onKeyDown,
      onPaste,
      minRows = 3,
      maxHeight = '12rem',
      render,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const { disabled: groupDisabled } = React.useContext(InputGroupContext);
    const isDisabled = disabled ?? groupDisabled;

    // Enter inserts a newline unless the caller opts into submit-on-Enter via onSubmit.
    // The caller's onKeyDown runs first and can cancel submission with preventDefault().
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !onSubmit) return;
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        onSubmit();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const files = Array.from(e.clipboardData.files);
        onFilesPasted?.(files);
      }
      onPaste?.(e);
    };

    const textareaClassName = cn(
      'w-full flex-1 bg-transparent border-0 px-3 py-2 text-base font-sans text-on-surface leading-relaxed',
      'placeholder:text-on-surface-variant/80 resize-none min-h-[64px] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border-none shadow-none',
      'disabled:cursor-not-allowed disabled:text-on-surface-variant/60',
      className
    );
    const textareaStyle = {
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      ...style,
    };

    const renderedTextarea = useRender({
      enabled: Boolean(render),
      render,
      ref,
      defaultTagName: 'textarea',
      props: {
        'data-slot': 'input-group-textarea',
        'data-slot-control': 'true',
        rows: minRows,
        disabled: isDisabled,
        onKeyDown: handleKeyDown,
        onPaste: handlePaste,
        className: cn('[field-sizing:content] h-auto', textareaClassName),
        style: textareaStyle,
        ...props,
      },
    });

    if (render) return renderedTextarea;
    return (
      <BaseTextareaPrimitive
        ref={ref}
        data-slot="input-group-textarea"
        data-slot-control="true"
        variant="unstyled"
        rows={minRows}
        autoGrow={true}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={textareaClassName}
        style={textareaStyle}
        {...props}
      />
    );
  }
);InputGroupTextarea.displayName = 'InputGroupTextarea';

// ============================================================================
// InputGroupAddon
// ============================================================================

export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  /**
   * Addon alignment relative to the input field:
   * - 'inline-start': Anchors to start (left) of an input row (e.g. search icon, prefix text).
   * - 'inline-end': Anchors to end (right) of an input row (e.g. submit button, clear trigger).
   * - 'block-start': Anchors above a textarea/input block (e.g. file attachment chips, header toolbar).
   * - 'block-end': Anchors below a textarea/input block (e.g. model selector, attach buttons, send action).
   */
  align?: InputGroupAddonAlign;
}

export const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = 'inline-start', render, children, ...props }, ref) => {
    const alignClasses = cn(
      align === 'inline-start' && 'order-first flex items-center gap-1.5 pl-3 pr-1 text-on-surface-variant select-none shrink-0',
      align === 'inline-end' && 'order-last flex items-center gap-1.5 pr-3 pl-1 ml-auto text-on-surface-variant select-none shrink-0',
      align === 'block-start' && 'order-first flex flex-wrap items-center justify-between gap-2 px-3 pt-2.5 pb-1 w-full text-on-surface-variant',
      align === 'block-end' && 'order-last flex flex-wrap items-center justify-between gap-2 px-3 pb-2.5 pt-1 mt-auto w-full text-on-surface-variant'
    );

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'input-group-addon',
        'data-align': align,
        className: cn(alignClasses, className),
        children,
        ...props,
      },
    });
  }
);
InputGroupAddon.displayName = 'InputGroupAddon';

// ============================================================================
// InputGroupButton
// ============================================================================

export type InputGroupButtonSize = 'xs' | 'sm' | 'md' | 'icon' | 'icon-xs' | 'icon-sm';

export interface InputGroupButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'colorRole'> {
  variant?: ButtonVariant;
  colorRole?: ButtonColorRole;
  size?: InputGroupButtonSize;
}

export const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      colorRole = 'neutral',
      size = 'xs',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    // Map custom input group icon sizes to button styling
    const sizeClasses = cn(
      size === 'icon-xs' && 'size-6 min-h-[24px] min-w-[24px] p-0 rounded-md',
      size === 'icon-sm' && 'size-8 min-h-[32px] min-w-[32px] p-0 rounded-full',
      size === 'icon' && 'size-8 min-h-[32px] min-w-[32px] p-0 rounded-md',
      size === 'xs' && 'h-6 px-2 text-xs rounded-md',
      size === 'sm' && 'h-8 px-2.5 text-xs rounded-md',
      size === 'md' && 'h-9 px-3 text-sm rounded-md'
    );

    const buttonSize =
      size === 'icon-xs' || size === 'icon-sm' || size === 'icon'
        ? 'icon'
        : size === 'xs'
        ? 'sm'
        : size;

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        colorRole={colorRole}
        size={buttonSize as ButtonProps['size']}
        data-slot="input-group-button"
        expandedTouchTarget
        className={cn(sizeClasses, className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
InputGroupButton.displayName = 'InputGroupButton';

// ============================================================================
// InputGroupText
// ============================================================================

export interface InputGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  render?: useRender.RenderProp;
}

export const InputGroupText = React.forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'input-group-text',
        className: cn(
          'text-xs font-sans text-on-surface-variant/80 select-none whitespace-nowrap tabular-nums',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
InputGroupText.displayName = 'InputGroupText';

// ============================================================================
// Compound Namespace Export
// ============================================================================

export const InputGroup = Object.assign(InputGroupRoot, {
  Input: InputGroupInput,
  Textarea: InputGroupTextarea,
  Addon: InputGroupAddon,
  Button: InputGroupButton,
  Text: InputGroupText,
});

export default InputGroup;
