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

// Ranges are tracked per hook instance so several highlighters can share one highlight name
// without overwriting or deleting each other's matches.
const rangesByName = new Map<string, Map<symbol, Range[]>>();

function publishHighlights(name: string) {
  const registry = CSS.highlights;
  const HighlightClass = window.Highlight;
  if (!registry || !HighlightClass) return;
  const owners = rangesByName.get(name);
  const all = owners ? Array.from(owners.values()).flat() : [];
  if (all.length === 0) {
    registry.delete(name);
    rangesByName.delete(name);
    return;
  }
  registry.set(name, new HighlightClass(...all));
}

function setOwnerRanges(name: string, owner: symbol, ranges: Range[]) {
  let owners = rangesByName.get(name);
  if (!owners) {
    owners = new Map();
    rangesByName.set(name, owners);
  }
  if (ranges.length > 0) owners.set(owner, ranges);
  else owners.delete(owner);
  publishHighlights(name);
}

export function useTextHighlight(
  containerRef: React.RefObject<HTMLElement | null>,
  query: string,
  options: UseTextHighlightOptions = {}
): UseTextHighlightResult {
  const { highlightName = 'search-results', caseSensitive = false } = options;
  const [matchCount, setMatchCount] = React.useState<number>(0);
  const [isSupported, setIsSupported] = React.useState<boolean>(true);
  const [contentVersion, setContentVersion] = React.useState(0);
  const ownerRef = React.useRef<symbol>(Symbol('highlight-owner'));

  // Re-run the search when the container's text changes without the query changing
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof MutationObserver === 'undefined') return;
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setContentVersion((v) => v + 1));
    });
    observer.observe(container, { childList: true, characterData: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerRef]);

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
    const owner = ownerRef.current;

    // Clear this instance's highlight if query is empty or container is unmounted
    if (!container || !query.trim()) {
      setOwnerRanges(highlightName, owner, []);
      setMatchCount(0);
      return;
    }

    const trimmedQuery = query.trim();
    const targetQuery = caseSensitive ? trimmedQuery : trimmedQuery.toLowerCase();
    const ranges: Range[] = [];

    // Fast DOM text-node tree traversal
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest('[data-text-highlight-status]')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
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

    setOwnerRanges(highlightName, owner, ranges);
    setMatchCount(ranges.length);

    return () => {
      setOwnerRanges(highlightName, owner, []);
    };
  }, [containerRef, query, highlightName, caseSensitive, contentVersion]);

  return { matchCount, isSupported };
}