'use client';

import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';


interface PopoverContextValue {
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
}

const PopoverContext = React.createContext<PopoverContextValue>({});
export const usePopoverContext = () => React.useContext(PopoverContext);

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
  side?: BasePopover.Positioner.Props['side'];
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  anchor?: BasePopover.Positioner.Props['anchor'];
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
  keepMounted?: boolean;
  className?: BasePopover.Popup.Props['className'];
}

function PopoverComponentInner<Payload = unknown>(
  {
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
    anchor,
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
    keepMounted,
    className,
  }: PopoverProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const generatedId = React.useId();
  const popoverId = `popover-${generatedId}`;

  const isCompoundUsage = React.useMemo(() => {
    if (trigger) return false;
    if (!title && !description) return true;
    if (typeof children === 'function') return false;
    return React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === PopoverTrigger ||
          child.type === PopoverContent ||
          child.type === BasePopover.Trigger ||
          child.type === BasePopover.Portal ||
          child.type === BasePopover.Positioner ||
          child.type === BasePopover.Popup)
    );
  }, [trigger, title, description, children]);

  // If used as a composable compound root (<Popover open={...}><PopoverTrigger /><PopoverContent /></Popover>)
  if (isCompoundUsage) {
    return (
      <PopoverContext.Provider value={{ openOnHover, delay, closeDelay }}>
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
      </PopoverContext.Provider>
    );
  }

  const isModalBackdrop = modal === true;

  const renderContentNode = (renderProps: { payload: Payload | undefined }) => (
    <BasePopover.Positioner
      anchor={anchor}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className="z-50 outline-none"
    >
      <BasePopover.Popup
        ref={ref}
        data-slot="popover-content"
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        className={composeClassName(
          'w-80 p-5 rounded bg-surface border border-outline-variant shadow-ambient focus:outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
          className
        )}
      >
        {showArrow && <PopoverArrow />}
        {title && (
          <BasePopover.Title data-slot="popover-title" className="font-heading text-base font-bold text-on-surface mb-1.5">
            {title}
          </BasePopover.Title>
        )}
        {description && (
          <BasePopover.Description data-slot="popover-description" className="font-sans text-sm text-on-surface-variant mb-3 leading-relaxed">
            {description}
          </BasePopover.Description>
        )}
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed">
          {typeof children === 'function' ? children(renderProps) : children}
        </div>
        {showCloseButton && (
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-end">
            <BasePopover.Close data-slot="popover-close" className="inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
          {trigger !== undefined && (
            <BasePopover.Trigger
              id={popoverId}
              data-slot="popover-trigger"
              render={React.isValidElement(trigger) ? trigger : undefined}
              nativeButton={resolveNativeButton(trigger)}
              openOnHover={openOnHover}
              delay={delay}
              closeDelay={closeDelay}
            >
              {!React.isValidElement(trigger) ? trigger : undefined}
            </BasePopover.Trigger>
          )}
          {portal ? (
            <BasePopover.Portal keepMounted={keepMounted}>
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

export const PopoverComponent = React.forwardRef(PopoverComponentInner) as <Payload = unknown>(
  props: PopoverProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element;

export interface PopoverArrowProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Arrow> {}

export const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BasePopover.Arrow
      ref={ref}
      data-slot="popover-arrow"
      className={composeClassName(
        cn(
          'z-10 data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px] data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px]',
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
          className="block fill-surface stroke-outline-variant"
          aria-hidden="true"
        >
          <path d="M0 5 L5 0 L10 5" />
        </svg>
      )}
    </BasePopover.Arrow>
  )
);
PopoverArrow.displayName = 'PopoverArrow';

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Popup> {
  side?: BasePopover.Positioner.Props['side'];
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  anchor?: BasePopover.Positioner.Props['anchor'];
  showArrow?: boolean;
  containerClassName?: BasePopover.Positioner.Props['className'];
  portal?: boolean;
  keepMounted?: boolean;
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
      anchor,
      showArrow = true,
      containerClassName,
      portal = true,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const content = (
      <BasePopover.Positioner
        anchor={anchor}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={composeClassName('z-50 outline-none', containerClassName)}
      >
        <BasePopover.Popup
          ref={ref}
          data-slot="popover-content"
          className={composeClassName(
            'w-80 p-5 rounded bg-surface border border-outline-variant shadow-ambient focus:outline-none transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none',
            className
          )}
          {...props}
        >
          {showArrow && <PopoverArrow />}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    );

    if (!portal) {
      return content;
    }

    return <BasePopover.Portal keepMounted={keepMounted}>{content}</BasePopover.Portal>;
  }
);
PopoverContent.displayName = 'PopoverContent';

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> {}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, openOnHover, delay, closeDelay, render, nativeButton, ...props }, ref) => {
    const context = usePopoverContext();
    const resolvedOpenOnHover = openOnHover ?? context.openOnHover;
    const resolvedDelay = delay ?? context.delay;
    const resolvedCloseDelay = closeDelay ?? context.closeDelay;

    return (
      <BasePopover.Trigger
        ref={ref}
        data-slot="popover-trigger"
        render={render}
        nativeButton={resolveNativeButton(render, nativeButton)}
        openOnHover={resolvedOpenOnHover}
        delay={resolvedDelay}
        closeDelay={resolvedCloseDelay}
        className={className}
        {...props}
      >
        {children}
      </BasePopover.Trigger>
    );
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-start mb-3', className)}
      {...props}
    />
  )
);
PopoverHeader.displayName = 'PopoverHeader';

export const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Title>
>(({ className, ...props }, ref) => (
  <BasePopover.Title
    ref={ref}
    data-slot="popover-title"
    className={composeClassName('font-heading text-base font-bold text-on-surface mb-1.5', className)}
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
    data-slot="popover-description"
    className={composeClassName('font-sans text-sm text-on-surface-variant mb-3 leading-relaxed', className)}
    {...props}
  />
));
PopoverDescription.displayName = 'PopoverDescription';

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Close>
>(({ className, render, nativeButton, ...props }, ref) => (
  <BasePopover.Close
    ref={ref}
    data-slot="popover-close"
    render={render}
    nativeButton={resolveNativeButton(render, nativeButton)}
    className={
      render
        ? className
        : composeClassName(
            'inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
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
    data-slot="popover-backdrop"
    className={composeClassName(
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
  <BasePopover.Viewport ref={ref} data-slot="popover-viewport" className={composeClassName('relative', className)} {...props} />
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
  Header: PopoverHeader,
  Arrow: PopoverArrow,
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
export const createPopoverHandle = BasePopover.createHandle;
export const PopoverHandle = BasePopover.Handle;

export default Popover;
