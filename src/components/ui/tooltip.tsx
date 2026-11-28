'use client';

import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn, composeClassName } from '@/lib/utils';

export interface TooltipProviderProps {
  children?: React.ReactNode;
  delay?: number;
  closeDelay?: number;
  timeout?: number;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
  delay = 150,
  closeDelay,
  timeout = 400,
}) => (
  <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
    {children}
  </BaseTooltip.Provider>
);
TooltipProvider.displayName = 'TooltipProvider';

interface TooltipContextValue {
  delay?: number;
  closeDelay?: number;
  closeOnClick?: boolean;
}

const TooltipContext = React.createContext<TooltipContextValue>({});
export const useTooltipContext = () => React.useContext(TooltipContext);

export interface TooltipProps<Payload = unknown> {
  content?: React.ReactNode;
  children?: BaseTooltip.Root.Props<Payload>['children'];
  side?: BaseTooltip.Positioner.Props['side'];
  align?: BaseTooltip.Positioner.Props['align'];
  sideOffset?: BaseTooltip.Positioner.Props['sideOffset'];
  alignOffset?: BaseTooltip.Positioner.Props['alignOffset'];
  anchor?: BaseTooltip.Positioner.Props['anchor'];
  sticky?: BaseTooltip.Positioner.Props['sticky'];
  collisionPadding?: BaseTooltip.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseTooltip.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseTooltip.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BaseTooltip.Positioner.Props['arrowPadding'];
  disableAnchorTracking?: BaseTooltip.Positioner.Props['disableAnchorTracking'];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BaseTooltip.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  delay?: number;
  closeDelay?: number;
  closeOnClick?: boolean;
  trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
  disableHoverablePopup?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  handle?: BaseTooltip.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  actionsRef?: React.RefObject<BaseTooltip.Root.Actions | null>;
  portal?: boolean;
  container?: BaseTooltip.Portal.Props['container'];
  keepMounted?: boolean;
  className?: BaseTooltip.Popup.Props['className'];
}

export interface TooltipArrowProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Arrow> {}

export const TooltipArrow = React.forwardRef<HTMLDivElement, TooltipArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BaseTooltip.Arrow
      ref={ref}
      data-slot="tooltip-arrow"
      className={composeClassName(
        cn(
          'text-on-surface z-10 data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px] data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px]',
          'data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90'
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          className="fill-current block"
          aria-hidden="true"
        >
          <path d="M0 5 L5 0 L10 5 Z" />
        </svg>
      )}
    </BaseTooltip.Arrow>
  )
);
TooltipArrow.displayName = 'TooltipArrow';

export const TooltipPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>
>(({ className, side = 'top', align = 'center', sideOffset = 6, collisionPadding = 8, ...props }, ref) => (
  <BaseTooltip.Positioner
    ref={ref}
    data-slot="tooltip-positioner"
    side={side}
    align={align}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={composeClassName(
      'z-[70] outline-none max-w-[min(var(--available-width),calc(100vw-1rem))] transition-[top,left,right,bottom] duration-[var(--duration-quick)] ease-[var(--ease-standard)] data-[instant]:transition-none motion-reduce:transition-none',
      className
    )}
    {...props}
  />
));
TooltipPositioner.displayName = 'TooltipPositioner';

export const TooltipPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Popup
    ref={ref}
    data-slot="tooltip-content"
    data-surface="inverted"
    className={composeClassName(
      'relative max-w-[min(20rem,var(--available-width),calc(100vw-1rem))] text-pretty px-3 py-1.5 rounded bg-on-surface text-surface font-label text-xs font-medium shadow-ambient outline-none select-none transition-[opacity,transform,width,height] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
      className
    )}
    {...props}
  />
));
TooltipPopup.displayName = 'TooltipPopup';

function TooltipComponentInner<Payload = unknown>(
  {
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 6,
    alignOffset,
    anchor,
    sticky,
    collisionPadding = 8,
    collisionBoundary,
    collisionAvoidance,
    arrowPadding,
    disableAnchorTracking,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    delay,
    closeDelay,
    closeOnClick = true,
    trackCursorAxis,
    disableHoverablePopup,
    disabled,
    showArrow = true,
    handle,
    triggerId,
    defaultTriggerId,
    actionsRef,
    portal = true,
    container,
    keepMounted,
    className,
  }: TooltipProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const contextValue = React.useMemo<TooltipContextValue>(
    () => ({ delay, closeDelay, closeOnClick }),
    [delay, closeDelay, closeOnClick]
  );

  // If used as a compound Root container without shorthand content prop (<Tooltip><TooltipTrigger /><TooltipContent /></Tooltip>)
  if (content === undefined) {
    return (
      <TooltipContext.Provider value={contextValue}>
        <BaseTooltip.Root<Payload>
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          trackCursorAxis={trackCursorAxis}
          disableHoverablePopup={disableHoverablePopup}
          disabled={disabled}
          handle={handle}
          triggerId={triggerId}
          defaultTriggerId={defaultTriggerId}
          actionsRef={actionsRef}
        >
          {children}
        </BaseTooltip.Root>
      </TooltipContext.Provider>
    );
  }

  // Shorthand convenience wrapper: <Tooltip content="..."><button>Hover</button></Tooltip>
  return (
    <TooltipContext.Provider value={contextValue}>
      <BaseTooltip.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        trackCursorAxis={trackCursorAxis}
        disableHoverablePopup={disableHoverablePopup}
        disabled={disabled}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
        actionsRef={actionsRef}
      >
        <BaseTooltip.Trigger
          data-slot="tooltip-trigger"
          render={React.isValidElement(children) ? children : undefined}
          {...(delay !== undefined ? { delay } : {})}
          {...(closeDelay !== undefined ? { closeDelay } : {})}
          closeOnClick={closeOnClick}
        >
          {!React.isValidElement(children) && typeof children !== 'function' ? children : undefined}
        </BaseTooltip.Trigger>
        <TooltipContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          anchor={anchor}
          sticky={sticky}
          collisionPadding={collisionPadding}
          collisionBoundary={collisionBoundary}
          collisionAvoidance={collisionAvoidance}
          arrowPadding={arrowPadding}
          disableAnchorTracking={disableAnchorTracking}
          showArrow={showArrow}
          portal={portal}
          container={container}
          keepMounted={keepMounted}
          className={className}
        >
          {content}
        </TooltipContent>
      </BaseTooltip.Root>
    </TooltipContext.Provider>
  );
}

