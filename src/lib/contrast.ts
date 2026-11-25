/**
 * Dynamic foreground contrast helper for user-supplied background colors.
 *
 * Platform Reference: Modern Web Guidance (MWG: contrast-color)
 *
 * Pairs with the `.contrast-auto` CSS utility (which uses native `contrast-color(var(--dynamic-bg))`
 * where supported) by providing a lightweight WCAG relative-luminance fallback for older browsers.
 */

interface ParsedLinearColor {
  r: number; // linear sRGB [0, 1]
  g: number;
  b: number;
  a: number; // [0, 1]
}

function linearizeSrgbUnit(channel01: number): number {
  const c = Math.min(1, Math.max(0, channel01));
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function parseAlphaToken(raw: string | undefined): number {
  if (!raw) return 1;
  const trimmed = raw.trim();
  const value = trimmed.endsWith('%') ? parseFloat(trimmed) / 100 : parseFloat(trimmed);
  if (!Number.isFinite(value)) return 1;
  return Math.min(1, Math.max(0, value));
}

function parseHueDegrees(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === 'none') return 0;
  const match = trimmed.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(deg|rad|grad|turn)?$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (!Number.isFinite(num)) return null;
  switch (match[2]) {
    case 'rad':
      return (num * 180) / Math.PI;
    case 'grad':
      return num * 0.9;
    case 'turn':
      return num * 360;
    default:
      return num;
  }
}

function parseColorToLinear(color: string): ParsedLinearColor | null {
  const trimmed = color.trim();

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
      if ([r, g, b, a].some(Number.isNaN)) return null;
      return {
        r: linearizeSrgbUnit(r / 255),
        g: linearizeSrgbUnit(g / 255),
        b: linearizeSrgbUnit(b / 255),
        a,
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      if ([r, g, b, a].some(Number.isNaN)) return null;
      return {
        r: linearizeSrgbUnit(r / 255),
        g: linearizeSrgbUnit(g / 255),
        b: linearizeSrgbUnit(b / 255),
        a,
      };
    }
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i
  );
  if (rgbMatch) {
    const parseChannel = (token: string) =>
      token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token) / 255;
    const r = parseChannel(rgbMatch[1]);
    const g = parseChannel(rgbMatch[2]);
    const b = parseChannel(rgbMatch[3]);
    const a = parseAlphaToken(rgbMatch[4]);
    if ([r, g, b].some((n) => !Number.isFinite(n))) return null;
    return {
      r: linearizeSrgbUnit(r),
      g: linearizeSrgbUnit(g),
      b: linearizeSrgbUnit(b),
      a,
    };
  }

  const oklchMatch = trimmed.match(/^oklch\(\s*([^/)]+?)(?:\s*\/\s*([^)]+))?\s*\)$/i);
  if (oklchMatch) {
    const parts = oklchMatch[1].trim().split(/\s+/);
    if (parts.length !== 3) return null;
    const lRaw = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
    const cRaw = parts[1].endsWith('%')
      ? (parseFloat(parts[1]) / 100) * 0.4
      : parseFloat(parts[1]);
    const hDeg = parseHueDegrees(parts[2]);
    if (!Number.isFinite(lRaw) || !Number.isFinite(cRaw) || hDeg === null) return null;

    const L = Math.min(1, Math.max(0, lRaw));
    const C = Math.max(0, cRaw);
    const hRad = (hDeg * Math.PI) / 180;
    const aOklab = C * Math.cos(hRad);
    const bOklab = C * Math.sin(hRad);

    // OKLab -> LMS -> Linear sRGB (CSS Color 4 / Ottosson matrices)
    const l_ = L + 0.3963377774 * aOklab + 0.2158037573 * bOklab;
    const m_ = L - 0.1055613458 * aOklab - 0.0638541728 * bOklab;
    const s_ = L - 0.0894841775 * aOklab - 1.2914855480 * bOklab;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = Math.min(1, Math.max(0, +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
    const g = Math.min(1, Math.max(0, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
    const b = Math.min(1, Math.max(0, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s));

    return {
      r,
      g,
      b,
      a: parseAlphaToken(oklchMatch[2]),
    };
  }

  return null;
}

function linearRelativeLuminance(color: { r: number; g: number; b: number }): number {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

function wcagContrastRatio(l1: number, l2: number): number {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Computes a high-contrast fallback text color (`#1C1A18` or `#ffffff`) for a hex, rgb(a), or oklch background.
 * For translucent colors (`alpha < 1`), pass `backdropColor` to composite against; without a backdrop,
 * translucent colors with `alpha < 0.5` fall back to `'var(--on-surface)'` rather than guessing polarity.
 * Native `contrast-color(var(--dynamic-bg))` overrides this in supporting browsers via `.contrast-auto`.
 */
export function getContrastInk(backgroundColor: string, backdropColor?: string): string {
  const fg = parseColorToLinear(backgroundColor);
  if (!fg) return 'var(--on-surface)';

  let resolved = { r: fg.r, g: fg.g, b: fg.b };
  if (fg.a < 1) {
    const bg = backdropColor ? parseColorToLinear(backdropColor) : null;
    if (bg) {
      resolved = {
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
      };
    } else if (fg.a < 0.5) {
      return 'var(--on-surface)';
    }
  }

  const luminance = linearRelativeLuminance(resolved);
  const darkInkLuminance = linearRelativeLuminance({
    r: linearizeSrgbUnit(28 / 255),
    g: linearizeSrgbUnit(26 / 255),
    b: linearizeSrgbUnit(24 / 255),
  });
  const contrastWithDark = wcagContrastRatio(luminance, darkInkLuminance);
  const contrastWithWhite = wcagContrastRatio(luminance, 1);
  return contrastWithDark >= contrastWithWhite ? '#1C1A18' : '#ffffff';
}
