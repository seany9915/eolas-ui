/**
 * NavigationBar primitive (@base-ui/react/button + semantic `<nav>`).
 *
 * Base UI Documentation: https://base-ui.com/react/components/button
 *
 * TAXONOMY & USAGE:
 * - High-frequency mobile bottom navigation bar (3 to 5 primary destinations).
 * - Placed at the bottom edge of mobile and compact viewports for ergonomic thumb reach.
 * - Conforms to DESIGN.md Tier B interactive controls:
 *   - 44x44px minimum touch target per destination (WCAG 2.2 SC 2.5.8).
 *   - Active indicator: soft `bg-primary-container` pill wash with `text-on-primary-container` ink.
 *   - Inactive items: `text-on-surface-variant` with hover lift to `text-on-surface`.
 *   - Floating 2px focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`).
 *   - Semantic navigation status: `aria-current="page"` on the active destination.
 *   - Explicit property transitions (never `transition-all`).
 *   - Mandatory `prefers-reduced-motion: reduce` dampening.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useRender } from '@base-ui/react/use-render';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface NavigationBarContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const NavigationBarContext = React.createContext<NavigationBarContextValue | null>(null);
const NavigationBarItemContext = React.createContext<{ isSelected: boolean }>({ isSelected: false });

export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** When true, fixes the bar to the bottom viewport edge with safe-area padding */
  fixed?: boolean;
  /** Polymorphic Base UI render prop */
  render?: useRender.RenderProp;
}

export const NavigationBarRoot = React.forwardRef<HTMLElement, NavigationBarProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      fixed = false,
      render,
      className,
      children,
      'aria-label': ariaLabel = 'Primary navigation',
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const contextValue = React.useMemo<NavigationBarContextValue>(
      () => ({ value, onValueChange: handleValueChange }),
      [value, handleValueChange]
    );

    const navElement = useRender({
      render,
      ref,
      defaultTagName: 'nav',
      props: {
        'aria-label': ariaLabel,
        'data-slot': 'navigation-bar',
        className: cn(
          'w-full bg-surface border-t border-outline-variant flex items-center justify-evenly gap-1 px-2 py-1.5 select-none z-30',
          fixed ? 'fixed bottom-0 inset-x-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]' : 'relative',
          className
        ),
        children,
        ...props,
      },
    });

    return (
      <NavigationBarContext.Provider value={contextValue}>
        {navElement}
      </NavigationBarContext.Provider>
    );
  }
);
NavigationBarRoot.displayName = 'NavigationBar';

export interface NavigationBarItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'value'> {
  value?: string;
  active?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  badge?: React.ReactNode;
}

export const NavigationBarItem = React.forwardRef<HTMLButtonElement, NavigationBarItemProps>(
  (
    {
      value: itemValue,
      active: activeProp,
      icon,
      label,
      badge,
      className,
      children,
      onClick,
      type,
      render,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(NavigationBarContext);
    const isSelected =
      activeProp !== undefined
        ? activeProp
        : itemValue !== undefined && context?.value !== undefined
        ? context.value === itemValue
        : false;

    const handleClick: React.ComponentPropsWithoutRef<typeof BaseButton>['onClick'] = (event) => {
      onClick?.(event);
      if (itemValue !== undefined) {
        context?.onValueChange?.(itemValue);
      }
    };

    const itemContext = React.useMemo(() => ({ isSelected }), [isSelected]);

    return (
      <NavigationBarItemContext.Provider value={itemContext}>
        <BaseButton
          ref={ref}
          render={render}
          {...(render ? {} : { type: type ?? 'button' })}
          data-slot="navigation-bar-item"
          data-selected={isSelected ? 'true' : undefined}
          aria-current={isSelected ? 'page' : undefined}
          onClick={handleClick}
          className={cn(
            'group relative flex-1 max-w-28 flex flex-col items-center justify-center min-h-11 min-w-11 py-1 px-1.5 rounded-md',
            'cursor-pointer transition-[color,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
            'active:scale-[var(--scale-large)] motion-reduce:active:scale-100 motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            isSelected ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface',
            className
          )}
          {...props}
        >
          {/* Active Pill Indicator for Icon */}
          <div
            data-slot="navigation-bar-indicator"
            className={cn(
              'relative inline-flex items-center justify-center h-8 px-3.5 rounded-full transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
              isSelected
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-transparent text-on-surface-variant group-hover:bg-surface-container'
            )}
          >
            {icon}
            {badge !== undefined && badge !== null && (
              <div className="absolute -top-0.5 -right-2.5 pointer-events-none">
                {typeof badge === 'number' || typeof badge === 'string' ? (
                  <Badge variant="filled" colorRole="primary" size="sm" className="px-1.5 min-w-5 leading-none">
                    {badge}
                  </Badge>
                ) : (
                  badge
                )}
              </div>
            )}
          </div>

          {/* Destination Label */}
          {label !== undefined && label !== null && (
            <NavigationBarLabel>{label}</NavigationBarLabel>
          )}

          {children}
        </BaseButton>
      </NavigationBarItemContext.Provider>
    );
  }
);
NavigationBarItem.displayName = 'NavigationBarItem';

export interface NavigationBarLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  render?: useRender.RenderProp;
}

export const NavigationBarLabel = React.forwardRef<HTMLSpanElement, NavigationBarLabelProps>(
  ({ className, active, render, ...props }, ref) => {
    const itemContext = React.useContext(NavigationBarItemContext);
    const isActive = active ?? itemContext.isSelected;

    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'navigation-bar-label',
        'data-selected': isActive ? 'true' : undefined,
        className: cn(
          'font-sans text-xs font-semibold leading-tight mt-1 tracking-tight truncate max-w-22',
          isActive ? 'text-on-surface' : 'text-on-surface-variant',
          className
        ),
        ...props,
      },
    });
  }
);
NavigationBarLabel.displayName = 'NavigationBarLabel';

export const NavigationBar = Object.assign(NavigationBarRoot, {
  Item: NavigationBarItem,
  Label: NavigationBarLabel,
});

export default NavigationBar;
