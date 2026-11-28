'use client';

/**
 * MessageScroller primitive suite.
 *
 * Base UI Integration: Consumes Base UI Button and Tooltip primitives.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements/base/chat
 * - https://ui.shadcn.com/docs/components/base/message-scroller
 *
 * TAXONOMY & USAGE:
 * - The foundational viewport engine for conversational AI interfaces, live transcripts, and clinical chat.
 * - Handles smart auto-scrolling: follows incoming streamed tokens when the user is at the live edge,
 *   without hijacking the scroll position if the clinician scrolled up to review clinical history.
 * - Turn Anchoring (`scrollAnchor`): Pins new prompt turns near the top with `scrollPreviousItemPeek` visible.
 * - Jump-to-Latest Control: Smooth floating button to return to the live response edge with unread indicators.
 * - Preserves scroll position on historical message prepends (`preserveScrollOnPrepend`).
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.
 * - Strictly follows DESIGN.md tokens: floating 2px focus ring, semantic colors, zero triple-tints.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { ScrollArea } from './scroll-area';
import { Tooltip } from './tooltip';
import { cn, useMergedRefs } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

function resolveScrollBehavior(behavior: ScrollBehavior): ScrollBehavior {
  if (behavior === 'smooth' && prefersReducedMotion()) {
    return 'auto';
  }
  return behavior;
}

function getOffsetTopWithinViewport(el: HTMLElement, vp: HTMLElement): number {
  const elRect = el.getBoundingClientRect();
  const vpRect = vp.getBoundingClientRect();
  return elRect.top - vpRect.top - vp.clientTop + vp.scrollTop;
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerContextValue {
  isAtBottom: boolean;
  autoScroll: boolean;
  setAutoScroll: (enabled: boolean) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToEnd: (behavior?: ScrollBehavior) => void;
  scrollToStart: (behavior?: ScrollBehavior) => void;
  scrollToMessage: (id: string, behavior?: ScrollBehavior) => boolean;
  registerItem: (id: string, node: HTMLElement | null) => () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  unreadCount: number;
  scrollPreviousItemPeek: number;
  scrollMargin: number;
  scrollable: { start: boolean; end: boolean };
  visibleMessageIds: string[];
  currentAnchorId: string | null;
  pendingScroll: boolean;
  /** @internal Reports the mounted viewport element so effects can attach when it mounts late. */
  attachViewport: (node: HTMLDivElement | null) => void;
  /** @internal Reports the mounted content element so effects can attach when it mounts late. */
  attachContent: (node: HTMLDivElement | null) => void;
  /** @internal Called when an item mounts after the initial render, to track unread turns. */
  notifyItemAdded: () => void;
  /** @internal True once the initial render has committed; items mounted later are new turns. */
  isReadyRef: React.RefObject<boolean>;
}

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export function useMessageScroller() {
  const ctx = React.useContext(MessageScrollerContext);
  if (!ctx) {
    throw new Error('MessageScroller compound subcomponents must be used within a <MessageScrollerProvider>.');
  }
  return ctx;
}

export function useMessageScrollerScrollable() {
  const { scrollable } = useMessageScroller();
  return scrollable;
}

export function useMessageScrollerVisibility() {
  const { currentAnchorId, visibleMessageIds } = useMessageScroller();
  return { currentAnchorId, visibleMessageIds };
}

