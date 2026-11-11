/**
 * ButtonGroup primitive.
 *
 * Base UI Integration: Pure design token & Base UI companion primitive.
 * Specification & Reference: https://ui.shadcn.com/docs/components/base/button-group
 *
 * TAXONOMY & USAGE:
 * - A container to group related buttons, segmented actions, and inputs with fused borders and shared geometry.
 * - Resolves double-border artifacts (-space-x-px / -space-y-px) while ensuring focus rings
 *   stay visible with proper stacking context (focus-visible:z-20).
 * - Fuses concentric border radii: rounds outer corners while flattening adjacent internal edges.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 touch target compliance.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const ButtonGroupContext = React.createContext<{ orientation: 'horizontal' | 'vertical' }>({
  orientation: 'horizontal',
});

export const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';

    return (
      <ButtonGroupContext.Provider value={{ orientation }}>
        <div
          ref={ref}
          role="group"
          data-slot="button-group"
          data-orientation={orientation}
          className={cn(
            'inline-flex isolate',
            isHorizontal
              ? [
                  'flex-row -space-x-px',
                  // Horizontal fused edges: collapse inner corners while preserving outer radius
                  '[&>*:not(:first-child)]:rounded-l-none',
                  '[&>*:not(:last-child)]:rounded-r-none',
                ]
              : [
                  'flex-col -space-y-px',
                  // Vertical fused edges: collapse inner corners while preserving outer radius
                  '[&>*:not(:first-child)]:rounded-t-none',
                  '[&>*:not(:last-child)]:rounded-b-none',
                ],
            // Elevation and focus stacking so floating 2px outlines are never clipped
            '[&>*]:relative',
            '[&>*:hover]:z-10',
            '[&>*:focus-visible]:z-20',
            '[&>*:active]:z-10',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroupRoot.displayName = 'ButtonGroup';

/* -------------------------------------------------------------------------------------------------
 * ButtonGroupSeparator
 * -----------------------------------------------------------------------------------------------*/
export interface ButtonGroupSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  ({ className, orientation: orientationProp, ...props }, ref) => {
    const context = React.useContext(ButtonGroupContext);
    const resolvedOrientation = orientationProp ?? (context.orientation === 'horizontal' ? 'vertical' : 'horizontal');

    return (
      <div
        ref={ref}
        role="separator"
        data-slot="button-group-separator"
        aria-orientation={resolvedOrientation}
        className={cn(
          'bg-outline-variant/60 shrink-0 self-center z-10',
          resolvedOrientation === 'vertical' ? 'h-6 w-px' : 'w-full h-px',
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroupSeparator.displayName = 'ButtonGroupSeparator';

/* -------------------------------------------------------------------------------------------------
 * ButtonGroupText
 * -----------------------------------------------------------------------------------------------*/
export interface ButtonGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, render, children, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'button-group-text',
        className: cn(
          'flex items-center justify-center px-3 text-xs font-label font-medium text-on-surface-variant bg-surface-container/60 border border-outline-variant select-none min-h-11',
          className
        ),
        children,
        ...props,
      },
    })
);
ButtonGroupText.displayName = 'ButtonGroupText';

/* -------------------------------------------------------------------------------------------------
 * Compound Object Export
 * -----------------------------------------------------------------------------------------------*/
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
  Text: ButtonGroupText,
});

export default ButtonGroup;
