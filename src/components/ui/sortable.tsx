import * as React from 'react';
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
  useDragDropMonitor,
  useDragOperation,
} from '@dnd-kit/react';
import {
  isSortable,
  isSortableOperation,
  useSortable,
  type UseSortableInput,
} from '@dnd-kit/react/sortable';
import { arrayMove, arraySwap, move } from '@dnd-kit/helpers';
import { cn, useRender } from '@/lib/utils';

/**
 * Accessible drag-and-drop sortable list, grid, and multi-container primitive built on `@dnd-kit/react` and DESIGN.md tokens.
 *
 * TAXONOMY / USAGE:
 * - Reorderable task queues, care plans, priority lists, and multi-column boards.
 * - Supports pointer, touch, and keyboard reordering (`Space`/`Enter` + Arrow keys) out of the box.
 * - Pair `<Sortable.Handle />` with visible move up/down `<Button />` controls for complex lists (WCAG 2.2 AA).
 */

export type SortableOrientation = 'vertical' | 'horizontal' | 'grid';

interface SortableContextValue {
  orientation: SortableOrientation;
  hasOverlay: boolean;
  registerOverlay: () => () => void;
}

const SortableContext = React.createContext<SortableContextValue>({
  orientation: 'vertical',
  hasOverlay: false,
  registerOverlay: () => () => {},
});

interface SortableItemContextValue {
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
  isDragSource: boolean;
  isDropTarget: boolean;
  disabled: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null);

export function useSortableItemContext() {
  const ctx = React.useContext(SortableItemContext);
  if (!ctx) {
    throw new Error('Sortable.Handle must be used within a Sortable.Item.');
  }
  return ctx;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | ((node: T | null) => void) | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };
}

export type SortableRootProps = React.ComponentProps<typeof DragDropProvider> & {
  /** Layout direction for nested Sortable.List containers. */
  orientation?: SortableOrientation;
};

export function SortableRoot({
  orientation = 'vertical',
  children,
  ...props
}: SortableRootProps) {
  const [overlayCount, setOverlayCount] = React.useState(0);
  const registerOverlay = React.useCallback(() => {
    setOverlayCount((count) => count + 1);
    return () => setOverlayCount((count) => Math.max(0, count - 1));
  }, []);

  const value = React.useMemo(
    () => ({ orientation, hasOverlay: overlayCount > 0, registerOverlay }),
    [orientation, overlayCount, registerOverlay]
  );
  return (
    <SortableContext.Provider value={value}>
      <DragDropProvider {...props}>{children}</DragDropProvider>
    </SortableContext.Provider>
  );
}
SortableRoot.displayName = 'Sortable.Root';

export interface SortableListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the default orientation inherited from Sortable.Root. */
  orientation?: SortableOrientation;
  /** Optional Base UI-style render prop for semantic elements (e.g., `<ul />`). */
  render?: useRender.RenderProp;
}

export const SortableList = React.forwardRef<HTMLDivElement, SortableListProps>(
  ({ className, orientation: orientationProp, render, role = 'list', ...props }, ref) => {
    const ctx = React.useContext(SortableContext);
    const orientation = orientationProp ?? ctx.orientation;

    const layoutClasses =
      orientation === 'horizontal'
        ? 'flex flex-row flex-wrap gap-2'
        : orientation === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
          : 'flex flex-col gap-2';

    return useRender({
      defaultTagName: 'div',
      render,
      ref,
      props: {
        'data-slot': 'sortable-list',
        'data-orientation': orientation,
        role,
        className: cn(layoutClasses, className),
        ...props,
      },
    });
  }
);
SortableList.displayName = 'Sortable.List';

export interface SortableItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>,
    Omit<UseSortableInput, 'handle' | 'element' | 'target'> {
  /** Optional Base UI-style render prop (e.g., `<li />`). */
  render?: useRender.RenderProp;
}

