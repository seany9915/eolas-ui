'use client';

import * as React from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cn, composeClassName } from '@/lib/utils';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';

interface PreviewCardContextValue {
  delay?: number;
  closeDelay?: number;
}

const PreviewCardContext = React.createContext<PreviewCardContextValue>({});
export const usePreviewCardContext = () => React.useContext(PreviewCardContext);

export interface PreviewCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Trigger> {}

export const PreviewCardTrigger = React.forwardRef<HTMLAnchorElement, PreviewCardTriggerProps>(
  ({ className, children, delay, closeDelay, render, href, ...props }, ref) => {
    const context = React.useContext(PreviewCardContext);
    const resolvedDelay = delay ?? context.delay;
    const resolvedCloseDelay = closeDelay ?? context.closeDelay;
    const isFallbackButton = href === undefined && render === undefined;
    const resolvedRender = isFallbackButton ? <button type="button" /> : render;

    return (
      <BasePreviewCard.Trigger
        ref={ref}
        data-slot="preview-card-trigger"
        render={resolvedRender}
        {...(!isFallbackButton && href !== undefined ? { href } : {})}
        {...(resolvedDelay !== undefined ? { delay: resolvedDelay } : {})}
        {...(resolvedCloseDelay !== undefined ? { closeDelay: resolvedCloseDelay } : {})}
        className={composeClassName(
          cn(
            'inline-flex cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded transition-colors motion-reduce:transition-none',
            isFallbackButton && 'bg-transparent border-0 p-0'
          ),
          className
        )}
        {...props}
      >
        {children}
      </BasePreviewCard.Trigger>
    );
  }
);
PreviewCardTrigger.displayName = 'PreviewCardTrigger';

export interface PreviewCardPositionerProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner> {}

export const PreviewCardPositioner = React.forwardRef<HTMLDivElement, PreviewCardPositionerProps>(
  ({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) => (
    <BasePreviewCard.Positioner
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={composeClassName(
        'z-50 outline-none max-w-[min(var(--available-width),calc(100vw-1rem))]',
        className
      )}
      {...props}
    />
  )
);
PreviewCardPositioner.displayName = 'PreviewCardPositioner';

export interface PreviewCardArrowProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Arrow> {}

export const PreviewCardArrow = React.forwardRef<HTMLDivElement, PreviewCardArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BasePreviewCard.Arrow
      ref={ref}
      data-slot="preview-card-arrow"
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
    </BasePreviewCard.Arrow>
  )
);
PreviewCardArrow.displayName = 'PreviewCardArrow';

export interface PreviewCardPopupProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> {}

