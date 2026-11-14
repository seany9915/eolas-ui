import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface WcagRating {
  ratio: number;
  ratioFormatted: string;
  passAA: boolean;
  passAALarge: boolean;
  passAAA: boolean;
  passAAALarge: boolean;
  rating: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  colorRole: 'success' | 'warning' | 'error';
}

/**
 * Standard Eolas UI design tokens for contrast testing.
 */
export const DESIGN_SYSTEM_COLORS = [
  { name: 'surface', hex: '#FFFFFF', label: 'surface (Elevated Card / Pane)' },
  { name: 'background', hex: '#F2F4F8', label: 'background (Canvas)' },
  { name: 'surface-container-low', hex: '#F2F4F8', label: 'surface-container-low (Inset Pane / Reading Box)' },
  { name: 'surface-container-high', hex: '#E3E6EC', label: 'surface-container-high (Recessed Track / Fill)' },
  { name: 'on-surface', hex: '#1A1C1E', label: 'on-surface (Charcoal Ink)' },
  { name: 'on-surface-variant', hex: '#434656', label: 'on-surface-variant (Secondary Ink)' },
  { name: 'primary', hex: '#0052FF', label: 'primary (Electric Blue)' },
  { name: 'primary-container', hex: '#DCE6FF', label: 'primary-container (Soft Blue)' },
  { name: 'secondary', hex: '#00796B', label: 'secondary (Rich Emerald)' },
  { name: 'secondary-container', hex: '#D5F0EE', label: 'secondary-container (Soft Emerald)' },
  { name: 'tertiary', hex: '#F9A825', label: 'tertiary (Sunny Amber)' },
  { name: 'tertiary-container', hex: '#FFF0C2', label: 'tertiary-container (Soft Amber)' },
  { name: 'error', hex: '#C4161C', label: 'error (Red)' },
  { name: 'error-container', hex: '#FFDAD6', label: 'error-container (Soft Red)' },
  { name: 'warning', hex: '#A64B00', label: 'warning (Burnt Orange)' },
  { name: 'warning-container', hex: '#FDE3B8', label: 'warning-container (Soft Orange)' },
  { name: 'success', hex: '#157331', label: 'success (Deep Green)' },
  { name: 'success-container', hex: '#C8F5CE', label: 'success-container (Soft Green)' },
  { name: 'outline', hex: '#6B6E80', label: 'outline (Control Border)' },
  { name: 'outline-variant', hex: '#BEC6D6', label: 'outline-variant (Subtle Border)' },
];

/**
 * Parse a 3-character, 6-character, or compound hex string into RGB values.
 */
export function parseHex(input: string): RgbColor | null {
  if (!input || typeof input !== 'string') return null;

  // Handle compound strings like '#dce6ff / #1a1c1e' by picking the first valid hex
  const clean = input.trim();
  const hexMatch = clean.match(/#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
    };
  }

  const shortMatch = clean.match(/#?([a-f\d])([a-f\d])([a-f\d])/i);
  if (shortMatch) {
    return {
      r: parseInt(shortMatch[1] + shortMatch[1], 16),
      g: parseInt(shortMatch[2] + shortMatch[2], 16),
      b: parseInt(shortMatch[3] + shortMatch[3], 16),
    };
  }

  return null;
}

/**
 * Calculates relative luminance according to the W3C WCAG 2.1 / 2.2 specification.
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const srgb = val / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates the exact WCAG contrast ratio between two colors (ranging from 1.0 to 21.0).
 */
