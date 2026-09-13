import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  className?: string;
}

const ScrollAreaComponent: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight = '240px',
  orientation = 'vertical',
  className,
}) => {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <BaseScrollArea.Root className={cn('relative overflow-hidden rounded-[0.75rem] border border-outline-variant bg-surface w-full', className)}>
      <BaseScrollArea.Viewport style={{ maxHeight }} className="w-full h-full p-4 overflow-auto scrollbar-thin">
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {showVertical && (
        <BaseScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-surface-container transition-colors w-2.5">
          <BaseScrollArea.Thumb className="flex-1 bg-outline rounded-full relative hover:bg-on-surface-variant/60" />
        </BaseScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <BaseScrollArea.Scrollbar orientation="horizontal" className="flex select-none touch-none p-0.5 bg-surface-container transition-colors h-2.5">
          <BaseScrollArea.Thumb className="flex-1 bg-outline rounded-full relative hover:bg-on-surface-variant/60" />
        </BaseScrollArea.Scrollbar>
      )}
      {orientation === 'both' && <BaseScrollArea.Corner className="bg-surface-container" />}
    </BaseScrollArea.Root>
  );
};

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

