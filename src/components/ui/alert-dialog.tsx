'use client';

import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from './button';
import { Icon } from './icon';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';
import { dialogSizeClasses, type DialogSize } from './dialog';

const AlertDialogPortalScopeContext = React.createContext(false);

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
  keepMounted?: boolean;
  container?: BaseAlertDialog.Portal.Props['container'];
  containerClassName?: BaseAlertDialog.Viewport.Props['className'];
  backdropClassName?: BaseAlertDialog.Backdrop.Props['className'];
  className?: BaseAlertDialog.Popup.Props['className'];
}

export const AlertDialogPortal = React.forwardRef<HTMLDivElement, BaseAlertDialog.Portal.Props>(
  ({ container, keepMounted, children, ...props }, ref) => (
    <AlertDialogPortalScopeContext.Provider value={Boolean(container)}>
      <BaseAlertDialog.Portal ref={ref} container={container} keepMounted={keepMounted} {...props}>
        {children}
      </BaseAlertDialog.Portal>
    </AlertDialogPortalScopeContext.Provider>
  )
);
AlertDialogPortal.displayName = 'AlertDialogPortal';

export const AlertDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Backdrop>
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(AlertDialogPortalScopeContext);
  return (
    <BaseAlertDialog.Backdrop
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={composeClassName(
        cn(
          isScoped ? 'absolute inset-0' : 'fixed inset-0',
          'bg-on-surface/50 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    />
  );
});
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop';

export interface AlertDialogViewportProps
  extends React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Viewport> {
  scroll?: 'inside' | 'outside';
}

export const AlertDialogViewport = React.forwardRef<HTMLDivElement, AlertDialogViewportProps>(
  ({ className, scroll = 'inside', ...props }, ref) => {
    const isScoped = React.useContext(AlertDialogPortalScopeContext);
    const isOutsideScroll = scroll === 'outside';

    return (
      <BaseAlertDialog.Viewport
        ref={ref}
        data-slot="alert-dialog-viewport"
        className={composeClassName(
          cn(
            isScoped ? 'absolute inset-0 z-50 p-4' : 'fixed inset-0 z-50 p-4',
            isOutsideScroll
              ? 'overflow-y-auto flex min-h-full items-start justify-center'
              : 'flex items-center justify-center'
          ),
          className
        )}
        {...props}
      />
    );
  }
);
AlertDialogViewport.displayName = 'AlertDialogViewport';

export interface AlertDialogPopupProps
  extends React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> {
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
}

export const AlertDialogPopup = React.forwardRef<HTMLDivElement, AlertDialogPopupProps>(
  ({ className, size = 'md', scroll = 'inside', ...props }, ref) => {
    const isOutsideScroll = scroll === 'outside';

    return (
      <BaseAlertDialog.Popup
        ref={ref}
        data-slot="alert-dialog-content"
        className={composeClassName(
          cn(
            '@container w-full p-6 rounded-lg bg-surface border border-outline-variant shadow-modal flex flex-col gap-4 will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
            isOutsideScroll ? 'my-auto' : 'max-h-[calc(100dvh-2rem)] overflow-y-auto',
            dialogSizeClasses[size] || dialogSizeClasses.md
          ),
          className
        )}
        {...props}
      />
    );
  }
);
AlertDialogPopup.displayName = 'AlertDialogPopup';

function AlertDialogComponentInner<Payload = unknown>(
  rawProps: AlertDialogProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const isShorthand =
    'title' in rawProps ||
    'description' in rawProps ||
    'trigger' in rawProps ||
    'onConfirm' in rawProps;

  const {
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
    keepMounted,
    container,
    containerClassName,
    backdropClassName,
    className,
  } = rawProps;

  // If used as composable compound root (<AlertDialog open={...}><AlertDialogContent>...</AlertDialogContent></AlertDialog>)
  if (!isShorthand) {
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
              data-slot="alert-dialog-trigger"
              render={React.isValidElement(trigger) ? trigger : undefined}
              nativeButton={resolveNativeButton(trigger)}
              className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BaseAlertDialog.Trigger>
          )}
          <AlertDialogPortal container={container} keepMounted={keepMounted}>
            <AlertDialogBackdrop className={backdropClassName} />
            <AlertDialogViewport scroll={scroll} className={containerClassName}>
              <AlertDialogPopup
                ref={ref}
                size={size}
                scroll={scroll}
                initialFocus={initialFocus}
                finalFocus={finalFocus}
                className={className}
              >
                <div data-slot="alert-dialog-header" className="flex items-start gap-3">
                  <div className="size-7 rounded-sm bg-error-container text-error flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="warning" size="md" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <BaseAlertDialog.Title data-slot="alert-dialog-title" className={cn('text-headline-sm text-on-surface', !title && 'sr-only')}>
                      {title || 'Alert'}
                    </BaseAlertDialog.Title>
                    {description && (
                      <BaseAlertDialog.Description data-slot="alert-dialog-description" className="font-sans text-base text-on-surface-variant mt-1 leading-relaxed text-pretty">
                        {description}
                      </BaseAlertDialog.Description>
                    )}
                  </div>
                </div>
                {typeof children === 'function' ? children(renderProps) : children}
                <div data-slot="alert-dialog-footer" className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-outline-variant">
                  <BaseAlertDialog.Close
                    data-slot="alert-dialog-cancel"
                    render={
                      <Button variant="outline" colorRole="neutral" size="md">
                        {cancelLabel}
                      </Button>
                    }
                  />
                  {closeOnConfirm ? (
                    <BaseAlertDialog.Close
                      data-slot="alert-dialog-action"
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
                      data-slot="alert-dialog-action"
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
              </AlertDialogPopup>
            </AlertDialogViewport>
          </AlertDialogPortal>
        </>
      )}
    </BaseAlertDialog.Root>
  );
}

