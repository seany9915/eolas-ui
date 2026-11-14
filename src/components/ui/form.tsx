/**
 * Form primitive (@base-ui/react/form).
 *
 * Base UI Documentation: https://base-ui.com/react/components/form
 *
 * TAXONOMY & USAGE:
 * - A native form element with consolidated error handling, field registration,
 *   imperative validate actions, and external error state integration.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 SC 2.5.8 touch target compliance.
 */
import * as React from 'react';
import { Form as BaseForm } from '@base-ui/react/form';
import { cn } from '@/lib/utils';

export interface FormProps<FormValues extends Record<string, any> = Record<string, any>>
  extends BaseForm.Props<FormValues> {
  children?: React.ReactNode;
  className?: string;

  /**
   * WebMCP (Modern Web Guidance): Unique machine-readable tool identifier
   * exposing this form to client-side AI agents (e.g. `toolname="searchPatients"`).
   */
  toolname?: string;

  /**
   * WebMCP (Modern Web Guidance): Natural-language description synthesized into
   * the agent's tool schema explaining when and how to call this form tool.
   */
  tooldescription?: string;

  /**
   * WebMCP (Modern Web Guidance): Allows an AI agent to execute read-only or low-risk
   * queries automatically upon field population without requiring modal user confirmation.
   */
  toolautosubmit?: boolean;
  /**
   * WCAG 2.2 / UX: Automatically focuses the first invalid field when form validation fails on submit.
   * @default true
   */
  focusFirstInvalid?: boolean;
}

const FormComponent = React.forwardRef<HTMLFormElement, FormProps<any>>(
  (
    {
      onSubmit,
      onFormSubmit,
      onInvalidCapture,
      validationMode = 'onSubmit',
      errors,
      actionsRef,
      focusFirstInvalid = true,
      children,
      className,
      toolname,
      tooldescription,
      toolautosubmit,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLFormElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
      },
      [ref]
    );

    const handleInvalidCapture = React.useCallback(
      (event: Parameters<NonNullable<BaseForm.Props<any>['onInvalidCapture']>>[0]) => {
        onInvalidCapture?.(event);
        if (!focusFirstInvalid || event.defaultPrevented) return;
        window.requestAnimationFrame(() => {
          const formEl = internalRef.current;
          if (!formEl) return;
          const active = document.activeElement;
          if (active && formEl.contains(active) && active.matches('[aria-invalid="true"], :invalid')) {
            return;
          }
          formEl.querySelector<HTMLElement>('[aria-invalid="true"], :invalid')?.focus();
        });
      },
      [focusFirstInvalid, onInvalidCapture]
    );

    // Declarative WebMCP attributes for client-side AI agent tool discovery
    const webMcpProps: Record<string, string> = {};
    if (toolname) webMcpProps.toolname = toolname;
    if (tooldescription) webMcpProps.tooldescription = tooldescription;
    if (toolautosubmit) webMcpProps.toolautosubmit = '';

    return (
      <BaseForm
        ref={mergedRef}
        data-slot="form"
        validationMode={validationMode}
        errors={errors}
        actionsRef={actionsRef}
        onFormSubmit={onFormSubmit}
        onSubmit={onSubmit}
        onInvalidCapture={handleInvalidCapture}
        className={cn('flex flex-col gap-4 w-full transition-colors duration-quick', className)}
        {...webMcpProps}
        {...props}
      >
        {children}
      </BaseForm>
    );
  }
) as <FormValues extends Record<string, any> = Record<string, any>>(
  props: FormProps<FormValues> & { ref?: React.Ref<HTMLFormElement> }
) => React.JSX.Element;

// Compound Base UI exports
export const Form = Object.assign(FormComponent, {
  Root: BaseForm,
});

export { BaseForm };
export const FormRoot = BaseForm;

export default Form;
