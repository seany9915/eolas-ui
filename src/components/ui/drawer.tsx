'use client';

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
import { Button } from './button';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

export interface DrawerProps<Payload = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'className'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: BaseDrawer.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: BaseDrawer.Root.Props<Payload>['children'];
  footer?: React.ReactNode;
  /** Physical screen edge & swipe dismissal direction matching `@base-ui/react/drawer`. */
  swipeDirection?: 'right' | 'left' | 'down' | 'up';
  snapPoints?: BaseDrawer.Root.SnapPoint[];
  snapToSequentialPoints?: boolean;
  snapPoint?: BaseDrawer.Root.SnapPoint | null;
  defaultSnapPoint?: BaseDrawer.Root.SnapPoint | null;
  onSnapPointChange?: (snapPoint: BaseDrawer.Root.SnapPoint | null, eventDetails?: BaseDrawer.Root.SnapPointChangeEventDetails) => void;
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  actionsRef?: React.RefObject<BaseDrawer.Root.Actions | null>;
  handle?: BaseDrawer.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  showCloseButton?: boolean;
  showHandle?: boolean;
  keepMounted?: boolean;
  container?: BaseDrawer.Portal.Props['container'];
  className?: BaseDrawer.Popup.Props['className'];
  popupClassName?: BaseDrawer.Popup.Props['className'];
}

type DrawerSwipeDirection = 'right' | 'left' | 'down' | 'up';

interface DrawerContextValue {
  swipeDirection: DrawerSwipeDirection;
  popupRef?: React.Ref<HTMLDivElement>;
  popupClassName?: BaseDrawer.Popup.Props['className'];
  popupProps?: Record<string, unknown>;
}

const DrawerContext = React.createContext<DrawerContextValue>({
  swipeDirection: 'right',
});

function mergeDrawerRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') {
        r(node);
      } else if (r && typeof r === 'object') {
        (r as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

export const drawerViewportClasses: Record<'right' | 'left' | 'down' | 'up', string> = {
  right: 'fixed inset-0 z-50 flex max-w-full ltr:justify-end rtl:justify-start',
  left: 'fixed inset-0 z-50 flex max-w-full ltr:justify-start rtl:justify-end',
  down: 'fixed inset-x-0 bottom-0 z-50 flex max-h-full items-end justify-center',
  up: 'fixed inset-x-0 top-0 z-50 flex max-h-full items-start justify-center',
};

export const drawerPopupClasses: Record<'right' | 'left' | 'down' | 'up', string> = {
  right:
    '@container w-full max-w-md h-full flex flex-col rounded-none border-l-2 border-y-0 border-r-0 border-outline-variant bg-surface shadow-modal pr-[calc(1.5rem+env(safe-area-inset-right,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full data-[swiping]:select-none data-[swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  left:
    '@container w-full max-w-md h-full flex flex-col rounded-none border-r-2 border-y-0 border-l-0 border-outline-variant bg-surface shadow-modal pl-[calc(1.5rem+env(safe-area-inset-left,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full data-[swiping]:select-none data-[swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  down:
    '@container w-full max-h-[88dvh] flex flex-col rounded-none border-t-2 border-x-0 border-b-0 border-outline-variant bg-surface shadow-modal pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] [transform:translateY(var(--drawer-swipe-movement-y,0px))] data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full data-[swiping]:select-none data-[swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  up:
    '@container w-full max-h-[88dvh] flex flex-col rounded-none border-b-2 border-x-0 border-t-0 border-outline-variant bg-surface shadow-modal pt-[calc(1.5rem+env(safe-area-inset-top,0px))] [transform:translateY(var(--drawer-swipe-movement-y,0px))] data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full data-[swiping]:select-none data-[swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
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
export interface DrawerCloseButtonProps
  extends React.ComponentPropsWithoutRef<typeof BaseDrawer.Close> {}

export const DrawerCloseButton = React.forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  ({ className, children, render, nativeButton, 'aria-label': ariaLabel, ...props }, ref) => (
    <BaseDrawer.Close
      ref={ref}
      data-slot="drawer-close"
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      className={
        render
          ? className
          : composeClassName(
              'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer',
              className
            )
      }
      aria-label={ariaLabel ?? (!render && !children ? 'Close drawer' : undefined)}
      {...props}
    >
      {children || (
        <Icon name="close" size="lg" aria-hidden="true" />
      )}
    </BaseDrawer.Close>
  )
);
DrawerCloseButton.displayName = 'DrawerCloseButton';

export const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Trigger>
>(({ render, nativeButton, ...props }, ref) => (
  <BaseDrawer.Trigger
    ref={ref}
    data-slot="drawer-trigger"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    {...props}
  />
));
DrawerTrigger.displayName = 'DrawerTrigger';

export const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Close>
>(({ render, nativeButton, ...props }, ref) => (
  <BaseDrawer.Close
    ref={ref}
    data-slot="drawer-close"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    {...props}
  />
));
DrawerClose.displayName = 'DrawerClose';

// Standard layout slots
export const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-header"
      className={cn(
        'grid auto-rows-min items-start gap-1.5 text-start mb-4 has-[>[data-slot=drawer-close]]:grid-cols-[minmax(0,1fr)_auto] [&>[data-slot=drawer-close]]:col-start-2 [&>[data-slot=drawer-close]]:row-start-1 [&>[data-slot=drawer-close]]:self-start [&>[data-slot=drawer-close]]:justify-self-end [&>[data-slot=drawer-close]]:-me-3 [&>[data-slot=drawer-close]]:-mt-3 has-[>[data-slot=drawer-description]]:[&>[data-slot=drawer-close]]:row-span-2',
        className
      )}
      {...props}
    />
  )
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <ScrollArea
      ref={ref}
      data-slot="drawer-body"
      className="flex-1 min-h-0"
      viewportClassName="overscroll-contain"
      contentClassName={className}
      {...props}
    >
      {children}
    </ScrollArea>
  )
);
DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="drawer-footer" className={cn('pt-4 border-t border-outline-variant flex flex-wrap items-center justify-end gap-3 mt-4', className)} {...props} />
  )
);
DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Title>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Title
    ref={ref}
    data-slot="drawer-title"
    className={composeClassName('text-headline-sm text-on-surface', className)}
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
    data-slot="drawer-description"
    className={composeClassName('font-sans text-base text-on-surface-variant leading-relaxed text-pretty', className)}
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
    data-slot="drawer-overlay"
    className={composeClassName(
      'fixed inset-0 bg-on-surface/40 z-50 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none',
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
    swipeDirection?: DrawerSwipeDirection;
  }
>(({ className, swipeDirection, ...props }, ref) => {
  const { swipeDirection: contextDirection } = React.useContext(DrawerContext);
  return (
    <BaseDrawer.Viewport
      ref={ref}
      data-slot="drawer-viewport"
      className={composeClassName(drawerViewportClasses[swipeDirection ?? contextDirection], className)}
      {...props}
    />
  );
});
DrawerViewport.displayName = 'DrawerViewport';

function composePopupClassNames(
  base: string,
  first?: BaseDrawer.Popup.Props['className'],
  second?: BaseDrawer.Popup.Props['className']
): BaseDrawer.Popup.Props['className'] {
  if (typeof first === 'function' || typeof second === 'function') {
    return (state) =>
      cn(
        base,
        typeof first === 'function' ? first(state) : first,
        typeof second === 'function' ? second(state) : second
      );
  }
  return cn(base, first, second);
}

export const DrawerPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup> & {
    swipeDirection?: DrawerSwipeDirection;
  }
>(({ className, swipeDirection, ...props }, ref) => {
  const {
    swipeDirection: contextDirection,
    popupRef,
    popupClassName,
    popupProps,
  } = React.useContext(DrawerContext);
  const mergedRef = popupRef ? mergeDrawerRefs(popupRef, ref) : ref;
  const baseClasses = cn(
    'p-6 bg-surface shadow-modal flex flex-col justify-between overflow-y-auto will-change-[transform]',
    drawerPopupClasses[swipeDirection ?? contextDirection]
  );
  return (
    <BaseDrawer.Popup
      ref={mergedRef}
      data-slot="drawer-popup"
      {...(popupProps as React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup>)}
      className={composePopupClassNames(baseClasses, popupClassName, className)}
      {...props}
    />
  );
});
DrawerPopup.displayName = 'DrawerPopup';

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Content>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Content
    ref={ref}
    data-slot="drawer-content"
    className={composeClassName('flex flex-col justify-between h-full', className)}
    {...props}
  />
));
DrawerContent.displayName = 'DrawerContent';

// Composable Panel wrapper combining Portal, Backdrop, Viewport, and Popup
export interface DrawerPanelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup>, 'children'> {
  children: React.ReactNode;
  swipeDirection?: DrawerSwipeDirection;
  showHandle?: boolean;
  backdropClassName?: BaseDrawer.Backdrop.Props['className'];
  keepMounted?: boolean;
  container?: BaseDrawer.Portal.Props['container'];
}

export const DrawerPanel = React.forwardRef<HTMLDivElement, DrawerPanelProps>(
  (
    {
      children,
      swipeDirection: swipeDirectionProp,
      showHandle = true,
      className,
      backdropClassName,
      keepMounted,
      container,
      ...props
    },
    ref
  ) => {
    const { swipeDirection: contextDirection } = React.useContext(DrawerContext);
    const swipeDirection = swipeDirectionProp ?? contextDirection;
    return (
      <BaseDrawer.Portal container={container} keepMounted={keepMounted}>
        <DrawerBackdrop className={backdropClassName} />
        <DrawerViewport swipeDirection={swipeDirection}>
          <DrawerPopup ref={ref} swipeDirection={swipeDirection} className={className} {...props}>
            <DrawerContent>
              {showHandle && swipeDirection === 'down' && <DrawerHandlePill />}
              {children}
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </BaseDrawer.Portal>
    );
  }
);
DrawerPanel.displayName = 'DrawerPanel';

