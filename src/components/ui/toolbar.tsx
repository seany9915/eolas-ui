import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cn } from '@/lib/utils';

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  active?: boolean;
}

export interface ToolbarProps {
  actions?: ToolbarAction[];
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({
  actions,
  orientation = 'horizontal',
  loopFocus = true,
  children,
  className,
}) => {
  return (
    <BaseToolbar.Root
      orientation={orientation}
      loopFocus={loopFocus}
      className={cn(
        'flex items-center gap-1.5 p-1.5 rounded-[0.75rem] bg-surface border border-outline-variant shadow-ambient w-max',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {children
        ? children
        : actions?.map((act) => (
            <BaseToolbar.Button
              key={act.id}
              onClick={act.action}
              aria-label={act.label}
              title={act.label}
              className={cn(
                'w-11 h-11 min-w-[44px] min-h-[44px] rounded-[0.375rem] flex items-center justify-center transition-colors cursor-pointer',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                act.active
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              )}
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                {act.icon}
              </span>
            </BaseToolbar.Button>
          ))}
    </BaseToolbar.Root>
  );
};

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

