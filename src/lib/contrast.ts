/**
 * Dynamic foreground contrast helper for user-supplied background colors.
 *
 * Platform Reference: Modern Web Guidance (MWG: contrast-color)
 *
 * Pairs with the `.contrast-auto` CSS utility (which uses native `contrast-color(var(--dynamic-bg))`
 * where supported) by providing a lightweight WCAG relative-luminance fallback for older browsers.
 */

function parseRgb(color: string): [number, number, number] | null {
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b];
    }
  }

  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  return null;
}

function linearizeChannel(channel255: number): number {
  const s = channel255 / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Computes a high-contrast fallback text color (`#1a1c1e` or `#ffffff`) for a hex/rgb background.
 * Native `contrast-color(var(--dynamic-bg))` overrides this in supporting browsers via `.contrast-auto`.
 */
export function getContrastInk(backgroundColor: string): string {
  const rgb = parseRgb(backgroundColor);
  if (!rgb) return 'var(--on-surface)';
  const luminance =
    0.2126 * linearizeChannel(rgb[0]) +
    0.7152 * linearizeChannel(rgb[1]) +
    0.0722 * linearizeChannel(rgb[2]);
  return luminance > 0.179 ? '#1a1c1e' : '#ffffff';
}
