'use client';

/**
 * TextHighlight primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: highlight-text-ranges)
 *
 * TAXONOMY & USAGE:
 * - A declarative text-search and keyword highlight container powered by the CSS Custom Highlight API (`::highlight()`).
 * - Highlights search matches on the GPU compositor without mutating the DOM tree, splitting strings,
 *   or fragmenting screen reader announcements.
 * - Adheres to WCAG 4.1.3 (Status Messages) by synchronizing visual highlights with an `aria-live="polite"`
 *   screen reader match announcer.
 * - Styles matches using tokenized secondary container palette in globals.css:
 *   `::highlight(search-results) { background-color: var(--secondary-container); color: var(--on-secondary-container); }`
 */
import * as React from 'react';
import {
  useTextHighlight,
  findNormalizedMatchRanges,
  type UseTextHighlightOptions,
} from '@/lib/use-text-highlight';
import { cn } from '@/lib/utils';

export interface TextHighlightProps extends React.HTMLAttributes<HTMLDivElement>, UseTextHighlightOptions {
  /** Search query string to highlight within children */
  query: string;
  /** Whether to render an accessible hidden live region announcing match count. Defaults to true */
  announceMatches?: boolean;
  children: React.ReactNode;
}

function renderFallbackHighlightedString(
  text: string,
  trimmedQuery: string,
  caseSensitive: boolean
): { nodes: React.ReactNode; count: number } {
  if (!trimmedQuery) return { nodes: text, count: 0 };
  const ranges = findNormalizedMatchRanges(text, trimmedQuery, caseSensitive);
  if (ranges.length === 0) return { nodes: text, count: 0 };

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    if (start > cursor) {
      parts.push(text.slice(cursor, start));
    }
    parts.push(
      <mark
        key={`${start}-${end}-${i}`}
        className="bg-secondary-container text-on-secondary-container underline decoration-2 underline-offset-2 rounded-xs"
      >
        {text.slice(start, end)}
      </mark>
    );
    cursor = end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return { nodes: parts, count: ranges.length };
}

export const TextHighlight = React.forwardRef<HTMLDivElement, TextHighlightProps>(
  (
    {
      query,
      highlightName = 'search-results',
      caseSensitive = false,
      announceMatches = true,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [containerEl, setContainerEl] = React.useState<HTMLDivElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        setContainerEl(node);
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const { matchCount, isSupported } = useTextHighlight(containerEl, query, {
      highlightName,
      caseSensitive,
    });

    const trimmedQuery = query.trim();

    // When CSS.highlights is unsupported, never mutate React children with TreeWalker.
    // Render declarative <mark> spans only for plain string children; degrade safely otherwise.
    const fallbackResult = React.useMemo(() => {
      if (isSupported || typeof children !== 'string' || !trimmedQuery) {
        return null;
      }
      return renderFallbackHighlightedString(children, trimmedQuery, caseSensitive);
    }, [isSupported, children, trimmedQuery, caseSensitive]);

    const effectiveMatchCount = fallbackResult ? fallbackResult.count : matchCount;
    const canAnnounce = isSupported || typeof children === 'string';
    const liveMessage =
      canAnnounce && trimmedQuery
        ? effectiveMatchCount > 0
          ? `${effectiveMatchCount} ${effectiveMatchCount === 1 ? 'search match' : 'search matches'} found`
          : 'No matches found'
        : '';

    return (
      <div ref={setRef} className={cn('relative', className)} {...props}>
        {/* Permanently mounted sr-only live region so assistive tech reliably announces updates */}
        {announceMatches && (
          <span data-text-highlight-status className="sr-only" aria-live="polite" aria-atomic="true">
            {liveMessage}
          </span>
        )}
        {fallbackResult ? fallbackResult.nodes : children}
      </div>
    );
  }
);
TextHighlight.displayName = 'TextHighlight';

export { useTextHighlight };
export default TextHighlight;
