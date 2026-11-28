'use client';

import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { ScrollArea } from './scroll-area';
import { cn, composeClassName, resolveNativeButton } from '@/lib/utils';

interface PopoverContextValue {
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
  modal?: boolean | 'trap-focus';
}

const PopoverContext = React.createContext<PopoverContextValue>({});
export const usePopoverContext = () => React.useContext(PopoverContext);

const PopoverPortalScopeContext = React.createContext(false);

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
  align?: BasePopover.Positioner.Props['align'];
  sideOffset?: BasePopover.Positioner.Props['sideOffset'];
  alignOffset?: BasePopover.Positioner.Props['alignOffset'];
  anchor?: BasePopover.Positioner.Props['anchor'];
  positionMethod?: BasePopover.Positioner.Props['positionMethod'];
  sticky?: BasePopover.Positioner.Props['sticky'];
  collisionPadding?: BasePopover.Positioner.Props['collisionPadding'];
  collisionBoundary?: BasePopover.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BasePopover.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BasePopover.Positioner.Props['arrowPadding'];
  disableAnchorTracking?: BasePopover.Positioner.Props['disableAnchorTracking'];
  initialFocus?: BasePopover.Popup.Props['initialFocus'];
  finalFocus?: BasePopover.Popup.Props['finalFocus'];
  actionsRef?: React.RefObject<BasePopover.Root.Actions | null>;
  handle?: BasePopover.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  showArrow?: boolean;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  closeLabel?: string;
  portal?: boolean;
  container?: BasePopover.Portal.Props['container'];
  keepMounted?: boolean;
  backdropClassName?: BasePopover.Backdrop.Props['className'];
  containerClassName?: BasePopover.Positioner.Props['className'];
  className?: BasePopover.Popup.Props['className'];
}

const POPOVER_PART = Symbol.for('eolas.popover.part');
const POPOVER_PART_NAMES = new Set([
  'PopoverTrigger',
  'PopoverContent',
  'PopoverPortal',
  'PopoverPositioner',
  'PopoverPopup',
]);

function hasPopoverCompoundChild(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return false;
    if (child.type === React.Fragment) {
      return hasPopoverCompoundChild(child.props.children);
    }
    if (
      child.type === BasePopover.Trigger ||
      child.type === BasePopover.Portal ||
      child.type === BasePopover.Positioner ||
      child.type === BasePopover.Popup
    ) {
      return true;
    }
    if (typeof child.type === 'object' || typeof child.type === 'function') {
      if (POPOVER_PART in child.type) return true;
      const maybeNamed = child.type as { displayName?: string };
      if (maybeNamed.displayName && POPOVER_PART_NAMES.has(maybeNamed.displayName)) {
        return true;
      }
    }
    return false;
  });
}

const basePositionerClasses =
  'z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none transition-[top,left,right,bottom] duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[instant]:transition-none motion-reduce:transition-none';

const basePopupClasses =
  'relative flex flex-col w-80 max-w-full max-h-[var(--available-height)] rounded bg-surface border border-outline-variant shadow-ambient focus:outline-none transition-[opacity,transform,width,height] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-medium)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-medium)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none data-[instant]:transition-none data-[instant]:transform-none';

export const PopoverPortal = Object.assign(
  React.forwardRef<HTMLDivElement, BasePopover.Portal.Props>(
    ({ container, keepMounted, children, ...props }, ref) => (
      <PopoverPortalScopeContext.Provider value={Boolean(container)}>
        <BasePopover.Portal ref={ref} container={container} keepMounted={keepMounted} {...props}>
          {children}
        </BasePopover.Portal>
      </PopoverPortalScopeContext.Provider>
    )
  ),
  { [POPOVER_PART]: true }
);
PopoverPortal.displayName = 'PopoverPortal';

export const PopoverBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Backdrop>
>(({ className, ...props }, ref) => {
  const isScoped = React.useContext(PopoverPortalScopeContext);
  return (
    <BasePopover.Backdrop
      ref={ref}
      data-slot="popover-backdrop"
      className={composeClassName(
        cn(
          isScoped ? 'absolute inset-0' : 'fixed inset-0',
          'bg-on-surface/30 z-50 transition-opacity duration-[var(--duration-fast)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none'
        ),
        className
      )}
      {...props}
    />
  );
});
PopoverBackdrop.displayName = 'PopoverBackdrop';

