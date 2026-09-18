import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';

export const TooltipProvider = BaseTooltip.Provider;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  closeDelay?: number;
  trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
  disabled?: boolean;
  showArrow?: boolean;
  className?: string;
}

const TooltipComponent: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  open,
  defaultOpen,
  onOpenChange,
  delay = 80,
  closeDelay,
  trackCursorAxis,
  disabled,
  showArrow = true,
  className,
}) => {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trackCursorAxis={trackCursorAxis}
      disabled={disabled}
    >
      <BaseTooltip.Trigger render={children} delay={delay} closeDelay={closeDelay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className="z-50 outline-none"
        >
          <BaseTooltip.Popup
            className={cn(
              'z-50 px-3 py-1.5 rounded-[0.5rem] bg-on-surface text-surface font-label text-xs font-medium shadow-md outline-none select-none',
              'transition-[opacity,transform] duration-[var(--duration-quick)] data-[ending-style]:duration-[var(--duration-micro)] origin-[var(--transform-origin)]',
              'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)]',
              'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)]',
              className
            )}
          >
            {showArrow && (
              <BaseTooltip.Arrow className="data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px] data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90">
                <svg width="10" height="5" viewBox="0 0 10 5" className="fill-on-surface block">
                  <path d="M0 5 L5 0 L10 5 Z" />
                </svg>
              </BaseTooltip.Arrow>
            )}
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};

// Compound export mapping Base UI primitives
export const Tooltip = Object.assign(TooltipComponent, {
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Portal: BaseTooltip.Portal,
  Positioner: BaseTooltip.Positioner,
  Popup: BaseTooltip.Popup,
  Arrow: BaseTooltip.Arrow,
  Provider: BaseTooltip.Provider,
  Viewport: BaseTooltip.Viewport,
  Handle: BaseTooltip.Handle,
  createHandle: BaseTooltip.createHandle,
});

// Re-export Base UI primitives for compound composition
export { BaseTooltip };
export const TooltipRoot = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;
export const TooltipPortal = BaseTooltip.Portal;
export const TooltipPositioner = BaseTooltip.Positioner;
export const TooltipPopup = BaseTooltip.Popup;
export const TooltipArrow = BaseTooltip.Arrow;
export const TooltipViewport = BaseTooltip.Viewport;
export const TooltipHandle = BaseTooltip.Handle;
export const createTooltipHandle = BaseTooltip.createHandle;



