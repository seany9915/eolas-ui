'use client';

import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type {
  ToastObject,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastManagerPromiseOptions,
  ToastManagerPositionerProps,
} from '@base-ui/react/toast';
import { cn, composeClassName } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export type ToastType = 'neutral' | 'info' | 'success' | 'warning' | 'error' | (string & {});

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'className'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
  onClose?: () => void;
  closeLabel?: string;
  className?: BaseToast.Root.Props['className'];
}

const accentBorder: Record<string, string> = {
  neutral: 'before:border-s-neutral',
  info: 'before:border-s-neutral', // alias to neutral to preserve primary blue strictly for interactive controls
  success: 'before:border-s-success',
  warning: 'before:border-s-warning',
  error: 'before:border-s-error',
  loading: 'before:border-s-primary',
};

const iconMap: Record<string, { name: string; color: string }> = {
  neutral: { name: 'info', color: 'text-on-surface' },
  info: { name: 'info', color: 'text-on-surface' },
  success: { name: 'check_circle', color: 'text-success' },
  warning: { name: 'warning', color: 'text-warning' },
  error: { name: 'error', color: 'text-error' },
  loading: { name: 'progress_activity', color: 'text-primary' },
};

/**
 * Static / Standalone Toast component for isolated use
 */
const ToastComponent = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      title,
      description,
      type = 'info',
      onClose,
      closeLabel = 'Dismiss toast',
      className,
      ...props
    },
    ref
  ) => {
    const currentIcon = iconMap[type] || iconMap.info;
    const toastId = React.useId();

    const toastObj = React.useMemo(
      () => ({
        id: `static-toast-${toastId}`,
        title,
        description,
        type,
      }),
      [toastId, title, description, type]
    );

    return (
      <BaseToast.Provider>
        <BaseToast.Root
          ref={ref}
          data-slot="toast"
          toast={toastObj}
          className={composeClassName(
            [
              "relative flex items-start gap-3 p-4 ps-5 rounded-s-none rounded-e bg-surface border-y border-e border-s-0 border-outline-variant shadow-ambient max-w-sm w-full transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none before:pointer-events-none before:content-[''] before:absolute before:-inset-y-px before:start-0 before:border-s-4 forced-colors:before:border-s-[Highlight]",
              accentBorder[type] || accentBorder.info,
            ],
            className
          )}
          {...props}
        >
          <BaseToast.Content data-slot="toast-content" className="flex items-start gap-3 w-full">
            <Icon
              name={currentIcon.name}
              size="lg"
              className={cn('shrink-0 mt-0.5 select-none', currentIcon.color)}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0 pe-1">
              {title && (
                <BaseToast.Title data-slot="toast-title" className="font-heading text-sm font-bold text-on-surface leading-snug">
                  {title}
                </BaseToast.Title>
              )}
              {description && (
                <BaseToast.Description
                  data-slot="toast-description"
                  className={cn('font-sans text-sm text-on-surface-variant leading-normal', title && 'mt-1')}
                >
                  {description}
                </BaseToast.Description>
              )}
            </div>
            {onClose && (
              <BaseToast.Close
                data-slot="toast-close"
                onClick={onClose}
                className="size-11 min-w-[44px] min-h-[44px] shrink-0 -me-2 -mt-2 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-state-hover active:bg-surface-container-high transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none"
                aria-label={closeLabel}
              >
                <Icon name="close" size="sm" aria-hidden="true" />
              </BaseToast.Close>
            )}
          </BaseToast.Content>
        </BaseToast.Root>
      </BaseToast.Provider>
    );
  }
);
ToastComponent.displayName = 'Toast';

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
  const { action, actionProps, data, ...rest } = options;

  // Seamlessly bridge both Base UI's native actionProps and convenience action config
  let resolvedActionProps = actionProps;
  if (!resolvedActionProps && action) {
    if (isActionConfig(action)) {
      resolvedActionProps = {
        children: action.label,
        onClick: action.onClick,
      };
    } else {
      resolvedActionProps = action;
    }
  }

  return {
    ...rest,
    actionProps: resolvedActionProps,
    type: options.type ?? defaultType,
    data: action ? { action, ...data } : data,
  };
}

/**
 * Dispatches a toast notification via the global toast manager.
 */
export const toast = (options: ToastOptions | string) => {
  const norm = normalizeToastOptions(options, 'neutral');
  return globalToastManager.add(norm);
};

