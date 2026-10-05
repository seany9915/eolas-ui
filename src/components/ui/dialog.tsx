import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './button';
import { cn } from '@/lib/utils';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'fullscreen' | string;

export interface DialogProps<Payload = unknown> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseDialog.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  handle?: BaseDialog.Handle<Payload>;
  actionsRef?: React.RefObject<BaseDialog.Root.Actions | null>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: BaseDialog.Root.Props<Payload>['children'];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
  footer?: React.ReactNode;
  initialFocus?: BaseDialog.Popup.Props['initialFocus'];
  finalFocus?: BaseDialog.Popup.Props['finalFocus'];
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  fullscreen: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] h-full',
};

function DialogComponent<Payload = unknown>({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  modal = true,
  disablePointerDismissal = false,
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
  footer,
  initialFocus,
  finalFocus,
  className,
}: DialogProps<Payload>): React.JSX.Element {
  // If used as composable compound root (<Dialog open={...}><DialogContent>...</DialogContent></Dialog>)
  if (!title && !description && !trigger && !footer && !onConfirm) {
    return (
      <BaseDialog.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        modal={modal}
        disablePointerDismissal={disablePointerDismissal}
        handle={handle}
        actionsRef={actionsRef}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
      >
        {children}
      </BaseDialog.Root>
    );
  }

  const isOutsideScroll = scroll === 'outside';

  return (
    <BaseDialog.Root<Payload>
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      modal={modal}
      disablePointerDismissal={disablePointerDismissal}
      handle={handle}
      actionsRef={actionsRef}
      triggerId={triggerId}
      defaultTriggerId={defaultTriggerId}
    >
      {(renderProps) => (
        <>
          {trigger && (
            <BaseDialog.Trigger
              render={React.isValidElement(trigger) ? trigger : undefined}
              className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BaseDialog.Trigger>
          )}
          <BaseDialog.Portal>
            <BaseDialog.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none" />
            <BaseDialog.Viewport
              className={cn(
                'fixed inset-0 z-50 p-4',
                isOutsideScroll
                  ? 'overflow-y-auto flex min-h-full items-center justify-center'
                  : 'flex items-center justify-center'
              )}
            >
              <BaseDialog.Popup
                initialFocus={initialFocus}
                finalFocus={finalFocus}
                className={cn(
                  'w-full p-6 rounded-lg bg-surface border border-outline-variant shadow-modal will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
                  isOutsideScroll ? 'my-auto' : 'max-h-[calc(100vh-2rem)] overflow-y-auto',
                  sizeClasses[size] || sizeClasses.md,
                  className
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <BaseDialog.Title className="font-heading text-xl font-bold text-on-surface">
                    {title}
                  </BaseDialog.Title>
                  <BaseDialog.Close
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
                  </BaseDialog.Close>
                </div>
                {description && (
                  <BaseDialog.Description className="font-sans text-sm text-on-surface-variant mb-6 leading-relaxed">
                    {description}
                  </BaseDialog.Description>
                )}
                {typeof children === 'function' ? children(renderProps) : children}
                {footer ? (
                  <div className="mt-6">{footer}</div>
                ) : (
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <BaseDialog.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded-md h-11 px-5 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      {cancelLabel}
                    </BaseDialog.Close>
                    {closeOnConfirm ? (
                      <BaseDialog.Close
                        render={
                          <Button
                            variant="filled"
                            colorRole="primary"
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
                        colorRole="primary"
                        size="md"
                        onClick={() => {
                          onConfirm?.();
                        }}
                      >
                        {confirmLabel}
                      </Button>
                    )}
                  </div>
                )}
              </BaseDialog.Popup>
            </BaseDialog.Viewport>
          </BaseDialog.Portal>
        </>
      )}
    </BaseDialog.Root>
  );
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
  containerClassName?: string;
  backdropClassName?: string;
}

// Standard composable compound slots
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, size = 'md', scroll = 'inside', containerClassName, backdropClassName, ...props }, ref) => {
    const isOutsideScroll = scroll === 'outside';
    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            'fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none',
            backdropClassName
          )}
        />
        <BaseDialog.Viewport
          className={cn(
            'fixed inset-0 z-50 p-4',
            isOutsideScroll
              ? 'overflow-y-auto flex min-h-full items-center justify-center'
              : 'flex items-center justify-center',
            containerClassName
          )}
        >
          <BaseDialog.Popup
            ref={ref}
            className={cn(
              'w-full p-6 rounded-lg bg-surface border border-outline-variant shadow-modal will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
              isOutsideScroll ? 'my-auto' : 'max-h-[calc(100vh-2rem)] overflow-y-auto',
              sizeClasses[size] || sizeClasses.md,
              className
            )}
            {...props}
          >
            {children}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

export const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-2', className)} {...props} />
);
DialogBody.displayName = 'DialogBody';

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-3 mt-6', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn('font-heading text-xl font-bold text-on-surface', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn('font-sans text-sm text-on-surface-variant leading-relaxed', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    className={cn(
      'w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
));
DialogClose.displayName = 'DialogClose';

// Compound Base UI exports
export const Dialog = Object.assign(DialogComponent, {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Portal: BaseDialog.Portal,
  Backdrop: BaseDialog.Backdrop,
  Overlay: BaseDialog.Backdrop,
  Viewport: BaseDialog.Viewport,
  Popup: BaseDialog.Popup,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  createHandle: BaseDialog.createHandle,
  Handle: BaseDialog.Handle,
});

export { BaseDialog };
export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;
export const DialogBackdrop = BaseDialog.Backdrop;
export const DialogOverlay = BaseDialog.Backdrop;
export const DialogViewport = BaseDialog.Viewport;
export const DialogPopup = BaseDialog.Popup;
export const createDialogHandle = BaseDialog.createHandle;
export const DialogHandle = BaseDialog.Handle;

export default Dialog;
