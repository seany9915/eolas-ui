'use client';

/**
 * Keyboard key primitive (Kbd).
 *
 * Aligned with shadcn/ui and Base UI ecosystem patterns:
 * https://ui.shadcn.com/docs/components/base/kbd
 *
 * TAXONOMY & USAGE:
 * - Use Kbd to visually represent keyboard keys, hotkeys, and shortcut combinations (e.g. ⌘K, Ctrl+B).
 * - Use KbdGroup to compose multiple keycaps together without line breaks.
 * - Ideal for embedding in buttons, command palettes, menus, and tooltips.
 * - Follows DESIGN.md tokens: Roboto Mono font (font-mono), surface-container wash,
 *   subtle outline-variant border, and strict semantic tokens.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';

export type KbdVariant = 'default' | 'outline' | 'ghost';
export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdVariantsProps {
  variant?: KbdVariant;
  size?: KbdSize;
  className?: string;
}

const variantStyles: Record<KbdVariant, string> = {
  default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant shadow-ambient',
  outline: 'bg-surface text-on-surface border border-outline shadow-ambient',
  ghost: 'bg-transparent text-on-surface-variant border-transparent',
};

const sizeStyles: Record<KbdSize, string> = {
  sm: 'h-4 min-w-4 px-1 text-xs rounded-sm',
  md: 'h-5 min-w-5 px-1.5 text-xs rounded-sm',
  lg: 'h-6 min-w-6 px-2 text-sm rounded-md',
};

export function kbdVariants({
  variant = 'default',
  size = 'md',
  className,
}: KbdVariantsProps = {}): string {
  return cn(
    'pointer-events-none inline-flex items-center justify-center gap-1 select-none font-mono font-medium leading-none align-middle',
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.md,
    className
  );
}

export function detectMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.platform || navigator.userAgent || '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

const KEY_SYMBOL_MAP_MAC: Record<string, string> = {
  mod: '⌘',
  meta: '⌘',
  cmd: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  esc: 'Esc',
  escape: 'Esc',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const KEY_SYMBOL_MAP_OTHER: Record<string, string> = {
  mod: 'Ctrl',
  meta: 'Win',
  cmd: 'Win',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  enter: 'Enter',
  return: 'Enter',
  backspace: 'Backspace',
  delete: 'Del',
  esc: 'Esc',
  escape: 'Esc',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

/**
 * Formats a normalized shortcut string (e.g. "mod+k", "mod+shift+p") into platform-appropriate key tokens.
 */
export function formatShortcut(
  shortcut: string,
  platform?: 'mac' | 'other'
): string[] {
  const isMac = platform ? platform === 'mac' : detectMacPlatform();
  const map = isMac ? KEY_SYMBOL_MAP_MAC : KEY_SYMBOL_MAP_OTHER;

  return shortcut
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (map[lower]) return map[lower];
      return part.length === 1 ? part.toUpperCase() : part;
    });
}

/**
 * Converts a normalized shortcut string (e.g. "mod+k") into a WAI-ARIA `aria-keyshortcuts` value.
 */
export function toAriaKeyShortcuts(
  shortcut: string,
  platform?: 'mac' | 'other'
): string {
  const isMac = platform ? platform === 'mac' : detectMacPlatform();
  return shortcut
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === 'mod') return isMac ? 'Meta' : 'Control';
      if (lower === 'meta' || lower === 'cmd') return 'Meta';
      if (lower === 'ctrl' || lower === 'control') return 'Control';
      if (lower === 'alt' || lower === 'option') return 'Alt';
      if (lower === 'shift') return 'Shift';
      return part.length === 1 ? part.toUpperCase() : part;
    })
    .join('+');
}

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    KbdVariantsProps {
  /**
   * Normalized shortcut string (e.g. "mod+k", "mod+enter") formatted per platform when `children` is omitted.
   */
  shortcut?: string;
  /**
   * Explicit platform override for deterministic rendering in SSR or previews.
   */
  platform?: 'mac' | 'other';
  /**
   * Base UI polymorphic render slot or custom JSX element.
   */
  render?: useRender.RenderProp;
}

const subscribeNoop = () => () => {};
const getServerIsMac = () => false;

function useIsMacPlatform(platform?: 'mac' | 'other'): boolean {
  const detectedIsMac = React.useSyncExternalStore(
    subscribeNoop,
    detectMacPlatform,
    getServerIsMac
  );
  return platform ? platform === 'mac' : detectedIsMac;
}

const KbdComponent = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant = 'default', size = 'md', shortcut, platform, render, children, ...props }, ref) => {
    const computedClass = kbdVariants({ variant, size, className });
    const isMac = useIsMacPlatform(platform);
    const resolvedPlatform: 'mac' | 'other' = isMac ? 'mac' : 'other';
    const resolvedChildren =
      children ?? (shortcut ? formatShortcut(shortcut, resolvedPlatform).join(isMac ? '' : '+') : undefined);

    return useRender({
      render,
      ref,
      defaultTagName: 'kbd',
      props: {
        'data-slot': 'kbd',
        className: computedClass,
        children: resolvedChildren,
        ...props,
      },
    });
  }
);
KbdComponent.displayName = 'Kbd';

export interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Base UI polymorphic render slot.
   */
  render?: useRender.RenderProp;
}

export const KbdGroup = React.forwardRef<HTMLDivElement, KbdGroupProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'kbd-group',
        className: cn('inline-flex items-center gap-1', className),
        children,
        ...props,
      },
    });
  }
);
KbdGroup.displayName = 'KbdGroup';

export const Kbd = Object.assign(KbdComponent, {
  Group: KbdGroup,
});

export default Kbd;