export const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  (
    {
      id,
      index,
      group,
      type,
      accept,
      disabled = false,
      data,
      transition,
      collisionDetector,
      collisionPriority,
      modifiers,
      sensors,
      plugins,
      className,
      render,
      role = 'listitem',
      children,
      ...props
    },
    forwardedRef
  ) => {
    const { hasOverlay } = React.useContext(SortableContext);
    const { ref, handleRef, isDragging, isDragSource, isDropTarget } = useSortable({
      id,
      index,
      group,
      type,
      accept,
      disabled,
      data,
      transition,
      collisionDetector,
      collisionPriority,
      modifiers,
      sensors,
      plugins,
    });

    const itemContext = React.useMemo<SortableItemContextValue>(
      () => ({
        handleRef,
        isDragging,
        isDragSource,
        isDropTarget,
        disabled: Boolean(disabled),
      }),
      [handleRef, isDragging, isDragSource, isDropTarget, disabled]
    );

    const element = useRender({
      defaultTagName: 'div',
      render,
      ref: mergeRefs(ref, forwardedRef),
      props: {
        'data-slot': 'sortable-item',
        'data-dragging': isDragging ? '' : undefined,
        'data-drag-source': isDragSource ? '' : undefined,
        'data-drop-target': isDropTarget ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        role,
        className: cn(
          'relative flex items-center gap-3 rounded-md border border-outline-variant bg-surface p-3 text-on-surface',
          'transition-[border-color,background-color,box-shadow,opacity] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          isDragging && hasOverlay && 'transition-none border-dashed border-outline-variant bg-surface-container-low [&>*]:opacity-0',
          isDragging && !hasOverlay && 'z-10 border-2 border-primary bg-surface shadow-modal',
          disabled && 'cursor-not-allowed opacity-50',
          className
        ),
        children,
        ...props,
      },
    });

    return <SortableItemContext.Provider value={itemContext}>{element}</SortableItemContext.Provider>;
  }
);
SortableItem.displayName = 'Sortable.Item';

export interface SortableHandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for screen readers. Defaults to "Reorder item". */
  label?: string;
  /** Optional Base UI-style render prop. */
  render?: useRender.RenderProp;
}

export const SortableHandle = React.forwardRef<HTMLButtonElement, SortableHandleProps>(
  (
    { className, label = 'Reorder item', disabled: disabledProp, render, children, ...props },
    forwardedRef
  ) => {
    const { handleRef, disabled: itemDisabled } = useSortableItemContext();
    const disabled = Boolean(disabledProp ?? itemDisabled);

    return useRender({
      defaultTagName: 'button',
      render,
      ref: mergeRefs(handleRef, forwardedRef),
      props: {
        type: 'button',
        disabled,
        'aria-label': label,
        'data-slot': 'sortable-handle',
        className: cn(
          'inline-flex size-11 shrink-0 items-center justify-center rounded text-on-surface-variant',
          'cursor-grab active:cursor-grabbing touch-none select-none',
          'hover:bg-state-hover hover:text-on-surface',
          'transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        ),
        children: children ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 shrink-0"
          >
            <circle cx="5.5" cy="3.5" r="1.25" />
            <circle cx="10.5" cy="3.5" r="1.25" />
            <circle cx="5.5" cy="8" r="1.25" />
            <circle cx="10.5" cy="8" r="1.25" />
            <circle cx="5.5" cy="12.5" r="1.25" />
            <circle cx="10.5" cy="12.5" r="1.25" />
          </svg>
        ),
        ...props,
      },
    });
  }
);
SortableHandle.displayName = 'Sortable.Handle';

export type SortableOverlayProps = React.ComponentProps<typeof DragOverlay>;

export function SortableOverlay({ className, dropAnimation, ...props }: SortableOverlayProps) {
  const { registerOverlay } = React.useContext(SortableContext);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    return registerOverlay();
  }, [registerOverlay]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <DragOverlay
      className={cn('rounded-md shadow-modal cursor-grabbing', className)}
      dropAnimation={dropAnimation !== undefined ? dropAnimation : prefersReducedMotion ? null : undefined}
      {...props}
    />
  );
}
SortableOverlay.displayName = 'Sortable.Overlay';

export const Sortable = {
  Root: SortableRoot,
  List: SortableList,
  Item: SortableItem,
  Handle: SortableHandle,
  Overlay: SortableOverlay,
};

export {
  arrayMove,
  arraySwap,
  isSortable,
  isSortableOperation,
  move,
  useDraggable,
  useDroppable,
  useDragDropMonitor,
  useDragOperation,
  useSortable,
};
