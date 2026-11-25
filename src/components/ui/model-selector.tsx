'use client';

/**
 * ModelSelector primitive.
 *
 * Base UI Integration: Consumes Base UI Select and Tooltip primitives.
 * Specification & Reference: https://ui.shadcn.com/docs/ai-elements/base/model-selector
 *
 * TAXONOMY & USAGE:
 * - Use ModelSelector in chat headers, sidebar toolbars, or prompt input footers to let
 *   users dynamically switch the active language model and adjust reasoning/thinking effort.
 * - Conforms to shadcn AI Elements ModelSelector specification and DESIGN.md:
 *   - Compact, high-precision layout with 44x44px accessible touch bounds.
 *   - Clear separation between consumer-provided model items and thinking depth controls.
 *   - Concentric radius, floating 2px focus ring (`outline-offset: 2px`).
 */
import * as React from 'react';
import { Select, type SelectOption } from './select';
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
  createComboboxItems,
  type ComboboxProps,
} from './combobox';
import { Tooltip } from './tooltip';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface ModelItem extends SelectOption {
  description?: string;
  badge?: string;
  icon?: string;
}

export type ThinkingEffort = 'off' | 'low' | 'medium' | 'high';

export type ModelSelectorRootProps<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
> = ComboboxProps<Value, Multiple, Item>;

function ModelSelectorRootInner<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
>(
  { children, className, ...props }: ModelSelectorRootProps<Value, Multiple, Item>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  return (
    <Combobox<Value, Multiple, Item>
      ref={ref}
      data-slot="model-selector-root"
      className={cn('@container flex flex-wrap items-center gap-2 w-full min-w-0 max-w-full', className)}
      {...props}
    >
      {children}
    </Combobox>
  );
}

