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
}

const FormComponent = React.forwardRef<HTMLFormElement, FormProps<any>>(({
  onSubmit,
  onFormSubmit,
  validationMode = 'onSubmit',
  errors,
  actionsRef,
  children,
  className,
  ...props
}, ref) => {
  return (
    <BaseForm
      ref={ref}
      validationMode={validationMode}
      errors={errors}
      actionsRef={actionsRef}
      onFormSubmit={onFormSubmit}
      onSubmit={onSubmit}
      className={cn('space-y-4 w-full', className)}
      {...props}
    >
      {children}
    </BaseForm>
  );
}) as <FormValues extends Record<string, any> = Record<string, any>>(
  props: FormProps<FormValues> & { ref?: React.Ref<HTMLFormElement> }
) => React.JSX.Element;

// Compound Base UI exports
export const Form = Object.assign(FormComponent, {
  Root: BaseForm,
});

export { BaseForm };
export const FormRoot = BaseForm;

export default Form;
