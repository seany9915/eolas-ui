import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';

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

export interface TooltipProps<Payload = unknown> {
  content?: React.ReactNode;
  children?: BaseTooltip.Root.Props<Payload>['children'];
  side?: 'top' | 'right' | 'bottom' | 'left';
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
  className?: string;
}

function TooltipComponent<Payload = unknown>({
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
  className,
}: TooltipProps<Payload>): React.JSX.Element {
  // If used as a compound Root container without shorthand content prop (<Tooltip><TooltipTrigger /><TooltipContent /></Tooltip>)
  if (content === undefined) {
    return (
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
      className="z-[70] outline-none"
    >
      <BaseTooltip.Popup
        className={cn(
          'px-3 py-1.5 rounded-md bg-on-surface text-surface font-label text-xs font-medium shadow-ambient outline-none select-none',
          'transition-[opacity,transform] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)]',
          'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)]',
          'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)]',
          'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
          className
        )}
      >
        {showArrow && <TooltipArrow />}
        {content}
      </BaseTooltip.Popup>
    </BaseTooltip.Positioner>
  );

  return (
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
        render={React.isValidElement(children) ? children : undefined}
        delay={delay}
        closeDelay={closeDelay}
        closeOnClick={closeOnClick}
      >
        {!React.isValidElement(children) && typeof children !== 'function' ? children : undefined}
      </BaseTooltip.Trigger>
      {portal ? <BaseTooltip.Portal>{popup}</BaseTooltip.Portal> : popup}
    </BaseTooltip.Root>
  );
}

export interface TooltipArrowProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Arrow> {}

export const TooltipArrow = React.forwardRef<HTMLDivElement, TooltipArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BaseTooltip.Arrow
      ref={ref}
      className={cn(
        'data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px]',
        'data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90',
        className
      )}
      {...props}
    >
      {children ?? (
        <svg width="10" height="5" viewBox="0 0 10 5" className="fill-on-surface block" aria-hidden="true">
          <path d="M0 5 L5 0 L10 5 Z" />
        </svg>
      )}
    </BaseTooltip.Arrow>
  )
);
TooltipArrow.displayName = 'TooltipArrow';

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> {}

export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BaseTooltip.Trigger ref={ref} className={className} {...props}>
      {children}
    </BaseTooltip.Trigger>
  )
);
TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  showArrow?: boolean;
  containerClassName?: string;
  portal?: boolean;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      side = 'top',
      align = 'center',
      sideOffset = 6,
      alignOffset,
      collisionPadding = 8,
      showArrow = true,
      containerClassName,
      portal = true,
      children,
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
        className={cn('z-[70] outline-none', containerClassName)}
      >
        <BaseTooltip.Popup
          ref={ref}
          className={cn(
            'px-3 py-1.5 rounded-md bg-on-surface text-surface font-label text-xs font-medium shadow-ambient outline-none select-none',
            'transition-[opacity,transform] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)]',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)]',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)]',
            'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
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

    return <BaseTooltip.Portal>{content}</BaseTooltip.Portal>;
  }
);
TooltipContent.displayName = 'TooltipContent';

export const TooltipViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Viewport>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Viewport ref={ref} className={cn('relative', className)} {...props} />
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
