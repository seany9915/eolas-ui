import * as React from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cn } from '@/lib/utils';

interface PreviewCardContextValue {
  delay?: number;
  closeDelay?: number;
}

const PreviewCardContext = React.createContext<PreviewCardContextValue>({});
export const usePreviewCardContext = () => React.useContext(PreviewCardContext);

export interface PreviewCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Trigger> {}

export const PreviewCardTrigger = React.forwardRef<HTMLAnchorElement, PreviewCardTriggerProps>(
  ({ className, children, delay, closeDelay, ...props }, ref) => {
    const context = React.useContext(PreviewCardContext);
    const resolvedDelay = delay ?? context.delay;
    const resolvedCloseDelay = closeDelay ?? context.closeDelay;

    return (
      <BasePreviewCard.Trigger
        ref={ref}
        delay={resolvedDelay}
        closeDelay={resolvedCloseDelay}
        className={cn(
          'inline-flex cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded',
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
  ({ className, sideOffset = 8, ...props }, ref) => (
    <BasePreviewCard.Positioner
      ref={ref}
      sideOffset={sideOffset}
      className={cn('z-50 outline-none', className)}
      {...props}
    />
  )
);
PreviewCardPositioner.displayName = 'PreviewCardPositioner';

export interface PreviewCardPopupProps
  extends React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> {}

export const PreviewCardPopup = React.forwardRef<HTMLDivElement, PreviewCardPopupProps>(
  ({ className, ...props }, ref) => (
    <BasePreviewCard.Popup
      ref={ref}
      className={cn(
        'w-72 p-4 rounded bg-surface border border-outline-variant shadow-ambient space-y-2',
        'transition-[opacity,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)] origin-[var(--transform-origin)]',
        'data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]',
        'motion-reduce:transition-none motion-reduce:transform-none',
        className
      )}
      {...props}
    />
  )
);
PreviewCardPopup.displayName = 'PreviewCardPopup';

export interface PreviewCardProps<Payload = unknown>
  extends Omit<React.ComponentPropsWithoutRef<typeof BasePreviewCard.Root>, 'children'> {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: string;
  badgeText?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: BasePreviewCard.Root.ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  actionsRef?: React.RefObject<BasePreviewCard.Root.Actions | null>;
  handle?: BasePreviewCard.Handle<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  delay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
  className?: string;
}

function PreviewCardComponentInner<Payload = unknown>(
  {
    trigger,
    title,
    description,
    icon,
    badgeText,
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
      >
        <PreviewCardTrigger
          render={React.isValidElement(trigger) ? trigger : undefined}
        >
          {React.isValidElement(trigger) ? undefined : trigger}
        </PreviewCardTrigger>
        <BasePreviewCard.Portal>
          <PreviewCardPositioner>
            <PreviewCardPopup ref={ref} className={className}>
              {children ? (
                children
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {icon && (
                        <span className="material-symbols-outlined text-primary text-xl shrink-0" aria-hidden="true">
                          {icon}
                        </span>
                      )}
                      {title && <h4 className="font-heading text-sm font-bold text-on-surface truncate">{title}</h4>}
                    </div>
                    {badgeText && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label text-xs font-semibold shrink-0">
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
  Arrow: BasePreviewCard.Arrow,
  Backdrop: BasePreviewCard.Backdrop,
  Viewport: BasePreviewCard.Viewport,
  createHandle: BasePreviewCard.createHandle,
  Handle: BasePreviewCard.Handle,
});

// Re-export Base UI primitives for compound composition
export { BasePreviewCard };
export const PreviewCardRoot = BasePreviewCard.Root;
export const PreviewCardPortal = BasePreviewCard.Portal;
export const PreviewCardArrow = BasePreviewCard.Arrow;
export const PreviewCardBackdrop = BasePreviewCard.Backdrop;
export const PreviewCardViewport = BasePreviewCard.Viewport;
export const createPreviewCardHandle = BasePreviewCard.createHandle;
export const PreviewCardHandle = BasePreviewCard.Handle;
export const PreviewCardTriggerPrimitive = BasePreviewCard.Trigger;
export const PreviewCardPositionerPrimitive = BasePreviewCard.Positioner;
export const PreviewCardPopupPrimitive = BasePreviewCard.Popup;

export default PreviewCard;