export function getContrastRatio(colorA: string, colorB: string): number {
  const rgbA = parseHex(colorA);
  const rgbB = parseHex(colorB);

  if (!rgbA || !rgbB) return 1.0;

  const lumA = getRelativeLuminance(rgbA);
  const lumB = getRelativeLuminance(rgbB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Evaluates WCAG 2.1 / 2.2 AA and AAA criteria for normal and large text.
 */
export function getWcagRating(ratio: number): WcagRating {
  const rounded = Math.round(ratio * 10) / 10;
  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3.0;
  const passAAA = ratio >= 7.0;
  const passAAALarge = ratio >= 4.5;

  let rating: WcagRating['rating'] = 'Fail';
  let colorRole: WcagRating['colorRole'] = 'error';

  if (passAAA) {
    rating = 'AAA';
    colorRole = 'success';
  } else if (passAA) {
    rating = 'AA';
    colorRole = 'success';
  } else if (passAALarge) {
    rating = 'AA Large';
    colorRole = 'warning';
  }

  return {
    ratio,
    ratioFormatted: `${rounded.toFixed(1)}:1`,
    passAA,
    passAALarge,
    passAAA,
    passAAALarge,
    rating,
    colorRole,
  };
}

export interface ColorPairProps {
  name: string;
  foreground: string;
  background: string;
  bgClass?: string;
  usage?: string;
  className?: string;
}

/**
 * ColorPair Component: Dynamically calculates the WCAG luminance ratio
 * between background and foreground tokens in real time, visually flagging any combination.
 */
export const ColorPair: React.FC<ColorPairProps> = ({
  name,
  foreground,
  background,
  bgClass = 'bg-surface text-on-surface border border-outline-variant',
  usage,
  className,
}) => {
  const ratio = React.useMemo(() => getContrastRatio(foreground, background), [foreground, background]);
  const wcag = React.useMemo(() => getWcagRating(ratio), [ratio]);

  return (
    <Card variant="default" className={cn('h-full flex flex-col justify-between space-y-4', className)}>
      <div className="space-y-3">
        {/* Dynamic Visual Swatch */}
        <div className={cn('h-14 px-4 rounded flex items-center justify-between font-mono text-xs shadow-xs', bgClass)}>
          <span className="font-bold truncate pr-2">{name}</span>
          <span className="shrink-0">{background}</span>
        </div>

        {usage && <p className="font-sans text-xs text-on-surface leading-relaxed">{usage}</p>}
      </div>

      {/* Dynamic Live Contrast & WCAG Compliance Status */}
      <div className="flex items-center justify-between text-xs font-label text-on-surface-variant border-t border-outline-variant/60 pt-2 shrink-0">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-on-surface font-semibold">{wcag.ratioFormatted}</span>
          <span className="text-on-surface-variant">contrast</span>
        </div>

        <div className="flex items-center gap-1">
          {wcag.passAA ? (
            <Badge variant="soft" colorRole={wcag.colorRole} size="sm">
              <Icon name="check_circle" size="xs" className="mr-1 text-success" />
              {wcag.rating} Pass
            </Badge>
          ) : wcag.passAALarge ? (
            <Badge variant="soft" colorRole="warning" size="sm">
              <Icon name="warning" size="xs" className="mr-1 text-warning" />
              AA Large Only
            </Badge>
          ) : (
            <Badge variant="soft" colorRole="error" size="sm">
              <Icon name="cancel" size="xs" className="mr-1 text-error" />
              Fails 4.5:1 AA
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Interactive Workbench Tool: Allows testing arbitrary foreground and background colors live in the browser.
 */
export const InteractiveColorPairChecker: React.FC = () => {
  const [fg, setFg] = React.useState('#1A1C1E');
  const [bg, setBg] = React.useState('#FFFFFF');

  const ratio = React.useMemo(() => getContrastRatio(fg, bg), [fg, bg]);
  const wcag = React.useMemo(() => getWcagRating(ratio), [ratio]);

  const selectOptions = React.useMemo(
    () =>
      DESIGN_SYSTEM_COLORS.map((c) => ({
        value: c.hex,
        label: `${c.label} (${c.hex})`,
      })),
    []
  );

  return (
    <Card variant="default" className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant pb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
            <Icon name="contrast" size="sm" className="text-primary" />
            Live WCAG Luminance Contrast Checker
          </h3>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            Test any foreground text on background token pair in real-time according to WCAG 2.1 / 2.2 algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="filled" colorRole={wcag.colorRole} size="md">
            {wcag.ratioFormatted}
          </Badge>
          <Badge variant="outline" colorRole={wcag.colorRole} size="md">
            {wcag.rating}
          </Badge>
        </div>
      </div>

      {/* Inputs for FG and BG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-label text-xs font-semibold text-on-surface">Foreground (Text Ink)</label>
          <div className="flex gap-2">
            <Input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              placeholder="#1A1C1E"
              size="sm"
              className="font-mono"
            />
            <div className="w-10 h-10 rounded border border-outline shrink-0 shadow-xs" style={{ backgroundColor: fg }} />
          </div>
          <Select
            placeholder="Select a token..."
            options={selectOptions}
            value={fg}
            onChange={(val) => val && setFg(val)}
          />
        </div>

        <div className="space-y-2">
          <label className="font-label text-xs font-semibold text-on-surface">Background (Surface Fill)</label>
          <div className="flex gap-2">
            <Input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              placeholder="#FFFFFF"
              size="sm"
              className="font-mono"
            />
            <div className="w-10 h-10 rounded border border-outline shrink-0 shadow-xs" style={{ backgroundColor: bg }} />
          </div>
          <Select
            placeholder="Select a token..."
            options={selectOptions}
            value={bg}
            onChange={(val) => val && setBg(val)}
          />
        </div>
      </div>

      {/* Live Rendered Preview Sample */}
      <div
        className="p-6 rounded-lg border border-outline-variant space-y-2 transition-colors shadow-xs"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p className="font-heading text-lg font-bold">
          Headline Sample ({wcag.passAALarge ? 'Passed AA 3.0:1' : 'Failed 3.0:1'})
        </p>
        <p className="font-sans text-sm leading-relaxed">
          Body text sample. Medical records, patient indicators, and clinical advice must strictly comply with WCAG 2.2 Level AA contrast requirements (minimum 4.5:1 ratio).
        </p>
      </div>

      {/* WCAG Criteria Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-label">
        <div className={cn('p-3 rounded border flex flex-col gap-1', wcag.passAA ? 'bg-success-container/30 border-success/40' : 'bg-error-container/30 border-error/40')}>
          <span className="text-on-surface-variant">WCAG AA Normal</span>
          <span className="font-bold text-on-surface flex items-center gap-1">
            <Icon name={wcag.passAA ? 'check_circle' : 'cancel'} size="xs" className={wcag.passAA ? 'text-success' : 'text-error'} />
            {wcag.passAA ? 'Pass (≥ 4.5:1)' : 'Fail (< 4.5:1)'}
          </span>
        </div>

        <div className={cn('p-3 rounded border flex flex-col gap-1', wcag.passAALarge ? 'bg-success-container/30 border-success/40' : 'bg-error-container/30 border-error/40')}>
          <span className="text-on-surface-variant">WCAG AA Large</span>
          <span className="font-bold text-on-surface flex items-center gap-1">
            <Icon name={wcag.passAALarge ? 'check_circle' : 'cancel'} size="xs" className={wcag.passAALarge ? 'text-success' : 'text-error'} />
            {wcag.passAALarge ? 'Pass (≥ 3.0:1)' : 'Fail (< 3.0:1)'}
          </span>
        </div>

        <div className={cn('p-3 rounded border flex flex-col gap-1', wcag.passAAA ? 'bg-success-container/30 border-success/40' : 'bg-neutral-container/30 border-outline-variant')}>
          <span className="text-on-surface-variant">WCAG AAA Normal</span>
          <span className="font-bold text-on-surface flex items-center gap-1">
            <Icon name={wcag.passAAA ? 'check_circle' : 'info'} size="xs" className={wcag.passAAA ? 'text-success' : 'text-on-surface-variant'} />
            {wcag.passAAA ? 'Pass (≥ 7.0:1)' : 'Fail (< 7.0:1)'}
          </span>
        </div>

        <div className={cn('p-3 rounded border flex flex-col gap-1', wcag.passAAALarge ? 'bg-success-container/30 border-success/40' : 'bg-neutral-container/30 border-outline-variant')}>
          <span className="text-on-surface-variant">WCAG AAA Large</span>
          <span className="font-bold text-on-surface flex items-center gap-1">
            <Icon name={wcag.passAAALarge ? 'check_circle' : 'info'} size="xs" className={wcag.passAAALarge ? 'text-success' : 'text-on-surface-variant'} />
            {wcag.passAAALarge ? 'Pass (≥ 4.5:1)' : 'Fail (< 4.5:1)'}
          </span>
        </div>
      </div>
    </Card>
  );
};
