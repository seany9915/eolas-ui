import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '@/lib/utils';

export interface PopoverProps<Payload = unknown> {
  label?: React.ReactNode;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: BasePopover.Root.Props<Payload>['children'];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: BasePopover.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean | 'trap-focus';
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  initialFocus?: BasePopover.Popup.Props['initialFocus'];
  finalFocus?: BasePopover.Popup.Props['finalFocus'];
  actionsRef?: React.RefObject<BasePopover.Root.Actions | null>;
  handle?: BasePopover.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  showArrow?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  portal?: boolean;
  className?: string;
}

function PopoverComponent<Payload = unknown>({
  label,
  trigger,
  title,
  description,
  children,
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  modal = false,
  openOnHover = false,
  delay = 300,
  closeDelay = 0,
  side,
  align,
  sideOffset = 8,
  alignOffset,
  collisionPadding = 8,
  initialFocus,
  finalFocus,
  actionsRef,
  handle,
  triggerId,
  defaultTriggerId,
  showArrow = true,
  showCloseButton = false,
  closeLabel = 'Close',
  portal = true,
  className,
}: PopoverProps<Payload>): React.JSX.Element {
  const generatedId = React.useId();
  const popoverId = `popover-${generatedId}`;

  // If used as a composable compound root (<Popover open={...}><PopoverTrigger /><PopoverContent /></Popover>)
  if (!trigger && !title && !description) {
    return (
      <BasePopover.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        modal={modal}
        actionsRef={actionsRef}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
      >
        {children}
      </BasePopover.Root>
    );
  }

  const isModalBackdrop = modal === true;

  const renderContentNode = (renderProps: { payload: Payload | undefined }) => (
    <BasePopover.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className="z-50 outline-none"
    >
      <BasePopover.Popup
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        className={cn(
          'w-80 p-5 rounded bg-surface border border-outline-variant shadow-ambient focus:outline-none',
          'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
          'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
          'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
          'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
          className
        )}
      >
        {showArrow && <BasePopover.Arrow className="fill-surface stroke-outline-variant" />}
        {title && (
          <BasePopover.Title className="font-heading text-base font-bold text-on-surface mb-1.5">
            {title}
          </BasePopover.Title>
        )}
        {description && (
          <BasePopover.Description className="font-sans text-sm text-on-surface-variant mb-3 leading-relaxed">
            {description}
          </BasePopover.Description>
        )}
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed">
          {typeof children === 'function' ? children(renderProps) : children}
        </div>
        {showCloseButton && (
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-end">
            <BasePopover.Close className="inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded-md bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {closeLabel}
            </BasePopover.Close>
          </div>
        )}
      </BasePopover.Popup>
    </BasePopover.Positioner>
  );

  const rootContent = (
    <BasePopover.Root<Payload>
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      modal={modal}
      actionsRef={actionsRef}
      handle={handle}
      triggerId={triggerId}
      defaultTriggerId={defaultTriggerId}
    >
      {(renderProps) => (
        <>
          <BasePopover.Trigger
            id={popoverId}
            render={React.isValidElement(trigger) ? trigger : undefined}
            openOnHover={openOnHover}
            delay={delay}
            closeDelay={closeDelay}
          >
            {!React.isValidElement(trigger) ? trigger : undefined}
          </BasePopover.Trigger>
          {portal ? (
            <BasePopover.Portal>
              {isModalBackdrop && (
                <BasePopover.Backdrop className="fixed inset-0 bg-on-surface/30 z-50 transition-opacity duration-[var(--duration-fast)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none" />
              )}
              {renderContentNode(renderProps)}
            </BasePopover.Portal>
          ) : (
            renderContentNode(renderProps)
          )}
        </>
      )}
    </BasePopover.Root>
  );

  if (label) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={popoverId} className="font-label text-xs font-semibold text-on-surface-variant cursor-pointer select-none">
          {label}
        </label>
        {rootContent}
      </div>
    );
  }

  return rootContent;
}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Popup> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  showArrow?: boolean;
  containerClassName?: string;
  portal?: boolean;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      children,
      side,
      align,
      sideOffset = 8,
      alignOffset,
      collisionPadding = 8,
      showArrow = true,
      containerClassName,
      portal = true,
      ...props
    },
    ref
  ) => {
    const content = (
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn('z-50 outline-none', containerClassName)}
      >
        <BasePopover.Popup
          ref={ref}
          className={cn(
            'w-80 p-5 rounded bg-surface border border-outline-variant shadow-ambient focus:outline-none',
            'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)]',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)]',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)]',
            'motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
            className
          )}
          {...props}
        >
          {showArrow && <BasePopover.Arrow className="fill-surface stroke-outline-variant" />}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    );

    if (!portal) {
      return content;
    }

    return <BasePopover.Portal>{content}</BasePopover.Portal>;
  }
);
PopoverContent.displayName = 'PopoverContent';

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> {}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BasePopover.Trigger ref={ref} className={className} {...props}>
      {children}
    </BasePopover.Trigger>
  )
);
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Title>
>(({ className, ...props }, ref) => (
  <BasePopover.Title
    ref={ref}
    className={cn('font-heading text-base font-bold text-on-surface mb-1.5', className)}
    {...props}
  />
));
PopoverTitle.displayName = 'PopoverTitle';

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Description>
>(({ className, ...props }, ref) => (
  <BasePopover.Description
    ref={ref}
    className={cn('font-sans text-sm text-on-surface-variant mb-3 leading-relaxed', className)}
    {...props}
  />
));
PopoverDescription.displayName = 'PopoverDescription';

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Close>
>(({ className, ...props }, ref) => (
  <BasePopover.Close
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded-md bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
));
PopoverClose.displayName = 'PopoverClose';

export const PopoverBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Backdrop>
>(({ className, ...props }, ref) => (
  <BasePopover.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 bg-on-surface/30 z-50 transition-opacity duration-[var(--duration-fast)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none',
      className
    )}
    {...props}
  />
));
PopoverBackdrop.displayName = 'PopoverBackdrop';

export const PopoverViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Viewport>
>(({ className, ...props }, ref) => (
  <BasePopover.Viewport ref={ref} className={cn('relative', className)} {...props} />
));
PopoverViewport.displayName = 'PopoverViewport';

// Compound export mapping Base UI primitives
export const Popover = Object.assign(PopoverComponent, {
  Root: BasePopover.Root,
  Trigger: PopoverTrigger,
  Portal: BasePopover.Portal,
  Positioner: BasePopover.Positioner,
  Popup: BasePopover.Popup,
  Content: PopoverContent,
  Arrow: BasePopover.Arrow,
  Backdrop: PopoverBackdrop,
  Viewport: PopoverViewport,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  createHandle: BasePopover.createHandle,
  Handle: BasePopover.Handle,
});

// Re-export Base UI primitives for compound composition
export { BasePopover };
export const PopoverRoot = BasePopover.Root;
export const PopoverPortal = BasePopover.Portal;
export const PopoverPositioner = BasePopover.Positioner;
export const PopoverPopup = BasePopover.Popup;
export const PopoverArrow = BasePopover.Arrow;
export const createPopoverHandle = BasePopover.createHandle;
export const PopoverHandle = BasePopover.Handle;

export default Popover;