const AlertDialogComponent = React.forwardRef(AlertDialogComponentInner) as (<Payload = unknown>(
  props: AlertDialogProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
AlertDialogComponent.displayName = 'AlertDialog';

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> {
  size?: DialogSize;
  scroll?: 'inside' | 'outside';
  keepMounted?: boolean;
  container?: BaseAlertDialog.Portal.Props['container'];
  containerClassName?: BaseAlertDialog.Viewport.Props['className'];
  backdropClassName?: BaseAlertDialog.Backdrop.Props['className'];
}

// Standard composable compound slots
export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, size = 'md', scroll = 'inside', keepMounted, container, containerClassName, backdropClassName, ...props }, ref) => (
    <AlertDialogPortal container={container} keepMounted={keepMounted}>
      <AlertDialogBackdrop className={backdropClassName} />
      <AlertDialogViewport scroll={scroll} className={containerClassName}>
        <AlertDialogPopup ref={ref} size={size} scroll={scroll} className={className} {...props}>
          {children}
        </AlertDialogPopup>
      </AlertDialogViewport>
    </AlertDialogPortal>
  )
);
AlertDialogContent.displayName = 'AlertDialogContent';

export type AlertDialogTriggerProps<Payload = unknown> = BaseAlertDialog.Trigger.Props<Payload>;

export const AlertDialogTrigger = React.forwardRef(function AlertDialogTrigger<Payload = unknown>(
  { render, nativeButton, ...props }: AlertDialogTriggerProps<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <BaseAlertDialog.Trigger
      ref={ref}
      data-slot="alert-dialog-trigger"
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      {...props}
    />
  );
}) as (<Payload = unknown>(
  props: AlertDialogTriggerProps<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export const AlertDialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-dialog-header" className={cn('flex flex-col gap-2 text-start', className)} {...props} />
  )
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-dialog-media"
      className={cn(
        'inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface [&_svg:not([class*="size-"])]:size-6',
        className
      )}
      {...props}
    />
  )
);
AlertDialogMedia.displayName = 'AlertDialogMedia';

export const AlertDialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-dialog-body" className={cn('py-2 font-sans text-base text-on-surface-variant leading-relaxed', className)} {...props} />
  )
);
AlertDialogBody.displayName = 'AlertDialogBody';

export const AlertDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-dialog-footer" className={cn('flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-outline-variant', className)} {...props} />
  )
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={composeClassName('text-headline-sm text-on-surface', className)}
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
    data-slot="alert-dialog-description"
    className={composeClassName('font-sans text-base text-on-surface-variant leading-relaxed text-pretty', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, render, nativeButton, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    data-slot="alert-dialog-action"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'inline-flex items-center justify-center font-label text-sm font-semibold rounded h-12 px-5 min-h-[48px] bg-error text-on-error hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  />
));
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, render, nativeButton, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    data-slot="alert-dialog-cancel"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'inline-flex items-center justify-center font-label text-sm font-semibold rounded h-12 px-5 min-h-[48px] bg-surface text-on-surface border-2 border-outline hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

export const AlertDialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Close>
>(({ className, render, nativeButton, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    data-slot="alert-dialog-close"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  />
));
AlertDialogClose.displayName = 'AlertDialogClose';

// Compound export mapping Base UI primitives
export const AlertDialog = Object.assign(AlertDialogComponent, {
  Root: BaseAlertDialog.Root,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Overlay: AlertDialogBackdrop,
  Viewport: AlertDialogViewport,
  Popup: AlertDialogPopup,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Media: AlertDialogMedia,
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
export const AlertDialogPortalPrimitive = BaseAlertDialog.Portal;
export const AlertDialogBackdropPrimitive = BaseAlertDialog.Backdrop;
export const AlertDialogOverlay = AlertDialogBackdrop;
export const AlertDialogViewportPrimitive = BaseAlertDialog.Viewport;
export const AlertDialogPopupPrimitive = BaseAlertDialog.Popup;
export const createAlertDialogHandle = BaseAlertDialog.createHandle;
export const AlertDialogHandle = BaseAlertDialog.Handle;

export default AlertDialog;