toast.add = (options: ToastOptions) => {
  const norm = normalizeToastOptions(options, 'neutral');
  return globalToastManager.add(norm);
};

toast.neutral = (
  title: React.ReactNode,
  description?: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'description' | 'type'>
) => {
  return toast.add({
    ...options,
    title,
    description,
    type: 'neutral',
  });
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
  // Errors persist until dismissed (timeout: 0); callers may still override.
  return toast.add({
    timeout: 0,
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
    // Upstream Base UI spec: string arguments in promise states are shortcuts for description
    if (typeof val === 'string') {
      return { description: val };
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
  const actionOption = t.data?.action;
  const isAnchored = Boolean(t.positionerProps?.anchor);
  const fallbackAction =
    !t.actionProps && actionOption
      ? isActionConfig(actionOption)
        ? { children: actionOption.label, onClick: actionOption.onClick }
        : actionOption
      : undefined;

  // Exact Base UI Tailwind stacked deck tokens & calculations
  const bottomDeckClasses = cn(
    '[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.05)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]',
    'absolute end-0 bottom-0 start-auto z-[calc(1000-var(--toast-index))] me-0 w-full origin-bottom',
    '[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--toast-swipe-movement-y,0px)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
    'data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--offset-y)))]',
    'h-[var(--height)] data-[expanded]:h-[var(--toast-height)]',
    'after:absolute after:top-full after:start-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[\'\']',
    'data-[starting-style]:[transform:translateY(150%)]',
    '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]'
  );

  const topDeckClasses = cn(
    '[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.05)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]',
    'absolute end-0 top-0 start-auto z-[calc(1000-var(--toast-index))] me-0 w-full origin-top',
    '[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--toast-swipe-movement-y,0px)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]',
    'data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x,0px))_translateY(calc(var(--offset-y)))]',
    'h-[var(--height)] data-[expanded]:h-[var(--toast-height)]',
    'after:absolute after:bottom-full after:start-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[\'\']',
    'data-[starting-style]:[transform:translateY(-150%)]',
    '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]'
  );

  const commonDeckClasses = cn(
    "pointer-events-auto flex items-start gap-3 p-4 ps-5 rounded-s-none rounded-e bg-surface border-y border-e border-s-0 border-outline-variant shadow-ambient max-w-sm w-full select-none before:pointer-events-none before:content-[''] before:absolute before:-inset-y-px before:start-0 before:border-s-4 forced-colors:before:border-s-[Highlight]",
    accentBorder[toastType] || accentBorder.info,
    // Calibrated 250ms enter / 150ms exit asymmetry (DESIGN.md)
    '[transition:transform_var(--duration-fast)_var(--ease-standard),opacity_var(--duration-fast)_var(--ease-standard),height_var(--duration-quick),box-shadow_var(--duration-quick)]',
    'data-[ending-style]:[transition:transform_var(--duration-quick)_var(--ease-standard),opacity_var(--duration-quick)_var(--ease-standard),height_var(--duration-quick)]',
    'data-[starting-style]:opacity-0',
    'data-[ending-style]:opacity-0',
    'data-[limited]:opacity-0 data-[limited]:pointer-events-none',
    'data-[swiping]:transition-none',
    // Directional swipe dismissal states
    'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)+150%))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)+150%))]',
    'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)-150%))_translateY(var(--offset-y))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)-150%))_translateY(var(--offset-y))]',
    'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)+150%))_translateY(var(--offset-y))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x,0px)+150%))_translateY(var(--offset-y))]',
    'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)-150%))]',
    'data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y,0px)-150%))]',
    'motion-reduce:transition-none'
  );

  const { className: fallbackActionClassName, ...restFallbackAction } = fallbackAction ?? {};

  const toastCardContent = (
    <BaseToast.Root
      data-slot="toast"
      toast={t}
      swipeDirection={isTopPosition ? ['up', 'right', 'left'] : ['down', 'right', 'left']}
      className={
        isAnchored
          ? cn(
              "pointer-events-auto relative flex items-start gap-3 p-4 ps-5 rounded-s-none rounded-e bg-surface border-y border-e border-s-0 border-outline-variant shadow-ambient max-w-[min(24rem,var(--available-width))] w-full select-none before:pointer-events-none before:content-[''] before:absolute before:-inset-y-px before:start-0 before:border-s-4 forced-colors:before:border-s-[Highlight]",
              'transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] origin-[var(--transform-origin)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-small)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-small)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
              accentBorder[toastType] || accentBorder.info
            )
          : cn(commonDeckClasses, isTopPosition ? topDeckClasses : bottomDeckClasses)
      }
    >
      <BaseToast.Content
        data-slot="toast-content"
        className={cn(
          'flex items-start gap-3 w-full min-w-0',
          !isAnchored &&
            'transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[behind]:opacity-0 data-[expanded]:opacity-100 motion-reduce:transition-none'
        )}
      >

        {/* Semantic Icon with rotation animation on loading */}
        <Icon
          name={currentIcon.name}
          size="lg"
          className={cn(
            'shrink-0 mt-0.5 select-none',
            currentIcon.color,
            toastType === 'loading' && 'animate-spin motion-reduce:animate-none'
          )}
          aria-hidden="true"
        />

        {/* Toast Body */}
        <div className="flex-1 min-w-0 pe-1">
          {t.title && (
            <BaseToast.Title data-slot="toast-title" className="font-heading text-sm font-bold text-on-surface leading-snug">
              {t.title}
            </BaseToast.Title>
          )}
          {t.description && (
            <BaseToast.Description
              data-slot="toast-description"
              className={cn('font-sans text-sm text-on-surface-variant leading-normal break-words', t.title && 'mt-1')}
            >
              {t.description}
            </BaseToast.Description>
          )}
        </div>

        {/* Action button rendered via BaseToast.Action (reads toast.actionProps from context and returns null when empty) */}
        <BaseToast.Action
          data-slot="toast-action"
          {...restFallbackAction}
          className={composeClassName(
            'relative font-label text-xs font-semibold px-2.5 py-1.5 rounded text-primary hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors motion-reduce:transition-none cursor-pointer shrink-0 touch-target-expanded',
            fallbackActionClassName
          )}
        />

        {/* Dismiss Close button with WCAG 2.2 44x44px target */}
        <BaseToast.Close
          data-slot="toast-close"
          className="size-11 min-w-[44px] min-h-[44px] shrink-0 -me-2 -mt-2 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-state-hover active:bg-surface-container-high transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none"
          aria-label="Dismiss toast"
        >
          <Icon name="close" size="sm" aria-hidden="true" />
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  );

  // If anchored toast, wrap in BaseToast.Positioner and add BaseToast.Arrow
  if (t.positionerProps?.anchor) {
    const {
      className: positionerClassName,
      collisionPadding = 8,
      ...restPositionerProps
    } = t.positionerProps;
    return (
      <BaseToast.Positioner
        toast={t}
        collisionPadding={collisionPadding}
        {...restPositionerProps}
        className={composeClassName(
          'z-[60] pointer-events-auto max-w-[var(--available-width)]',
          positionerClassName
        )}
      >
        {toastCardContent}
        <BaseToast.Arrow className="data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-7.5px] data-[side=right]:left-[-7.5px] data-[side=inline-start]:end-[-7.5px] data-[side=inline-end]:start-[-7.5px] data-[side=top]:rotate-180 data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:-rotate-90 data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:rotate-90">
          <svg width="10" height="5" viewBox="0 0 10 5" className="block fill-surface stroke-outline-variant" aria-hidden="true">
            <path d="M0 5 L5 0 L10 5" />
          </svg>
        </BaseToast.Arrow>
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

export type ToastPositionerSide = BaseToast.Positioner.Props['side'];

export interface ToasterProps {
  position?: ToasterPosition;
  limit?: number; // default 5
  timeout?: number; // default 5000
  className?: BaseToast.Viewport.Props['className'];
}

const positionClasses: Record<ToasterPosition, string> = {
  'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
  'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6',
  'top-right': 'top-4 right-4 sm:top-6 sm:right-6',
  'top-left': 'top-4 left-4 sm:top-6 sm:left-6',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 sm:top-6',
};

const ToasterViewportContent: React.FC<{
  position: ToasterPosition;
  className?: BaseToast.Viewport.Props['className'];
}> = ({ position, className }) => {
  const { toasts } = BaseToast.useToastManager<ToastCustomData>();
  const viewportToasts = toasts.filter((t) => !t.positionerProps?.anchor);
  const anchoredToasts = toasts.filter((t) => Boolean(t.positionerProps?.anchor));

  return (
    <>
      <BaseToast.Portal>
        {/* High z-index z-[60] so toasts float above modal dialogs and sheets (z-50) */}
        <BaseToast.Viewport
          data-slot="toast-viewport"
          className={composeClassName(
            [
              'fixed z-[60] max-w-sm w-[calc(100vw-2rem)] sm:w-90 pointer-events-none p-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] focus:outline-none',
              positionClasses[position],
            ],
            className
          )}
        >
          {viewportToasts.map((t) => (
            <ActiveToastItem key={t.id} toast={t} position={position} />
          ))}
        </BaseToast.Viewport>
      </BaseToast.Portal>
      {anchoredToasts.length > 0 && (
        <BaseToast.Portal>
          {anchoredToasts.map((t) => (
            <ActiveToastItem key={t.id} toast={t} position={position} />
          ))}
        </BaseToast.Portal>
      )}
    </>
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

export const ToastRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Root>
>(({ className, toast, ...props }, ref) => (
  <BaseToast.Root
    ref={ref}
    data-slot="toast"
    toast={toast}
    className={composeClassName(
      [
        "relative flex items-start gap-3 p-4 ps-5 rounded-s-none rounded-e bg-surface border-y border-e border-s-0 border-outline-variant shadow-ambient max-w-sm w-full transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none before:pointer-events-none before:content-[''] before:absolute before:-inset-y-px before:start-0 before:border-s-4 forced-colors:before:border-s-[Highlight]",
        accentBorder[toast?.type || 'info'] || accentBorder.info,
      ],
      className
    )}
    {...props}
  />
));
ToastRoot.displayName = 'ToastRoot';

export const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Content>
>(({ className, ...props }, ref) => (
  <BaseToast.Content
    ref={ref}
    data-slot="toast-content"
    className={composeClassName('flex items-start gap-3 w-full min-w-0', className)}
    {...props}
  />
));
ToastContent.displayName = 'ToastContent';

export const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Title>
>(({ className, ...props }, ref) => (
  <BaseToast.Title
    ref={ref}
    data-slot="toast-title"
    className={composeClassName('font-heading text-sm font-bold text-on-surface leading-snug', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Description>
>(({ className, ...props }, ref) => (
  <BaseToast.Description
    ref={ref}
    data-slot="toast-description"
    className={composeClassName('font-sans text-sm text-on-surface-variant leading-normal break-words', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Close>
>(({ className, 'aria-label': ariaLabel = 'Dismiss toast', ...props }, ref) => (
  <BaseToast.Close
    ref={ref}
    data-slot="toast-close"
    aria-label={ariaLabel}
    className={composeClassName(
      'size-11 min-w-[44px] min-h-[44px] shrink-0 -me-2 -mt-2 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-state-hover active:bg-surface-container-high transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none',
      className
    )}
    {...props}
  />
));
ToastClose.displayName = 'ToastClose';

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Action>
>(({ className, ...props }, ref) => (
  <BaseToast.Action
    ref={ref}
    data-slot="toast-action"
    className={composeClassName(
      'relative font-label text-xs font-semibold px-2.5 py-1.5 rounded text-primary hover:bg-state-hover hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors motion-reduce:transition-none cursor-pointer shrink-0 touch-target-expanded',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

export const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Viewport>
>(({ className, ...props }, ref) => (
  <BaseToast.Viewport
    ref={ref}
    data-slot="toast-viewport"
    className={composeClassName(
      'fixed z-[60] max-w-sm w-[calc(100vw-2rem)] sm:w-90 pointer-events-none p-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] focus:outline-none',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

export const ToastArrow = BaseToast.Arrow;
export const ToastProvider = BaseToast.Provider;
export const ToastPortal = BaseToast.Portal;
export const ToastPositioner = BaseToast.Positioner;

// Compound export mapping styled Eolas Toast primitives
export const Toast = Object.assign(ToastComponent, {
  Provider: BaseToast.Provider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Description: ToastDescription,
  Title: ToastTitle,
  Close: ToastClose,
  Action: ToastAction,
  Portal: BaseToast.Portal,
  Positioner: BaseToast.Positioner,
  Arrow: BaseToast.Arrow,
  useToastManager: BaseToast.useToastManager,
  createToastManager: BaseToast.createToastManager,
});

// Re-export Base UI primitives for compound composition
export { BaseToast };
export const useToastManager = BaseToast.useToastManager;
export const createToastManager = BaseToast.createToastManager;
export type { ToastManagerPositionerProps };
