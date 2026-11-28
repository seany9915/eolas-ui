'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './button';
import { Icon } from './icon';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

export type DialogSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | 'fullscreen'
  | (string & {});

interface DialogContextValue {
  modal: boolean | 'trap-focus';
}

const DialogContext = React.createContext<DialogContextValue>({ modal: true });
const DialogPortalScopeContext = React.createContext(false);

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
  /** Removes popup padding; when paired with `size="fullscreen"`, renders an edge-to-edge `h-dvh` viewport modal without outer margins, border, or radius. Callers should still provide a visible or `sr-only` `<DialogTitle>`. */
  flush?: boolean;
  scroll?: 'inside' | 'outside';
  footer?: React.ReactNode;
  initialFocus?: BaseDialog.Popup.Props['initialFocus'];
  finalFocus?: BaseDialog.Popup.Props['finalFocus'];
  showBackdrop?: boolean;
  keepMounted?: boolean;
  container?: BaseDialog.Portal.Props['container'];
  containerClassName?: BaseDialog.Viewport.Props['className'];
  backdropClassName?: BaseDialog.Backdrop.Props['className'];
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

export const DialogPortal = React.forwardRef<HTMLDivElement, BaseDialog.Portal.Props>(
  ({ container, keepMounted, children, ...props }, ref) => (
    <DialogPortalScopeContext.Provider value={Boolean(container)}>
      <BaseDialog.Portal ref={ref} container={container} keepMounted={keepMounted} {...props}>
        {children}
      </BaseDialog.Portal>
    </DialogPortalScopeContext.Provider>
  )
);
DialogPortal.displayName = 'DialogPortal';

export const DialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(DialogPortalScopeContext);
  return (
    <BaseDialog.Backdrop
      ref={ref}
      data-slot="dialog-overlay"
      className={composeClassName(
        cn(
          isScoped ? 'absolute inset-0' : 'fixed inset-0',
          'bg-on-surface/40 z-50 overflow-hidden overscroll-contain transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    />
  );
});
DialogBackdrop.displayName = 'DialogBackdrop';

export interface DialogViewportProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Viewport> {
  scroll?: 'inside' | 'outside';
  flush?: boolean;
  size?: DialogSize;
  modal?: boolean | 'trap-focus';
}

export const DialogViewport = React.forwardRef<HTMLDivElement, DialogViewportProps>(
  ({ className, scroll = 'inside', flush = false, size = 'md', modal, ...props }, ref) => {
    const { modal: contextModal } = React.useContext(DialogContext);
    const isScoped = React.useContext(DialogPortalScopeContext);
    const resolvedModal = modal ?? contextModal;
    const isOutsideScroll = scroll === 'outside';
    const isEdgeToEdge = flush && size === 'fullscreen';

    return (
      <BaseDialog.Viewport
        ref={ref}
        data-slot="dialog-viewport"
        className={composeClassName(
          cn(
            isScoped ? 'absolute inset-0 z-50' : 'fixed inset-0 z-50',
            isEdgeToEdge ? 'p-0' : 'p-4',
            isOutsideScroll
              ? 'overflow-y-auto flex min-h-full items-start justify-center'
              : 'flex items-center justify-center',
            resolvedModal === false && 'pointer-events-none'
          ),
          className
        )}
        {...props}
      />
    );
  }
);
DialogViewport.displayName = 'DialogViewport';

export interface DialogPopupProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  size?: DialogSize;
  flush?: boolean;
  scroll?: 'inside' | 'outside';
}

