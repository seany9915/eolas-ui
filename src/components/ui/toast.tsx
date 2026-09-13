import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '@/lib/utils';

export interface ToastProps {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

const accentBg: Record<string, string> = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

const iconMap: Record<string, { name: string; color: string }> = {
  info: { name: 'info', color: 'text-primary' },
  success: { name: 'check_circle', color: 'text-success' },
  warning: { name: 'warning', color: 'text-warning' },
  error: { name: 'error', color: 'text-error' },
};

const ToastComponent: React.FC<ToastProps> = ({
  title,
  description,
  type = 'info',
  onClose,
  className,
}) => {
  const currentIcon = iconMap[type] || iconMap.info;

  const toastObj = React.useMemo(
    () => ({
      id: 'static-toast',
      title,
      description,
      type,
    }),
    [title, description, type]
  );

  return (
    <BaseToast.Provider>
      <BaseToast.Root
        toast={toastObj}
        className={cn(
          'relative flex items-start gap-3 p-4 pl-5 rounded-none bg-surface border-none shadow-ambient max-w-md w-full overflow-hidden transition-[opacity,transform] duration-[var(--duration-slow)] data-[ending-style]:duration-[var(--duration-medium)] data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 ease-[var(--ease-standard)]',
          className
        )}
      >
        <BaseToast.Content className="flex items-start gap-3 w-full">
          {/* Mathematically straight 4px vertical accent bar */}
          <div className={cn('absolute left-0 top-0 bottom-0 w-1', accentBg[type])} aria-hidden="true" />
          <span className={cn('material-symbols-outlined text-2xl mt-0.5 select-none', currentIcon.color, type === 'success' && 'transition-[transform,opacity] duration-[var(--duration-very-slow)] ease-[var(--ease-bounce)] data-[starting-style]:scale-50 data-[starting-style]:opacity-0')} aria-hidden="true">
            {currentIcon.name}
          </span>
          <div className="flex-1">
            <BaseToast.Title className="font-heading text-sm font-bold text-on-surface">
              {title}
            </BaseToast.Title>
            {description && (
              <BaseToast.Description className="font-sans text-xs text-on-surface-variant mt-0.5">
                {description}
              </BaseToast.Description>
            )}
          </div>
          {onClose && (
            <BaseToast.Close
              onClick={onClose}
              className="w-7 h-7 min-w-[28px] min-h-[28px] shrink-0 -mr-1 -mt-0.5 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/80 active:bg-surface-variant transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Dismiss toast"
            >
              <span className="material-symbols-outlined text-[18px] leading-none select-none" aria-hidden="true">
                close
              </span>
            </BaseToast.Close>
          )}
        </BaseToast.Content>
      </BaseToast.Root>
    </BaseToast.Provider>
  );
};

// Global Toast Manager and Dispatcher
export const globalToastManager = BaseToast.createToastManager<{
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
}>();

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  timeout?: number;
}

export const toast = (options: ToastOptions | string) => {
  if (typeof options === 'string') {
    return globalToastManager.add({ title: options, type: 'info' });
  }
  return globalToastManager.add({
    title: options.title,
    description: options.description,
    type: options.type ?? 'info',
    timeout: options.timeout,
  });
};

toast.info = (title: React.ReactNode, description?: React.ReactNode, timeout?: number) =>
  globalToastManager.add({ title, description, type: 'info', timeout });

toast.success = (title: React.ReactNode, description?: React.ReactNode, timeout?: number) =>
  globalToastManager.add({ title, description, type: 'success', timeout });

toast.warning = (title: React.ReactNode, description?: React.ReactNode, timeout?: number) =>
  globalToastManager.add({ title, description, type: 'warning', timeout });

toast.error = (title: React.ReactNode, description?: React.ReactNode, timeout?: number) =>
  globalToastManager.add({ title, description, type: 'error', timeout });

toast.close = (id?: string) => globalToastManager.close(id);

/**
 * Toast item inside global Toaster
 */
const ActiveToastItem: React.FC<{ toast: any }> = ({ toast: t }) => {
  const toastType = t.type || 'info';
  const currentIcon = iconMap[toastType] || iconMap.info;

  return (
    <BaseToast.Root
      toast={t}
      className="pointer-events-auto relative flex items-start gap-3 p-4 pl-5 rounded-[0.5rem] bg-surface border border-outline-variant shadow-floating max-w-sm w-full overflow-hidden transition-[opacity,transform] duration-[var(--duration-slow)] data-[ending-style]:duration-[var(--duration-medium)] data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 ease-[var(--ease-standard)]"
    >
      <BaseToast.Content className="flex items-start gap-3 w-full">
        <div className={cn('absolute left-0 top-0 bottom-0 w-1', accentBg[toastType] || accentBg.info)} aria-hidden="true" />
        <span className={cn('material-symbols-outlined text-2xl mt-0.5 select-none', currentIcon.color)} aria-hidden="true">
          {currentIcon.name}
        </span>
        <div className="flex-1">
          <BaseToast.Title className="font-heading text-sm font-bold text-on-surface">
            {t.title}
          </BaseToast.Title>
          {t.description && (
            <BaseToast.Description className="font-sans text-xs text-on-surface-variant mt-0.5">
              {t.description}
            </BaseToast.Description>
          )}
        </div>
        <BaseToast.Close
          className="w-7 h-7 min-w-[28px] min-h-[28px] shrink-0 -mr-1 -mt-0.5 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/80 active:bg-surface-variant transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Dismiss toast"
        >
          <span className="material-symbols-outlined text-[18px] leading-none select-none" aria-hidden="true">
            close
          </span>
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  );
};

const ToasterViewportContent: React.FC = () => {
  const { toasts } = BaseToast.useToastManager();

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4 focus:outline-none">
        {toasts.map((t) => (
          <ActiveToastItem key={t.id} toast={t} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};

/**
 * App-level Toaster component that mounts the Base UI Toast Provider and Viewport.
 */
export const Toaster: React.FC = () => {
  return (
    <BaseToast.Provider toastManager={globalToastManager}>
      <ToasterViewportContent />
    </BaseToast.Provider>
  );
};

// Compound export mapping Base UI primitives
export const Toast = Object.assign(ToastComponent, {
  Provider: BaseToast.Provider,
  Viewport: BaseToast.Viewport,
  Root: BaseToast.Root,
  Content: BaseToast.Content,
  Description: BaseToast.Description,
  Title: BaseToast.Title,
  Close: BaseToast.Close,
  Action: BaseToast.Action,
  Portal: BaseToast.Portal,
  Positioner: BaseToast.Positioner,
  Arrow: BaseToast.Arrow,
  useToastManager: BaseToast.useToastManager,
  createToastManager: BaseToast.createToastManager,
});

// Re-export Base UI primitives for compound composition
export { BaseToast };
export const ToastRoot = BaseToast.Root;
export const ToastContent = BaseToast.Content;
export const ToastTitle = BaseToast.Title;
export const ToastDescription = BaseToast.Description;
export const ToastClose = BaseToast.Close;
export const ToastAction = BaseToast.Action;
export const ToastViewport = BaseToast.Viewport;
export const ToastArrow = BaseToast.Arrow;
export const ToastProvider = BaseToast.Provider;
export const ToastPortal = BaseToast.Portal;
export const ToastPositioner = BaseToast.Positioner;
export const useToastManager = BaseToast.useToastManager;
export const createToastManager = BaseToast.createToastManager;
