import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  modal?: boolean;
  initialFocus?: BaseDialog.Popup.Props['initialFocus'];
  finalFocus?: BaseDialog.Popup.Props['finalFocus'];
  handle?: BaseDialog.Handle<any>;
  actionsRef?: React.RefObject<BaseDialog.Root.Actions | null>;
}

const DialogComponent: React.FC<DialogProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  trigger,
  title,
  description,
  children,
  confirmLabel = 'Confirm action',
  onConfirm,
  closeOnConfirm = true,
  modal = true,
  initialFocus,
  finalFocus,
  handle,
  actionsRef,
}) => {
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      modal={modal}
      handle={handle}
      actionsRef={actionsRef}
    >
      {trigger && (
        <BaseDialog.Trigger
          render={React.isValidElement(trigger) ? trigger : undefined}
          className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
        >
          {!React.isValidElement(trigger) ? trigger : undefined}
        </BaseDialog.Trigger>
      )}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
        <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseDialog.Popup
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className="w-full max-w-lg p-6 rounded-[1rem] bg-surface border-[2px] border-outline-variant shadow-modal will-change-[opacity,transform] transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)]"
          >
            <div className="flex items-center justify-between mb-2">
              <BaseDialog.Title className="font-heading text-xl font-bold text-on-surface">
                {title}
              </BaseDialog.Title>
              <BaseDialog.Close
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
              </BaseDialog.Close>
            </div>
            <BaseDialog.Description className="font-sans text-base text-on-surface-variant mb-6">
              {description}
            </BaseDialog.Description>
            {children}
            <div className="flex items-center justify-end gap-3 mt-6">
              <BaseDialog.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded-[0.5rem] h-12 px-5 min-h-[48px] bg-surface text-primary border-[2px] border-primary hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer">
                Cancel
              </BaseDialog.Close>
              {closeOnConfirm ? (
                <BaseDialog.Close
                  render={
                    <Button
                      variant="filled"
                      colorRole="primary"
                      size="sm"
                      onClick={() => {
                        onConfirm?.();
                      }}
                    >
                      {confirmLabel}
                    </Button>
                  }
                />
              ) : (
                <Button
                  variant="filled"
                  colorRole="primary"
                  size="sm"
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  {confirmLabel}
                </Button>
              )}
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

// Compound Base UI exports
export const Dialog = Object.assign(DialogComponent, {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Portal: BaseDialog.Portal,
  Backdrop: BaseDialog.Backdrop,
  Viewport: BaseDialog.Viewport,
  Popup: BaseDialog.Popup,
  Title: BaseDialog.Title,
  Description: BaseDialog.Description,
  Close: BaseDialog.Close,
  createHandle: BaseDialog.createHandle,
  Handle: BaseDialog.Handle,
});

export { BaseDialog };
export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;
export const DialogBackdrop = BaseDialog.Backdrop;
export const DialogViewport = BaseDialog.Viewport;
export const DialogPopup = BaseDialog.Popup;
export const DialogTitle = BaseDialog.Title;
export const DialogDescription = BaseDialog.Description;
export const DialogClose = BaseDialog.Close;
export const createDialogHandle = BaseDialog.createHandle;

