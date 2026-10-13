/**
 * Untrusted HTML Sanitizer Utility & React Component.
 *
 * Platform Reference: Modern Web Guidance (MWG: sanitize-untrusted-html)
 *
 * Safely parses and renders user- or API-supplied HTML content (such as clinical consultation
 * notes, discharge summaries, or formatted audit results) by leveraging the native browser
 * Sanitizer API (Chrome 146+, Edge 146+, Firefox 148+) with a secure DOMParser-based fallback
 * for cross-browser safety.
 */
import * as React from 'react';

export interface SanitizeConfig {
  /**
   * Whitelist of permitted HTML tags. Tags not listed here are removed along with their content,
   * unless included in `replaceWithChildrenElements`.
   */
  elements?: string[];
  /**
   * Whitelist of permitted HTML attributes. All other attributes (including all `on*` event handlers) are stripped.
   */
  attributes?: string[];
  /**
   * Wrapper tags that should be removed while preserving their text and child nodes.
   */
  replaceWithChildrenElements?: string[];
}

export const DEFAULT_ALLOWED_ELEMENTS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 's', 'small', 'mark',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'pre', 'code', 'kbd',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'a', 'span', 'div', 'br', 'hr',
];

export const DEFAULT_ALLOWED_ATTRIBUTES = [
  'href', 'title', 'target', 'rel', 'class', 'id', 'aria-label', 'aria-describedby',
];

// Augment DOM interfaces for modern Sanitizer API
declare global {
  interface SanitizerConfiguration {
    elements?: string[];
    attributes?: string[];
    replaceWithChildrenElements?: string[];
  }

  interface Element {
    setHTML?(input: string, options?: { sanitizer?: unknown }): void;
  }
}

/**
 * Fallback sanitizer for environments where Element.setHTML() is not yet supported.
 * Strips active scripting elements, inline event handlers, and javascript: protocols.
 */
function fallbackSanitize(html: string, config: SanitizeConfig = {}): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, ''); // Server-side plain-text strip fallback
  }

  const allowedTags = new Set((config.elements || DEFAULT_ALLOWED_ELEMENTS).map((t) => t.toLowerCase()));
  const allowedAttrs = new Set((config.attributes || DEFAULT_ALLOWED_ATTRIBUTES).map((a) => a.toLowerCase()));
  const replaceChildren = new Set((config.replaceWithChildrenElements || []).map((t) => t.toLowerCase()));

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function cleanNode(node: Node) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Strip dangerous script, iframe, and object tags unconditionally
        if (tagName === 'script' || tagName === 'style' || tagName === 'iframe' || tagName === 'object' || tagName === 'embed') {
          node.removeChild(el);
          continue;
        }

        if (replaceChildren.has(tagName)) {
          // Replace tag with its children
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          node.removeChild(el);
          continue;
        }

        if (!allowedTags.has(tagName)) {
          // Strip disallowed tag and its children
          node.removeChild(el);
          continue;
        }

        // Filter attributes
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();
          const attrValue = attr.value.trim().toLowerCase();

          // Reject any inline on* handler or dangerous protocol
          if (
            attrName.startsWith('on') ||
            attrValue.startsWith('javascript:') ||
            attrValue.startsWith('vbscript:') ||
            attrValue.startsWith('data:text/html')
          ) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (!allowedAttrs.has(attrName)) {
            el.removeAttribute(attr.name);
          }
        }

        // Recurse down children
        cleanNode(el);
      }
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML;
}

/**
 * Safely inserts untrusted HTML into a container element using the native Sanitizer API
 * when supported, falling back to a hardened parser.
 */
export function safeSetHtml(
  element: HTMLElement,
  untrustedHtml: string,
  config: SanitizeConfig = {}
): void {
  const elements = config.elements || DEFAULT_ALLOWED_ELEMENTS;
  const attributes = config.attributes || DEFAULT_ALLOWED_ATTRIBUTES;

  if (typeof element.setHTML === 'function') {
    try {
      element.setHTML(untrustedHtml, {
        sanitizer: {
          elements,
          attributes,
          replaceWithChildrenElements: config.replaceWithChildrenElements,
        },
      });
      return;
    } catch {
      // If native Sanitizer throws due to experimental config variance, fall through
    }
  }

  // Fallback
  element.innerHTML = fallbackSanitize(untrustedHtml, config);
}

/**
 * Sanitizes an untrusted HTML string into clean, safe HTML markup.
 */
export function sanitizeHtml(untrustedHtml: string, config: SanitizeConfig = {}): string {
  if (typeof document === 'undefined') {
    return fallbackSanitize(untrustedHtml, config);
  }
  const container = document.createElement('div');
  safeSetHtml(container, untrustedHtml, config);
  return container.innerHTML;
}

/**
 * React hook that sanitizes untrusted HTML with memoization.
 */
export function useSanitizedHtml(untrustedHtml: string, config?: SanitizeConfig): string {
  return React.useMemo(() => {
    return sanitizeHtml(untrustedHtml, config);
  }, [untrustedHtml, config]);
}

export interface SanitizedHtmlProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
  config?: SanitizeConfig;
}

/**
 * Accessible React component for securely rendering untrusted rich text markup.
 */
export const SanitizedHtml = React.forwardRef<HTMLDivElement, SanitizedHtmlProps>(
  ({ html, config, className, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (containerRef.current) {
        safeSetHtml(containerRef.current, html, config);
      }
    }, [html, config]);

    return React.createElement('div', {
      ref: containerRef,
      className,
      ...props,
    });
  }
);
SanitizedHtml.displayName = 'SanitizedHtml';
