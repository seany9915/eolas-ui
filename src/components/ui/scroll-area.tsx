import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string | number;
  orientation?: 'vertical' | 'horizontal' | 'both';
  variant?: 'default' | 'framed';
  fade?: boolean;
  viewportClassName?: string;
  contentClassName?: string;
}

const ScrollAreaComponent = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({
  children,
  maxHeight,
  orientation = 'vertical',
  variant = 'default',
  fade = false,
  className,
  viewportClassName,
  contentClassName,
  style,
  ...props
}, ref) => {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <BaseScrollArea.Root
      ref={ref}
      className={cn(
        'relative overflow-hidden w-full',
        variant === 'framed' && 'rounded-md border border-outline-variant bg-surface',
        className
      )}
      style={style}
      {...props}
    >
      <BaseScrollArea.Viewport
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        className={cn(
          'w-full h-full focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
          fade && 'mask-linear-[to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,24px))),transparent_100%] mask-no-repeat',
          viewportClassName
        )}
      >
        <BaseScrollArea.Content className={contentClassName}>
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>

      {showVertical && (
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 w-2.5 bg-transparent hover:bg-on-surface/5 transition-opacity duration-150 opacity-0 pointer-events-none data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto"
        >
          <BaseScrollArea.Thumb className="w-full bg-outline/60 hover:bg-outline rounded-full transition-colors" />
        </BaseScrollArea.Scrollbar>
      )}

      {showHorizontal && (
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          className="flex select-none touch-none p-0.5 h-2.5 bg-transparent hover:bg-on-surface/5 transition-opacity duration-150 opacity-0 pointer-events-none data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto"
        >
          <BaseScrollArea.Thumb className="h-full bg-outline/60 hover:bg-outline rounded-full transition-colors" />
        </BaseScrollArea.Scrollbar>
      )}

      {orientation === 'both' && (
        <BaseScrollArea.Corner className="bg-transparent" />
      )}
    </BaseScrollArea.Root>
  );
});

ScrollAreaComponent.displayName = 'ScrollArea';

// Compound export mapping Base UI primitives
export const ScrollArea = Object.assign(ScrollAreaComponent, {
  Root: BaseScrollArea.Root,
  Viewport: BaseScrollArea.Viewport,
  Content: BaseScrollArea.Content,
  Scrollbar: BaseScrollArea.Scrollbar,
  Thumb: BaseScrollArea.Thumb,
  Corner: BaseScrollArea.Corner,
});

// Re-export Base UI primitives for compound composition
export { BaseScrollArea };
export const ScrollAreaRoot = BaseScrollArea.Root;
export const ScrollAreaViewport = BaseScrollArea.Viewport;
export const ScrollAreaContent = BaseScrollArea.Content;
export const ScrollAreaScrollbar = BaseScrollArea.Scrollbar;
export const ScrollAreaThumb = BaseScrollArea.Thumb;
export const ScrollAreaCorner = BaseScrollArea.Corner;

export default ScrollArea;
