import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

interface ResizableContextType {
  direction: 'horizontal' | 'vertical';
  panelSizes: number[];
  setPanelSizes: React.Dispatch<React.SetStateAction<number[]>>;
  registerPanel: (index: number, defaultSize: number) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResizableContext = React.createContext<ResizableContextType | null>(null);

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ className, direction = 'horizontal', children, ...props }, ref) => {
    const [panelSizes, setPanelSizes] = React.useState<number[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);

    const registerPanel = React.useCallback((index: number, defaultSize: number) => {
      setPanelSizes((prev) => {
        if (prev[index] !== undefined) return prev;
        const next = [...prev];
        next[index] = defaultSize;
        return next;
      });
    }, []);

    return (
      <ResizableContext.Provider
        value={{
          direction,
          panelSizes,
          setPanelSizes,
          registerPanel,
          isDragging,
          setIsDragging,
        }}
      >
        <div
          ref={ref}
          className={cn(
            '@container flex h-full w-full overflow-hidden rounded-lg border border-outline-variant bg-surface',
            direction === 'horizontal' ? 'flex-row' : 'flex-col',
            isDragging && 'select-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  order?: number;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, defaultSize = 50, minSize = 15, maxSize = 85, order = 0, style, children, ...props }, ref) => {
    const ctx = React.useContext(ResizableContext);

    React.useEffect(() => {
      ctx?.registerPanel(order, defaultSize);
    }, [ctx, order, defaultSize]);

    const currentSize = ctx?.panelSizes[order] ?? defaultSize;

    return (
      <div
        ref={ref}
        style={{
          flex: `${currentSize} 1 0%`,
          minWidth: ctx?.direction === 'horizontal' ? `${minSize}%` : undefined,
          maxWidth: ctx?.direction === 'horizontal' ? `${maxSize}%` : undefined,
          minHeight: ctx?.direction === 'vertical' ? `${minSize}%` : undefined,
          maxHeight: ctx?.direction === 'vertical' ? `${maxSize}%` : undefined,
          ...style,
        }}
        className={cn('relative overflow-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResizablePanel.displayName = 'ResizablePanel';

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
}

export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle = false, ...props }, ref) => {
    const ctx = React.useContext(ResizableContext);
    const isHorizontal = ctx?.direction === 'horizontal';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!ctx || ctx.panelSizes.length < 2) return;
      const step = 5;

      if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
        e.preventDefault();
        ctx.setPanelSizes(([left = 50, right = 50]) => {
          const newLeft = Math.max(15, left - step);
          return [newLeft, 100 - newLeft];
        });
      } else if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
        e.preventDefault();
        ctx.setPanelSizes(([left = 50, right = 50]) => {
          const newLeft = Math.min(85, left + step);
          return [newLeft, 100 - newLeft];
        });
      } else if (e.key === 'Home') {
        e.preventDefault();
        ctx.setPanelSizes([15, 85]);
      } else if (e.key === 'End') {
        e.preventDefault();
        ctx.setPanelSizes([85, 15]);
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!ctx) return;
      ctx.setIsDragging(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const initialSizes = [...ctx.panelSizes];

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = isHorizontal ? moveEvent.clientX - startX : moveEvent.clientY - startY;
        const container = (e.target as HTMLElement).closest('.flex');
        if (!container) return;

        const totalPx = isHorizontal ? container.clientWidth : container.clientHeight;
        const deltaPercent = (delta / totalPx) * 100;

        ctx.setPanelSizes(([left = 50]) => {
          const initialLeft = initialSizes[0] ?? 50;
          const newLeft = Math.min(85, Math.max(15, initialLeft + deltaPercent));
          return [newLeft, 100 - newLeft];
        });
      };

      const onMouseUp = () => {
        ctx.setIsDragging(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (!ctx || e.touches.length === 0) return;
      ctx.setIsDragging(true);

      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      const initialSizes = [...ctx.panelSizes];

      const onTouchMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length === 0) return;
        const moveTouch = moveEvent.touches[0];
        const delta = isHorizontal ? moveTouch.clientX - startX : moveTouch.clientY - startY;
        const container = (e.target as HTMLElement).closest('.flex');
        if (!container) return;

        const totalPx = isHorizontal ? container.clientWidth : container.clientHeight;
        const deltaPercent = (delta / totalPx) * 100;

        ctx.setPanelSizes(([left = 50]) => {
          const initialLeft = initialSizes[0] ?? 50;
          const newLeft = Math.min(85, Math.max(15, initialLeft + deltaPercent));
          return [newLeft, 100 - newLeft];
        });
      };

      const onTouchEnd = () => {
        ctx.setIsDragging(false);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };

      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);
    };

    return (
      <div
        ref={ref}
        role="separator"
        tabIndex={0}
        aria-orientation={ctx?.direction || 'horizontal'}
        aria-valuenow={Math.round(ctx?.panelSizes[0] ?? 50)}
        aria-valuemin={15}
        aria-valuemax={85}
        aria-label="Resize panel divider"
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          'relative flex items-center justify-center bg-outline-variant transition-colors hover:bg-primary/70 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 select-none touch-none',
          isHorizontal ? 'w-1.5 cursor-col-resize hover:w-2' : 'h-1.5 cursor-row-resize hover:h-2',
          className
        )}
        {...props}
      >
        {withHandle && (
          <div className="z-10 flex size-5 items-center justify-center rounded-sm border border-outline-variant bg-surface text-on-surface-variant shadow-sm">
            <Icon
              name={isHorizontal ? 'drag_indicator' : 'drag_handle'}
              size="sm"
              className="text-xs"
            />
          </div>
        )}
      </div>
    );
  }
);
ResizableHandle.displayName = 'ResizableHandle';
