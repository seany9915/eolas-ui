/**
 * Accordion primitive (@base-ui/react/accordion).
 *
 * Base UI Documentation: https://base-ui.com/react/components/accordion
 *
 * TAXONOMY & USAGE:
 * - Use Accordion for vertically stacked disclosure panels where one or more
 *   sections can be expanded at a time.
 * - Supports browser in-page search (hiddenUntilFound / hidden="until-found").
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Item> {
  className?: string;
  children?: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, ...props }, ref) => (
    <BaseAccordion.Item
      ref={ref}
      className={cn('w-full border-b border-outline-variant last:border-b-0', className)}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  )
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionHeaderProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Header> {
  className?: string;
  children?: React.ReactNode;
}

export const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <BaseAccordion.Header
      ref={ref}
      className={cn('flex w-full', className)}
      {...props}
    >
      {children}
    </BaseAccordion.Header>
  )
);
AccordionHeader.displayName = 'AccordionHeader';

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> {
  children: React.ReactNode;
  className?: string;
  hideChevron?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, hideChevron = false, ...props }, ref) => (
    <BaseAccordion.Trigger
      ref={ref}
      className={cn(
        'flex items-center justify-between w-full py-4 px-2 min-h-[48px] font-heading text-base font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group rounded-md',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {!hideChevron && (
        <span
          className="material-symbols-outlined text-2xl text-on-surface-variant group-data-[panel-open]:rotate-180 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none select-none shrink-0"
          aria-hidden="true"
        >
          expand_more
        </span>
      )}
    </BaseAccordion.Trigger>
  )
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionPanelProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel> {
  children?: React.ReactNode;
  className?: string;
  unstyled?: boolean;
}

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, className, unstyled = false, ...props }, ref) => (
    <BaseAccordion.Panel
      ref={ref}
      className="overflow-hidden h-[var(--accordion-panel-height)] transition-[height] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
      {...props}
    >
      <div
        className={cn(
          unstyled
            ? ''
            : 'px-2 pb-4 font-sans text-base text-on-surface-variant leading-relaxed',
          className
        )}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  )
);
AccordionPanel.displayName = 'AccordionPanel';

export const AccordionContent = AccordionPanel;
export type AccordionContentProps = AccordionPanelProps;

export interface AccordionProps {
  items?: AccordionItemData[];
  level?: 1 | 2;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[], eventDetails?: BaseAccordion.Root.ChangeEventDetails) => void;
  multiple?: boolean;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loopFocus?: boolean;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const AccordionComponent: React.FC<AccordionProps> = ({
  items,
  level = 1,
  value,
  defaultValue,
  onValueChange,
  multiple,
  type,
  collapsible: _collapsible,
  orientation,
  loopFocus,
  disabled,
  hiddenUntilFound,
  keepMounted,
  children,
  className,
}) => {
  const isMultiple = type ? type === 'multiple' : !!multiple;

  const normalizedValue = React.useMemo(() => {
    if (value === undefined) return undefined;
    if (value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const normalizedDefaultValue = React.useMemo(() => {
    if (defaultValue === undefined) return undefined;
    if (defaultValue === null) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  }, [defaultValue]);

  const handleValueChange = React.useCallback(
    (val: any[], eventDetails: BaseAccordion.Root.ChangeEventDetails) => {
      if (onValueChange) {
        if (!isMultiple && type === 'single') {
          onValueChange(val[val.length - 1] ?? '', eventDetails);
        } else {
          onValueChange(val, eventDetails);
        }
      }
    },
    [onValueChange, isMultiple, type]
  );

  return (
    <BaseAccordion.Root
      value={normalizedValue}
      defaultValue={normalizedDefaultValue}
      onValueChange={handleValueChange}
      multiple={isMultiple}
      orientation={orientation}
      loopFocus={loopFocus}
      disabled={disabled}
      hiddenUntilFound={hiddenUntilFound}
      keepMounted={keepMounted}
      className={cn(
        'w-full',
        level === 2 && 'p-4 rounded-xl bg-surface-container border-none shadow-ambient',
        className
      )}
    >
      {children
        ? children
        : items?.map((item, idx) => (
            <BaseAccordion.Item
              key={item.id}
              value={item.id}
              disabled={item.disabled}
              className={cn(
                'w-full',
                level === 1 && idx < (items?.length ?? 0) - 1 && 'border-b border-outline-variant',
                level === 2 && idx < (items?.length ?? 0) - 1 && 'border-b border-outline-variant/60'
              )}
            >
              <BaseAccordion.Header className="flex">
                <AccordionTrigger>{item.title}</AccordionTrigger>
              </BaseAccordion.Header>
              <AccordionPanel>{item.content}</AccordionPanel>
            </BaseAccordion.Item>
          ))}
    </BaseAccordion.Root>
  );
};

// Compound export mapping Base UI primitives
export const Accordion = Object.assign(AccordionComponent, {
  Root: AccordionComponent,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Content: AccordionContent,
});

// Re-export Base UI primitives for compound composition
export { BaseAccordion };
export const AccordionRoot = AccordionComponent;
export const AccordionItemPrimitive = BaseAccordion.Item;
export const AccordionHeaderPrimitive = BaseAccordion.Header;
export const AccordionTriggerPrimitive = BaseAccordion.Trigger;
export const AccordionPanelPrimitive = BaseAccordion.Panel;
export default Accordion;