export const DialogPopup = React.forwardRef<HTMLDivElement, DialogPopupProps>(
  ({ className, size = 'md', flush = false, scroll = 'inside', ...props }, ref) => {
    const isOutsideScroll = scroll === 'outside';
    const isEdgeToEdge = flush && size === 'fullscreen';

    return (
      <BaseDialog.Popup
        ref={ref}
        data-slot="dialog-content"
        className={composeClassName(
          cn(
            'pointer-events-auto',
            isEdgeToEdge
              ? '@container relative w-full max-w-none h-dvh min-h-dvh max-h-dvh p-0 rounded-none bg-surface border-0 shadow-none overflow-y-auto overscroll-contain transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none'
              : cn(
                  '@container relative w-full rounded-lg bg-surface border border-outline-variant shadow-modal overscroll-contain transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] data-[nested-dialog-open]:scale-[0.97] data-[nested-dialog-open]:opacity-80 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
                  flush ? 'p-0' : 'p-6',
                  isOutsideScroll ? 'my-auto' : 'max-h-[calc(100dvh-2rem)] overflow-y-auto',
                  dialogSizeClasses[size] || dialogSizeClasses.md
                )
          ),
          className
        )}
        {...props}
      />
    );
  }
);
DialogPopup.displayName = 'DialogPopup';

export function DialogRoot<Payload = unknown>({
  modal = true,
  ...props
}: BaseDialog.Root.Props<Payload>): React.JSX.Element {
  const dialogContextValue = React.useMemo(() => ({ modal }), [modal]);
  return (
    <DialogContext.Provider value={dialogContextValue}>
      <BaseDialog.Root<Payload> modal={modal} {...props} />
    </DialogContext.Provider>
  );
}

function DialogComponentInner<Payload = unknown>(
  rawProps: DialogProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const isShorthand =
    'title' in rawProps ||
    'description' in rawProps ||
    'trigger' in rawProps ||
    'footer' in rawProps ||
    'onConfirm' in rawProps;

  const {
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
    flush = false,
    scroll = 'inside',
    footer,
    initialFocus,
    finalFocus,
    showBackdrop,
    keepMounted,
    container,
    containerClassName,
    backdropClassName,
    className,
  } = rawProps;

  // If used as composable compound root (<Dialog open={...}><DialogContent>...</DialogContent></Dialog>)
  if (!isShorthand) {
    return (
      <DialogRoot<Payload>
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
      </DialogRoot>
    );
  }

  return (
    <DialogRoot<Payload>
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
          <DialogContent
            ref={ref}
            size={size}
            flush={flush}
            scroll={scroll}
            showCloseButton={false}
            showBackdrop={showBackdrop}
            keepMounted={keepMounted}
            container={container}
            containerClassName={containerClassName}
            backdropClassName={backdropClassName}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={className}
          >
            <div data-slot="dialog-header" className="flex items-start justify-between gap-2 mb-2">
              <DialogTitle className={cn(!title && 'sr-only')}>
                {title || 'Dialog'}
              </DialogTitle>
              <DialogClose className="-me-3 -mt-3 shrink-0" aria-label="Close dialog" />
            </div>
            {description && (
              <DialogDescription className="mb-6">
                {description}
              </DialogDescription>
            )}
            {typeof children === 'function' ? children(renderProps) : children}
            {footer ? (
              <div data-slot="dialog-footer" className="mt-6">{footer}</div>
            ) : (
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="outline" colorRole="neutral" size="md">
                      {cancelLabel}
                    </Button>
                  }
                />
                {onConfirm &&
                  (closeOnConfirm ? (
                    <DialogClose
                      render={
                        <Button
                          variant="filled"
                          colorRole="primary"
                          size="md"
                          onClick={() => {
                            onConfirm();
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
                        onConfirm();
                      }}
                    >
                      {confirmLabel}
                    </Button>
                  ))}
              </DialogFooter>
            )}
          </DialogContent>
        </>
      )}
    </DialogRoot>
  );
}

