import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './button';
import { cn } from '@/lib/utils';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'fullscreen' | string;

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean;
  handle?: BaseDialog.Handle<any>;
  actionsRef?: React.RefObject<BaseDialog.Root.Actions | null>;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  size?: DialogSize;
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

const DialogComponent: React.FC<DialogProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  modal = true,
  handle,
  actionsRef,
  trigger,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  closeOnConfirm = true,
  size = 'md',
  footer,
  initialFocus,
  finalFocus,
  className,
}) => {
  // If used as composable compound root (<Dialog open={...}><DialogContent>...</DialogContent></Dialog>)
  if (!title && !description && !trigger && !footer && !onConfirm) {
    return (
      <BaseDialog.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        modal={modal}
        handle={handle}
        actionsRef={actionsRef}
      >
        {children}
      </BaseDialog.Root>
    );
  }

  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      modal={modal}
      handle={handle}
      actionsRef={actionsRef}
    >
      {trigger && (
        <BaseDialog.Trigger
          render={React.isValidElement(trigger) ? trigger : undefined}
          className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
        >
          {!React.isValidElement(trigger) ? trigger : undefined}
        </BaseDialog.Trigger>
      )}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
        <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseDialog.Popup
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={cn(
              'w-full p-6 rounded-[1rem] bg-surface border-[2px] border-outline-variant shadow-modal max-h-[calc(100vh-2rem)] overflow-y-auto will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)]',
              sizeClasses[size] || sizeClasses.md,
              className
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <BaseDialog.Title className="font-heading text-xl font-bold text-on-surface">
                {title}
              </BaseDialog.Title>
              <BaseDialog.Close
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
              </BaseDialog.Close>
            </div>
            {description && (
              <BaseDialog.Description className="font-sans text-base text-on-surface-variant mb-6">
                {description}
              </BaseDialog.Description>
            )}
            {children}
            {footer ? (
              <div className="mt-6">{footer}</div>
            ) : (
              <div className="flex items-center justify-end gap-3 mt-6">
                <BaseDialog.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded-[0.5rem] h-11 px-5 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer">
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
    </BaseDialog.Root>
  );
};

// Standard composable compound slots
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & { size?: DialogSize; containerClassName?: string }
>(({ className, children, size = 'md', ...props }, ref) => (
  <BaseDialog.Portal>
    <BaseDialog.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
    <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <BaseDialog.Popup
        ref={ref}
        className={cn(
          'w-full p-6 rounded-[1rem] bg-surface border-[2px] border-outline-variant shadow-modal max-h-[calc(100vh-2rem)] overflow-y-auto will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)]',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Viewport>
  </BaseDialog.Portal>
));
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
  Title: BaseDialog.Title,
  Description: BaseDialog.Description,
  Close: BaseDialog.Close,
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
export const DialogTitle = BaseDialog.Title;
export const DialogDescription = BaseDialog.Description;
export const DialogClose = BaseDialog.Close;
export const createDialogHandle = BaseDialog.createHandle;
export const DialogHandle = BaseDialog.Handle;

export default Dialog;
