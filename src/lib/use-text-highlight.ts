/**
 * useTextHighlight Hook
 *
 * Platform Reference: Modern Web Guidance (MWG: highlight-text-ranges)
 *
 * Uses the CSS Custom Highlight API (`::highlight()`) to highlight arbitrary search matches
 * or clinical keywords on the GPU compositor without mutating the DOM tree, splitting strings,
 * or fragmenting screen reader announcements.
 *
 * Pairs with tokenized CSS in globals.css:
 * ```css
 * ::highlight(search-results) {
 *   background-color: var(--secondary-container);
 *   color: var(--on-secondary-container);
 * }
 * ```
 */
import * as React from 'react';

declare global {
  interface CSS {
    highlights?: HighlightRegistry;
  }
  interface Window {
    Highlight?: {
      new (...ranges: Range[]): Highlight;
    };
  }
}

export interface UseTextHighlightOptions {
  /** Name of the highlight registered in CSS.highlights and targeted by ::highlight(name). Defaults to 'search-results' */
  highlightName?: string;
  /** Whether the search should be case sensitive. Defaults to false. */
  caseSensitive?: boolean;
}

export interface UseTextHighlightResult {
  /** Total number of matches highlighted in the container */
  matchCount: number;
  /** Whether the CSS Custom Highlight API is supported in the current browser */
  isSupported: boolean;
}

export function useTextHighlight(
  containerRef: React.RefObject<HTMLElement | null>,
  query: string,
  options: UseTextHighlightOptions = {}
): UseTextHighlightResult {
  const { highlightName = 'search-results', caseSensitive = false } = options;
  const [matchCount, setMatchCount] = React.useState<number>(0);
  const [isSupported, setIsSupported] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') {
      setIsSupported(false);
      return;
    }

    const registry = CSS.highlights;
    const HighlightClass = window.Highlight;

    if (!registry || !HighlightClass) {
      setIsSupported(false);
      setMatchCount(0);
      return;
    }

    setIsSupported(true);
    const container = containerRef.current;

    // Clear previous highlight if query is empty or container is unmounted
    if (!container || !query.trim()) {
      registry.delete(highlightName);
      setMatchCount(0);
      return;
    }

    const trimmedQuery = query.trim();
    const targetQuery = caseSensitive ? trimmedQuery : trimmedQuery.toLowerCase();
    const ranges: Range[] = [];

    // Fast DOM text-node tree traversal
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null = walker.nextNode();

    while (currentNode) {
      const textContent = currentNode.textContent;
      if (textContent) {
        const textToSearch = caseSensitive ? textContent : textContent.toLowerCase();
        let startIndex = textToSearch.indexOf(targetQuery);

        while (startIndex !== -1) {
          const range = new Range();
          range.setStart(currentNode, startIndex);
          range.setEnd(currentNode, startIndex + targetQuery.length);
          ranges.push(range);

          startIndex = textToSearch.indexOf(targetQuery, startIndex + targetQuery.length);
        }
      }
      currentNode = walker.nextNode();
    }

    if (ranges.length > 0) {
      const highlight = new HighlightClass(...ranges);
      registry.set(highlightName, highlight);
      setMatchCount(ranges.length);
    } else {
      registry.delete(highlightName);
      setMatchCount(0);
    }

    return () => {
      if (typeof CSS !== 'undefined' && CSS.highlights) {
        CSS.highlights.delete(highlightName);
      }
    };
  }, [containerRef, query, highlightName, caseSensitive]);

  return { matchCount, isSupported };
}