const DialogComponent = React.forwardRef(DialogComponentInner) as (<Payload = unknown>(
  props: DialogProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
DialogComponent.displayName = 'Dialog';

const DialogContentContext = React.createContext<{ hasCloseButton: boolean }>({
  hasCloseButton: false,
});

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  size?: DialogSize;
  /** Removes popup padding; when paired with `size="fullscreen"`, renders an edge-to-edge `h-dvh` viewport modal without outer margins, border, or radius. Callers should still provide a visible or `sr-only` `<DialogTitle>`. */
  flush?: boolean;
  scroll?: 'inside' | 'outside';
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  keepMounted?: boolean;
  container?: BaseDialog.Portal.Props['container'];
  containerClassName?: BaseDialog.Viewport.Props['className'];
  backdropClassName?: BaseDialog.Backdrop.Props['className'];
}

// Standard composable compound slots
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      children,
      size = 'md',
      flush = false,
      scroll = 'inside',
      showCloseButton = true,
      showBackdrop,
      keepMounted,
      container,
      containerClassName,
      backdropClassName,
      ...props
    },
    ref
  ) => {
    const { modal } = React.useContext(DialogContext);
    const shouldRenderBackdrop = showBackdrop ?? modal !== false;
    const contentContextValue = React.useMemo(
      () => ({ hasCloseButton: showCloseButton }),
      [showCloseButton]
    );

    return (
      <DialogPortal container={container} keepMounted={keepMounted}>
        {shouldRenderBackdrop && <DialogBackdrop className={backdropClassName} />}
        <DialogViewport
          scroll={scroll}
          flush={flush}
          size={size}
          modal={modal}
          className={containerClassName}
        >
          <DialogPopup
            ref={ref}
            size={size}
            flush={flush}
            scroll={scroll}
            className={className}
            {...props}
          >
            <DialogContentContext.Provider value={contentContextValue}>
              {children}
            </DialogContentContext.Provider>
            {showCloseButton && (
              <DialogClose className="absolute top-3 end-3" aria-label="Close dialog" />
            )}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

export type DialogTriggerProps<Payload = unknown> = BaseDialog.Trigger.Props<Payload>;

export const DialogTrigger = React.forwardRef(function DialogTrigger<Payload = unknown>(
  { render, nativeButton, ...props }: DialogTriggerProps<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <BaseDialog.Trigger
      ref={ref}
      data-slot="dialog-trigger"
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      {...props}
    />
  );
}) as (<Payload = unknown>(
  props: DialogTriggerProps<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
DialogTrigger.displayName = 'DialogTrigger';

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { hasCloseButton } = React.useContext(DialogContentContext);
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        className={cn('flex flex-col gap-1.5 text-start mb-4', hasCloseButton && 'pe-12', className)}
        {...props}
      />
    );
  }
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
    <div ref={ref} data-slot="dialog-footer" className={cn('flex flex-wrap items-center justify-end gap-3 mt-6', className)} {...props} />
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
    className={composeClassName('text-headline-sm text-on-surface', className)}
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
    className={composeClassName('font-sans text-base text-on-surface-variant leading-relaxed text-pretty', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Close>
>(({ className, children, render, nativeButton, 'aria-label': ariaLabel, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    data-slot="dialog-close"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    aria-label={ariaLabel ?? (!render && !children ? 'Close dialog' : undefined)}
    className={
      render
        ? className
        : composeClassName(
            'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  >
    {children ?? (render ? undefined : <Icon name="close" size="md" aria-hidden="true" />)}
  </BaseDialog.Close>
));
DialogClose.displayName = 'DialogClose';

// Compound Base UI exports
export const Dialog = Object.assign(DialogComponent, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Overlay: DialogBackdrop,
  Viewport: DialogViewport,
  Popup: DialogPopup,
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
export const DialogRootPrimitive = BaseDialog.Root;
export const DialogPortalPrimitive = BaseDialog.Portal;
export const DialogBackdropPrimitive = BaseDialog.Backdrop;
export const DialogOverlay = DialogBackdrop;
export const DialogViewportPrimitive = BaseDialog.Viewport;
export const DialogPopupPrimitive = BaseDialog.Popup;
export const createDialogHandle = BaseDialog.createHandle;
export const DialogHandle = BaseDialog.Handle;

export default Dialog;
