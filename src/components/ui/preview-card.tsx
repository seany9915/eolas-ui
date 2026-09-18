import * as React from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';

export interface PreviewCardProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  icon?: string;
  badgeText?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
}

const PreviewCardComponent: React.FC<PreviewCardProps> = ({
  trigger,
  title,
  description,
  icon,
  badgeText,
  open,
  defaultOpen,
  onOpenChange,
  delay,
  closeDelay,
  children,
}) => {
  return (
    <BasePreviewCard.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BasePreviewCard.Trigger
        delay={delay}
        closeDelay={closeDelay}
        render={React.isValidElement(trigger) ? trigger : undefined}
        className="inline-flex cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
      >
        {React.isValidElement(trigger) ? undefined : trigger}
      </BasePreviewCard.Trigger>
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner sideOffset={8}>
          <BasePreviewCard.Popup className="w-72 p-4 rounded bg-surface border border-outline-variant shadow-ambient z-50 space-y-2 transition-[opacity,transform] duration-100 ease-out origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98]">
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
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
};

// Compound export mapping Base UI primitives
export const PreviewCard = Object.assign(PreviewCardComponent, {
  Root: BasePreviewCard.Root,
  Trigger: BasePreviewCard.Trigger,
  Portal: BasePreviewCard.Portal,
  Positioner: BasePreviewCard.Positioner,
  Popup: BasePreviewCard.Popup,
  Arrow: BasePreviewCard.Arrow,
  Backdrop: BasePreviewCard.Backdrop,
  Viewport: BasePreviewCard.Viewport,
  createHandle: BasePreviewCard.createHandle,
  Handle: BasePreviewCard.Handle,
});

// Re-export Base UI primitives for compound composition
export { BasePreviewCard };
export const PreviewCardRoot = BasePreviewCard.Root;
export const PreviewCardTrigger = BasePreviewCard.Trigger;
export const PreviewCardPortal = BasePreviewCard.Portal;
export const PreviewCardPositioner = BasePreviewCard.Positioner;
export const PreviewCardPopup = BasePreviewCard.Popup;
export const PreviewCardArrow = BasePreviewCard.Arrow;
export const PreviewCardBackdrop = BasePreviewCard.Backdrop;
export const PreviewCardViewport = BasePreviewCard.Viewport;
export const createPreviewCardHandle = BasePreviewCard.createHandle;
export const PreviewCardHandle = BasePreviewCard.Handle;