export function DrawerRoot<Payload = unknown>({
  swipeDirection = 'right',
  ...props
}: BaseDrawer.Root.Props<Payload>): React.JSX.Element {
  return (
    <DrawerContext.Provider value={{ swipeDirection }}>
      <BaseDrawer.Root<Payload> swipeDirection={swipeDirection} {...props} />
    </DrawerContext.Provider>
  );
}

function DrawerComponentInner<Payload = unknown>(
  {
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
    keepMounted,
    container,
    className,
    popupClassName,
    ...props
  }: DrawerProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const combinedPopupClassName: BaseDrawer.Popup.Props['className'] =
    typeof popupClassName === 'function' || typeof className === 'function'
      ? (state) =>
          cn(
            typeof popupClassName === 'function' ? popupClassName(state) : popupClassName,
            typeof className === 'function' ? className(state) : className
          )
      : cn(popupClassName, className) || undefined;

  // If used as pure headless compound root without shorthand config
  if (!title && !description && !trigger && !footer) {
    const compoundPopupProps = Object.keys(props).length > 0 ? props : undefined;
    return (
      <DrawerContext.Provider
        value={{
          swipeDirection,
          popupRef: ref,
          popupClassName: combinedPopupClassName,
          popupProps: compoundPopupProps,
        }}
      >
        <BaseDrawer.Root<Payload>
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
      </DrawerContext.Provider>
    );
  }

  return (
    <DrawerContext.Provider value={{ swipeDirection }}>
      <BaseDrawer.Root<Payload>
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
        {(renderProps) => (
          <>
            {trigger && (
              <BaseDrawer.Trigger
                data-slot="drawer-trigger"
                render={React.isValidElement(trigger) ? trigger : undefined}
                nativeButton={resolveNativeButton(trigger)}
                className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
              >
                {!React.isValidElement(trigger) ? trigger : undefined}
              </BaseDrawer.Trigger>
            )}
            <BaseDrawer.Portal container={container} keepMounted={keepMounted}>
              <DrawerBackdrop />
              <DrawerViewport swipeDirection={swipeDirection}>
                <DrawerPopup
                  ref={ref}
                  swipeDirection={swipeDirection}
                  className={combinedPopupClassName}
                  {...props}
                >
                  <DrawerContent className="flex flex-col h-full min-h-0">
                    <div data-slot="drawer-header" className="flex flex-col gap-1.5 mb-4 shrink-0">
                      {showHandle && swipeDirection === 'down' && <DrawerHandlePill />}
                      <div className="flex items-start justify-between gap-2">
                        <DrawerTitle className={cn(!title && 'sr-only')}>{title || 'Panel'}</DrawerTitle>
                        {showCloseButton && (
                          <DrawerCloseButton className="-me-3 -mt-3 shrink-0" aria-label="Close drawer" />
                        )}
                      </div>
                      {description && <DrawerDescription>{description}</DrawerDescription>}
                    </div>
                    <DrawerBody>
                      {typeof children === 'function' ? children(renderProps) : children}
                    </DrawerBody>
                    {footer ? (
                      <div data-slot="drawer-footer" className="pt-4 border-t border-outline-variant mt-4 shrink-0">{footer}</div>
                    ) : (
                      <div data-slot="drawer-footer" className="pt-4 border-t border-outline-variant flex flex-wrap items-center justify-end gap-3 mt-4 shrink-0">
                        <BaseDrawer.Close
                          data-slot="drawer-close"
                          render={
                            <Button variant="outline" colorRole="neutral" size="sm">
                              Close
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </DrawerContent>
                </DrawerPopup>
              </DrawerViewport>
            </BaseDrawer.Portal>
          </>
        )}
      </BaseDrawer.Root>
    </DrawerContext.Provider>
  );
}

const DrawerComponent = React.forwardRef(DrawerComponentInner) as (<Payload = unknown>(
  props: DrawerProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
DrawerComponent.displayName = 'Drawer';

// Compound export mapping Base UI primitives
export const Drawer = Object.assign(DrawerComponent, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
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
  Close: DrawerClose,
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

export const DrawerPortal = BaseDrawer.Portal;
export const DrawerSwipeArea = BaseDrawer.SwipeArea;
export const DrawerIndent = BaseDrawer.Indent;
export const DrawerIndentBackground = BaseDrawer.IndentBackground;
export const DrawerVirtualKeyboardProvider = BaseDrawer.VirtualKeyboardProvider;
export const DrawerProvider = BaseDrawer.Provider;
export const DrawerHandle = BaseDrawer.Handle;
export const createDrawerHandle = BaseDrawer.createHandle;

export default Drawer;
