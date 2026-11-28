'use client';

/**
 * Drawer primitive (@base-ui/react/drawer).
 *
 * Base UI Documentation: https://base-ui.com/react/components/drawer
 *
 * TAXONOMY & USAGE:
 * - Use Drawer for slide-over side panels or bottom sheets with swipe dismissal gestures,
 *   snap points, non-modal inspectors, and background indent effects.
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
  onSnapPointChange?: (
    snapPoint: BaseDrawer.Root.SnapPoint | null,
    eventDetails?: BaseDrawer.Root.SnapPointChangeEventDetails
  ) => void;
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  actionsRef?: React.RefObject<BaseDrawer.Root.Actions | null>;
  handle?: BaseDrawer.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  initialFocus?: BaseDrawer.Popup.Props['initialFocus'];
  finalFocus?: BaseDrawer.Popup.Props['finalFocus'];
  showBackdrop?: boolean;
  showCloseButton?: boolean;
  showHandle?: boolean;
  virtualKeyboardAware?: boolean;
  keepMounted?: boolean;
  container?: BaseDrawer.Portal.Props['container'];
  className?: BaseDrawer.Popup.Props['className'];
  popupClassName?: BaseDrawer.Popup.Props['className'];
  backdropClassName?: BaseDrawer.Backdrop.Props['className'];
  viewportClassName?: BaseDrawer.Viewport.Props['className'];
}

type DrawerSwipeDirection = 'right' | 'left' | 'down' | 'up';

interface DrawerContextValue {
  swipeDirection: DrawerSwipeDirection;
  modal: boolean | 'trap-focus';
  hasSnapPoints: boolean;
  popupRef?: React.Ref<HTMLDivElement>;
  popupClassName?: BaseDrawer.Popup.Props['className'];
  popupProps?: Record<string, unknown>;
}

const DrawerContext = React.createContext<DrawerContextValue>({
  swipeDirection: 'right',
  modal: true,
  hasSnapPoints: false,
});

const DrawerPortalScopeContext = React.createContext(false);

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
  down: 'fixed inset-x-0 bottom-0 top-0 z-50 flex max-h-full items-end justify-center',
  up: 'fixed inset-x-0 top-0 bottom-0 z-50 flex max-h-full items-start justify-center',
};

export const drawerPopupClasses: Record<'right' | 'left' | 'down' | 'up', string> = {
  right:
    '@container w-full max-w-md h-full flex flex-col rounded-none border-l-2 border-y-0 border-r-0 border-outline-variant bg-surface shadow-modal pr-[calc(1.5rem+env(safe-area-inset-right,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full data-[swiping]:select-none data-[swiping]:duration-0 data-[nested-drawer-swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:[transition-duration:calc(var(--drawer-swipe-strength,1)*var(--duration-fast))] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  left:
    '@container w-full max-w-md h-full flex flex-col rounded-none border-r-2 border-y-0 border-l-0 border-outline-variant bg-surface shadow-modal pl-[calc(1.5rem+env(safe-area-inset-left,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full data-[swiping]:select-none data-[swiping]:duration-0 data-[nested-drawer-swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:[transition-duration:calc(var(--drawer-swipe-strength,1)*var(--duration-fast))] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  down:
    '@container w-full max-h-[88dvh] flex flex-col rounded-none border-t-2 border-x-0 border-b-0 border-outline-variant bg-surface shadow-modal pl-[calc(1.5rem+env(safe-area-inset-left,0px))] pr-[calc(1.5rem+env(safe-area-inset-right,0px))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] [transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))] data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full data-[swiping]:select-none data-[swiping]:duration-0 data-[nested-drawer-swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:[transition-duration:calc(var(--drawer-swipe-strength,1)*var(--duration-fast))] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
  up:
    '@container w-full max-h-[88dvh] flex flex-col rounded-none border-b-2 border-x-0 border-t-0 border-outline-variant bg-surface shadow-modal pl-[calc(1.5rem+env(safe-area-inset-left,0px))] pr-[calc(1.5rem+env(safe-area-inset-right,0px))] pt-[calc(1.5rem+env(safe-area-inset-top,0px))] [transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))] data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full data-[swiping]:select-none data-[swiping]:duration-0 data-[nested-drawer-swiping]:duration-0 transition-transform duration-[var(--duration-fast)] data-[ending-style]:[transition-duration:calc(var(--drawer-swipe-strength,1)*var(--duration-fast))] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
};

const snapPointDownClasses =
  "relative h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] overflow-visible pb-[max(1.5rem,calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)+1.5rem+env(safe-area-inset-bottom,0px)))] transition-[transform,padding-bottom] data-[starting-style]:pb-6 data-[ending-style]:pb-6 data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[ending-style]:[transform:translateY(calc(100%+2px))] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-12 after:bg-surface after:content-['']";

// Visual grab handle pill
export const DrawerHandlePill = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-handle-pill"
      className={cn(
        'mx-auto my-3 h-1.5 w-12 rounded-full bg-outline-variant shrink-0 select-none touch-none cursor-grab active:cursor-grabbing',
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
              'size-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-state-hover active:bg-surface-container-high active:opacity-80 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer',
              className
            )
      }
      aria-label={ariaLabel ?? (!render && !children ? 'Close drawer' : undefined)}
      {...props}
    >
      {children || <Icon name="close" size="md" aria-hidden="true" />}
    </BaseDrawer.Close>
  )
);
DrawerCloseButton.displayName = 'DrawerCloseButton';

export const DrawerTrigger = React.forwardRef(function DrawerTrigger<Payload = unknown>(
  {
    render,
    nativeButton,
    ...props
  }: BaseDrawer.Trigger.Props<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <BaseDrawer.Trigger
      ref={ref}
      data-slot="drawer-trigger"
      render={render}
      nativeButton={resolveNativeButton(render, nativeButton)}
      {...props}
    />
  );
}) as (<Payload = unknown>(
  props: BaseDrawer.Trigger.Props<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
DrawerTrigger.displayName = 'DrawerTrigger';

export const DrawerPortal = React.forwardRef<HTMLDivElement, BaseDrawer.Portal.Props>(
  ({ container, keepMounted, children, ...props }, ref) => (
    <DrawerPortalScopeContext.Provider value={Boolean(container)}>
      <BaseDrawer.Portal ref={ref} container={container} keepMounted={keepMounted} {...props}>
        {children}
      </BaseDrawer.Portal>
    </DrawerPortalScopeContext.Provider>
  )
);
DrawerPortal.displayName = 'DrawerPortal';

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
    <div
      ref={ref}
      data-slot="drawer-footer"
      className={cn(
        'pt-4 pb-[var(--drawer-keyboard-inset,0px)] border-t border-outline-variant flex flex-wrap items-center justify-end gap-3 mt-4 shrink-0',
        className
      )}
      {...props}
    />
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
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(DrawerPortalScopeContext);
  return (
    <BaseDrawer.Backdrop
      ref={ref}
      data-slot="drawer-overlay"
      className={composeClassName(
        cn(
          isScoped ? 'absolute inset-0' : 'fixed inset-0 min-h-dvh',
          'bg-on-surface/40 z-50 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-[var(--duration-fast)] data-[ending-style]:[transition-duration:calc(var(--drawer-swipe-strength,1)*var(--duration-fast))] data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    />
  );
});
DrawerBackdrop.displayName = 'DrawerBackdrop';

export const DrawerOverlay = DrawerBackdrop;

export const DrawerViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Viewport> & {
    swipeDirection?: DrawerSwipeDirection;
    modal?: boolean | 'trap-focus';
  }
>(({ className, swipeDirection, modal, ...props }, ref) => {
  const { swipeDirection: contextDirection, modal: contextModal } = React.useContext(DrawerContext);
  const isScoped = React.useContext(DrawerPortalScopeContext);
  const resolvedModal = modal ?? contextModal;
  return (
    <BaseDrawer.Viewport
      ref={ref}
      data-slot="drawer-viewport"
      className={composeClassName(
        cn(
          drawerViewportClasses[swipeDirection ?? contextDirection],
          isScoped && 'absolute',
          resolvedModal === false && 'pointer-events-none'
        ),
        className
      )}
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
    hasSnapPoints?: boolean;
  }
>(({ className, swipeDirection, hasSnapPoints: hasSnapPointsProp, ...props }, ref) => {
  const {
    swipeDirection: contextDirection,
    hasSnapPoints: contextHasSnapPoints,
    popupRef,
    popupClassName,
    popupProps,
  } = React.useContext(DrawerContext);
  const resolvedDirection = swipeDirection ?? contextDirection;
  const resolvedHasSnapPoints = hasSnapPointsProp ?? contextHasSnapPoints;
  const isSnapBottomSheet = resolvedHasSnapPoints && resolvedDirection === 'down';
  const mergedRef = popupRef ? mergeDrawerRefs(popupRef, ref) : ref;
  const baseClasses = cn(
    'pointer-events-auto p-6 bg-surface shadow-modal flex flex-col justify-between overscroll-contain touch-auto outline-none will-change-[transform]',
    !isSnapBottomSheet && 'overflow-y-auto has-[[data-slot=drawer-body]]:overflow-hidden',
    drawerPopupClasses[resolvedDirection],
    isSnapBottomSheet && snapPointDownClasses
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
    className={composeClassName('flex flex-col justify-between flex-1 h-full min-h-0 overflow-hidden', className)}
    {...props}
  />
));
DrawerContent.displayName = 'DrawerContent';

// Composable Panel wrapper combining Portal, Backdrop, Viewport, and Popup
export interface DrawerPanelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup>, 'children'> {
  children: React.ReactNode;
  swipeDirection?: DrawerSwipeDirection;
  showBackdrop?: boolean;
  showHandle?: boolean;
  backdropClassName?: BaseDrawer.Backdrop.Props['className'];
  viewportClassName?: BaseDrawer.Viewport.Props['className'];
  keepMounted?: boolean;
  container?: BaseDrawer.Portal.Props['container'];
}

export const DrawerPanel = React.forwardRef<HTMLDivElement, DrawerPanelProps>(
  (
    {
      children,
      swipeDirection: swipeDirectionProp,
      showBackdrop,
      showHandle = true,
      className,
      backdropClassName,
      viewportClassName,
      keepMounted,
      container,
      ...props
    },
    ref
  ) => {
    const { swipeDirection: contextDirection, modal } = React.useContext(DrawerContext);
    const swipeDirection = swipeDirectionProp ?? contextDirection;
    const shouldRenderBackdrop = showBackdrop ?? modal !== false;
    return (
      <DrawerPortal container={container} keepMounted={keepMounted}>
        {shouldRenderBackdrop && <DrawerBackdrop className={backdropClassName} />}
        <DrawerViewport swipeDirection={swipeDirection} modal={modal} className={viewportClassName}>
          <DrawerPopup ref={ref} swipeDirection={swipeDirection} className={className} {...props}>
            <DrawerContent>
              {showHandle && swipeDirection === 'down' && <DrawerHandlePill />}
              {children}
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </DrawerPortal>
    );
  }
);
DrawerPanel.displayName = 'DrawerPanel';

export function DrawerRoot<Payload = unknown>({
  swipeDirection = 'right',
  modal = true,
  snapPoints,
  ...props
}: BaseDrawer.Root.Props<Payload>): React.JSX.Element {
  const hasSnapPoints = Boolean(snapPoints && snapPoints.length > 0);
  const drawerRootContextValue = React.useMemo(
    () => ({ swipeDirection, modal, hasSnapPoints }),
    [swipeDirection, modal, hasSnapPoints]
  );

  return (
    <DrawerContext.Provider value={drawerRootContextValue}>
      <BaseDrawer.Root<Payload>
        swipeDirection={swipeDirection}
        modal={modal}
        snapPoints={snapPoints}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

export const DrawerSwipeArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.SwipeArea>
>(({ className, ...props }, ref) => (
  <BaseDrawer.SwipeArea
    ref={ref}
    data-slot="drawer-swipe-area"
    className={composeClassName('touch-none select-none', className)}
    {...props}
  />
));
DrawerSwipeArea.displayName = 'DrawerSwipeArea';

export const DrawerIndent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Indent>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Indent
    ref={ref}
    data-slot="drawer-indent"
    className={composeClassName(
      'relative bg-surface origin-top transition-[transform,border-radius] duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[active]:scale-[0.985] data-[active]:translate-y-2 data-[active]:rounded-t-lg motion-reduce:transition-none motion-reduce:transform-none',
      className
    )}
    {...props}
  />
));
DrawerIndent.displayName = 'DrawerIndent';

export const DrawerIndentBackground = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.IndentBackground>
>(({ className, ...props }, ref) => (
  <BaseDrawer.IndentBackground
    ref={ref}
    data-slot="drawer-indent-background"
    className={composeClassName('absolute inset-0 bg-neutral/90', className)}
    {...props}
  />
));
DrawerIndentBackground.displayName = 'DrawerIndentBackground';

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
    initialFocus,
    finalFocus,
    showBackdrop,
    showCloseButton = true,
    showHandle = true,
    virtualKeyboardAware = false,
    keepMounted,
    container,
    className,
    popupClassName,
    backdropClassName,
    viewportClassName,
    ...props
  }: DrawerProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const hasSnapPoints = Boolean(snapPoints && snapPoints.length > 0);
  const shouldRenderBackdrop = showBackdrop ?? modal !== false;

  const combinedPopupClassName = React.useMemo<BaseDrawer.Popup.Props['className']>(
    () =>
      typeof popupClassName === 'function' || typeof className === 'function'
        ? (state) =>
            cn(
              typeof popupClassName === 'function' ? popupClassName(state) : popupClassName,
              typeof className === 'function' ? className(state) : className
            )
        : cn(popupClassName, className) || undefined,
    [popupClassName, className]
  );

  const isCompound = !title && !description && !trigger && !footer;
  const compoundPopupProps = Object.keys(props).length > 0 ? props : undefined;
  const compoundDrawerContextValue = React.useMemo(
    () => ({
      swipeDirection,
      modal,
      hasSnapPoints,
      popupRef: ref,
      popupClassName: combinedPopupClassName,
      popupProps: compoundPopupProps,
    }),
    [swipeDirection, modal, hasSnapPoints, ref, combinedPopupClassName, compoundPopupProps]
  );
  const shorthandDrawerContextValue = React.useMemo(
    () => ({ swipeDirection, modal, hasSnapPoints }),
    [swipeDirection, modal, hasSnapPoints]
  );

  // If used as pure headless compound root without shorthand config
  if (isCompound) {
    return (
      <DrawerContext.Provider value={compoundDrawerContextValue}>
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
    <DrawerContext.Provider value={shorthandDrawerContextValue}>
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
        {(renderProps) => {
          const portalNode = (
            <DrawerPortal container={container} keepMounted={keepMounted}>
              {shouldRenderBackdrop && <DrawerBackdrop className={backdropClassName} />}
              <DrawerViewport
                swipeDirection={swipeDirection}
                modal={modal}
                className={viewportClassName}
              >
                <DrawerPopup
                  ref={ref}
                  swipeDirection={swipeDirection}
                  hasSnapPoints={hasSnapPoints}
                  initialFocus={initialFocus}
                  finalFocus={finalFocus}
                  className={combinedPopupClassName}
                  {...props}
                >
                  <DrawerContent className="flex flex-col h-full min-h-0">
                    <div data-slot="drawer-header" className="flex flex-col gap-1.5 mb-4 shrink-0">
                      {showHandle && swipeDirection === 'down' && <DrawerHandlePill className="mt-0 mb-2" />}
                      <div className="flex items-start justify-between gap-2">
                        <DrawerTitle className={cn(!title && 'sr-only')}>
                          {title || 'Panel'}
                        </DrawerTitle>
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
                      <div
                        data-slot="drawer-footer"
                        className="pt-4 pb-[var(--drawer-keyboard-inset,0px)] border-t border-outline-variant mt-4 shrink-0"
                      >
                        {footer}
                      </div>
                    ) : (
                      <div
                        data-slot="drawer-footer"
                        className="pt-4 pb-[var(--drawer-keyboard-inset,0px)] border-t border-outline-variant flex flex-wrap items-center justify-end gap-3 mt-4 shrink-0"
                      >
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
            </DrawerPortal>
          );

          return (
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
              {virtualKeyboardAware ? (
                <BaseDrawer.VirtualKeyboardProvider>{portalNode}</BaseDrawer.VirtualKeyboardProvider>
              ) : (
                portalNode
              )}
            </>
          );
        }}
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
  Portal: DrawerPortal,
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
  SwipeArea: DrawerSwipeArea,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  VirtualKeyboardProvider: BaseDrawer.VirtualKeyboardProvider,
  Provider: BaseDrawer.Provider,
  createHandle: BaseDrawer.createHandle,
  Handle: BaseDrawer.Handle,
});

// Re-export Base UI primitives for compound composition
export { BaseDrawer };

export const DrawerVirtualKeyboardProvider = BaseDrawer.VirtualKeyboardProvider;
export const DrawerProvider = BaseDrawer.Provider;
export const DrawerHandle = BaseDrawer.Handle;
export const createDrawerHandle = BaseDrawer.createHandle;

export default Drawer;
