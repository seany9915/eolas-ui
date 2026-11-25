'use client';

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
  'href', 'title', 'target', 'rel', 'class', 'aria-label', 'aria-describedby',
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

const URL_ATTRIBUTES = new Set([
  'href',
  'src',
  'srcset',
  'background',
  'xlink:href',
  'formaction',
  'action',
  'cite',
  'poster',
]);
const ALLOWED_URL_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const SAFE_DATA_IMAGE_RE = /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i;

function stripControlsAndWhitespace(rawValue: string): string {
  let out = '';
  for (let i = 0; i < rawValue.length; i++) {
    const code = rawValue.charCodeAt(i);
    if (code <= 0x20 || code === 0x7f || /\s/.test(rawValue[i])) continue;
    out += rawValue[i];
  }
  return out;
}

function isDangerousUrl(rawValue: string): boolean {
  const normalized = stripControlsAndWhitespace(rawValue);
  if (!normalized) return false;
  if (normalized.startsWith('//') || normalized.startsWith('/\\') || normalized.startsWith('\\')) {
    return true;
  }

  if (
    normalized.startsWith('/') ||
    normalized.startsWith('./') ||
    normalized.startsWith('../') ||
    normalized.startsWith('#') ||
    normalized.startsWith('?')
  ) {
    return false;
  }

  const beforeDelimiter = normalized.split(/[/?#]/, 1)[0];
  const colonIdx = beforeDelimiter.indexOf(':');
  if (colonIdx === -1) return false;

  const scheme = beforeDelimiter.slice(0, colonIdx + 1).toLowerCase();
  if (ALLOWED_URL_SCHEMES.has(scheme)) return false;
  if (scheme === 'data:' && SAFE_DATA_IMAGE_RE.test(normalized)) return false;
  return true;
}

function isDangerousSrcset(rawValue: string): boolean {
  const trimmed = rawValue.trim();
  if (!trimmed) return false;
  // Split candidates on commas that do not separate base64 data URI headers from payloads
  const candidates = trimmed.split(/(?<!;base64),/);
  return candidates.some((candidate) => {
    const urlPart = candidate.trim().split(/\s+/)[0] ?? '';
    return isDangerousUrl(urlPart);
  });
}

function enforceBlankTargetRel(root: ParentNode): void {
  const elements = root.querySelectorAll('[target]');
  for (const el of elements) {
    if (el.getAttribute('target')?.trim().toLowerCase() === '_blank') {
      const existing = (el.getAttribute('rel') ?? '')
        .split(/\s+/)
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);
      const relSet = new Set(existing);
      relSet.add('noopener');
      relSet.add('noreferrer');
      el.setAttribute('rel', Array.from(relSet).join(' '));
    }
  }
}

/**
 * Fallback sanitizer for environments where Element.setHTML() is not yet supported.
 * Strips active scripting elements, inline event handlers, and unsafe URL protocols,
 * returning a live DocumentFragment so nodes can be inserted via replaceChildren()
 * without re-serializing through innerHTML (preventing mXSS and Trusted Types errors).
 */
function fallbackSanitizeToFragment(html: string, config: SanitizeConfig = {}): DocumentFragment {
  const fragment = document.createDocumentFragment();
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

        // Strip dangerous script, style, iframe, and embedded plugin tags unconditionally
        if (tagName === 'script' || tagName === 'style' || tagName === 'iframe' || tagName === 'object' || tagName === 'embed') {
          node.removeChild(el);
          continue;
        }

        if (replaceChildren.has(tagName)) {
          // Sanitize descendants first so disallowed child elements inside wrappers are stripped before hoisting
          cleanNode(el);
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          node.removeChild(el);
          continue;
        }

        if (!allowedTags.has(tagName)) {
          node.removeChild(el);
          continue;
        }

        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();

          const isUnsafeUrlAttr =
            URL_ATTRIBUTES.has(attrName) &&
            (attrName === 'srcset' ? isDangerousSrcset(attr.value) : isDangerousUrl(attr.value));

          if (attrName.startsWith('on') || !allowedAttrs.has(attrName) || isUnsafeUrlAttr) {
            el.removeAttribute(attr.name);
          }
        }

        if (el.getAttribute('target')?.trim().toLowerCase() === '_blank') {
          const existing = (el.getAttribute('rel') ?? '')
            .split(/\s+/)
            .map((token) => token.trim().toLowerCase())
            .filter(Boolean);
          const relSet = new Set(existing);
          relSet.add('noopener');
          relSet.add('noreferrer');
          el.setAttribute('rel', Array.from(relSet).join(' '));
        }

        cleanNode(el);

        if (tagName === 'template' && 'content' in el) {
          cleanNode((el as HTMLTemplateElement).content);
        }
      }
    }
  }

  cleanNode(doc.body);
  while (doc.body.firstChild) {
    fragment.appendChild(document.adoptNode(doc.body.firstChild));
  }
  return fragment;
}

/**
 * Safely inserts untrusted HTML into a container element using the native Sanitizer API
 * when supported, falling back to a hardened DOMParser fragment inserted via replaceChildren().
 */
export function safeSetHtml(
  element: HTMLElement,
  untrustedHtml: string,
  config: SanitizeConfig = {}
): void {
  const rawElements = config.elements || DEFAULT_ALLOWED_ELEMENTS;
  const attributes = config.attributes || DEFAULT_ALLOWED_ATTRIBUTES;
  const replaceList = config.replaceWithChildrenElements;
  const replaceSet = replaceList ? new Set(replaceList.map((t) => t.toLowerCase())) : null;
  const elements = replaceSet
    ? rawElements.filter((t) => !replaceSet.has(t.toLowerCase()))
    : rawElements;

  if (
    typeof Element !== 'undefined' &&
    'setHTML' in Element.prototype &&
    typeof element.setHTML === 'function'
  ) {
    try {
      element.setHTML(untrustedHtml, {
        sanitizer: {
          elements,
          attributes,
          replaceWithChildrenElements: replaceList,
        },
      });
      enforceBlankTargetRel(element);
      return;
    } catch {
      // If native Sanitizer throws due to experimental config variance, fall through
    }
  }

  // Fallback: move sanitized nodes directly into a DocumentFragment without innerHTML assignment
  const fragment = fallbackSanitizeToFragment(untrustedHtml, config);
  element.replaceChildren(fragment);
}

function escapeHtmlEntities(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes an untrusted HTML string into clean, safe HTML markup.
 * Rich HTML sanitization requires a browser DOM; in non-DOM SSR environments this
 * safely HTML-escapes the raw input string rather than attempting regex tag stripping.
 * Prefer `<SanitizedHtml />` for SSR-safe rich HTML rendering.
 */
export function sanitizeHtml(untrustedHtml: string, config: SanitizeConfig = {}): string {
  if (typeof document === 'undefined') {
    return escapeHtmlEntities(untrustedHtml);
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
