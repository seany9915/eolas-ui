'use client';

/**
 * ScrollArea primitive (@base-ui/react/scroll-area).
 *
 * Base UI Documentation: https://base-ui.com/react/components/scroll-area
 *
 * TAXONOMY & USAGE:
 * - Augments native browser scrolling with custom-styled, accessible scrollbars.
 * - Supports vertical, horizontal, or dual-axis scrolling with optional overflow fade masks.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring
 *   (scoped to direct-child viewport so nested ScrollAreas never double-highlight), slim 6px
 *   passive overlay thumb that expands to 8px with >=3:1 contrast on track hover/active drag,
 *   high-contrast / forced-colors overrides, inverted surface support, and calibrated motion restraint.
 * - Place internal padding on `contentClassName` (or `viewportClassName`), not on `Root`,
 *   so scrolling content reaches the container edges cleanly without detaching the scrollbar.
 * - When using `scrollbarVisibility="always"`, add matching end-padding (e.g. `pe-3`) on
 *   `contentClassName` because overlay scrollbars do not reserve layout gutter space.
 */
import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn, composeClassName } from '@/lib/utils';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaScrollbarVisibility = 'auto' | 'always';

function getFadeMaskClass(orientation: ScrollAreaOrientation): string {
  if (orientation === 'horizontal') {
    return '[mask-image:linear-gradient(to_right,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] rtl:[mask-image:linear-gradient(to_left,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] mask-no-repeat';
  }
  if (orientation === 'both') {
    return '[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%),linear-gradient(to_right,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] rtl:[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%),linear-gradient(to_left,transparent_0,black_min(24px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-x-end,0px))),transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] mask-no-repeat';
  }
  return '[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(24px,var(--scroll-area-overflow-y-end,0px))),transparent_100%)] mask-no-repeat';
}

const ROOT_BASE_CLASSES =
  'relative flex flex-col overflow-hidden w-full has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-2 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-offset-2 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-primary';

const VIEWPORT_BASE_CLASSES =
  'isolate min-h-0 flex-auto size-full rounded-[inherit] outline-none';

const SCROLLBAR_BASE_CLASSES =
  'group/scrollbar flex select-none touch-none bg-transparent hover:bg-on-surface/5 active:bg-on-surface/8 inverted:hover:bg-on-primary/10 inverted:active:bg-on-primary/15 transition-[opacity,padding,background-color] duration-quick ease-[var(--ease-standard)] motion-reduce:transition-none';

const SCROLLBAR_VERTICAL_CLASSES = 'w-3.5 py-0.5 ps-1.5 pe-0.5 hover:ps-1 active:ps-1';
const SCROLLBAR_HORIZONTAL_CLASSES = 'h-3.5 px-0.5 pt-1.5 pb-0.5 hover:pt-1 active:pt-1';

const SCROLLBAR_AUTO_CLASSES =
  'opacity-0 pointer-events-none data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto';

const SCROLLBAR_ALWAYS_CLASSES = 'opacity-100 pointer-events-auto';

const THUMB_BASE_CLASSES =
  'data-[orientation=vertical]:w-full data-[orientation=horizontal]:h-full rounded-full bg-outline/45 group-hover/scrollbar:bg-outline group-active/scrollbar:bg-on-surface-variant inverted:bg-on-primary/35 inverted:group-hover/scrollbar:bg-on-primary/75 inverted:group-active/scrollbar:bg-on-primary contrast-more:bg-on-surface contrast-more:opacity-100 contrast-more:border contrast-more:border-outline forced-colors:bg-[ButtonText] transition-[background-color] duration-quick ease-[var(--ease-standard)] motion-reduce:transition-none';