export const PreviewCardPopup = React.forwardRef<HTMLDivElement, PreviewCardPopupProps>(
  ({ className, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const arrowChildren: React.ReactNode[] = [];
    const bodyChildren: React.ReactNode[] = [];

    for (const child of childArray) {
      if (
        React.isValidElement(child) &&
        (child.type === PreviewCardArrow || child.type === BasePreviewCard.Arrow)
      ) {
        arrowChildren.push(child);
      } else {
        bodyChildren.push(child);
      }
    }

    return (
      <BasePreviewCard.Popup
        ref={ref}
        data-slot="preview-card-content"
        className={composeClassName(
          'relative w-72 max-w-full max-h-[var(--available-height)] p-4 rounded bg-surface border border-outline-variant shadow-ambient flex flex-col transition-[opacity,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none',
          className
        )}
        {...props}
      >
        {arrowChildren}
        <ScrollArea
          data-slot="preview-card-body"
          className="min-h-0 flex-[0_1_auto]"
          viewportClassName="overscroll-contain"
          contentClassName="flex flex-col gap-2"
        >
          {bodyChildren}
        </ScrollArea>
      </BasePreviewCard.Popup>
    );
  }
);
PreviewCardPopup.displayName = 'PreviewCardPopup';

export interface PreviewCardProps<Payload = unknown>
  extends Omit<BasePreviewCard.Root.Props<Payload>, 'children'> {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: string;
  badgeText?: string;
  side?: BasePreviewCard.Positioner.Props['side'];
  align?: BasePreviewCard.Positioner.Props['align'];
  sideOffset?: BasePreviewCard.Positioner.Props['sideOffset'];
  alignOffset?: BasePreviewCard.Positioner.Props['alignOffset'];
  showArrow?: boolean;
  keepMounted?: boolean;
  container?: BasePreviewCard.Portal.Props['container'];
  delay?: number;
  closeDelay?: number;
  children?: BasePreviewCard.Root.Props<Payload>['children'];
  className?: BasePreviewCard.Popup.Props['className'];
}

function PreviewCardComponentInner<Payload = unknown>(
  {
    trigger,
    title,
    description,
    icon,
    badgeText,
    side,
    align,
    sideOffset = 8,
    alignOffset,
    showArrow = false,
    keepMounted,
    container,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    actionsRef,
    handle,
    triggerId,
    defaultTriggerId,
    delay,
    closeDelay,
    children,
    className,
    ...rootProps
  }: PreviewCardProps<Payload>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  // If used as compound container without shorthand trigger (<PreviewCard><PreviewCard.Trigger>...</PreviewCard>)
  if (!trigger && !title && !description) {
    return (
      <PreviewCardContext.Provider value={{ delay, closeDelay }}>
        <BasePreviewCard.Root<Payload>
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          actionsRef={actionsRef}
          handle={handle}
          triggerId={triggerId}
          defaultTriggerId={defaultTriggerId}
          {...rootProps}
        >
          {children}
        </BasePreviewCard.Root>
      </PreviewCardContext.Provider>
    );
  }

  return (
    <PreviewCardContext.Provider value={{ delay, closeDelay }}>
      <BasePreviewCard.Root<Payload>
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        actionsRef={actionsRef}
        handle={handle}
        triggerId={triggerId}
        defaultTriggerId={defaultTriggerId}
        {...rootProps}
      >
        {(renderProps) => (
          <>
            <PreviewCardTrigger
              render={React.isValidElement(trigger) ? trigger : undefined}
            >
              {React.isValidElement(trigger) ? undefined : trigger}
            </PreviewCardTrigger>
            <BasePreviewCard.Portal container={container} keepMounted={keepMounted}>
              <PreviewCardPositioner
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
              >
                <PreviewCardPopup ref={ref} className={className}>
                  {showArrow && <PreviewCardArrow />}
                  {children ? (
                    typeof children === 'function' ? children(renderProps) : children
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {icon && (
                            <Icon name={icon} size="md" className="text-primary shrink-0" aria-hidden="true" />
                          )}
                          {title && <h4 className="font-heading text-sm font-bold text-on-surface truncate">{title}</h4>}
                        </div>
                        {badgeText && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label text-xs font-semibold shrink-0">
                            {badgeText}
                          </span>
                        )}
                      </div>
                      {description && (
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </PreviewCardPopup>
              </PreviewCardPositioner>
            </BasePreviewCard.Portal>
          </>
        )}
      </BasePreviewCard.Root>
    </PreviewCardContext.Provider>
  );
}

export const PreviewCardComponent = React.forwardRef(PreviewCardComponentInner) as <Payload = unknown>(
  props: PreviewCardProps<Payload> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element;

// Compound export mapping Base UI primitives
export const PreviewCard = Object.assign(PreviewCardComponent, {
  Root: BasePreviewCard.Root,
  Trigger: PreviewCardTrigger,
  Portal: BasePreviewCard.Portal,
  Positioner: PreviewCardPositioner,
  Popup: PreviewCardPopup,
  Arrow: PreviewCardArrow,
  Backdrop: BasePreviewCard.Backdrop,
  Viewport: BasePreviewCard.Viewport,
  createHandle: BasePreviewCard.createHandle,
  Handle: BasePreviewCard.Handle,
});

// Re-export Base UI primitives for compound composition
export { BasePreviewCard };
export const PreviewCardRoot = BasePreviewCard.Root;
export const PreviewCardPortal = BasePreviewCard.Portal;
export const PreviewCardArrowPrimitive = BasePreviewCard.Arrow;
export const PreviewCardBackdrop = BasePreviewCard.Backdrop;
export const PreviewCardViewport = BasePreviewCard.Viewport;
export const createPreviewCardHandle = BasePreviewCard.createHandle;
export const PreviewCardHandle = BasePreviewCard.Handle;
export const PreviewCardTriggerPrimitive = BasePreviewCard.Trigger;
export const PreviewCardPositionerPrimitive = BasePreviewCard.Positioner;
export const PreviewCardPopupPrimitive = BasePreviewCard.Popup;

export default PreviewCard;
