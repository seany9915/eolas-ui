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
  delay,
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
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
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
  keepMounted?: boolean;
  className?: BaseTooltip.Popup.Props['className'];
}

function TooltipComponentInner<Payload = unknown>(
  {
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 6,
    alignOffset,
    collisionPadding = 8,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    delay = 80,
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
    keepMounted,
    className,
  }: TooltipProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  // If used as a compound Root container without shorthand content prop (<Tooltip><TooltipTrigger /><TooltipContent /></Tooltip>)
  if (content === undefined) {
    return (
      <TooltipContext.Provider value={{ delay, closeDelay, closeOnClick }}>
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
  const popup = (
    <BaseTooltip.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className="z-[70] outline-none max-w-[min(var(--available-width),calc(100vw-1rem))]"
    >
      <BaseTooltip.Popup
        ref={ref}
        data-slot="tooltip-content"
        data-surface="inverted"
        className={composeClassName(
          'relative max-w-[min(20rem,var(--available-width),calc(100vw-1rem))] text-pretty px-3 py-1.5 rounded bg-on-surface text-surface font-label text-xs font-medium shadow-ambient outline-none select-none transition-[opacity,transform] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
          className
        )}
      >
        {showArrow && <TooltipArrow />}
        {content}
      </BaseTooltip.Popup>
    </BaseTooltip.Positioner>
  );

  return (
    <TooltipContext.Provider value={{ delay, closeDelay, closeOnClick }}>
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
          delay={delay}
          closeDelay={closeDelay}
          closeOnClick={closeOnClick}
        >
          {!React.isValidElement(children) && typeof children !== 'function' ? children : undefined}
        </BaseTooltip.Trigger>
        {portal ? <BaseTooltip.Portal keepMounted={keepMounted}>{popup}</BaseTooltip.Portal> : popup}
      </BaseTooltip.Root>
    </TooltipContext.Provider>
  );
}

export const TooltipComponent = React.forwardRef(TooltipComponentInner) as <Payload = unknown>(
  props: TooltipProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element;

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

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> {}

export const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  TooltipTriggerProps
>(({ className, children, delay, closeDelay, closeOnClick, ...props }, ref) => {
  const context = React.useContext(TooltipContext);
  const resolvedDelay = delay ?? context.delay;
  const resolvedCloseDelay = closeDelay ?? context.closeDelay;
  const resolvedCloseOnClick = closeOnClick ?? context.closeOnClick;

  return (
    <BaseTooltip.Trigger
      ref={ref}
      data-slot="tooltip-trigger"
      delay={resolvedDelay}
      closeDelay={resolvedCloseDelay}
      closeOnClick={resolvedCloseOnClick}
      className={composeClassName('inline-flex cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary', className)}
      {...props}
    >
      {children}
    </BaseTooltip.Trigger>
  );
});
TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> {
  side?: BaseTooltip.Positioner.Props['side'];
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  showArrow?: boolean;
  containerClassName?: BaseTooltip.Positioner.Props['className'];
  portal?: boolean;
  keepMounted?: boolean;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(
  (
    {
      className,
      children,
      side = 'top',
      align = 'center',
      sideOffset = 6,
      alignOffset,
      collisionPadding = 8,
      showArrow = true,
      containerClassName,
      portal = true,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const content = (
      <BaseTooltip.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={composeClassName('z-[70] outline-none max-w-[min(var(--available-width),calc(100vw-1rem))]', containerClassName)}
      >
        <BaseTooltip.Popup
          ref={ref}
          data-slot="tooltip-content"
          data-surface="inverted"
          className={composeClassName(
            'relative max-w-[min(20rem,var(--available-width),calc(100vw-1rem))] text-pretty px-3 py-1.5 rounded bg-on-surface text-surface font-label text-xs font-medium shadow-ambient outline-none select-none transition-[opacity,transform] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
            className
          )}
          {...props}
        >
          {showArrow && <TooltipArrow />}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    );

    if (!portal) {
      return content;
    }

    return <BaseTooltip.Portal keepMounted={keepMounted}>{content}</BaseTooltip.Portal>;
  }
);
TooltipContent.displayName = 'TooltipContent';

export const TooltipViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Viewport>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Viewport ref={ref} className={composeClassName('relative', className)} {...props} />
));
TooltipViewport.displayName = 'TooltipViewport';

// Compound export mapping Base UI primitives
export const Tooltip = Object.assign(TooltipComponent, {
  Root: BaseTooltip.Root,
  Trigger: TooltipTrigger,
  Portal: BaseTooltip.Portal,
  Positioner: BaseTooltip.Positioner,
  Popup: BaseTooltip.Popup,
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
export const TooltipPositioner = BaseTooltip.Positioner;
export const TooltipPopup = BaseTooltip.Popup;
export const createTooltipHandle = BaseTooltip.createHandle;
export const TooltipHandle = BaseTooltip.Handle;

export default Tooltip;
