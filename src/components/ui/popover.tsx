import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  label?: string;
  trigger: React.ReactElement;
  title?: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  initialFocus?: BasePopover.Popup.Props['initialFocus'];
  finalFocus?: BasePopover.Popup.Props['finalFocus'];
  actionsRef?: React.RefObject<BasePopover.Root.Actions | null>;
  className?: string;
}

const PopoverComponent: React.FC<PopoverProps> = ({
  label,
  trigger,
  title,
  description,
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  side,
  align,
  sideOffset = 8,
  initialFocus,
  finalFocus,
  actionsRef,
  className,
}) => {
  const generatedId = React.useId();
  const popoverId = `popover-${generatedId}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={popoverId} className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer">
          {label}
        </label>
      )}
      <BasePopover.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
        actionsRef={actionsRef}
      >
        <BasePopover.Trigger id={popoverId} render={trigger} />
        <BasePopover.Portal>
          <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset}>
            <BasePopover.Popup
              initialFocus={initialFocus}
              finalFocus={finalFocus}
              className={cn('z-50 w-80 p-5 rounded-[0.5rem] bg-surface border-[1px] border-outline-variant shadow-floating focus:outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]', className)}
            >
              <BasePopover.Arrow className="fill-surface" />
              {title && (
                <BasePopover.Title className="font-heading text-base font-bold text-on-surface mb-2">
                  {title}
                </BasePopover.Title>
              )}
              {description && (
                <BasePopover.Description className="font-sans text-xs text-on-surface-variant mb-3 leading-relaxed">
                  {description}
                </BasePopover.Description>
              )}
              <div className="font-sans text-xs text-on-surface-variant mb-4 leading-relaxed">
                {children}
              </div>
              <BasePopover.Close className="inline-flex items-center justify-center h-10 min-h-[44px] px-4 rounded-md bg-primary text-on-primary font-label text-xs font-semibold cursor-pointer hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
                Close
              </BasePopover.Close>
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    </div>
  );
};

// Compound export mapping Base UI primitives
export const Popover = Object.assign(PopoverComponent, {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Portal: BasePopover.Portal,
  Positioner: BasePopover.Positioner,
  Popup: BasePopover.Popup,
  Arrow: BasePopover.Arrow,
  Backdrop: BasePopover.Backdrop,
  Viewport: BasePopover.Viewport,
  Title: BasePopover.Title,
  Description: BasePopover.Description,
  Close: BasePopover.Close,
  createHandle: BasePopover.createHandle,
  Handle: BasePopover.Handle,
});

// Re-export Base UI primitives for compound composition
export { BasePopover };
export const PopoverRoot = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverPortal = BasePopover.Portal;
export const PopoverPositioner = BasePopover.Positioner;
export const PopoverPopup = BasePopover.Popup;
export const PopoverArrow = BasePopover.Arrow;
export const PopoverBackdrop = BasePopover.Backdrop;
export const PopoverViewport = BasePopover.Viewport;
export const PopoverTitle = BasePopover.Title;
export const PopoverDescription = BasePopover.Description;
export const PopoverClose = BasePopover.Close;
export const createPopoverHandle = BasePopover.createHandle;
export const PopoverHandle = BasePopover.Handle;

