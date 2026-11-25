'use client';

/**
 * ButtonGroup primitive.
 *
 * Base UI Integration: Pure design token & Base UI companion primitive.
 * Specification & Reference: https://ui.shadcn.com/docs/components/base/button-group
 *
 * TAXONOMY & USAGE:
 * - A container to group related buttons, segmented actions, and inputs with fused borders and shared geometry.
 * - Resolves double-border artifacts via child border-overlap selectors while ensuring focus rings
 *   stay visible with proper stacking context (focus-visible:z-20).
 * - Fuses concentric border radii: rounds outer corners while flattening adjacent internal edges.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   and WCAG 2.2 touch target compliance.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn, composeClassName } from '@/lib/utils';
import { Separator } from './separator';

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
                  'flex-row max-w-full overflow-x-auto scrollbar-none p-1 -m-1 [&>*:not(:first-child)]:-ms-px [&>*[class*="border-2"]:not(:first-child)]:-ms-0.5',
                  // Allow wrapper children (e.g. Input) to shrink without overriding explicit caller widths
                  '[&>[data-slot=input-wrapper]]:min-w-0',
                  // Horizontal fused edges: collapse inner corners while preserving outer radius (including wrapped Input)
                  '[&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)_[data-slot=input]]:rounded-s-none',
                  '[&>*:not(:last-child)]:rounded-e-none [&>*:not(:last-child)_[data-slot=input]]:rounded-e-none',
                ]
              : [
                  'flex-col [&>*:not(:first-child)]:-mt-px [&>*[class*="border-2"]:not(:first-child)]:-mt-0.5',
                  // Vertical fused edges: collapse inner corners while preserving outer radius (including wrapped Input)
                  '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)_[data-slot=input]]:rounded-t-none',
                  '[&>*:not(:last-child)]:rounded-b-none [&>*:not(:last-child)_[data-slot=input]]:rounded-b-none',
                ],
            // Elevation and focus stacking so floating 2px outlines are never clipped
            '[&>*]:relative',
            '[&>*:hover]:z-10',
            '[&>*:focus-visible]:z-20',
            '[&>*:focus-within]:z-20',
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
export interface ButtonGroupSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof Separator> {
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  ({ className, orientation: orientationProp, decorative = false, ...props }, ref) => {
    const context = React.useContext(ButtonGroupContext);
    const resolvedOrientation =
      orientationProp ?? (context.orientation === 'horizontal' ? 'vertical' : 'horizontal');

    return (
      <Separator
        ref={ref}
        data-slot="button-group-separator"
        orientation={resolvedOrientation}
        decorative={decorative}
        className={composeClassName(
          cn(
            'bg-outline-variant/60 shrink-0 self-center z-10',
            resolvedOrientation === 'vertical' ? 'h-6 w-px mx-0' : 'w-full h-px my-0'
          ),
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
  size?: 'sm' | 'md' | 'lg';
  render?: useRender.RenderProp;
}

const textSizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'min-h-[44px] h-11 px-3 text-xs',
  md: 'min-h-[48px] h-12 px-4 text-sm',
  lg: 'min-h-[56px] h-14 px-5 text-sm',
};

export const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, size = 'md', render, children, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'button-group-text',
        className: cn(
          'flex items-center justify-center rounded font-label font-medium text-on-surface-variant bg-surface-container-low border border-outline select-none',
          textSizeClasses[size],
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