export const PopoverPositioner = Object.assign(
  React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BasePopover.Positioner>>(
    ({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) => (
      <BasePopover.Positioner
        ref={ref}
        data-slot="popover-positioner"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={composeClassName(basePositionerClasses, className)}
        {...props}
      />
    )
  ),
  { [POPOVER_PART]: true }
);
PopoverPositioner.displayName = 'PopoverPositioner';

export const PopoverPopup = Object.assign(
  React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BasePopover.Popup>>(
    ({ className, ...props }, ref) => (
      <BasePopover.Popup
        ref={ref}
        data-slot="popover-content"
        className={composeClassName(basePopupClasses, className)}
        {...props}
      />
    )
  ),
  { [POPOVER_PART]: true }
);
PopoverPopup.displayName = 'PopoverPopup';

export function PopoverRoot<Payload = unknown>({
  modal = false,
  ...props
}: BasePopover.Root.Props<Payload>): React.JSX.Element {
  const popoverContextValue = React.useMemo(() => ({ modal }), [modal]);
  return (
    <PopoverContext.Provider value={popoverContextValue}>
      <BasePopover.Root<Payload> modal={modal} {...props} />
    </PopoverContext.Provider>
  );
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
    anchor,
    positionMethod,
    sticky,
    collisionPadding = 8,
    collisionBoundary,
    collisionAvoidance,
    arrowPadding,
    disableAnchorTracking,
    initialFocus,
    finalFocus,
    actionsRef,
    handle,
    triggerId,
    defaultTriggerId,
    showArrow = true,
    showCloseButton = false,
    showBackdrop,
    closeLabel = 'Close',
    portal = true,
    container,
    keepMounted,
    backdropClassName,
    containerClassName,
    className,
  }: PopoverProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const generatedId = React.useId();
  const popoverId = `popover-${generatedId}`;

  const isCompoundUsage = React.useMemo(() => {
    if (trigger !== undefined || anchor !== undefined) return false;
    if (!title && !description) return true;
    if (typeof children === 'function') return false;
    return hasPopoverCompoundChild(children);
  }, [trigger, anchor, title, description, children]);

  const popoverContextValue = React.useMemo(
    () => ({ openOnHover, delay, closeDelay, modal }),
    [openOnHover, delay, closeDelay, modal]
  );

  // If used as a composable compound root (<Popover open={...}><PopoverTrigger /><PopoverContent /></Popover>)
  if (isCompoundUsage) {
    return (
      <PopoverContext.Provider value={popoverContextValue}>
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

  const shouldRenderBackdrop = showBackdrop ?? modal === true;
  const needsFocusTrapClose = modal === true || modal === 'trap-focus';

  const renderContentNode = (renderProps: { payload: Payload | undefined }) => (
    <PopoverPositioner
      anchor={anchor}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      positionMethod={positionMethod}
      sticky={sticky}
      collisionPadding={collisionPadding}
      collisionBoundary={collisionBoundary}
      collisionAvoidance={collisionAvoidance}
      arrowPadding={arrowPadding}
      disableAnchorTracking={disableAnchorTracking}
      className={containerClassName}
    >
      <PopoverPopup
        ref={ref}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        className={className}
      >
        {showArrow && <PopoverArrow />}
        <ScrollArea
          data-slot="popover-body"
          className="min-h-0 flex-[0_1_auto]"
          viewportClassName="overscroll-contain"
          contentClassName="p-5"
        >
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
          {showCloseButton ? (
            <div className="mt-4 pt-3 border-t border-outline-variant flex justify-end">
              <BasePopover.Close
                data-slot="popover-close"
                className="inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {closeLabel}
              </BasePopover.Close>
            </div>
          ) : needsFocusTrapClose ? (
            <BasePopover.Close className="sr-only">{closeLabel}</BasePopover.Close>
          ) : null}
        </ScrollArea>
      </PopoverPopup>
    </PopoverPositioner>
  );

  const rootContent = (
    <PopoverContext.Provider value={popoverContextValue}>
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
              <PopoverPortal container={container} keepMounted={keepMounted}>
                {shouldRenderBackdrop && <PopoverBackdrop className={backdropClassName} />}
                {renderContentNode(renderProps)}
              </PopoverPortal>
            ) : (
              renderContentNode(renderProps)
            )}
          </>
        )}
      </BasePopover.Root>
    </PopoverContext.Provider>
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

export const PopoverComponent = React.forwardRef(PopoverComponentInner) as (<Payload = unknown>(
  props: PopoverProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };

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
  align?: BasePopover.Positioner.Props['align'];
  sideOffset?: BasePopover.Positioner.Props['sideOffset'];
  alignOffset?: BasePopover.Positioner.Props['alignOffset'];
  anchor?: BasePopover.Positioner.Props['anchor'];
  positionMethod?: BasePopover.Positioner.Props['positionMethod'];
  sticky?: BasePopover.Positioner.Props['sticky'];
  collisionPadding?: BasePopover.Positioner.Props['collisionPadding'];
  collisionBoundary?: BasePopover.Positioner.Props['collisionBoundary'];
  collisionAvoidance?: BasePopover.Positioner.Props['collisionAvoidance'];
  arrowPadding?: BasePopover.Positioner.Props['arrowPadding'];
  disableAnchorTracking?: BasePopover.Positioner.Props['disableAnchorTracking'];
  showArrow?: boolean;
  showBackdrop?: boolean;
  scrollable?: boolean;
  backdropClassName?: BasePopover.Backdrop.Props['className'];
  containerClassName?: BasePopover.Positioner.Props['className'];
  portal?: boolean;
  container?: BasePopover.Portal.Props['container'];
  keepMounted?: boolean;
}

