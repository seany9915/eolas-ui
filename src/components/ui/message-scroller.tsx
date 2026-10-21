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
import { Tooltip } from './tooltip';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerContextValue {
  isAtBottom: boolean;
  autoScroll: boolean;
  setAutoScroll: (enabled: boolean) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  unreadCount: number;
  scrollPreviousItemPeek: number;
}

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export function useMessageScroller() {
  const ctx = React.useContext(MessageScrollerContext);
  if (!ctx) {
    throw new Error('MessageScroller compound subcomponents must be used within a <MessageScrollerProvider>.');
  }
  return ctx;
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
  threshold = 48,
  children,
}) => {
  const edgeThreshold = scrollEdgeThreshold ?? threshold;
  const [isAtBottom, setIsAtBottom] = React.useState(defaultScrollPosition !== 'start');
  const [autoScroll, setAutoScroll] = React.useState(defaultAutoScroll);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const prevHeightRef = React.useRef<number>(0);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current;
      if (!vp) return;
      vp.scrollTo({
        top: vp.scrollHeight,
        behavior,
      });
      setIsAtBottom(true);
      setUnreadCount(0);
    },
    []
  );

  const scrollToTop = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const vp = viewportRef.current;
      if (!vp) return;
      vp.scrollTo({
        top: 0,
        behavior,
      });
    },
    []
  );

  // ResizeObserver on content container to track incoming streamed tokens or expanding disclosures
  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (prevHeightRef.current > 0 && newHeight > prevHeightRef.current) {
          if (autoScroll && isAtBottom) {
            scrollToBottom('instant');
          } else if (!isAtBottom) {
            setUnreadCount((c) => c + 1);
          }
        }
        prevHeightRef.current = newHeight;
      }
    });

    ro.observe(content);
    return () => ro.disconnect();
  }, [autoScroll, isAtBottom, scrollToBottom]);

  // Handle scroll events on viewport
  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handleScroll = () => {
      const atBottom = vp.scrollHeight - vp.scrollTop - vp.clientHeight <= edgeThreshold;
      setIsAtBottom(atBottom);
      if (atBottom) {
        setUnreadCount(0);
      }
    };

    vp.addEventListener('scroll', handleScroll, { passive: true });
    return () => vp.removeEventListener('scroll', handleScroll);
  }, [edgeThreshold]);

  return (
    <MessageScrollerContext.Provider
      value={{
        isAtBottom,
        autoScroll,
        setAutoScroll,
        scrollToBottom,
        scrollToTop,
        viewportRef,
        contentRef,
        unreadCount,
        scrollPreviousItemPeek,
      }}
    >
      {children}
    </MessageScrollerContext.Provider>
  );
};
MessageScrollerProvider.displayName = 'MessageScrollerProvider';

/* -------------------------------------------------------------------------------------------------
 * MessageScroller (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const MessageScrollerRoot = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="message-scroller"
        className={cn('relative flex flex-col w-full h-full overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
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
    const { viewportRef } = useMessageScroller();
    const prevScrollHeightRef = React.useRef<number>(0);

    // Track scroll height to support prepending older messages without jumping
    React.useLayoutEffect(() => {
      const vp = viewportRef.current;
      if (!vp || !preserveScrollOnPrepend) return;

      if (prevScrollHeightRef.current > 0 && vp.scrollHeight > prevScrollHeightRef.current && vp.scrollTop < 100) {
        const delta = vp.scrollHeight - prevScrollHeightRef.current;
        vp.scrollTop += delta;
      }
      prevScrollHeightRef.current = vp.scrollHeight;
    });

    return (
      <div
        ref={(node) => {
          (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="message-scroller-viewport"
        aria-label={ariaLabel}
        className={cn(
          'flex-1 w-full overflow-y-auto overscroll-contain focus-visible:outline-none',
          'scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent',
          className
        )}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
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
    const { contentRef } = useMessageScroller();

    return (
      <div
        ref={(node) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="message-scroller-content"
        className={cn('flex flex-col space-y-4 p-4 min-h-full justify-start', className)}
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
  ({ messageId, scrollAnchor = false, children, className, ...props }, ref) => {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const { viewportRef, scrollPreviousItemPeek } = useMessageScroller();

    React.useEffect(() => {
      if (scrollAnchor && itemRef.current && viewportRef.current) {
        // Pin new user turns near the top, preserving scrollPreviousItemPeek pixels of previous item
        const vp = viewportRef.current;
        const itemTop = itemRef.current.offsetTop;
        const targetScrollTop = Math.max(0, itemTop - scrollPreviousItemPeek);
        vp.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    }, [scrollAnchor, scrollPreviousItemPeek, viewportRef]);

    return (
      <div
        ref={(node) => {
          itemRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="message-scroller-item"
        data-message-id={messageId}
        data-scroll-anchor={scrollAnchor ? '' : undefined}
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
export interface MessageScrollerButtonProps {
  direction?: 'start' | 'end';
  label?: string;
  className?: string;
}

export const MessageScrollerButton: React.FC<MessageScrollerButtonProps> = ({
  direction = 'end',
  label,
  className,
}) => {
  const { isAtBottom, scrollToBottom, scrollToTop, unreadCount } = useMessageScroller();

  const isVisible = direction === 'end' ? !isAtBottom : true;
  if (!isVisible) return null;

  const defaultLabel =
    direction === 'end' ? 'Scroll to latest message' : 'Scroll to start of conversation';
  const resolvedLabel = label ?? defaultLabel;

  return (
    <div
      data-slot="message-scroller-button-container"
      data-direction={direction}
      data-active={isVisible ? 'true' : 'false'}
      className={cn(
        'absolute z-20 animate-in fade-in zoom-in-95 duration-quick',
        direction === 'end' ? 'bottom-4 right-4' : 'top-4 right-4',
        className
      )}
    >
      <Tooltip content={unreadCount > 0 ? `${unreadCount} new update${unreadCount === 1 ? '' : 's'}` : resolvedLabel}>
        <Button
          type="button"
          variant="filled"
          colorRole="primary"
          size="sm"
          onClick={() => (direction === 'end' ? scrollToBottom('smooth') : scrollToTop('smooth'))}
          aria-label={resolvedLabel}
          expandedTouchTarget
          className="rounded-full shadow-elevation-2 flex items-center gap-1.5 px-3 py-1.5 h-9"
        >
          <Icon name={direction === 'end' ? 'arrow_downward' : 'arrow_upward'} size="xs" aria-hidden="true" />
          {unreadCount > 0 && direction === 'end' && (
            <span className="font-mono text-[11px] tabular-nums font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </Tooltip>
    </div>
  );
};
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
