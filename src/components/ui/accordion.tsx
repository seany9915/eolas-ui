import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

// Retain alias for backwards compatibility
export type AccordionItem = AccordionItemData;

export interface AccordionProps {
  items?: AccordionItemData[];
  level?: 1 | 2;
  value?: string | string[] | null;
  defaultValue?: string | string[];
  onValueChange?: (value: any) => void;
  multiple?: boolean;
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
  defaultValue = [],
  onValueChange,
  multiple,
  orientation,
  loopFocus,
  disabled,
  hiddenUntilFound,
  keepMounted,
  children,
  className,
}) => {
  return (
    <BaseAccordion.Root
      value={value as any}
      defaultValue={defaultValue as any}
      onValueChange={onValueChange}
      multiple={multiple}
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
              <BaseAccordion.Header className="flex">
                <BaseAccordion.Trigger className="flex items-center justify-between w-full py-4 px-2 min-h-[48px] font-heading text-base font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md">
                  <span>{item.title}</span>
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant group-data-[panel-open]:rotate-180 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)]" aria-hidden="true">
                    expand_more
                  </span>
                </BaseAccordion.Trigger>
              </BaseAccordion.Header>
              <BaseAccordion.Panel className="px-2 pb-4 font-sans text-base text-on-surface-variant leading-relaxed overflow-hidden h-[var(--accordion-panel-height)] transition-[height,opacity] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] data-[starting-style]:h-0 data-[ending-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
                {item.content}
              </BaseAccordion.Panel>
            </BaseAccordion.Item>
          ))}
    </BaseAccordion.Root>
  );
};

// Compound export mapping Base UI primitives
export const Accordion = Object.assign(AccordionComponent, {
  Root: BaseAccordion.Root,
  Item: BaseAccordion.Item,
  Header: BaseAccordion.Header,
  Trigger: BaseAccordion.Trigger,
  Panel: BaseAccordion.Panel,
});

// Re-export Base UI primitives for compound composition
export { BaseAccordion };
export const AccordionRoot = BaseAccordion.Root;
export const AccordionItemPrimitive = BaseAccordion.Item;
export const AccordionHeader = BaseAccordion.Header;
export const AccordionTrigger = BaseAccordion.Trigger;
export const AccordionPanel = BaseAccordion.Panel;

