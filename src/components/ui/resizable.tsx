import * as React from 'react';
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from 'react-resizable-panels';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

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
>(({ className, ...props }, ref) => {
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
>(({ className, withHandle = false, ...props }, ref) => {
  return (
    <Separator
      elementRef={ref}
      className={cn(
        'relative flex items-center justify-center bg-outline-variant transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 select-none touch-none',
        'data-[orientation=horizontal]:w-1.5 data-[orientation=horizontal]:cursor-col-resize hover:data-[orientation=horizontal]:w-2',
        'data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:cursor-row-resize hover:data-[orientation=vertical]:h-2',
        // Fallback sizing when orientation attribute might be evaluating or native separator
        'w-1.5 data-[orientation=vertical]:w-full h-full data-[orientation=vertical]:h-1.5',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex size-5 items-center justify-center rounded-sm border border-outline-variant bg-surface text-on-surface-variant shadow-ambient">
          <Icon
            name="drag_indicator"
            size="sm"
            className="text-xs data-[orientation=vertical]:hidden"
          />
        </div>
      )}
    </Separator>
  );
});
ResizableHandle.displayName = 'ResizableHandle';
