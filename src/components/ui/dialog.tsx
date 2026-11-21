'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './button';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

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
  keepMounted?: boolean;
  className?: BaseDialog.Popup.Props['className'];
}

export const dialogSizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  fullscreen: 'max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] h-full',
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
  keepMounted,
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
              data-slot="dialog-trigger"
              render={React.isValidElement(trigger) ? trigger : undefined}
              nativeButton={resolveNativeButton(trigger)}
              className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BaseDialog.Trigger>
          )}
          <BaseDialog.Portal keepMounted={keepMounted}>
            <BaseDialog.Backdrop data-slot="dialog-overlay" className="fixed inset-0 bg-on-surface/40 z-50 overflow-hidden overscroll-contain transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none" />
            <BaseDialog.Viewport
              data-slot="dialog-viewport"
              className={cn(
                'fixed inset-0 z-50 p-4',
                isOutsideScroll
                  ? 'overflow-y-auto flex min-h-full items-start justify-center'
                  : 'flex items-center justify-center'
              )}
            >
              <BaseDialog.Popup
                data-slot="dialog-content"
                initialFocus={initialFocus}
                finalFocus={finalFocus}
                className={composeClassName(
                  cn(
                    'w-full p-6 rounded-lg bg-surface border border-outline-variant shadow-modal overscroll-contain transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
                    isOutsideScroll ? 'my-auto' : 'max-h-[calc(100dvh-2rem)] overflow-y-auto',
                    dialogSizeClasses[size] || dialogSizeClasses.md
                  ),
                  className
                )}
              >
                <div data-slot="dialog-header" className="flex items-center justify-between mb-2">
                  <BaseDialog.Title data-slot="dialog-title" className={cn('font-heading text-xl font-bold text-on-surface text-balance', !title && 'sr-only')}>
                    {title || 'Dialog'}
                  </BaseDialog.Title>
                  <BaseDialog.Close
                    data-slot="dialog-close"
                    className="size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
                  </BaseDialog.Close>
                </div>
                {description && (
                  <BaseDialog.Description data-slot="dialog-description" className="font-sans text-sm text-on-surface-variant mb-6 leading-relaxed text-pretty">
                    {description}
                  </BaseDialog.Description>
                )}
                {typeof children === 'function' ? children(renderProps) : children}
                {footer ? (
                  <div data-slot="dialog-footer" className="mt-6">{footer}</div>
                ) : (
                  <div data-slot="dialog-footer" className="flex items-center justify-end gap-3 mt-6">
                    <BaseDialog.Close
                      data-slot="dialog-close"
                      render={
                        <Button variant="outline" colorRole="neutral" size="md">
                          {cancelLabel}
                        </Button>
                      }
                    />
                    {closeOnConfirm ? (
                      <BaseDialog.Close
                        data-slot="dialog-close"
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
  showCloseButton?: boolean;
  keepMounted?: boolean;
  containerClassName?: BaseDialog.Viewport.Props['className'];
  backdropClassName?: BaseDialog.Backdrop.Props['className'];
}

// Standard composable compound slots
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, size = 'md', scroll = 'inside', showCloseButton = true, keepMounted, containerClassName, backdropClassName, ...props }, ref) => {
    const isOutsideScroll = scroll === 'outside';
    return (
      <BaseDialog.Portal keepMounted={keepMounted}>
        <BaseDialog.Backdrop
          data-slot="dialog-overlay"
          className={composeClassName(
            'fixed inset-0 bg-on-surface/40 z-50 overflow-hidden overscroll-contain transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none',
            backdropClassName
          )}
        />
        <BaseDialog.Viewport
          data-slot="dialog-viewport"
          className={composeClassName(
            cn(
              'fixed inset-0 z-50 p-4',
              isOutsideScroll
                ? 'overflow-y-auto flex min-h-full items-start justify-center'
                : 'flex items-center justify-center'
            ),
            containerClassName
          )}
        >
          <BaseDialog.Popup
            ref={ref}
            data-slot="dialog-content"
            className={composeClassName(
              cn(
                'relative w-full p-6 rounded-lg bg-surface border border-outline-variant shadow-modal overscroll-contain transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
                isOutsideScroll ? 'my-auto' : 'max-h-[calc(100dvh-2rem)] overflow-y-auto',
                dialogSizeClasses[size] || dialogSizeClasses.md
              ),
              className
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogClose
                className="absolute top-3 end-3"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
              </DialogClose>
            )}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Trigger>
>(({ render, nativeButton, ...props }, ref) => (
  <BaseDialog.Trigger
    ref={ref}
    data-slot="dialog-trigger"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    {...props}
  />
));
DialogTrigger.displayName = 'DialogTrigger';

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="dialog-header" className={cn('flex flex-col gap-1.5 text-start mb-4', className)} {...props} />
  )
);
DialogHeader.displayName = 'DialogHeader';

export const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="dialog-body" className={cn('py-2', className)} {...props} />
  )
);
DialogBody.displayName = 'DialogBody';

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="dialog-footer" className={cn('flex items-center justify-end gap-3 mt-6', className)} {...props} />
  )
);
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    data-slot="dialog-title"
    className={composeClassName('font-heading text-xl font-bold text-on-surface text-balance', className)}
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
    data-slot="dialog-description"
    className={composeClassName('font-sans text-sm text-on-surface-variant leading-relaxed text-pretty', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Close>
>(({ className, render, nativeButton, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    data-slot="dialog-close"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  />
));
DialogClose.displayName = 'DialogClose';

// Compound Base UI exports
export const Dialog = Object.assign(DialogComponent, {
  Root: BaseDialog.Root,
  Trigger: DialogTrigger,
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
export const DialogPortal = BaseDialog.Portal;
export const DialogBackdrop = BaseDialog.Backdrop;
export const DialogOverlay = BaseDialog.Backdrop;
export const DialogViewport = BaseDialog.Viewport;
export const DialogPopup = BaseDialog.Popup;
export const createDialogHandle = BaseDialog.createHandle;
export const DialogHandle = BaseDialog.Handle;

export default Dialog;
