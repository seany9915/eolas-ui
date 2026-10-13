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
import { useTextHighlight, type UseTextHighlightOptions } from '@/lib/use-text-highlight';
import { cn } from '@/lib/utils';

export interface TextHighlightProps extends React.HTMLAttributes<HTMLDivElement>, UseTextHighlightOptions {
  /** Search query string to highlight within children */
  query: string;
  /** Whether to render an accessible hidden live region announcing match count. Defaults to true */
  announceMatches?: boolean;
  children: React.ReactNode;
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
    const internalRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(forwardedRef, () => {
      const el = internalRef.current;
      if (!el) {
        throw new Error('TextHighlight ref not mounted');
      }
      return el;
    });

    const { matchCount } = useTextHighlight(internalRef, query, {
      highlightName,
      caseSensitive,
    });

    return (
      <div ref={internalRef} className={cn('relative', className)} {...props}>
        {/* Accessible screen reader live-region announcement */}
        {announceMatches && query.trim() && (
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {matchCount > 0 ? `${matchCount} search matches found` : 'No matches found'}
          </span>
        )}
        {children}
      </div>
    );
  }
);
TextHighlight.displayName = 'TextHighlight';

export { useTextHighlight };
export default TextHighlight;
