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
import { Tooltip } from './tooltip';
import { cn } from '@/lib/utils';

export interface ModelItem extends SelectOption {
  description?: string;
  badge?: string;
  icon?: string;
}

export type ThinkingEffort = 'off' | 'low' | 'medium' | 'high';

export interface ModelSelectorRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ModelSelectorRoot = React.forwardRef<HTMLDivElement, ModelSelectorRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="model-selector-root"
        className={cn('inline-flex items-center gap-1.5 p-1 rounded-lg bg-surface-container/40 border border-outline-variant/60 shadow-ambient', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModelSelectorRoot.displayName = 'ModelSelector.Root';

export const EFFORT_OPTIONS: SelectOption[] = [
  { value: 'off', label: 'Thinking: Off' },
  { value: 'low', label: 'Thinking: Low' },
  { value: 'medium', label: 'Thinking: Medium' },
  { value: 'high', label: 'Thinking: High' },
];

export interface ModelSelectorModelProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (model: string) => void;
  models?: ModelItem[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorModel: React.FC<ModelSelectorModelProps> = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  models = [],
  disabled = false,
  size = 'sm',
  placeholder = 'Select model',
  className,
}) => {
  const hasModels = models.length > 0;

  return (
    <div className={cn('min-w-[140px] @sm:min-w-[160px]', className)}>
      <Select
        options={models}
        value={valueProp}
        defaultValue={defaultValue ?? null}
        onValueChange={(val) => {
          if (val && typeof val === 'string') {
            onValueChange?.(val);
          }
        }}
        disabled={disabled || !hasModels}
        size={size}
        aria-label="Select model"
        placeholder={hasModels ? placeholder : 'No models available'}
      />
    </div>
  );
};
ModelSelectorModel.displayName = 'ModelSelector.Model';

export interface ModelSelectorEffortProps {
  value?: ThinkingEffort;
  defaultValue?: ThinkingEffort;
  onValueChange?: (effort: ThinkingEffort) => void;
  options?: SelectOption[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorEffort: React.FC<ModelSelectorEffortProps> = ({
  value: valueProp,
  defaultValue = 'medium',
  onValueChange,
  options = EFFORT_OPTIONS,
  disabled = false,
  size = 'sm',
  placeholder = 'Thinking',
  className,
}) => {
  return (
    <div className={cn('min-w-[110px] @sm:min-w-[130px]', className)}>
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
};
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
      <ModelSelectorRoot ref={ref} className={className} {...props}>
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
      </ModelSelectorRoot>
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
});

export {
  ModelSelectorRoot,
  ModelSelectorModel,
  ModelSelectorEffort,
};

export default ModelSelector;
