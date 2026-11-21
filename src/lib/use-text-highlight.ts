'use client';

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

export function findNormalizedMatchRanges(
  textContent: string,
  trimmedQuery: string,
  caseSensitive: boolean
): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  if (caseSensitive) {
    let startIndex = textContent.indexOf(trimmedQuery);
    while (startIndex !== -1) {
      const endIndex = startIndex + trimmedQuery.length;
      if (endIndex <= textContent.length) {
        ranges.push([startIndex, endIndex]);
      }
      startIndex = textContent.indexOf(trimmedQuery, endIndex);
    }
    return ranges;
  }

  const targetQuery = trimmedQuery.toLowerCase();
  const textToSearch = textContent.toLowerCase();

  // Fast path: 1:1 UTF-16 length match
  if (textToSearch.length === textContent.length) {
    let startIndex = textToSearch.indexOf(targetQuery);
    while (startIndex !== -1) {
      const endIndex = startIndex + targetQuery.length;
      if (endIndex <= textContent.length) {
        ranges.push([startIndex, endIndex]);
      }
      startIndex = textToSearch.indexOf(targetQuery, endIndex);
    }
    return ranges;
  }

  // Unicode case-folding length expansion path (e.g. Turkish dotted uppercase I '\u0130' -> 'i\u0307')
  let folded = '';
  const origStarts: number[] = [];
  const origEnds: number[] = [];
  let i = 0;
  while (i < textContent.length) {
    const codePoint = textContent.codePointAt(i);
    const charLen = codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
    const origSlice = textContent.slice(i, i + charLen);
    const lowerSlice = origSlice.toLowerCase();
    for (let j = 0; j < lowerSlice.length; j++) {
      origStarts.push(i);
      origEnds.push(i + charLen);
    }
    folded += lowerSlice;
    i += charLen;
  }

  let matchIdx = folded.indexOf(targetQuery);
  while (matchIdx !== -1) {
    const endFoldedIdx = matchIdx + targetQuery.length - 1;
    const startOffset = origStarts[matchIdx];
    const endOffset = origEnds[endFoldedIdx];
    if (
      startOffset !== undefined &&
      endOffset !== undefined &&
      startOffset <= endOffset &&
      endOffset <= textContent.length
    ) {
      ranges.push([startOffset, endOffset]);
    }
    matchIdx = folded.indexOf(targetQuery, matchIdx + targetQuery.length);
  }

  return ranges;
}

export function useTextHighlight(
  containerTarget: HTMLElement | null | React.RefObject<HTMLElement | null>,
  query: string,
  options: UseTextHighlightOptions = {}
): UseTextHighlightResult {
  const { highlightName = 'search-results', caseSensitive = false } = options;
  const [matchCount, setMatchCount] = React.useState<number>(0);
  const [isSupported, setIsSupported] = React.useState<boolean>(true);
  const [contentVersion, setContentVersion] = React.useState(0);
  const ownerRef = React.useRef<symbol>(Symbol('highlight-owner'));
  const cachedTextNodesRef = React.useRef<Text[]>([]);

  const containerElement =
    containerTarget && 'current' in containerTarget ? containerTarget.current : containerTarget;

  // Observe container content mutations (ignoring the sr-only live status region) so the cached
  // text-node list refreshes only when container content changes rather than on every keystroke.
  React.useEffect(() => {
    const container =
      containerTarget && 'current' in containerTarget ? containerTarget.current : containerTarget;
    if (!container || typeof MutationObserver === 'undefined') return;
    let frame = 0;
    const observer = new MutationObserver((mutations) => {
      const hasContentMutation = mutations.some((mutation) => {
        const targetEl =
          mutation.target.nodeType === Node.ELEMENT_NODE
            ? (mutation.target as Element)
            : mutation.target.parentElement;
        return !targetEl?.closest('[data-text-highlight-status]');
      });
      if (!hasContentMutation) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setContentVersion((v) => v + 1));
    });
    observer.observe(container, { childList: true, characterData: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerTarget, containerElement]);

  // Cache TreeWalker text nodes per container and content version to avoid full DOM walks on every keystroke
  React.useEffect(() => {
    const container =
      containerTarget && 'current' in containerTarget ? containerTarget.current : containerTarget;
    if (!container || typeof document === 'undefined') {
      cachedTextNodesRef.current = [];
      return;
    }

    const nodes: Text[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest('[data-text-highlight-status]')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      nodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }
    cachedTextNodesRef.current = nodes;
  }, [containerTarget, containerElement, contentVersion]);

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
    const container =
      containerTarget && 'current' in containerTarget ? containerTarget.current : containerTarget;
    const owner = ownerRef.current;

    // Clear this instance's highlight if query is empty or container is unmounted
    if (!container || !query.trim()) {
      setOwnerRanges(highlightName, owner, []);
      setMatchCount(0);
      return;
    }

    const trimmedQuery = query.trim();
    const ranges: Range[] = [];

    for (const textNode of cachedTextNodesRef.current) {
      if (!textNode.isConnected) continue;
      const textContent = textNode.textContent;
      if (!textContent) continue;
      const offsets = findNormalizedMatchRanges(textContent, trimmedQuery, caseSensitive);
      for (const [startOffset, endOffset] of offsets) {
        const range = new Range();
        range.setStart(textNode, startOffset);
        range.setEnd(textNode, endOffset);
        ranges.push(range);
      }
    }

    setOwnerRanges(highlightName, owner, ranges);
    setMatchCount(ranges.length);

    return () => {
      setOwnerRanges(highlightName, owner, []);
    };
  }, [containerTarget, containerElement, query, highlightName, caseSensitive, contentVersion]);

  return { matchCount, isSupported };
}