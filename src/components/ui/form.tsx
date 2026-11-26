'use client';

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
import { composeClassName, useMergedRefs } from '@/lib/utils';

export interface FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>>
  extends BaseForm.Props<FormValues> {
  children?: React.ReactNode;

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

const FOCUSABLE_DESCENDANT_SELECTOR =
  'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';

function isElementVisibleForFocus(el: HTMLElement): boolean {
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
  if (el.hidden) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function isNativelyFocusableControl(el: HTMLElement): boolean {
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLButtonElement
  ) {
    return !el.disabled;
  }
  if (el instanceof HTMLAnchorElement && el.hasAttribute('href')) return true;
  const tabIndexAttr = el.getAttribute('tabindex');
  return tabIndexAttr !== null && tabIndexAttr !== '-1';
}

const FormComponent = React.forwardRef<HTMLFormElement, FormProps<Record<string, unknown>>>(
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
    const mergedRef = useMergedRefs(internalRef, ref);

    const handleInvalidCapture = React.useCallback(
      (event: Parameters<NonNullable<BaseForm.Props<Record<string, unknown>>['onInvalidCapture']>>[0]) => {
        onInvalidCapture?.(event);
        if (!focusFirstInvalid || event.defaultPrevented) return;
        window.requestAnimationFrame(() => {
          const formEl = internalRef.current;
          if (!formEl) return;
          const active = document.activeElement;
          if (active && formEl.contains(active) && active.matches('[aria-invalid="true"], :invalid:not(form):not(fieldset)')) {
            return;
          }
          const candidates = formEl.querySelectorAll<HTMLElement>(
            '[aria-invalid="true"], :invalid:not(form):not(fieldset)'
          );
          for (const candidate of candidates) {
            if (!isElementVisibleForFocus(candidate)) continue;
            if (isNativelyFocusableControl(candidate)) {
              candidate.focus();
              return;
            }
            const descendant = Array.from(
              candidate.querySelectorAll<HTMLElement>(FOCUSABLE_DESCENDANT_SELECTOR)
            ).find(isElementVisibleForFocus);
            if (descendant) {
              descendant.focus();
              return;
            }
          }
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
        className={composeClassName(
          'flex flex-col gap-4 w-full transition-colors duration-quick motion-reduce:transition-none',
          className
        )}
        {...webMcpProps}
        {...props}
      >
        {children}
      </BaseForm>
    );
  }
) as (<FormValues extends Record<string, unknown> = Record<string, unknown>>(
  props: FormProps<FormValues> & { ref?: React.Ref<HTMLFormElement> }
) => React.JSX.Element) & { displayName?: string };
FormComponent.displayName = 'Form';

// Compound Base UI exports
export const Form = Object.assign(FormComponent, {
  Root: BaseForm,
});

export { BaseForm };
export const FormRoot = BaseForm;

export default Form;