export const PopoverContent = Object.assign(
  React.forwardRef<HTMLDivElement, PopoverContentProps>(
    (
      {
        className,
        children,
        side,
        align,
        sideOffset = 8,
        alignOffset,
        anchor,
        positionMethod,
        sticky,
        collisionPadding = 8,
        collisionBoundary,
        collisionAvoidance,
        arrowPadding,
        disableAnchorTracking,
        showArrow = true,
        showBackdrop,
        scrollable = true,
        backdropClassName,
        containerClassName,
        portal = true,
        container,
        keepMounted,
        ...props
      },
      ref
    ) => {
      const { modal } = usePopoverContext();
      const shouldRenderBackdrop = showBackdrop ?? modal === true;
      const childList = React.Children.toArray(children);
      const arrowChildren: React.ReactNode[] = [];
      const bodyChildren: React.ReactNode[] = [];

      for (const child of childList) {
        if (
          React.isValidElement(child) &&
          (child.type === PopoverArrow || child.type === BasePopover.Arrow)
        ) {
          arrowChildren.push(child);
        } else {
          bodyChildren.push(child);
        }
      }

      const content = (
        <PopoverPositioner
          anchor={anchor}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          positionMethod={positionMethod}
          sticky={sticky}
          collisionPadding={collisionPadding}
          collisionBoundary={collisionBoundary}
          collisionAvoidance={collisionAvoidance}
          arrowPadding={arrowPadding}
          disableAnchorTracking={disableAnchorTracking}
          className={containerClassName}
        >
          <PopoverPopup
            ref={ref}
            className={composeClassName(scrollable ? 'p-5' : undefined, className)}
            {...props}
          >
            {arrowChildren.length > 0 ? arrowChildren : showArrow ? <PopoverArrow /> : null}
            {scrollable ? (
              <ScrollArea
                data-slot="popover-body"
                className="min-h-0 flex-[0_1_auto]"
                viewportClassName="overscroll-contain"
              >
                {bodyChildren}
              </ScrollArea>
            ) : (
              bodyChildren
            )}
          </PopoverPopup>
        </PopoverPositioner>
      );

      if (!portal) {
        return content;
      }

      return (
        <PopoverPortal container={container} keepMounted={keepMounted}>
          {shouldRenderBackdrop && <PopoverBackdrop className={backdropClassName} />}
          {content}
        </PopoverPortal>
      );
    }
  ),
  { [POPOVER_PART]: true }
);
PopoverContent.displayName = 'PopoverContent';

export type PopoverTriggerProps<Payload = unknown> = BasePopover.Trigger.Props<Payload>;

export const PopoverTrigger = Object.assign(
  React.forwardRef(function PopoverTrigger<Payload = unknown>(
    { className, children, openOnHover, delay, closeDelay, render, nativeButton, ...props }: PopoverTriggerProps<Payload>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) {
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
        {...(resolvedDelay !== undefined ? { delay: resolvedDelay } : {})}
        {...(resolvedCloseDelay !== undefined ? { closeDelay: resolvedCloseDelay } : {})}
        className={className}
        {...props}
      >
        {children}
      </BasePopover.Trigger>
    );
  }) as (<Payload = unknown>(
    props: PopoverTriggerProps<Payload> & React.RefAttributes<HTMLButtonElement>
  ) => React.JSX.Element) & { displayName?: string },
  { [POPOVER_PART]: true }
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
            'inline-flex items-center justify-center h-11 min-h-[44px] px-4 rounded bg-surface text-on-surface border border-outline font-label text-sm font-semibold cursor-pointer hover:bg-state-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )
    }
    {...props}
  />
));
PopoverClose.displayName = 'PopoverClose';

export const PopoverViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Viewport>
>(({ className, ...props }, ref) => (
  <BasePopover.Viewport
    ref={ref}
    data-slot="popover-viewport"
    className={composeClassName('relative size-full overflow-hidden rounded-[inherit]', className)}
    {...props}
  />
));
PopoverViewport.displayName = 'PopoverViewport';

// Compound export mapping Base UI primitives
export const Popover = Object.assign(PopoverComponent, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
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
export const PopoverRootPrimitive = BasePopover.Root;
export const PopoverPortalPrimitive = BasePopover.Portal;
export const PopoverPositionerPrimitive = BasePopover.Positioner;
export const PopoverPopupPrimitive = BasePopover.Popup;
export const createPopoverHandle = BasePopover.createHandle;
export const PopoverHandle = BasePopover.Handle;

export default Popover;
