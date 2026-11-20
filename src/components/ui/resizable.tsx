'use client';

/**
 * Resizable component primitive built on react-resizable-panels.
 *
 * Base UI Documentation: https://base-ui.com/react/components/separator
 * React Resizable Panels Documentation: https://github.com/bvaughn/react-resizable-panels
 *
 * TAXONOMY & USAGE:
 * - Provides accessible, draggable multi-pane layouts (split views, sidebars, inspection panels).
 * - Supports keyboard navigation (Arrow keys, Home, End), touch targets, and min/max constraints.
 * - Follows DESIGN.md Tier B tokens: hairline 1px track (outline-variant), 12px touch-safe hit area,
 *   refined capsule pill drag handle (rounded-full, bg-surface, primary hover/active feedback),
 *   and floating 2px focus ring.
 */
import * as React from 'react';
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
  type PanelImperativeHandle,
  type GroupImperativeHandle,
} from 'react-resizable-panels';
import { cn } from '@/lib/utils';

export type { PanelImperativeHandle, GroupImperativeHandle };

export interface ResizablePanelGroupProps
  extends Omit<GroupProps, 'orientation'> {
  direction?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
}

export const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, direction = 'horizontal', orientation, ...props }, ref) => {
  const resolvedOrientation = orientation ?? direction;

  return (
    <Group
      elementRef={ref}
      orientation={resolvedOrientation}
      className={cn(
        '@container flex h-full w-full overflow-hidden rounded-lg border border-outline-variant bg-surface',
        resolvedOrientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      {...props}
    />
  );
});
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export interface ResizablePanelProps extends PanelProps {
  order?: number;
}

export const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(({ className, order: _order, ...props }, ref) => {
  return (
    <Panel
      elementRef={ref}
      className={cn('relative overflow-auto', className)}
      {...props}
    />
  );
});
ResizablePanel.displayName = 'ResizablePanel';

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

export const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(({ className, withHandle = false, children, ...props }, ref) => {
  return (
    <Separator
      elementRef={ref}
      className={cn(
        'group relative flex items-center justify-center bg-outline-variant select-none touch-none',
        'transition-colors duration-quick ease-standard motion-reduce:transition-none',
        // Hover & Active States on track
        'hover:bg-primary focus-visible:bg-primary data-[separator=hover]:bg-primary data-[separator=active]:bg-primary',
        // Accessible Floating Focus Ring per DESIGN.md
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 focus-visible:z-20',
        // Vertical Separator (Horizontal Layout: panels placed side-by-side)
        'h-full w-px cursor-col-resize [&[aria-orientation=vertical]]:w-px [&[aria-orientation=vertical]]:cursor-col-resize',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 after:content-[\'\']',
        // Horizontal Separator (Vertical Layout: panels stacked vertically)
        '[&[aria-orientation=horizontal]]:h-px [&[aria-orientation=horizontal]]:w-full [&[aria-orientation=horizontal]]:cursor-row-resize',
        '[&[aria-orientation=horizontal]]:after:inset-x-0 [&[aria-orientation=horizontal]]:after:inset-y-auto [&[aria-orientation=horizontal]]:after:left-0 [&[aria-orientation=horizontal]]:after:top-1/2 [&[aria-orientation=horizontal]]:after:h-3 [&[aria-orientation=horizontal]]:after:w-full [&[aria-orientation=horizontal]]:after:translate-x-0 [&[aria-orientation=horizontal]]:after:-translate-y-1/2',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle"
          className={cn(
            'z-10 flex items-center justify-center rounded-full border bg-surface text-on-surface-variant pointer-events-none select-none',
            'border-outline-variant shadow-xs',
            'transition-[color,background-color,border-color,box-shadow,transform] duration-quick ease-standard motion-reduce:transition-none',
            // Dimensions: Capsule pill (28x14px) adapting to orientation
            'h-7 w-3.5',
            'group-[[aria-orientation=horizontal]]:h-3.5 group-[[aria-orientation=horizontal]]:w-7',
            // Interactive hover & focus feedback driven by separator
            'group-hover:border-primary group-hover:text-primary',
            'group-focus-visible:border-primary group-focus-visible:text-primary',
            // Active dragging feedback
            'group-data-[separator=active]:border-primary group-data-[separator=active]:bg-primary-container group-data-[separator=active]:text-on-primary-container group-data-[separator=active]:shadow-sm'
          )}
        >
          {children ?? (
            <svg
              aria-hidden="true"
              className={cn(
                'size-2.5 shrink-0 text-current transition-transform duration-quick ease-standard motion-reduce:transition-none',
                'group-[[aria-orientation=horizontal]]:rotate-90'
              )}
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <circle cx="3" cy="2" r="1" />
              <circle cx="7" cy="2" r="1" />
              <circle cx="3" cy="5" r="1" />
              <circle cx="7" cy="5" r="1" />
              <circle cx="3" cy="8" r="1" />
              <circle cx="7" cy="8" r="1" />
            </svg>
          )}
        </div>
      )}
      {!withHandle && children}
    </Separator>
  );
});
ResizableHandle.displayName = 'ResizableHandle';

// Compound export mapping Base UI / shadcn style conventions
export const Resizable = Object.assign(ResizablePanelGroup, {
  Group: ResizablePanelGroup,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

