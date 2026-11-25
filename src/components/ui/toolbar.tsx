'use client';

/**
 * Toolbar primitive (@base-ui/react/toolbar).
 *
 * Base UI Documentation: https://base-ui.com/react/components/toolbar
 *
 * WAI-ARIA Role: role="toolbar"
 * Primary Purpose: Group of controls navigable with arrow keys under a SINGLE tab stop.
 *
 * TAXONOMY & USAGE GUIDELINES:
 * - USE THIS: In rich-text formatting strips, media audio/playback bars, or canvas editing palettes
 *   where controls remain permanently visible and interactive under roving keyboard focus.
 * - DO NOT USE:
 *   - For hierarchical application command menus (File, Edit, View) -> Use <Menubar>.
 *   - For site navigation links -> Use <NavigationMenu>.
 *   - For standalone action dropdowns -> Use <Menu>.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { Tooltip } from './tooltip';
import { Icon } from './icon';
import { cn, composeClassName } from '@/lib/utils';

interface ToolbarContextValue {
  orientation: 'horizontal' | 'vertical';
}

const ToolbarContext = React.createContext<ToolbarContextValue>({
  orientation: 'horizontal',
});

export type ToolbarVariant = 'default' | 'ghost';

export interface ToolbarRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Root> {
  /** Visual chrome: `'default'` renders a bordered surface strip; `'ghost'` removes background, border, and padding for embedding inside headers/cards. */
  variant?: ToolbarVariant;
  children?: React.ReactNode;
}

export const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'default',
      loopFocus = true,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ToolbarContext.Provider value={{ orientation }}>
        <BaseToolbar.Root
          ref={ref}
          data-slot="toolbar"
          data-variant={variant}
          orientation={orientation}
          loopFocus={loopFocus}
          disabled={disabled}
          className={composeClassName(
            cn(
              'flex items-center gap-1.5 w-max max-w-full overflow-x-auto scrollbar-none select-none',
              variant === 'ghost'
                ? 'p-1 -m-1 rounded-none bg-transparent border-0'
                : 'p-1.5 rounded-lg bg-surface border border-outline-variant',
              orientation === 'vertical' && 'flex-col items-stretch overflow-x-visible'
            ),
            className
          )}
          {...props}
        >
          {children}
        </BaseToolbar.Root>
      </ToolbarContext.Provider>
    );
  }
);
ToolbarRoot.displayName = 'ToolbarRoot';

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Button> {
  active?: boolean;
  tooltip?: React.ReactNode;
  icon?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      active,
      tooltip,
      icon,
      size = 'md',
      disabled = false,
      focusableWhenDisabled = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ToolbarContext);

    const sizeClasses: Record<'sm' | 'md' | 'lg' | 'icon', string> = {
      sm: 'h-11 min-w-11 px-2.5 gap-1.5 text-xs',
      md: 'h-11 min-w-11 px-2.5 gap-1.5 text-sm',
      lg: 'h-12 min-w-12 px-3 gap-2 text-base',
      icon: 'size-11 min-w-[44px] min-h-[44px] p-0',
    };

    const button = (
      <BaseToolbar.Button
        ref={ref}
        data-slot="toolbar-button"
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        aria-pressed={active !== undefined ? active : undefined}
        className={composeClassName(
          cn(
            'rounded-sm flex shrink-0 whitespace-nowrap items-center justify-center font-label font-semibold cursor-pointer select-none',
            'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
            'active:scale-[var(--scale-small)] motion-reduce:transform-none motion-reduce:transition-none',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
            sizeClasses[size],
            active
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface',
            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
          ),
          className
        )}
        {...props}
      >
        {icon && <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />}
        {children}
      </BaseToolbar.Button>
    );

    if (tooltip) {
      return (
        <Tooltip
          content={tooltip}
          disabled={disabled}
          side={context.orientation === 'vertical' ? 'inline-end' : 'top'}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);
ToolbarButton.displayName = 'ToolbarButton';

export interface ToolbarGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Group> {}

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, disabled = false, ...props }, ref) => {
    const context = React.useContext(ToolbarContext);
    return (
      <BaseToolbar.Group
        ref={ref}
        data-slot="toolbar-group"
        disabled={disabled}
        className={composeClassName(
          cn(
            'flex items-center gap-1',
            context.orientation === 'vertical' && 'flex-col items-stretch'
          ),
          className
        )}
        {...props}
      >
        {children}
      </BaseToolbar.Group>
    );
  }
);
ToolbarGroup.displayName = 'ToolbarGroup';

