import * as React from 'react';
import { Form as BaseForm } from '@base-ui/react/form';
import { cn } from '@/lib/utils';

export interface FormProps<FormValues extends Record<string, any> = Record<string, any>>
  extends BaseForm.Props<FormValues> {
  children?: React.ReactNode;
  className?: string;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps<any>>(({
  onSubmit,
  onFormSubmit,
  validationMode,
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
export { BaseForm };
export const FormRoot = BaseForm;

export default Form;