export interface ScrollAreaProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>, 'children'> {
  children?: React.ReactNode;
  maxHeight?: string | number;
  orientation?: ScrollAreaOrientation;
  variant?: 'default' | 'framed';
  fade?: boolean;
  /**
   * Controls scrollbar visibility:
   * - `'auto'` (default): fades in on pointer hover or active scrolling.
   * - `'always'`: stays visible whenever content overflows. Add matching end-padding
   *   (e.g. `pe-3`) on `contentClassName` so the overlay thumb does not cover trailing controls.
   */
  scrollbarVisibility?: ScrollAreaScrollbarVisibility;
  /** Keeps scrollbar tracks mounted in the DOM even when the viewport does not overflow. */
  scrollbarKeepMounted?: boolean;
  viewportClassName?: React.ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>['className'];
  contentClassName?: React.ComponentPropsWithoutRef<typeof BaseScrollArea.Content>['className'];
  /** Optional ref forwarded directly to the scrollable Viewport element. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /** Additional props forwarded to the scrollable Viewport element (e.g. `onScroll`, `aria-label`, `role`, `data-*`). */
  viewportProps?: Omit<
    React.ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>,
    'className' | 'children'
  > & { [key: `data-${string}`]: string | number | boolean | undefined };
  /** Additional props forwarded to the inner Content wrapper element. */
  contentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof BaseScrollArea.Content>,
    'className' | 'children'
  > & { [key: `data-${string}`]: string | number | boolean | undefined };
}

const ScrollAreaComponent = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({
  children,
  maxHeight,
  orientation = 'vertical',
  variant = 'default',
  fade = false,
  scrollbarVisibility = 'auto',
  scrollbarKeepMounted,
  className,
  viewportClassName,
  contentClassName,
  viewportRef,
  viewportProps,
  contentProps,
  style,
  ...props
}, ref) => {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  const fadeMaskClass = fade ? getFadeMaskClass(orientation) : undefined;
  const scrollbarVisibilityClass =
    scrollbarVisibility === 'always' ? SCROLLBAR_ALWAYS_CLASSES : SCROLLBAR_AUTO_CLASSES;

  const resolvedRootStyle: React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>['style'] =
    maxHeight !== undefined
      ? typeof style === 'function'
        ? (state) => ({ maxHeight, ...style(state) })
        : { maxHeight, ...style }
      : style;

  const contentPropStyle = contentProps?.style;
  const resolvedContentStyle: React.ComponentPropsWithoutRef<typeof BaseScrollArea.Content>['style'] =
    orientation === 'vertical'
      ? typeof contentPropStyle === 'function'
        ? (state) => ({ minWidth: '100%', ...contentPropStyle(state) })
        : { minWidth: '100%', ...contentPropStyle }
      : contentPropStyle;

  const viewportPropStyle = viewportProps?.style;
  const viewportAxisOverflow: React.CSSProperties | undefined =
    orientation === 'vertical'
      ? { overflowX: 'hidden', overflowY: 'scroll' }
      : orientation === 'horizontal'
        ? { overflowX: 'scroll', overflowY: 'hidden' }
        : undefined;
  const resolvedViewportStyle: React.ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>['style'] =
    viewportAxisOverflow
      ? typeof viewportPropStyle === 'function'
        ? (state) => ({ ...viewportAxisOverflow, ...viewportPropStyle(state) })
        : { ...viewportAxisOverflow, ...viewportPropStyle }
      : viewportPropStyle;

  return (
    <BaseScrollArea.Root
      ref={ref}
      data-slot="scroll-area"
      className={composeClassName(
        cn(
          ROOT_BASE_CLASSES,
          variant === 'framed' &&
            'rounded-lg border border-outline-variant bg-surface inverted:bg-transparent inverted:border-on-primary/25'
        ),
        className
      )}
      style={resolvedRootStyle}
      {...props}
    >
      <BaseScrollArea.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        {...viewportProps}
        style={resolvedViewportStyle}
        className={composeClassName(
          cn(
            VIEWPORT_BASE_CLASSES,
            maxHeight !== undefined && 'max-h-[inherit]',
            fadeMaskClass
          ),
          viewportClassName
        )}
      >
        <BaseScrollArea.Content
          data-slot="scroll-area-content"
          {...contentProps}
          style={resolvedContentStyle}
          className={composeClassName(
            orientation === 'vertical' ? 'w-full min-w-0' : undefined,
            contentClassName
          )}
        >
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>

      {showVertical && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="vertical"
          keepMounted={scrollbarKeepMounted}
          className={cn(SCROLLBAR_BASE_CLASSES, SCROLLBAR_VERTICAL_CLASSES, scrollbarVisibilityClass)}
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className={THUMB_BASE_CLASSES} />
        </BaseScrollArea.Scrollbar>
      )}

      {showHorizontal && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="horizontal"
          keepMounted={scrollbarKeepMounted}
          className={cn(SCROLLBAR_BASE_CLASSES, SCROLLBAR_HORIZONTAL_CLASSES, scrollbarVisibilityClass)}
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className={THUMB_BASE_CLASSES} />
        </BaseScrollArea.Scrollbar>
      )}

      {orientation === 'both' && (
        <BaseScrollArea.Corner data-slot="scroll-area-corner" className="bg-transparent" />
      )}
    </BaseScrollArea.Root>
  );
});

