import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type {
  ToastObject,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastManagerPromiseOptions,
  ToastManagerPositionerProps,
} from '@base-ui/react/toast';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export interface ToastProps {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

const accentBorder: Record<string, string> = {
  info: 'border-l-primary',
  success: 'border-l-success',
  warning: 'border-l-warning',
  error: 'border-l-error',
  loading: 'border-l-primary',
};

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
  loading: { name: 'progress_activity', color: 'text-primary' },
};

/**
 * Static / Standalone Toast component for isolated use
 */
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
          'relative flex items-start gap-3 p-4 pl-5 rounded-none bg-surface border-l-4 border-t-0 border-r-0 border-b-0 shadow-ambient max-w-sm w-full overflow-hidden transition-[opacity,transform] duration-[var(--duration-slow)] data-[ending-style]:duration-[var(--duration-medium)] data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
          accentBorder[type] || accentBorder.info,
          className
        )}
      >
        <BaseToast.Content className="flex items-start gap-3 w-full">
          <Icon
            name={currentIcon.name}
            size="lg"
            className={cn('shrink-0 mt-0.5 select-none', currentIcon.color)}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0 pr-1">
            <BaseToast.Title className="font-heading text-sm font-bold text-on-surface leading-snug">
              {title}
            </BaseToast.Title>
            {description && (
              <BaseToast.Description className="font-sans text-xs text-on-surface-variant mt-1 leading-normal">
                {description}
              </BaseToast.Description>
            )}
          </div>
          {onClose && (
            <BaseToast.Close
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 -mr-2 -mt-2 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/80 active:bg-surface-variant transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none"
              aria-label="Dismiss toast"
            >
              <Icon name="close" size="sm" aria-hidden="true" />
            </BaseToast.Close>
          )}
        </BaseToast.Content>
      </BaseToast.Root>
    </BaseToast.Provider>
  );
};