/* -------------------------------------------------------------------------------------------------
 * MessageScrollerProvider
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerProviderProps {
  autoScroll?: boolean;
  defaultScrollPosition?: 'start' | 'end' | 'last-anchor';
  scrollPreviousItemPeek?: number;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  threshold?: number;
  children: React.ReactNode;
}

export const MessageScrollerProvider: React.FC<MessageScrollerProviderProps> = ({
  autoScroll: defaultAutoScroll = true,
  defaultScrollPosition = 'end',
  scrollPreviousItemPeek = 64,
  scrollEdgeThreshold,
  scrollMargin = 0,
  threshold = 48,
  children,
}) => {
  const edgeThreshold = scrollEdgeThreshold ?? threshold;
  const [isAtBottom, setIsAtBottom] = React.useState(defaultScrollPosition !== 'start');
  const [autoScroll, setAutoScroll] = React.useState(defaultAutoScroll);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [scrollable, setScrollable] = React.useState({ start: false, end: false });
  const [visibleMessageIds, setVisibleMessageIds] = React.useState<string[]>([]);
  const [currentAnchorId, setCurrentAnchorId] = React.useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = React.useState(defaultScrollPosition !== 'start');

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());
  const prevHeightRef = React.useRef<number>(0);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const visibleIdsRef = React.useRef<Set<string>>(new Set());
  const isReadyRef = React.useRef(false);
  const autoScrollRef = React.useRef(autoScroll);
  const isAtBottomRef = React.useRef(isAtBottom);
  const [viewportEl, setViewportEl] = React.useState<HTMLDivElement | null>(null);
  const [contentEl, setContentEl] = React.useState<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    autoScrollRef.current = autoScroll;
    isAtBottomRef.current = isAtBottom;
  }, [autoScroll, isAtBottom]);

  React.useEffect(() => {
    isReadyRef.current = true;
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const attachViewport = React.useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    setViewportEl(node);
  }, []);

  const attachContent = React.useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setContentEl(node);
  }, []);

  const notifyItemAdded = React.useCallback(() => {
    if (!isAtBottomRef.current) setUnreadCount((c) => c + 1);
  }, []);

  const registerItem = React.useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      itemsRef.current.set(id, node);
      observerRef.current?.observe(node);
    } else {
      itemsRef.current.delete(id);
      visibleIdsRef.current.delete(id);
    }
    return () => {
      const existing = itemsRef.current.get(id);
      if (existing) observerRef.current?.unobserve(existing);
      itemsRef.current.delete(id);
      visibleIdsRef.current.delete(id);
    };
  }, []);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current;
      if (!vp) return;
      vp.scrollTo({
        top: vp.scrollHeight,
        behavior: resolveScrollBehavior(behavior),
      });
      setIsAtBottom(true);
      setUnreadCount(0);
      setPendingScroll(false);
    },
    []
  );

  const scrollToTop = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current;
      if (!vp) return;
      vp.scrollTo({
        top: 0,
        behavior: resolveScrollBehavior(behavior),
      });
      setPendingScroll(false);
    },
    []
  );

  const scrollToMessage = React.useCallback(
    (id: string, behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current;
      const el = itemsRef.current.get(id);
      if (!vp || !el) return false;
      const targetTop = Math.max(
        0,
        getOffsetTopWithinViewport(el, vp) - scrollPreviousItemPeek - scrollMargin
      );
      vp.scrollTo({
        top: targetTop,
        behavior: resolveScrollBehavior(behavior),
      });
      return true;
    },
    [scrollPreviousItemPeek, scrollMargin]
  );

  // Initial scroll position resolution
  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!viewportEl || !vp) return;

    if (defaultScrollPosition === 'end') {
      vp.scrollTop = vp.scrollHeight;
      setIsAtBottom(true);
      setPendingScroll(false);
    } else if (defaultScrollPosition === 'last-anchor') {
      const anchorNodes = Array.from(vp.querySelectorAll<HTMLElement>('[data-scroll-anchor]'));
      const lastAnchor = anchorNodes[anchorNodes.length - 1];
      if (lastAnchor) {
        vp.scrollTop = Math.max(
          0,
          getOffsetTopWithinViewport(lastAnchor, vp) - scrollPreviousItemPeek - scrollMargin
        );
      }
      setPendingScroll(false);
    } else {
      setPendingScroll(false);
    }
  }, [defaultScrollPosition, scrollPreviousItemPeek, scrollMargin, viewportEl]);

  // ResizeObserver on content container to track incoming streamed tokens or expanding disclosures
  React.useEffect(() => {
    const content = contentEl;
    if (!content || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (prevHeightRef.current > 0 && newHeight > prevHeightRef.current) {
          if (autoScrollRef.current && isAtBottomRef.current) {
            scrollToBottom('instant');
          }
        }
        prevHeightRef.current = newHeight;
      }

      // Update scroll boundaries
      const vp = viewportRef.current;
      if (vp) {
        const canScrollUp = vp.scrollTop > edgeThreshold;
        const canScrollDown = vp.scrollHeight - vp.scrollTop - vp.clientHeight > edgeThreshold;
        setScrollable((prev) =>
          prev.start === canScrollUp && prev.end === canScrollDown
            ? prev
            : { start: canScrollUp, end: canScrollDown }
        );
      }
    });

    ro.observe(content);
    return () => ro.disconnect();
  }, [contentEl, scrollToBottom, edgeThreshold]);

  // Handle scroll events and boundary state on viewport
  React.useEffect(() => {
    const vp = viewportEl;
    if (!vp) return;

    const handleScroll = () => {
      const canScrollUp = vp.scrollTop > edgeThreshold;
      const canScrollDown = vp.scrollHeight - vp.scrollTop - vp.clientHeight > edgeThreshold;
      const atBottom = !canScrollDown;

      setIsAtBottom(atBottom);
      setScrollable((prev) =>
        prev.start === canScrollUp && prev.end === canScrollDown
          ? prev
          : { start: canScrollUp, end: canScrollDown }
      );

      if (atBottom) {
        setUnreadCount(0);
      }
    };

    // Initial boundary check
    handleScroll();

    vp.addEventListener('scroll', handleScroll, { passive: true });
    return () => vp.removeEventListener('scroll', handleScroll);
  }, [edgeThreshold, viewportEl]);

  // IntersectionObserver for visibility and current anchor tracking.
  // Items registered later are observed from registerItem.
  React.useEffect(() => {
    const vp = viewportEl;
    if (!vp || typeof IntersectionObserver === 'undefined') return;

    const visibleIds = visibleIdsRef.current;
    visibleIds.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        let visibilityChanged = false;
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const messageId = target.dataset.messageId;
          if (!messageId) continue;

          if (entry.isIntersecting) {
            if (!visibleIds.has(messageId)) {
              visibleIds.add(messageId);
              visibilityChanged = true;
            }
          } else if (visibleIds.delete(messageId)) {
            visibilityChanged = true;
          }
        }

        let nextAnchorId: string | null = null;
        let nextAnchorEl: HTMLElement | null = null;
        for (const id of visibleIds) {
          const el = itemsRef.current.get(id);
          if (!el || el.dataset.scrollAnchor === undefined) continue;
          if (
            !nextAnchorEl ||
            (nextAnchorEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
          ) {
            nextAnchorEl = el;
            nextAnchorId = id;
          }
        }

        if (visibilityChanged) {
          setVisibleMessageIds(Array.from(visibleIds));
        }
        setCurrentAnchorId((prev) => (prev === nextAnchorId ? prev : nextAnchorId));
      },
      { root: vp, threshold: 0.1 }
    );

    observerRef.current = observer;
    itemsRef.current.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      observerRef.current = null;
      visibleIds.clear();
    };
  }, [viewportEl]);

  const contextValue = React.useMemo<MessageScrollerContextValue>(
    () => ({
      isAtBottom,
      autoScroll,
      setAutoScroll,
      scrollToBottom,
      scrollToTop,
      scrollToEnd: scrollToBottom,
      scrollToStart: scrollToTop,
      scrollToMessage,
      registerItem,
      viewportRef,
      contentRef,
      unreadCount,
      scrollPreviousItemPeek,
      scrollMargin,
      scrollable,
      visibleMessageIds,
      currentAnchorId,
      pendingScroll,
      attachViewport,
      attachContent,
      notifyItemAdded,
      isReadyRef,
    }),
    [
      isAtBottom,
      autoScroll,
      scrollToBottom,
      scrollToTop,
      scrollToMessage,
      registerItem,
      unreadCount,
      scrollPreviousItemPeek,
      scrollMargin,
      scrollable,
      visibleMessageIds,
      currentAnchorId,
      pendingScroll,
      attachViewport,
      attachContent,
      notifyItemAdded,
    ]
  );

  return (
    <MessageScrollerContext.Provider value={contextValue}>
      {children}
    </MessageScrollerContext.Provider>
  );
};
MessageScrollerProvider.displayName = 'MessageScrollerProvider';

/* -------------------------------------------------------------------------------------------------
 * MessageScroller (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'container' | 'canvas';
  autoScroll?: boolean;
  defaultScrollPosition?: 'start' | 'end' | 'last-anchor';
  scrollPreviousItemPeek?: number;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  threshold?: number;
  children?: React.ReactNode;
  className?: string;
}

const MessageScrollerContainer = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  (
    {
      variant = 'default',
      children,
      className,
      autoScroll: _autoScroll,
      defaultScrollPosition: _defaultScrollPosition,
      scrollPreviousItemPeek: _scrollPreviousItemPeek,
      scrollEdgeThreshold: _scrollEdgeThreshold,
      scrollMargin: _scrollMargin,
      threshold: _threshold,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="message-scroller"
        className={cn(
          'relative flex flex-col size-full overflow-hidden',
          variant === 'container' && 'bg-surface-container-low',
          variant === 'canvas' && 'bg-background',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerContainer.displayName = 'MessageScrollerContainer';

const MessageScrollerRoot = React.forwardRef<HTMLDivElement, MessageScrollerProps>((props, ref) => {
  const hasOuterContext = React.useContext(MessageScrollerContext) !== null;

  if (hasOuterContext) {
    return <MessageScrollerContainer ref={ref} {...props} />;
  }

  const {
    autoScroll,
    defaultScrollPosition,
    scrollPreviousItemPeek,
    scrollEdgeThreshold,
    scrollMargin,
    threshold,
    children,
    ...containerProps
  } = props;

  return (
    <MessageScrollerProvider
      autoScroll={autoScroll}
      defaultScrollPosition={defaultScrollPosition}
      scrollPreviousItemPeek={scrollPreviousItemPeek}
      scrollEdgeThreshold={scrollEdgeThreshold}
      scrollMargin={scrollMargin}
      threshold={threshold}
    >
      <MessageScrollerContainer ref={ref} {...containerProps}>
        {children}
      </MessageScrollerContainer>
    </MessageScrollerProvider>
  );
});
MessageScrollerRoot.displayName = 'MessageScroller';

/* -------------------------------------------------------------------------------------------------
 * MessageScrollerViewport
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  preserveScrollOnPrepend?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const MessageScrollerViewport = React.forwardRef<HTMLDivElement, MessageScrollerViewportProps>(
  (
    {
      preserveScrollOnPrepend = true,
      children,
      className,
      'aria-label': ariaLabel = 'Conversation history',
      ...props
    },
    ref
  ) => {
    const { viewportRef, contentRef, attachViewport, pendingScroll, scrollable } = useMessageScroller();
    const prevFirstItemRef = React.useRef<{ el: HTMLElement; offsetTop: number } | null>(null);

    // Track the first message item so prepended history preserves scroll without shifting streamed appends
    React.useLayoutEffect(() => {
      const vp = viewportRef.current;
      if (!vp || !preserveScrollOnPrepend) {
        prevFirstItemRef.current = null;
        return;
      }

      const container = contentRef.current ?? vp;
      const firstItem = (container.querySelector<HTMLElement>('[data-slot="message-scroller-item"]') ??
        container.firstElementChild) as HTMLElement | null;
      const prev = prevFirstItemRef.current;

      if (
        prev &&
        prev.el !== firstItem &&
        prev.el.isConnected &&
        container.contains(prev.el) &&
        vp.scrollTop < 100
      ) {
        const delta = getOffsetTopWithinViewport(prev.el, vp) - prev.offsetTop;
        if (delta > 0) {
          vp.scrollTop += delta;
        }
      }

      prevFirstItemRef.current = firstItem
        ? { el: firstItem, offsetTop: getOffsetTopWithinViewport(firstItem, vp) }
        : null;
    }, [children, preserveScrollOnPrepend, viewportRef, contentRef]);

    const mergedRef = useMergedRefs(attachViewport, ref);

    return (
      <ScrollArea
        fade
        data-slot="message-scroller-viewport"
        className="flex-1 min-h-0 w-full"
        viewportRef={mergedRef}
        viewportClassName={cn(
          'relative overscroll-contain data-[pending-scroll]:invisible',
          className
        )}
        contentClassName="min-h-full flex flex-col"
        viewportProps={{
          role: 'region',
          'aria-label': ariaLabel,
          'data-pending-scroll': pendingScroll ? '' : undefined,
          'data-scrollable-start': scrollable.start ? '' : undefined,
          'data-scrollable-end': scrollable.end ? '' : undefined,
          ...props,
        }}
      >
        {children}
      </ScrollArea>
    );
  }
);
MessageScrollerViewport.displayName = 'MessageScrollerViewport';

/* -------------------------------------------------------------------------------------------------
 * MessageScrollerContent
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const MessageScrollerContent = React.forwardRef<HTMLDivElement, MessageScrollerContentProps>(
  ({ children, className, ...props }, ref) => {
    const { attachContent } = useMessageScroller();

    const mergedRef = useMergedRefs(attachContent, ref);

    return (
      <div
        ref={mergedRef}
        role="log"
        aria-relevant="additions"
        data-slot="message-scroller-content"
        className={cn('flex flex-1 flex-col gap-4 p-4 min-h-full justify-start', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerContent.displayName = 'MessageScrollerContent';

/* -------------------------------------------------------------------------------------------------
 * MessageScrollerItem
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  messageId?: string;
  scrollAnchor?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const MessageScrollerItem = React.forwardRef<HTMLDivElement, MessageScrollerItemProps>(
  ({ messageId, scrollAnchor = false, children, className, style, ...props }, ref) => {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const {
      viewportRef,
      scrollPreviousItemPeek,
      scrollMargin,
      registerItem,
      notifyItemAdded,
      isReadyRef,
    } = useMessageScroller();

    // Determine whether this item mounted after initial mount inside effects rather than during render
    const isNewTurnRef = React.useRef<boolean | null>(null);

    React.useEffect(() => {
      if (isNewTurnRef.current === null) {
        isNewTurnRef.current = isReadyRef.current;
      }
      if (isNewTurnRef.current) notifyItemAdded();
    }, [isReadyRef, notifyItemAdded]);

    React.useEffect(() => {
      if (isNewTurnRef.current === null) {
        isNewTurnRef.current = isReadyRef.current;
      }
      if (scrollAnchor && isNewTurnRef.current && itemRef.current && viewportRef.current) {
        // Pin new user turns near the top, preserving scrollPreviousItemPeek pixels of previous item
        const vp = viewportRef.current;
        const itemTop = getOffsetTopWithinViewport(itemRef.current, vp);
        const targetScrollTop = Math.max(0, itemTop - scrollPreviousItemPeek - scrollMargin);
        vp.scrollTo({ top: targetScrollTop, behavior: resolveScrollBehavior('smooth') });
      }
    }, [scrollAnchor, scrollPreviousItemPeek, scrollMargin, viewportRef, isReadyRef]);

    React.useEffect(() => {
      if (!messageId || !itemRef.current) return;
      return registerItem(messageId, itemRef.current);
    }, [messageId, registerItem]);

    const mergedItemRef = useMergedRefs(itemRef, ref);

    return (
      <div
        ref={mergedItemRef}
        data-slot="message-scroller-item"
        data-message-id={messageId}
        data-scroll-anchor={scrollAnchor ? '' : undefined}
        style={scrollMargin ? { scrollMarginTop: scrollMargin, ...style } : style}
        className={cn('w-full shrink-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerItem.displayName = 'MessageScrollerItem';

/* -------------------------------------------------------------------------------------------------
 * MessageScrollerButton (Floating jump-to-bottom/top control)
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'start' | 'end';
  label?: string;
  className?: string;
}

export const MessageScrollerButton = React.forwardRef<HTMLDivElement, MessageScrollerButtonProps>(
  ({ direction = 'end', label, className, ...props }, ref) => {
    const { isAtBottom, scrollable, scrollToBottom, scrollToTop, unreadCount } = useMessageScroller();

    const isVisible = direction === 'end' ? !isAtBottom : scrollable.start;
    if (!isVisible) return null;

    const defaultLabel =
      direction === 'end' ? 'Scroll to latest message' : 'Scroll to start of conversation';
    const resolvedLabel = label ?? defaultLabel;
    const accessibleLabel =
      direction === 'end' && unreadCount > 0
        ? `${resolvedLabel} (${unreadCount} new update${unreadCount === 1 ? '' : 's'})`
        : resolvedLabel;

    return (
      <div
        ref={ref}
        data-slot="message-scroller-button-container"
        data-direction={direction}
        data-active={isVisible ? 'true' : 'false'}
        className={cn(
          'absolute z-20 transition-[opacity,transform] duration-quick ease-standard motion-reduce:transition-none',
          direction === 'end' ? 'bottom-4 end-4' : 'top-4 end-4',
          className
        )}
        {...props}
      >
        <Tooltip
          content={
            direction === 'end' && unreadCount > 0
              ? `${unreadCount} new update${unreadCount === 1 ? '' : 's'}`
              : resolvedLabel
          }
        >
          <Button
            type="button"
            variant="filled"
            colorRole="primary"
            size="sm"
            onClick={() => (direction === 'end' ? scrollToBottom('smooth') : scrollToTop('smooth'))}
            aria-label={accessibleLabel}
            expandedTouchTarget
            className="rounded-full shadow-ambient flex items-center gap-1.5 px-3 py-1.5 h-9"
          >
            <Icon name={direction === 'end' ? 'arrow_downward' : 'arrow_upward'} size="xs" aria-hidden="true" />
            {unreadCount > 0 && direction === 'end' && (
              <span className="font-mono text-xs tabular-nums font-bold">
                {unreadCount}
              </span>
            )}
          </Button>
        </Tooltip>
      </div>
    );
  }
);
MessageScrollerButton.displayName = 'MessageScrollerButton';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const MessageScroller = Object.assign(MessageScrollerRoot, {
  Provider: MessageScrollerProvider,
  Viewport: MessageScrollerViewport,
  Content: MessageScrollerContent,
  Item: MessageScrollerItem,
  Button: MessageScrollerButton,
});

/* -------------------------------------------------------------------------------------------------
 * AI Elements Legacy Aliases (Conversation, etc.)
 * -----------------------------------------------------------------------------------------------*/
export {
  MessageScroller as Conversation,
  MessageScrollerContent as ConversationContent,
  MessageScrollerViewport as ConversationViewport,
  MessageScrollerButton as ConversationScrollButton,
};

export default MessageScroller;
