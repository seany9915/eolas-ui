import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  initialFocus?: BaseAlertDialog.Popup.Props['initialFocus'];
  finalFocus?: BaseAlertDialog.Popup.Props['finalFocus'];
  actionsRef?: React.RefObject<BaseAlertDialog.Root.Actions | null>;
  handle?: BaseAlertDialog.Handle<any>;
  className?: string;
}

const AlertDialogComponent: React.FC<AlertDialogProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  trigger,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  closeOnConfirm = true,
  initialFocus,
  finalFocus,
  actionsRef,
  handle,
  className,
}) => {
  // If used as composable compound root (<AlertDialog open={...}><AlertDialogContent>...</AlertDialogContent></AlertDialog>)
  if (!title && !description && !trigger && !onConfirm) {
    return (
      <BaseAlertDialog.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        actionsRef={actionsRef}
        handle={handle}
      >
        {children}
      </BaseAlertDialog.Root>
    );
  }

  return (
    <BaseAlertDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      actionsRef={actionsRef}
      handle={handle}
    >
      {trigger && (
        <BaseAlertDialog.Trigger
          render={React.isValidElement(trigger) ? trigger : undefined}
          className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
        >
          {!React.isValidElement(trigger) ? trigger : undefined}
        </BaseAlertDialog.Trigger>
      )}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="fixed inset-0 bg-on-surface/50 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
        <BaseAlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseAlertDialog.Popup
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={cn(
              'w-full max-w-md p-6 rounded-[1rem] bg-surface border-[2px] border-outline-variant shadow-modal space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)]',
              className
            )}
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-2xl mt-0.5 shrink-0" aria-hidden="true">
                warning
              </span>
              <div>
                {title && (
                  <BaseAlertDialog.Title className="font-heading text-lg font-bold text-on-surface">
                    {title}
                  </BaseAlertDialog.Title>
                )}
                {description && (
                  <BaseAlertDialog.Description className="font-sans text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {description}
                  </BaseAlertDialog.Description>
                )}
              </div>
            </div>
            {children}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant">
              <BaseAlertDialog.Close className="inline-flex items-center justify-center font-label text-xs font-semibold rounded-md h-10 px-4 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer">
                {cancelLabel}
              </BaseAlertDialog.Close>
              {closeOnConfirm ? (
                <BaseAlertDialog.Close
                  render={
                    <Button
                      variant="filled"
                      colorRole="error"
                      size="sm"
                      onClick={() => {
                        onConfirm?.();
                      }}
                    >
                      {confirmLabel}
                    </Button>
                  }
                />
              ) : (
                <Button
                  variant="filled"
                  colorRole="error"
                  size="sm"
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  {confirmLabel}
                </Button>
              )}
            </div>
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
};

// Standard composable compound slots
export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <BaseAlertDialog.Portal>
    <BaseAlertDialog.Backdrop className="fixed inset-0 bg-on-surface/50 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
    <BaseAlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <BaseAlertDialog.Popup
        ref={ref}
        className={cn(
          'w-full max-w-md p-6 rounded-[1rem] bg-surface border-[2px] border-outline-variant shadow-modal space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)]',
          className
        )}
        {...props}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Viewport>
  </BaseAlertDialog.Portal>
));
AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2 border-t border-outline-variant', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center font-label text-xs font-semibold rounded-md h-10 px-4 min-h-[44px] bg-error text-on-error hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error transition-colors cursor-pointer',
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center font-label text-xs font-semibold rounded-md h-10 px-4 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer',
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

// Compound export mapping Base UI primitives
export const AlertDialog = Object.assign(AlertDialogComponent, {
  Root: BaseAlertDialog.Root,
  Trigger: BaseAlertDialog.Trigger,
  Portal: BaseAlertDialog.Portal,
  Backdrop: BaseAlertDialog.Backdrop,
  Overlay: BaseAlertDialog.Backdrop,
  Viewport: BaseAlertDialog.Viewport,
  Popup: BaseAlertDialog.Popup,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  Title: BaseAlertDialog.Title,
  Description: BaseAlertDialog.Description,
  Close: BaseAlertDialog.Close,
  createHandle: BaseAlertDialog.createHandle,
  Handle: BaseAlertDialog.Handle,
});

// Re-export Base UI primitives for compound composition
export { BaseAlertDialog };
export const AlertDialogRoot = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;
export const AlertDialogPortal = BaseAlertDialog.Portal;
export const AlertDialogBackdrop = BaseAlertDialog.Backdrop;
export const AlertDialogOverlay = BaseAlertDialog.Backdrop;
export const AlertDialogViewport = BaseAlertDialog.Viewport;
export const AlertDialogPopup = BaseAlertDialog.Popup;
export const AlertDialogTitle = BaseAlertDialog.Title;
export const AlertDialogDescription = BaseAlertDialog.Description;
export const AlertDialogClose = BaseAlertDialog.Close;
export const createAlertDialogHandle = BaseAlertDialog.createHandle;
export const AlertDialogHandle = BaseAlertDialog.Handle;

export default AlertDialog;
