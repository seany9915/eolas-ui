'use client';

/**
 * ScrollArea primitive (@base-ui/react/scroll-area).
 *
 * Base UI Documentation: https://base-ui.com/react/components/scroll-area
 *
 * TAXONOMY & USAGE:
 * - Augments native browser scrolling with custom-styled, accessible scrollbars.
 * - Supports vertical, horizontal, or dual-axis scrolling with overflow fade masks.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and motion restraint.
 */
import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn, composeClassName } from '@/lib/utils';

export interface ScrollAreaProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>, 'children'> {
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

  const fadeMaskClass = !fade
    ? undefined
    : orientation === 'horizontal'
      ? '[mask-image:linear-gradient(to_right,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] rtl:[mask-image:linear-gradient(to_left,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] mask-no-repeat'
      : orientation === 'both'
        ? '[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%),linear-gradient(to_right,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] rtl:[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%),linear-gradient(to_left,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] mask-no-repeat'
        : '[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%)] mask-no-repeat';

  return (
    <BaseScrollArea.Root
      ref={ref}
      data-slot="scroll-area"
      className={composeClassName(
        cn(
          'relative overflow-hidden w-full',
          variant === 'framed' && 'rounded-lg border border-outline-variant bg-surface'
        ),
        className
      )}
      style={style}
      {...props}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        className={cn(
          'size-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          fadeMaskClass,
          viewportClassName
        )}
      >
        <BaseScrollArea.Content className={contentClassName}>
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>

      {showVertical && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="vertical"
          className="flex select-none touch-none p-0.5 w-2.5 bg-transparent hover:bg-on-surface/5 transition-opacity duration-[var(--duration-fast)] opacity-0 pointer-events-none data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto"
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className="w-full bg-outline/60 hover:bg-outline contrast-more:bg-on-surface contrast-more:opacity-100 contrast-more:border contrast-more:border-outline rounded-full transition-colors" />
        </BaseScrollArea.Scrollbar>
      )}

      {showHorizontal && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="horizontal"
          className="flex select-none touch-none p-0.5 h-2.5 bg-transparent hover:bg-on-surface/5 transition-opacity duration-[var(--duration-fast)] opacity-0 pointer-events-none data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto"
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className="h-full bg-outline/60 hover:bg-outline contrast-more:bg-on-surface contrast-more:opacity-100 contrast-more:border contrast-more:border-outline rounded-full transition-colors" />
        </BaseScrollArea.Scrollbar>
      )}

      {orientation === 'both' && (
        <BaseScrollArea.Corner className="bg-transparent" />
      )}
    </BaseScrollArea.Root>
  );
});

ScrollAreaComponent.displayName = 'ScrollArea';

export const ScrollAreaRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>
>((props, ref) => <BaseScrollArea.Root ref={ref} data-slot="scroll-area" {...props} />);
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

export const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>
>((props, ref) => <BaseScrollArea.Viewport ref={ref} data-slot="scroll-area-viewport" {...props} />);
ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export const ScrollAreaScrollbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar>
>((props, ref) => <BaseScrollArea.Scrollbar ref={ref} data-slot="scroll-area-scrollbar" {...props} />);
ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export const ScrollAreaThumb = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Thumb>
>((props, ref) => <BaseScrollArea.Thumb ref={ref} data-slot="scroll-area-thumb" {...props} />);
ScrollAreaThumb.displayName = 'ScrollAreaThumb';

// Compound export mapping Base UI primitives
export const ScrollArea = Object.assign(ScrollAreaComponent, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: BaseScrollArea.Content,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: BaseScrollArea.Corner,
});

// Re-export Base UI primitives for compound composition
export { BaseScrollArea };
export const ScrollAreaContent = BaseScrollArea.Content;
export const ScrollAreaCorner = BaseScrollArea.Corner;

export default ScrollArea;
