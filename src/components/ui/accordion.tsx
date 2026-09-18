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
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  )
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <BaseAccordion.Header className="flex">
      <BaseAccordion.Trigger
        ref={ref}
        className={cn(
          'flex items-center justify-between w-full py-4 px-2 min-h-[48px] font-heading text-base font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md',
          className
        )}
        {...props}
      >
        {children}
        <span
          className="material-symbols-outlined text-2xl text-on-surface-variant group-data-[panel-open]:rotate-180 group-data-[state=open]:rotate-180 transition-transform duration-150 ease-out"
          aria-hidden="true"
        >
          expand_more
        </span>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionPanelProps extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel> {
  children?: React.ReactNode;
  className?: string;
}

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, className, ...props }, ref) => (
    <BaseAccordion.Panel
      ref={ref}
      className="overflow-hidden h-[var(--accordion-panel-height)] transition-[height] duration-150 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
      {...props}
    >
      <div className={cn('px-2 pb-4 font-sans text-base text-on-surface-variant leading-relaxed', className)}>
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
  defaultValue?: string | string[];
  onValueChange?: (value: any) => void;
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
    (val: any[], eventDetails: any) => {
      if (onValueChange) {
        if (!isMultiple && type === 'single') {
          onValueChange(val[val.length - 1] ?? '');
        } else {
          onValueChange(val);
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
        level === 2 && 'p-4 rounded-[1rem] bg-surface-container border-none shadow-ambient',
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
              <AccordionTrigger>{item.title}</AccordionTrigger>
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
  Header: BaseAccordion.Header,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Content: AccordionContent,
});

// Re-export Base UI primitives for compound composition
export { BaseAccordion };
export const AccordionRoot = AccordionComponent;
export const AccordionItemPrimitive = BaseAccordion.Item;
export const AccordionHeader = BaseAccordion.Header;
export const AccordionTriggerPrimitive = BaseAccordion.Trigger;
export const AccordionPanelPrimitive = BaseAccordion.Panel;
export default Accordion;
