import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { DialogSize } from './dialog';

export interface AlertDialogProps<Payload = unknown> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseAlertDialog.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  handle?: BaseAlertDialog.Handle<Payload>;
  actionsRef?: React.RefObject<BaseAlertDialog.Root.Actions | null>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: BaseAlertDialog.Root.Props<Payload>['children'];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
  initialFocus?: BaseAlertDialog.Popup.Props['initialFocus'];
  finalFocus?: BaseAlertDialog.Popup.Props['finalFocus'];
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

function AlertDialogComponent<Payload = unknown>({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  handle,
  actionsRef,
  triggerId,
  defaultTriggerId,
  trigger,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  closeOnConfirm = true,
  size = 'md',
  scroll = 'inside',
  initialFocus,
  finalFocus,
  className,
}: AlertDialogProps<Payload>): React.JSX.Element {
  // If used as composable compound root (<AlertDialog open={...}><AlertDialogContent>...</AlertDialogContent></AlertDialog>)
  if (!title && !description && !trigger && !onConfirm) {
    return (
      <BaseAlertDialog.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        actionsRef={actionsRef}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
      >
        {children}
      </BaseAlertDialog.Root>
    );
  }

  const isOutsideScroll = scroll === 'outside';

  return (
    <BaseAlertDialog.Root<Payload>
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      actionsRef={actionsRef}
      handle={handle}
      triggerId={triggerId}
      defaultTriggerId={defaultTriggerId}
    >
      {(renderProps) => (
        <>
          {trigger && (
            <BaseAlertDialog.Trigger
              render={React.isValidElement(trigger) ? trigger : undefined}
              className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BaseAlertDialog.Trigger>
          )}
          <BaseAlertDialog.Portal>
            <BaseAlertDialog.Backdrop className="fixed inset-0 bg-on-surface/50 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none" />
            <BaseAlertDialog.Viewport
              className={cn(
                'fixed inset-0 z-50 p-4',
                isOutsideScroll
                  ? 'overflow-y-auto flex min-h-full items-center justify-center'
                  : 'flex items-center justify-center'
              )}
            >
              <BaseAlertDialog.Popup
                initialFocus={initialFocus}
                finalFocus={finalFocus}
                className={cn(
                  '@container w-full p-6 rounded-xl bg-surface border border-outline-variant shadow-modal space-y-4 will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
                  isOutsideScroll ? 'my-auto' : 'max-h-[calc(100vh-2rem)] overflow-y-auto',
                  sizeClasses[size] || sizeClasses.md,
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
                {typeof children === 'function' ? children(renderProps) : children}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant">
                  <BaseAlertDialog.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded-md h-11 px-5 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {cancelLabel}
                  </BaseAlertDialog.Close>
                  {closeOnConfirm ? (
                    <BaseAlertDialog.Close
                      render={
                        <Button
                          variant="filled"
                          colorRole="error"
                          size="md"
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
                      size="md"
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
        </>
      )}
    </BaseAlertDialog.Root>
  );
}

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> {
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
  containerClassName?: string;
  backdropClassName?: string;
}

// Standard composable compound slots
export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, size = 'md', scroll = 'inside', containerClassName, backdropClassName, ...props }, ref) => {
    const isOutsideScroll = scroll === 'outside';
    return (
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop
          className={cn(
            'fixed inset-0 bg-on-surface/50 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none',
            backdropClassName
          )}
        />
        <BaseAlertDialog.Viewport
          className={cn(
            'fixed inset-0 z-50 p-4',
            isOutsideScroll
              ? 'overflow-y-auto flex min-h-full items-center justify-center'
              : 'flex items-center justify-center',
            containerClassName
          )}
        >
          <BaseAlertDialog.Popup
            ref={ref}
            className={cn(
              '@container w-full p-6 rounded-xl bg-surface border border-outline-variant shadow-modal space-y-4 will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
              isOutsideScroll ? 'my-auto' : 'max-h-[calc(100vh-2rem)] overflow-y-auto',
              sizeClasses[size] || sizeClasses.md,
              className
            )}
            {...props}
          >
            {children}
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    );
  }
);
AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-2 font-sans text-sm text-on-surface-variant leading-relaxed', className)} {...props} />
);
AlertDialogBody.displayName = 'AlertDialogBody';

export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-3 pt-3 border-t border-outline-variant', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    className={cn('font-heading text-lg font-bold text-on-surface', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    className={cn('font-sans text-sm text-on-surface-variant leading-relaxed', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center font-label text-sm font-semibold rounded-md h-11 px-5 min-h-[44px] bg-error text-on-error hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
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
      'inline-flex items-center justify-center font-label text-sm font-semibold rounded-md h-11 px-5 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

export const AlertDialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      'w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
));
AlertDialogClose.displayName = 'AlertDialogClose';

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
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
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
export const createAlertDialogHandle = BaseAlertDialog.createHandle;
export const AlertDialogHandle = BaseAlertDialog.Handle;

export default AlertDialog;
