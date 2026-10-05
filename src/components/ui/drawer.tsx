/**
 * Drawer primitive (@base-ui/react/drawer).
 *
 * Base UI Documentation: https://base-ui.com/react/components/drawer
 *
 * TAXONOMY & USAGE:
 * - Use Drawer for slide-over side panels or bottom sheets with swipe dismissal gestures,
 *   snap points, and background indent effects.
 * - For focused modal dialogs without swipe gestures, use Dialog instead.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: BaseDrawer.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  swipeDirection?: 'right' | 'left' | 'down' | 'up';
  snapPoints?: BaseDrawer.Root.SnapPoint[];
  snapToSequentialPoints?: boolean;
  snapPoint?: BaseDrawer.Root.SnapPoint | null;
  defaultSnapPoint?: BaseDrawer.Root.SnapPoint | null;
  onSnapPointChange?: (snapPoint: BaseDrawer.Root.SnapPoint | null) => void;
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  actionsRef?: React.RefObject<BaseDrawer.Root.Actions | null>;
  handle?: BaseDrawer.Handle<any>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  showCloseButton?: boolean;
  showHandle?: boolean;
  className?: string;
  popupClassName?: string;
}

export const drawerViewportClasses: Record<'right' | 'left' | 'down' | 'up', string> = {
  right: 'fixed inset-y-0 right-0 z-50 flex max-w-full justify-end',
  left: 'fixed inset-y-0 left-0 z-50 flex max-w-full justify-start',
  down: 'fixed inset-x-0 bottom-0 z-50 flex max-h-full items-end justify-center',
  up: 'fixed inset-x-0 top-0 z-50 flex max-h-full items-start justify-center',
};

export const drawerPopupClasses: Record<'right' | 'left' | 'down' | 'up', string> = {
  right:
    'w-screen max-w-md h-full rounded-none border-l-2 border-y-0 border-r-0 border-outline-variant bg-surface shadow-modal data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full will-change-transform transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none',
  left:
    'w-screen max-w-md h-full rounded-none border-r-2 border-y-0 border-l-0 border-outline-variant bg-surface shadow-modal data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full will-change-transform transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none',
  down:
    'w-full max-h-[88vh] rounded-none border-t-2 border-x-0 border-b-0 border-outline-variant bg-surface shadow-modal data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full will-change-transform transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none',
  up:
    'w-full max-h-[88vh] rounded-none border-b-2 border-x-0 border-t-0 border-outline-variant bg-surface shadow-modal data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full will-change-transform transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] motion-reduce:transition-none',
};

// Visual grab handle pill
export const DrawerHandlePill = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto my-3 h-1.5 w-12 rounded-full bg-outline-variant shrink-0 select-none cursor-grab',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
);
DrawerHandlePill.displayName = 'DrawerHandlePill';

// Accessible Close button
export interface DrawerCloseButtonProps extends React.ComponentPropsWithoutRef<typeof BaseDrawer.Close> {
  className?: string;
}

export const DrawerCloseButton = React.forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  ({ className, children, ...props }, ref) => (
    <BaseDrawer.Close
      ref={ref}
      className={cn(
        'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer',
        className
      )}
      aria-label="Close drawer"
      {...props}
    >
      {children || (
        <span className="material-symbols-outlined text-2xl select-none" aria-hidden="true">
          close
        </span>
      )}
    </BaseDrawer.Close>
  )
);
DrawerCloseButton.displayName = 'DrawerCloseButton';

// Standard layout slots
export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-2 flex-1 overflow-y-auto', className)} {...props} />
);
DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-6 border-t border-outline-variant flex items-center justify-end gap-3 mt-6', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Title>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Title
    ref={ref}
    className={cn('font-heading text-xl font-bold text-on-surface', className)}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Description>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Description
    ref={ref}
    className={cn('font-sans text-base text-on-surface-variant mb-4', className)}
    {...props}
  />
));
DrawerDescription.displayName = 'DrawerDescription';

export const DrawerBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-slow)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]',
      className
    )}
    {...props}
  />
));
DrawerBackdrop.displayName = 'DrawerBackdrop';

export const DrawerOverlay = DrawerBackdrop;

export const DrawerViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Viewport> & {
    swipeDirection?: 'right' | 'left' | 'down' | 'up';
  }
>(({ className, swipeDirection = 'right', ...props }, ref) => (
  <BaseDrawer.Viewport
    ref={ref}
    className={cn(drawerViewportClasses[swipeDirection], className)}
    {...props}
  />
));
DrawerViewport.displayName = 'DrawerViewport';

export const DrawerPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup> & {
    swipeDirection?: 'right' | 'left' | 'down' | 'up';
  }
>(({ className, swipeDirection = 'right', ...props }, ref) => (
  <BaseDrawer.Popup
    ref={ref}
    className={cn(
      'p-6 bg-surface shadow-modal flex flex-col justify-between overflow-y-auto will-change-[transform]',
      drawerPopupClasses[swipeDirection],
      className
    )}
    {...props}
  />
));
DrawerPopup.displayName = 'DrawerPopup';

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Content>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Content
    ref={ref}
    className={cn('flex flex-col justify-between h-full', className)}
    {...props}
  />
));
DrawerContent.displayName = 'DrawerContent';

// Composable Panel wrapper combining Portal, Backdrop, Viewport, and Popup
export interface DrawerPanelProps {
  children: React.ReactNode;
  swipeDirection?: 'right' | 'left' | 'down' | 'up';
  showHandle?: boolean;
  className?: string;
  backdropClassName?: string;
}

export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  children,
  swipeDirection = 'right',
  showHandle = true,
  className,
  backdropClassName,
}) => (
  <BaseDrawer.Portal>
    <DrawerBackdrop className={backdropClassName} />
    <DrawerViewport swipeDirection={swipeDirection}>
      <DrawerPopup swipeDirection={swipeDirection} className={className}>
        <DrawerContent>
          {showHandle && swipeDirection === 'down' && <DrawerHandlePill />}
          {children}
        </DrawerContent>
      </DrawerPopup>
    </DrawerViewport>
  </BaseDrawer.Portal>
);
DrawerPanel.displayName = 'DrawerPanel';

const DrawerComponent: React.FC<DrawerProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  trigger,
  title,
  description,
  children,
  footer,
  swipeDirection = 'right',
  snapPoints,
  snapToSequentialPoints,
  snapPoint,
  defaultSnapPoint,
  onSnapPointChange,
  modal = true,
  disablePointerDismissal,
  actionsRef,
  handle,
  triggerId,
  defaultTriggerId,
  showCloseButton = true,
  showHandle = true,
  className,
  popupClassName,
}) => {
  // If used as pure headless compound root without shorthand config
  if (!title && !description && !trigger && !footer) {
    return (
      <BaseDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        swipeDirection={swipeDirection}
        snapPoints={snapPoints}
        snapToSequentialPoints={snapToSequentialPoints}
        snapPoint={snapPoint}
        defaultSnapPoint={defaultSnapPoint}
        onSnapPointChange={onSnapPointChange}
        modal={modal}
        disablePointerDismissal={disablePointerDismissal}
        actionsRef={actionsRef}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
      >
        {children}
      </BaseDrawer.Root>
    );
  }

  return (
    <BaseDrawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      swipeDirection={swipeDirection}
      snapPoints={snapPoints}
      snapToSequentialPoints={snapToSequentialPoints}
      snapPoint={snapPoint}
      defaultSnapPoint={defaultSnapPoint}
      onSnapPointChange={onSnapPointChange}
      modal={modal}
      disablePointerDismissal={disablePointerDismissal}
      actionsRef={actionsRef}
      handle={handle}
      triggerId={triggerId}
      defaultTriggerId={defaultTriggerId}
    >
      {trigger && (
        <BaseDrawer.Trigger
          render={React.isValidElement(trigger) ? trigger : undefined}
          className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
        >
          {!React.isValidElement(trigger) ? trigger : undefined}
        </BaseDrawer.Trigger>
      )}
      <BaseDrawer.Portal>
        <DrawerBackdrop />
        <DrawerViewport swipeDirection={swipeDirection}>
          <DrawerPopup
            swipeDirection={swipeDirection}
            className={cn(popupClassName, className)}
          >
            <DrawerContent>
              <div>
                {showHandle && swipeDirection === 'down' && <DrawerHandlePill />}
                <div className="flex items-center justify-between mb-4">
                  {title && <DrawerTitle>{title}</DrawerTitle>}
                  {showCloseButton && (
                    <DrawerCloseButton aria-label="Close drawer panel" />
                  )}
                </div>
                {description && <DrawerDescription>{description}</DrawerDescription>}
                {children}
              </div>
              {footer ? (
                <div className="pt-6 border-t border-outline-variant mt-6">{footer}</div>
              ) : (
                <div className="pt-6 border-t border-outline-variant flex items-center justify-end gap-3 mt-6">
                  <BaseDrawer.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded h-11 px-5 min-h-[44px] bg-surface text-on-surface border border-outline hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer">
                    Close panel
                  </BaseDrawer.Close>
                </div>
              )}
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};

// Compound export mapping Base UI primitives
export const Drawer = Object.assign(DrawerComponent, {
  Root: BaseDrawer.Root,
  Trigger: BaseDrawer.Trigger,
  Portal: BaseDrawer.Portal,
  Backdrop: DrawerBackdrop,
  Overlay: DrawerOverlay,
  Viewport: DrawerViewport,
  Popup: DrawerPopup,
  Content: DrawerContent,
  Panel: DrawerPanel,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: BaseDrawer.Close,
  CloseButton: DrawerCloseButton,
  HandlePill: DrawerHandlePill,
  SwipeArea: BaseDrawer.SwipeArea,
  Indent: BaseDrawer.Indent,
  IndentBackground: BaseDrawer.IndentBackground,
  VirtualKeyboardProvider: BaseDrawer.VirtualKeyboardProvider,
  Provider: BaseDrawer.Provider,
  createHandle: BaseDrawer.createHandle,
  Handle: BaseDrawer.Handle,
});

// Re-export Base UI primitives for compound composition
export { BaseDrawer };
export const DrawerRoot = BaseDrawer.Root;
export const DrawerTrigger = BaseDrawer.Trigger;
export const DrawerPortal = BaseDrawer.Portal;
export const DrawerSwipeArea = BaseDrawer.SwipeArea;
export const DrawerIndent = BaseDrawer.Indent;
export const DrawerIndentBackground = BaseDrawer.IndentBackground;
export const DrawerVirtualKeyboardProvider = BaseDrawer.VirtualKeyboardProvider;
export const DrawerClose = BaseDrawer.Close;
export const DrawerProvider = BaseDrawer.Provider;
export const DrawerHandle = BaseDrawer.Handle;
export const createDrawerHandle = BaseDrawer.createHandle;

export default Drawer;