const ModelSelectorRoot = React.forwardRef(ModelSelectorRootInner) as (<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
>(
  props: ModelSelectorRootProps<Value, Multiple, Item> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element) & { displayName?: string };
ModelSelectorRoot.displayName = 'ModelSelector.Root';

export const EFFORT_OPTIONS: SelectOption[] = [
  { value: 'off', label: 'Thinking: Off' },
  { value: 'low', label: 'Thinking: Low' },
  { value: 'medium', label: 'Thinking: Medium' },
  { value: 'high', label: 'Thinking: High' },
];

export interface ModelSelectorModelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (model: string) => void;
  models?: ModelItem[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorModel = React.forwardRef<HTMLDivElement, ModelSelectorModelProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      models = [],
      disabled = false,
      size = 'sm',
      placeholder = 'Select model',
      className,
      ...props
    },
    ref
  ) => {
    const hasModels = models.length > 0;
    const modelItems = React.useMemo(
      () =>
        createComboboxItems(models, {
          getValue: (item: ModelItem) => item.value,
          getLabel: (item: ModelItem) => item.label,
        }),
      [models]
    );
    const selectedModel = React.useMemo(
      () => models.find((m) => m.value === valueProp),
      [models, valueProp]
    );

    return (
      <div
        ref={ref}
        className={cn('min-w-0 max-w-full flex-1 @xs:flex-none @xs:min-w-36 @sm:min-w-44', className)}
        {...props}
      >
        <Combobox
          items={modelItems}
          value={valueProp}
          defaultValue={defaultValue ?? null}
          onValueChange={(val) => {
            if (val && typeof val === 'string') {
              onValueChange?.(val);
            }
          }}
          disabled={disabled || !hasModels}
        >
          <ComboboxTrigger
            aria-label="Select model"
            size={size}
            className="w-full"
          >
            <ComboboxValue placeholder={hasModels ? placeholder : 'No models available'}>
              {(val) => {
                const match = models.find((m) => m.value === val) ?? selectedModel;
                return match ? match.label : hasModels ? placeholder : 'No models available';
              }}
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxContent className="w-72 max-w-[var(--available-width)]">
            <div className="p-1.5 border-b border-outline-variant/60">
              <ComboboxInput placeholder="Search models..." size="sm" enterKeyHint="search" />
            </div>
            <ComboboxEmpty>No models found.</ComboboxEmpty>
            <ComboboxList>
              {(item: ModelItem) => (
                <ComboboxItem key={item.value} value={item.value} disabled={item.disabled}>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium text-on-surface">{item.label}</span>
                      {item.badge && (
                        <Badge size="sm" variant="soft" colorRole="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-sm text-on-surface-variant truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  }
);
ModelSelectorModel.displayName = 'ModelSelector.Model';

export interface ModelSelectorEffortProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: ThinkingEffort;
  defaultValue?: ThinkingEffort;
  onValueChange?: (effort: ThinkingEffort) => void;
  options?: SelectOption[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorEffort = React.forwardRef<HTMLDivElement, ModelSelectorEffortProps>(
  (
    {
      value: valueProp,
      defaultValue = 'medium',
      onValueChange,
      options = EFFORT_OPTIONS,
      disabled = false,
      size = 'sm',
      placeholder = 'Thinking',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('min-w-0 max-w-full flex-1 @xs:flex-none @xs:min-w-[110px] @sm:min-w-[130px]', className)}
        {...props}
      >
        <Tooltip content="Adjust depth of model reasoning steps">
          {/* Wrapper keeps TooltipTrigger's data-popup-open and id off SelectTrigger */}
          <div className="w-full">
            <Select
              options={options}
              value={valueProp}
              defaultValue={defaultValue}
              onValueChange={(val) => {
                if (val && typeof val === 'string') {
                  onValueChange?.(val as ThinkingEffort);
                }
              }}
              disabled={disabled}
              size={size}
              aria-label="Adjust reasoning effort"
              placeholder={placeholder}
            />
          </div>
        </Tooltip>
      </div>
    );
  }
);
ModelSelectorEffort.displayName = 'ModelSelector.Effort';

/* -------------------------------------------------------------------------------------------------
 * Full ModelSelector Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface ModelSelectorProps {
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  models?: ModelItem[];
  effort?: ThinkingEffort;
  defaultEffort?: ThinkingEffort;
  onEffortChange?: (effort: ThinkingEffort) => void;
  showEffort?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const ModelSelectorComponent = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  (
    {
      model,
      defaultModel,
      onModelChange,
      models = [],
      effort,
      defaultEffort,
      onEffortChange,
      showEffort = true,
      disabled = false,
      size = 'sm',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="model-selector-root"
        className={cn('@container flex flex-wrap items-center gap-2 w-full min-w-0 max-w-full', className)}
        {...props}
      >
        <ModelSelectorModel
          value={model}
          defaultValue={defaultModel}
          onValueChange={onModelChange}
          models={models}
          disabled={disabled}
          size={size}
        />
        {showEffort && (
          <ModelSelectorEffort
            value={effort}
            defaultValue={defaultEffort}
            onValueChange={onEffortChange}
            disabled={disabled}
            size={size}
          />
        )}
      </div>
    );
  }
);
ModelSelectorComponent.displayName = 'ModelSelector';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const ModelSelector = Object.assign(ModelSelectorComponent, {
  Root: ModelSelectorRoot,
  Model: ModelSelectorModel,
  Effort: ModelSelectorEffort,
  Trigger: ComboboxTrigger,
  Value: ComboboxValue,
  Content: ComboboxContent,
  Input: ComboboxInput,
  Empty: ComboboxEmpty,
  List: ComboboxList,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
});

export {
  ModelSelectorRoot,
  ModelSelectorModel,
  ModelSelectorEffort,
  ComboboxTrigger as ModelSelectorTrigger,
  ComboboxValue as ModelSelectorValue,
  ComboboxContent as ModelSelectorContent,
  ComboboxInput as ModelSelectorInput,
  ComboboxEmpty as ModelSelectorEmpty,
  ComboboxList as ModelSelectorList,
  ComboboxItem as ModelSelectorItem,
  ComboboxGroup as ModelSelectorGroup,
  ComboboxGroupLabel as ModelSelectorGroupLabel,
  ComboboxSeparator as ModelSelectorSeparator,
};

export default ModelSelector;