export interface ToolbarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator> {}

export const ToolbarSeparator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ orientation, className, ...props }, ref) => {
    const context = React.useContext(ToolbarContext);
    const effectiveOrientation =
      orientation ?? (context.orientation === 'horizontal' ? 'vertical' : 'horizontal');

    return (
      <BaseToolbar.Separator
        ref={ref}
        data-slot="toolbar-separator"
        orientation={effectiveOrientation}
        className={composeClassName(
          effectiveOrientation === 'vertical'
            ? 'w-px h-6 my-auto mx-1 bg-outline-variant/80 shrink-0'
            : 'h-px w-6 mx-auto my-1 bg-outline-variant/80 shrink-0',
          className
        )}
        {...props}
      />
    );
  }
);
ToolbarSeparator.displayName = 'ToolbarSeparator';

export interface ToolbarLinkProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Link> {
  size?: 'sm' | 'md' | 'lg';
}

export const ToolbarLink = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-11 px-3 min-w-11 min-h-11 text-xs',
      md: 'h-11 px-3 min-w-11 min-h-11 text-sm',
      lg: 'h-12 px-4 min-w-12 min-h-12 text-base',
    }[size];

    return (
      <BaseToolbar.Link
        ref={ref}
        data-slot="toolbar-link"
        className={composeClassName(
          cn(
            'inline-flex shrink-0 whitespace-nowrap items-center justify-center rounded-sm font-label font-semibold text-on-surface-variant hover:text-on-surface hover:bg-state-hover select-none',
            'transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-quick)] motion-reduce:transition-none',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
            sizeClasses
          ),
          className
        )}
        {...props}
      >
        {children}
      </BaseToolbar.Link>
    );
  }
);
ToolbarLink.displayName = 'ToolbarLink';

export interface ToolbarInputProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Input> {}

export const ToolbarInput = React.forwardRef<HTMLInputElement, ToolbarInputProps>(
  ({ disabled = false, focusableWhenDisabled = true, className, ...props }, ref) => {
    return (
      <BaseToolbar.Input
        ref={ref}
        data-slot="toolbar-input"
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        className={composeClassName(
          cn(
            'h-11 min-h-11 min-w-0 max-w-full px-3 rounded bg-surface border border-outline text-sm font-sans text-on-surface placeholder:text-on-surface-variant/80 transition-[border-color,outline-color] duration-[var(--duration-quick)] motion-reduce:transition-none',
            'focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
          ),
          className
        )}
        {...props}
      />
    );
  }
);
ToolbarInput.displayName = 'ToolbarInput';

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: React.ReactNode;
}

export interface ToolbarProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Root> {
  variant?: ToolbarVariant;
  actions?: ToolbarAction[];
  children?: React.ReactNode;
}

const ToolbarComponent = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      actions,
      variant = 'default',
      orientation = 'horizontal',
      loopFocus = true,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <ToolbarRoot
        ref={ref}
        variant={variant}
        orientation={orientation}
        loopFocus={loopFocus}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children
          ? children
          : actions?.map((act) => (
              <ToolbarButton
                key={act.id}
                size="icon"
                onClick={act.action}
                disabled={act.disabled}
                aria-label={act.label}
                active={act.active}
                tooltip={act.tooltip ?? act.label}
                icon={act.icon}
              />
            ))}
      </ToolbarRoot>
    );
  }
);
ToolbarComponent.displayName = 'Toolbar';

// Compound export mapping Base UI primitives & wrappers
export const Toolbar = Object.assign(ToolbarComponent, {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  Input: ToolbarInput,
});

// Re-export Base UI primitives for compound composition
export { BaseToolbar };
export default Toolbar;
