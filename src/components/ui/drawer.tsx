import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  swipeDirection?: 'right' | 'left' | 'down' | 'up';
  snapPoints?: BaseDrawer.Root.SnapPoint[];
  snapPoint?: BaseDrawer.Root.SnapPoint | null;
  defaultSnapPoint?: BaseDrawer.Root.SnapPoint | null;
  onSnapPointChange?: (snapPoint: BaseDrawer.Root.SnapPoint | null) => void;
  modal?: boolean | 'trap-focus';
}

const DrawerComponent: React.FC<DrawerProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  swipeDirection = 'right',
  snapPoints,
  snapPoint,
  defaultSnapPoint,
  onSnapPointChange,
  modal = true,
}) => {
  const viewportClasses = {
    right: 'fixed inset-y-0 right-0 z-50 flex max-w-full',
    left: 'fixed inset-y-0 left-0 z-50 flex max-w-full',
    down: 'fixed inset-x-0 bottom-0 z-50 flex max-h-full',
    up: 'fixed inset-x-0 top-0 z-50 flex max-h-full',
  }[swipeDirection];

  const popupClasses = {
    right: 'w-screen max-w-md h-full rounded-l-lg rounded-r-none border-l-[2px] border-outline-variant data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
    left: 'w-screen max-w-md h-full rounded-r-lg rounded-l-none border-r-[2px] border-outline-variant data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
    down: 'h-auto max-h-[85vh] w-full rounded-t-xl rounded-b-none border-t-[2px] border-outline-variant data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
    up: 'h-auto max-h-[85vh] w-full rounded-b-xl rounded-t-none border-b-[2px] border-outline-variant data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full',
  }[swipeDirection];

  return (
    <BaseDrawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      swipeDirection={swipeDirection}
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      defaultSnapPoint={defaultSnapPoint}
      onSnapPointChange={onSnapPointChange}
      modal={modal}
    >
      {trigger && (
        <BaseDrawer.Trigger
          render={React.isValidElement(trigger) ? trigger : undefined}
          className={!React.isValidElement(trigger) ? 'inline-flex cursor-pointer' : undefined}
        >
          {!React.isValidElement(trigger) ? trigger : undefined}
        </BaseDrawer.Trigger>
      )}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 transition-opacity duration-[var(--duration-slow)] data-[ending-style]:duration-[var(--duration-medium)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)]" />
        <BaseDrawer.Viewport className={viewportClasses}>
          <BaseDrawer.Popup className={cn(
            'p-6 bg-surface shadow-modal flex flex-col justify-between overflow-y-auto will-change-[transform] transition-transform duration-[var(--duration-slow)] data-[ending-style]:duration-[var(--duration-medium)] ease-[var(--ease-standard)]',
            popupClasses
          )}>
            <BaseDrawer.Content className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <BaseDrawer.Title className="font-heading text-xl font-bold text-on-surface">
                    {title}
                  </BaseDrawer.Title>
                  <BaseDrawer.Close
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
                    aria-label="Close drawer panel"
                  >
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
                  </BaseDrawer.Close>
                </div>
                <BaseDrawer.Description className="font-sans text-base text-on-surface-variant mb-6">
                  {description}
                </BaseDrawer.Description>
                {children}
              </div>
              <div className="pt-6 border-t border-outline-variant flex items-center justify-end gap-3 mt-6">
                <BaseDrawer.Close className="inline-flex items-center justify-center font-label text-sm font-semibold rounded-[0.5rem] h-12 px-5 min-h-[48px] bg-surface text-primary border-[2px] border-primary hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer">
                  Close panel
                </BaseDrawer.Close>
              </div>
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};

// Compound export mapping Base UI primitives
export const Drawer = Object.assign(DrawerComponent, {
  Root: BaseDrawer.Root,
  Trigger: BaseDrawer.Trigger,
  Portal: BaseDrawer.Portal,
  Backdrop: BaseDrawer.Backdrop,
  Viewport: BaseDrawer.Viewport,
  Popup: BaseDrawer.Popup,
  Content: BaseDrawer.Content,
  SwipeArea: BaseDrawer.SwipeArea,
  Indent: BaseDrawer.Indent,
  IndentBackground: BaseDrawer.IndentBackground,
  VirtualKeyboardProvider: BaseDrawer.VirtualKeyboardProvider,
  Title: BaseDrawer.Title,
  Description: BaseDrawer.Description,
  Close: BaseDrawer.Close,
  Provider: BaseDrawer.Provider,
  createHandle: BaseDrawer.createHandle,
  Handle: BaseDrawer.Handle,
});

// Re-export Base UI primitives for compound composition
export { BaseDrawer };
export const DrawerRoot = BaseDrawer.Root;
export const DrawerTrigger = BaseDrawer.Trigger;
export const DrawerPortal = BaseDrawer.Portal;
export const DrawerBackdrop = BaseDrawer.Backdrop;
export const DrawerViewport = BaseDrawer.Viewport;
export const DrawerPopup = BaseDrawer.Popup;
export const DrawerContent = BaseDrawer.Content;
export const DrawerSwipeArea = BaseDrawer.SwipeArea;
export const DrawerIndent = BaseDrawer.Indent;
export const DrawerIndentBackground = BaseDrawer.IndentBackground;
export const DrawerVirtualKeyboardProvider = BaseDrawer.VirtualKeyboardProvider;
export const DrawerTitle = BaseDrawer.Title;
export const DrawerDescription = BaseDrawer.Description;
export const DrawerClose = BaseDrawer.Close;
export const DrawerProvider = BaseDrawer.Provider;
export const createDrawerHandle = BaseDrawer.createHandle;
export const DrawerHandle = BaseDrawer.Handle;

