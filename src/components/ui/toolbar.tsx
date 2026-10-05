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
import { cn } from '@/lib/utils';

interface ToolbarContextValue {
  orientation: 'horizontal' | 'vertical';
}

const ToolbarContext = React.createContext<ToolbarContextValue>({
  orientation: 'horizontal',
});

export interface ToolbarRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Root> {
  children?: React.ReactNode;
}

export const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  (
    {
      orientation = 'horizontal',
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
          orientation={orientation}
          loopFocus={loopFocus}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 p-1.5 rounded-lg bg-surface border border-outline-variant shadow-ambient w-max select-none',
            orientation === 'vertical' && 'flex-col items-stretch',
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
  size?: 'sm' | 'md' | 'lg';
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

    const sizeClasses = {
      sm: 'w-9 h-9 min-w-[36px] min-h-[36px] text-xs',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px] text-sm',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-base',
    }[size];

    const button = (
      <BaseToolbar.Button
        ref={ref}
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        aria-pressed={active !== undefined ? active : undefined}
        className={cn(
          'rounded-sm flex items-center justify-center font-label font-semibold cursor-pointer select-none',
          'transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
          'active:scale-[var(--scale-small)] motion-reduce:transform-none motion-reduce:transition-none',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
          sizeClasses,
          active
            ? 'bg-primary text-on-primary shadow-xs'
            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </BaseToolbar.Button>
    );

    if (tooltip) {
      return (
        <Tooltip
          content={tooltip}
          disabled={disabled}
          side={context.orientation === 'vertical' ? 'right' : 'top'}
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
        disabled={disabled}
        className={cn(
          'flex items-center gap-1',
          context.orientation === 'vertical' && 'flex-col items-stretch',
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
        orientation={effectiveOrientation}
        className={cn(
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
      sm: 'h-9 px-2.5 min-w-[36px] text-xs',
      md: 'h-11 px-3 min-w-[44px] min-h-[44px] text-sm',
      lg: 'h-12 px-4 min-w-[48px] min-h-[48px] text-base',
    }[size];

    return (
      <BaseToolbar.Link
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-label font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container select-none',
          'transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-quick)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
          sizeClasses,
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
        disabled={disabled}
        focusableWhenDisabled={focusableWhenDisabled}
        className={cn(
          'h-9 px-3 rounded-sm bg-surface-container border border-outline-variant text-sm font-sans text-on-surface placeholder:text-on-surface-variant/60',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10',
          'disabled:opacity-40 disabled:cursor-not-allowed',
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

export interface ToolbarProps {
  actions?: ToolbarAction[];
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ToolbarComponent = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      actions,
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