export const TooltipComponent = React.forwardRef(TooltipComponentInner) as (<Payload = unknown>(
  props: TooltipProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };

export type TooltipTriggerProps<Payload = unknown> = BaseTooltip.Trigger.Props<Payload>;

export const TooltipTrigger = React.forwardRef(function TooltipTrigger<Payload = unknown>(
  { className, children, delay, closeDelay, closeOnClick, render, ...props }: TooltipTriggerProps<Payload>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const context = React.useContext(TooltipContext);
  const resolvedDelay = delay ?? context.delay;
  const resolvedCloseDelay = closeDelay ?? context.closeDelay;
  const resolvedCloseOnClick = closeOnClick ?? context.closeOnClick;

  return (
    <BaseTooltip.Trigger
      ref={ref}
      data-slot="tooltip-trigger"
      render={render}
      {...(resolvedDelay !== undefined ? { delay: resolvedDelay } : {})}
      {...(resolvedCloseDelay !== undefined ? { closeDelay: resolvedCloseDelay } : {})}
      closeOnClick={resolvedCloseOnClick}
      className={
        render
          ? className
          : composeClassName(
              'inline-flex cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              className
            )
      }
      {...props}
    >
      {children}
    </BaseTooltip.Trigger>
  );
}) as (<Payload = unknown>(
  props: TooltipTriggerProps<Payload> & React.RefAttributes<HTMLButtonElement>
) => React.JSX.Element) & { displayName?: string };
TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> {
  side?: BaseTooltip.Positioner.Props['side'];
  align?: BaseTooltip.Positioner.Props['align'];
  sideOffset?: BaseTooltip.Positioner.Props['sideOffset'];
  alignOffset?: BaseTooltip.Positioner.Props['alignOffset'];
  anchor?: BaseTooltip.Positioner.Props['anchor'];
  sticky?: BaseTooltip.Positioner.Props['sticky'];
  collisionPadding?: BaseTooltip.Positioner.Props['collisionPadding'];
  collisionBoundary?: BaseTooltip.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BaseTooltip.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BaseTooltip.Positioner.Props['arrowPadding'];
  disableAnchorTracking?: BaseTooltip.Positioner.Props['disableAnchorTracking'];
  showArrow?: boolean;
  containerClassName?: BaseTooltip.Positioner.Props['className'];
  portal?: boolean;
  container?: BaseTooltip.Portal.Props['container'];
  keepMounted?: boolean;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      children,
      side = 'top',
      align = 'center',
      sideOffset = 6,
      alignOffset,
      anchor,
      sticky,
      collisionPadding = 8,
      collisionBoundary,
      collisionAvoidance,
      arrowPadding,
      disableAnchorTracking,
      showArrow = true,
      containerClassName,
      portal = true,
      container,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const hasExplicitArrow = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === TooltipArrow || child.type === BaseTooltip.Arrow)
    );

    const content = (
      <TooltipPositioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        sticky={sticky}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        collisionAvoidance={collisionAvoidance}
        arrowPadding={arrowPadding}
        disableAnchorTracking={disableAnchorTracking}
        className={containerClassName}
      >
        <TooltipPopup ref={ref} className={className} {...props}>
          {showArrow && !hasExplicitArrow && <TooltipArrow />}
          {children}
        </TooltipPopup>
      </TooltipPositioner>
    );

    if (!portal) {
      return content;
    }

    return (
      <BaseTooltip.Portal container={container} keepMounted={keepMounted}>
        {content}
      </BaseTooltip.Portal>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export const TooltipViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Viewport>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Viewport
    ref={ref}
    data-slot="tooltip-viewport"
    className={composeClassName('relative size-full overflow-hidden rounded-[inherit]', className)}
    {...props}
  />
));
TooltipViewport.displayName = 'TooltipViewport';

// Compound export mapping Base UI primitives
export const Tooltip = Object.assign(TooltipComponent, {
  Root: BaseTooltip.Root,
  Trigger: TooltipTrigger,
  Portal: BaseTooltip.Portal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Provider: TooltipProvider,
  Viewport: TooltipViewport,
  Handle: BaseTooltip.Handle,
  createHandle: BaseTooltip.createHandle,
});

// Re-export Base UI primitives for compound composition
export { BaseTooltip };
export const TooltipRoot = BaseTooltip.Root;
export const TooltipPortal = BaseTooltip.Portal;
export const TooltipPositionerPrimitive = BaseTooltip.Positioner;
export const TooltipPopupPrimitive = BaseTooltip.Popup;
export const createTooltipHandle = BaseTooltip.createHandle;
export const TooltipHandle = BaseTooltip.Handle;

export default Tooltip;
