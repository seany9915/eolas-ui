import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { Tooltip } from './tooltip';
import { cn } from '@/lib/utils';

/**
 * Toolbar Component (Persistent Action Strip & Formatting Controls)
 *
 * WAI-ARIA Role: role="toolbar"
 * Primary Purpose: Group of controls navigable with arrow keys under a SINGLE tab stop.
 *
 * TAXONOMY & USAGE GUIDELINES:
 * - USE THIS: In rich-text formatting strips, media audio/playback bars, or canvas editing palettes where controls remain permanently visible and interactive.
 * - DO NOT USE:
 *   - For hierarchical application command menus (File, Edit, View) -> Use <Menubar>.
 *   - For site navigation links -> Use <NavigationMenu>.
 *   - For standalone action dropdowns -> Use <Menu>.
 */

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: React.ReactNode;
}

export interface ToolbarProps {
  actions?: ToolbarAction[];
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ToolbarComponent = React.forwardRef<HTMLDivElement, ToolbarProps>(({
  actions,
  orientation = 'horizontal',
  loopFocus = true,
  children,
  className,
  ...props
}, ref) => {
  return (
    <BaseToolbar.Root
      ref={ref}
      orientation={orientation}
      loopFocus={loopFocus}
      className={cn(
        'flex items-center gap-1 p-1 rounded bg-surface border border-outline-variant shadow-ambient w-max',
        orientation === 'vertical' && 'flex-col',
        className
      )}
      {...props}
    >
      {children
        ? children
        : actions?.map((act) => (
            <Tooltip
              key={act.id}
              content={act.tooltip ?? act.label}
              disabled={act.disabled}
              side={orientation === 'vertical' ? 'right' : 'top'}
            >
              <BaseToolbar.Button
                onClick={act.action}
                disabled={act.disabled}
                aria-label={act.label}
                aria-pressed={act.active !== undefined ? act.active : undefined}
                className={cn(
                  'w-11 h-11 min-w-[44px] min-h-[44px] rounded-sm flex items-center justify-center transition-colors cursor-pointer select-none',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
                  act.active
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  {act.icon}
                </span>
              </BaseToolbar.Button>
            </Tooltip>
          ))}
    </BaseToolbar.Root>
  );
});

ToolbarComponent.displayName = 'Toolbar';

// Compound export mapping Base UI primitives
export const Toolbar = Object.assign(ToolbarComponent, {
  Root: BaseToolbar.Root,
  Button: BaseToolbar.Button,
  Group: BaseToolbar.Group,
  Separator: BaseToolbar.Separator,
  Link: BaseToolbar.Link,
  Input: BaseToolbar.Input,
});

// Re-export Base UI primitives for compound composition
export { BaseToolbar };
export const ToolbarRoot = BaseToolbar.Root;
export const ToolbarButton = BaseToolbar.Button;
export const ToolbarGroup = BaseToolbar.Group;
export const ToolbarSeparator = BaseToolbar.Separator;
export const ToolbarLink = BaseToolbar.Link;
export const ToolbarInput = BaseToolbar.Input;