export interface ToastActionConfig {
  label: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ToastActionOption = ToastActionConfig | React.ComponentPropsWithoutRef<'button'>;

export interface ToastCustomData {
  action?: ToastActionOption;
}

export type ToastItem = ToastObject<ToastCustomData>;

export interface ToastOptions extends ToastManagerAddOptions<ToastCustomData> {
  action?: ToastActionOption;
}

// Global Toast Manager and Dispatcher
export const globalToastManager = BaseToast.createToastManager<ToastCustomData>();

function normalizeToastOptions(options: ToastOptions | string, defaultType = 'info'): ToastOptions {
  if (typeof options === 'string') {
    return { title: options, type: defaultType };
  }
  const { action, data, ...rest } = options;
  return {
    ...rest,
    type: options.type ?? defaultType,
    data: action ? { action, ...data } : data,
  };
}

/**
 * Dispatches a toast notification via the global toast manager.
 */
export const toast = (options: ToastOptions | string) => {
  const norm = normalizeToastOptions(options, 'info');
  return globalToastManager.add(norm);
};

toast.add = (options: ToastOptions) => {
  const norm = normalizeToastOptions(options, 'info');
  return globalToastManager.add(norm);
};

toast.info = (
  title: React.ReactNode,
  description?: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'description' | 'type'>
) => {
  return toast.add({
    ...options,
    title,
    description,
    type: 'info',
  });
};

toast.success = (
  title: React.ReactNode,
  description?: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'description' | 'type'>
) => {
  return toast.add({
    ...options,
    title,
    description,
    type: 'success',
  });
};

toast.warning = (
  title: React.ReactNode,
  description?: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'description' | 'type'>
) => {
  return toast.add({
    ...options,
    title,
    description,
    type: 'warning',
  });
};

toast.error = (
  title: React.ReactNode,
  description?: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'description' | 'type'>
) => {
  return toast.add({
    ...options,
    title,
    description,
    type: 'error',
  });
};

toast.close = (id?: string) => globalToastManager.close(id);

toast.update = (
  id: string,
  updates:
    | ToastManagerUpdateOptions<ToastCustomData>
    | ((prevToast: ToastItem) => ToastManagerUpdateOptions<ToastCustomData>)
) => {
  globalToastManager.update(id, updates);
};

export interface ToastPromiseOptions<Value> {
  loading: string | ToastManagerUpdateOptions<ToastCustomData>;
  success:
    | string
    | ToastManagerUpdateOptions<ToastCustomData>
    | ((result: Value) => string | ToastManagerUpdateOptions<ToastCustomData>);
  error:
    | string
    | ToastManagerUpdateOptions<ToastCustomData>
    | ((error: unknown) => string | ToastManagerUpdateOptions<ToastCustomData>);
}

toast.promise = <Value,>(
  promise: Promise<Value>,
  options: ToastPromiseOptions<Value>
): Promise<Value> => {
  const mapUpdate = (
    val: string | ToastManagerUpdateOptions<ToastCustomData>
  ): ToastManagerUpdateOptions<ToastCustomData> => {
    if (typeof val === 'string') {
      return { title: val };
    }
    return val;
  };

  const managerPromiseOptions: ToastManagerPromiseOptions<Value, ToastCustomData> = {
    loading: mapUpdate(options.loading),
    success: (result: Value) => {
      const resolved = typeof options.success === 'function' ? options.success(result) : options.success;
      return mapUpdate(resolved);
    },
    error: (err: unknown) => {
      const resolved = typeof options.error === 'function' ? options.error(err) : options.error;
      return mapUpdate(resolved);
    },
  };

  return globalToastManager.promise(promise, managerPromiseOptions);
};

toast.anchored = (
  title: React.ReactNode,
  anchorElement: Element | null,
  options?: Omit<ToastOptions, 'title'>
) => {
  return toast.add({
    ...options,
    title,
    positionerProps: {
      ...options?.positionerProps,
      anchor: anchorElement,
    },
  });
};

function isActionConfig(action: ToastActionOption): action is ToastActionConfig {
  return typeof action === 'object' && action !== null && 'label' in action && 'onClick' in action;
}

/**
 * Toast item inside global Toaster with Base UI stacked deck physics & gestures
 */
const ActiveToastItem: React.FC<{
  toast: ToastItem;
  position: ToasterPosition;
}> = ({ toast: t, position }) => {
  const toastType = t.type || 'info';
  const currentIcon = iconMap[toastType] || iconMap.info;
  const isTopPosition = position.startsWith('top');

  // Stacking deck CSS styles driven by Base UI CSS variables:
  // --toast-index, --toast-offset-y, --toast-height, --toast-swipe-movement-x, --toast-swipe-movement-y
  const stackStyle: React.CSSProperties = {
    transform: `translateX(var(--toast-swipe-movement-x, 0px)) translateY(calc(var(--toast-swipe-movement-y, 0px) + (var(--toast-offset-y) * ${isTopPosition ? 1 : -1})))`,
  };

  const actionOption = t.data?.action;
  const hasAction = Boolean(t.actionProps || actionOption);

  const toastCardContent = (
    <BaseToast.Root
      toast={t}
      swipeDirection={['down', 'right', 'left']}
      style={t.positionerProps?.anchor ? undefined : stackStyle}
      className={cn(
        'pointer-events-auto relative flex items-start gap-3 p-4 pl-5 rounded-none bg-surface border-l-4 border-t-0 border-r-0 border-b-0 shadow-ambient max-w-sm w-full overflow-hidden select-none',
        accentBorder[toastType] || accentBorder.info,
        // Base transition for smooth stacking deck physics
        'transition-[opacity,transform,box-shadow] duration-[var(--duration-slow)] ease-[var(--ease-standard)]',
        // Responsive entry and exit states
        'data-[starting-style]:opacity-0',
        isTopPosition
          ? 'data-[starting-style]:-translate-y-4'
          : 'data-[starting-style]:translate-y-4',
        'data-[ending-style]:opacity-0 data-[ending-style]:duration-[var(--duration-medium)]',
        // Behind toast styling (dimmed slightly in collapsed deck)
        'data-[behind]:opacity-85 data-[behind]:shadow-ambient',
        // Limited toast styling (exceeded stack limit)
        'data-[limited]:opacity-0 data-[limited]:pointer-events-none',
        // Swiping active gesture
        'data-[swiping]:transition-none',
        // Respect reduced motion
        'motion-reduce:transition-none motion-reduce:transform-none'
      )}
    >
      <BaseToast.Content className="flex items-start gap-3 w-full min-w-0">

        {/* Semantic Icon with rotation animation on loading */}
        <Icon
          name={currentIcon.name}
          size="lg"
          className={cn(
            'shrink-0 mt-0.5 select-none',
            currentIcon.color,
            toastType === 'loading' && 'animate-spin'
          )}
          aria-hidden="true"
        />

        {/* Toast Body */}
        <div className="flex-1 min-w-0 pr-1">
          {t.title && (
            <BaseToast.Title className="font-heading text-sm font-bold text-on-surface leading-snug">
              {t.title}
            </BaseToast.Title>
          )}
          {t.description && (
            <BaseToast.Description className="font-sans text-xs text-on-surface-variant mt-1 leading-normal break-words">
              {t.description}
            </BaseToast.Description>
          )}
        </div>

        {/* Action button if provided */}
        {hasAction && (
          <BaseToast.Action
            className="font-label text-xs font-semibold px-2.5 py-1 rounded-sm text-primary hover:bg-primary-container hover:text-on-primary-container focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer shrink-0"
            onClick={
              actionOption && isActionConfig(actionOption)
                ? actionOption.onClick
                : undefined
            }
          >
            {actionOption && isActionConfig(actionOption) ? actionOption.label : undefined}
          </BaseToast.Action>
        )}

        {/* Dismiss Close button with WCAG 2.2 44x44px target */}
        <BaseToast.Close
          className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 -mr-2 -mt-2 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/80 active:bg-surface-variant transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none"
          aria-label="Dismiss toast"
        >
          <Icon name="close" size="sm" aria-hidden="true" />
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  );

  // If anchored toast, wrap in BaseToast.Positioner and add BaseToast.Arrow
  if (t.positionerProps?.anchor) {
    return (
      <BaseToast.Positioner
        toast={t}
        anchor={t.positionerProps.anchor}
        side={t.positionerProps.side}
        align={t.positionerProps.align}
        sideOffset={t.positionerProps.sideOffset}
        alignOffset={t.positionerProps.alignOffset}
        className="z-[60] pointer-events-auto"
      >
        {toastCardContent}
        <BaseToast.Arrow className="fill-surface stroke-outline-variant drop-shadow-sm" />
      </BaseToast.Positioner>
    );
  }

  return toastCardContent;
};

export type ToasterPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-center';

export interface ToasterProps {
  position?: ToasterPosition;
  limit?: number; // default 5
  timeout?: number; // default 5000
  className?: string;
}

const positionClasses: Record<ToasterPosition, string> = {
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
};

const ToasterViewportContent: React.FC<{
  position: ToasterPosition;
  className?: string;
}> = ({ position, className }) => {
  const { toasts } = BaseToast.useToastManager<ToastCustomData>();

  return (
    <BaseToast.Portal>
      {/* High z-index z-[60] so toasts float above modal dialogs and sheets (z-50) */}
      <BaseToast.Viewport
        className={cn(
          'fixed z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4 focus:outline-none',
          positionClasses[position],
          className
        )}
      >
        {toasts.map((t) => (
          <ActiveToastItem key={t.id} toast={t} position={position} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
};

/**
 * App-level Toaster component that mounts the Base UI Toast Provider and Viewport.
 */
export const Toaster: React.FC<ToasterProps> = ({
  position = 'bottom-right',
  limit = 5,
  timeout = 5000,
  className,
}) => {
  return (
    <BaseToast.Provider toastManager={globalToastManager} timeout={timeout} limit={limit}>
      <ToasterViewportContent position={position} className={className} />
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
export type { ToastManagerPositionerProps };