ScrollAreaComponent.displayName = 'ScrollArea';

export const ScrollAreaRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Root
    ref={ref}
    data-slot="scroll-area"
    className={composeClassName(ROOT_BASE_CLASSES, className)}
    {...props}
  />
));
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

export interface ScrollAreaViewportProps
  extends React.ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport> {
  fade?: boolean;
  fadeOrientation?: ScrollAreaOrientation;
}

export const ScrollAreaViewport = React.forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  ({ className, fade = false, fadeOrientation = 'vertical', ...props }, ref) => (
    <BaseScrollArea.Viewport
      ref={ref}
      data-slot="scroll-area-viewport"
      className={composeClassName(
        cn(VIEWPORT_BASE_CLASSES, fade && getFadeMaskClass(fadeOrientation)),
        className
      )}
      {...props}
    />
  )
);
ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export interface ScrollAreaScrollbarProps
  extends React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar> {
  visibility?: ScrollAreaScrollbarVisibility;
}

export const ScrollAreaScrollbar = React.forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  ({ className, orientation = 'vertical', visibility = 'auto', ...props }, ref) => (
    <BaseScrollArea.Scrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={composeClassName(
        cn(
          SCROLLBAR_BASE_CLASSES,
          orientation === 'horizontal' ? SCROLLBAR_HORIZONTAL_CLASSES : SCROLLBAR_VERTICAL_CLASSES,
          visibility === 'always' ? SCROLLBAR_ALWAYS_CLASSES : SCROLLBAR_AUTO_CLASSES
        ),
        className
      )}
      {...props}
    />
  )
);
ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export const ScrollAreaThumb = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Thumb>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Thumb
    ref={ref}
    data-slot="scroll-area-thumb"
    className={composeClassName(THUMB_BASE_CLASSES, className)}
    {...props}
  />
));
ScrollAreaThumb.displayName = 'ScrollAreaThumb';

export const ScrollAreaContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Content>
>((props, ref) => (
  <BaseScrollArea.Content ref={ref} data-slot="scroll-area-content" {...props} />
));
ScrollAreaContent.displayName = 'ScrollAreaContent';

export const ScrollAreaCorner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Corner>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Corner
    ref={ref}
    data-slot="scroll-area-corner"
    className={composeClassName('bg-transparent', className)}
    {...props}
  />
));
ScrollAreaCorner.displayName = 'ScrollAreaCorner';

// Compound export mapping Base UI primitives
export const ScrollArea = Object.assign(ScrollAreaComponent, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
});

// Re-export Base UI primitives for compound composition
export { BaseScrollArea };

export default ScrollArea;
