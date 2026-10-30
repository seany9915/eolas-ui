/**
 * ModelSelector primitive.
 *
 * Base UI Integration: Consumes Base UI Select primitive and Icon primitive.
 *
 * TAXONOMY & USAGE:
 * - Use ModelSelector in chat headers, sidebar toolbars, or prompt input footers to let
 *   users dynamically switch the active language model and adjust reasoning/thinking effort.
 * - Conforms to shadcn AI Elements ModelSelector specification and DESIGN.md:
 *   - Compact, high-precision layout with 44x44px accessible touch bounds.
 *   - Clear distinction between model family (Gemini, Claude, GPT, Med-PaLM) and thinking depth.
 *   - Concentric radius, floating 2px focus ring (`outline-offset: 2px`).
 */
import * as React from 'react';
import { Select, type SelectOption } from './select';
import { Icon } from './icon';
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

export const DEFAULT_MODELS: ModelItem[] = [
  {
    value: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: 'High-reasoning multimodal clinical analysis',
    badge: 'Recommended',
    icon: 'neurology',
  },
  {
    value: 'claude-3-7-sonnet',
    label: 'Claude 3.7 Sonnet',
    description: 'Extended thinking and articulate clinical reports',
    icon: 'psychology',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Fast versatile multimodal assistant',
    icon: 'smart_toy',
  },
  {
    value: 'med-palm-2',
    label: 'Med-PaLM 2',
    description: 'Specialized clinical knowledge retrieval',
    icon: 'clinical_notes',
  },
];

export const EFFORT_OPTIONS: SelectOption[] = [
  { value: 'off', label: 'Thinking: Off' },
  { value: 'low', label: 'Thinking: Low' },
  { value: 'medium', label: 'Thinking: Medium' },
  { value: 'high', label: 'Thinking: High' },
];

export interface ModelSelectorModelProps {
  value?: string;
  onValueChange?: (model: string) => void;
  models?: ModelItem[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorModel: React.FC<ModelSelectorModelProps> = ({
  value = 'gemini-2.5-pro',
  onValueChange,
  models = DEFAULT_MODELS,
  disabled = false,
  size = 'sm',
  placeholder = 'Select model',
  className,
}) => {
  return (
    <div className={cn('min-w-[140px] @sm:min-w-[160px]', className)}>
      <Select
        options={models}
        value={value}
        onValueChange={(val) => {
          if (val && typeof val === 'string') {
            onValueChange?.(val);
          }
        }}
        disabled={disabled}
        size={size}
        aria-label="Select model"
        placeholder={placeholder}
      />
    </div>
  );
};
ModelSelectorModel.displayName = 'ModelSelector.Model';

export interface ModelSelectorEffortProps {
  value?: ThinkingEffort;
  onValueChange?: (effort: ThinkingEffort) => void;
  options?: SelectOption[];
  disabled?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}

const ModelSelectorEffort: React.FC<ModelSelectorEffortProps> = ({
  value = 'medium',
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
        <div>
          <Select
            options={options}
            value={value}
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
  onModelChange?: (model: string) => void;
  models?: ModelItem[];
  effort?: ThinkingEffort;
  onEffortChange?: (effort: ThinkingEffort) => void;
  showEffort?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const ModelSelectorComponent = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  (
    {
      model = 'gemini-2.5-pro',
      onModelChange,
      models = DEFAULT_MODELS,
      effort = 'medium',
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
          onValueChange={onModelChange}
          models={models}
          disabled={disabled}
          size={size}
        />
        {showEffort && (
          <ModelSelectorEffort
            value={effort}
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
