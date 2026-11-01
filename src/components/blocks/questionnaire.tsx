/**
 * Questionnaire composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from Base UI primitives and design tokens:
 *             - `Button` (`src/components/ui/button.tsx`)
 *             - `Input` (`src/components/ui/input.tsx`)
 *             - `Progress` (`src/components/ui/progress.tsx`)
 *             - `Icon` (`src/components/ui/icon.tsx`)
 *             - `Kbd` (`src/components/ui/kbd.tsx`)
 *
 * TAXONOMY & USAGE:
 * - Multi-step guided question primitive and flow engine for intake forms, clinical assessments,
 *   onboarding sequences, configuration wizards, and conversational agent clarification prompts.
 * - Conforms to shadcn/ui Questionnaire specification with full parity across compound subcomponents
 *   and flat exports: Root, Progress, Item, Title, Description, Choices, Choice, ChoiceInput,
 *   ChoiceLabel, ChoiceShortcut, Input, Error, Actions, Previous, Skip, Next, and Submit.
 * - Supports single-choice, multiple-choice, freeform text entry, keyboard shortcuts (A-Z, 1-9),
 *   roving tabindex arrow key navigation, form validation, draft restoration, and native FormData serialization.
 * - Accessible: WCAG 2.2 SC 2.5.8 compliant (min-h-11 touch targets), floating 2px focus indicators,
 *   fieldset/legend semantics, inert inactive items, live error regions, and container-query responsiveness (@container).
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@/components/ui/icon';
import { Kbd } from '@/components/ui/kbd';

/* -------------------------------------------------------------------------------------------------
 * Types & Interfaces
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceDef {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

export interface QuestionnaireItemDef {
  name: string;
  prompt?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  type?: 'single' | 'multiple';
  choices?: QuestionnaireChoiceDef[];
  input?: {
    name?: string;
    label?: string;
    placeholder?: string;
  };
}

export interface QuestionnaireStatus {
  activeItem: string;
  activeIndex: number;
  totalItems: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  canSubmit: boolean;
  canSkip: boolean;
  canGoBack: boolean;
}

export interface QuestionnaireItemMeta {
  required?: boolean;
  type?: 'single' | 'multiple';
}

export interface RegisteredChoice {
  value: string;
  shortcut?: string;
  disabled?: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Root Context
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireContextValue {
  itemNames: string[];
  registerItem: (name: string, meta?: QuestionnaireItemMeta) => () => void;
  updateItemMeta: (name: string, meta: QuestionnaireItemMeta) => void;
  getItemMeta: (name: string) => QuestionnaireItemMeta | undefined;
  activeItem: string;
  setActiveItem: (name: string) => void;
  direction: 'forward' | 'backward';
  goToPrevious: () => void;
  goToNext: () => void;
  skipCurrent: () => void;
  resetQuestionnaire: () => void;
  isFirst: boolean;
  isLast: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  activeIndex: number;
  totalItems: number;
  percentage: number;
  values: Record<string, any>;
  setAnswer: (fieldName: string, value: any, itemName?: string) => void;
  errors: Record<string, string>;
  setError: (name: string, error: string | null) => void;
  shortcuts?: 'letters' | 'numbers' | boolean;
  items?: QuestionnaireItemDef[];
  hiddenUntilFound?: boolean;
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);

export function useQuestionnaire(): QuestionnaireContextValue {
  const context = React.useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('Questionnaire compound subcomponents must be used within a Questionnaire.Root');
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Item Context
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireItemContextValue {
  name: string;
  required: boolean;
  type: 'single' | 'multiple';
  isActive: boolean;
  direction: 'forward' | 'backward';
  registerChoice: (choice: RegisteredChoice) => () => void;
  choices: RegisteredChoice[];
  getShortcutForChoice: (choiceValue: string, explicitShortcut?: string) => string | undefined;
  error?: string;
  hiddenUntilFound?: boolean;
}

const QuestionnaireItemContext = React.createContext<QuestionnaireItemContextValue | null>(null);

export function useQuestionnaireItem(): QuestionnaireItemContextValue | null {
  return React.useContext(QuestionnaireItemContext);
}

/* -------------------------------------------------------------------------------------------------
 * Choice Context
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceContextValue {
  value: string;
  isSelected: boolean;
  isMultiple: boolean;
  shortcutKey?: string;
  disabled?: boolean;
  description?: React.ReactNode;
}

const QuestionnaireChoiceContext = React.createContext<QuestionnaireChoiceContextValue | null>(null);

export function useQuestionnaireChoice(): QuestionnaireChoiceContextValue | null {
  return React.useContext(QuestionnaireChoiceContext);
}

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Root
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  items?: QuestionnaireItemDef[];
  /** Controlled active item name */
  item?: string;
  /** Alias for item */
  value?: string;
  /** Uncontrolled initial active item name */
  defaultItem?: string;
  /** Alias for defaultItem */
  defaultValue?: string;
  /** Callback fired when active item changes */
  onItemChange?: (item: string) => void;
  /** Alias for onItemChange */
  onValueChange?: (item: string) => void;
  /** Controlled answers map */
  values?: Record<string, any>;
  /** Alias for values */
  answers?: Record<string, any>;
  /** Uncontrolled initial answers map */
  defaultValues?: Record<string, any>;
  /** Alias for defaultValues */
  defaultAnswers?: Record<string, any>;
  /** Callback fired when answers update */
  onValuesChange?: (values: Record<string, any>) => void;
  /** Alias for onValuesChange */
  onAnswersChange?: (answers: Record<string, any>) => void;
  /** Keyboard shortcuts mode: 'letters' (A-Z), 'numbers' (1-9), or boolean */
  shortcuts?: 'letters' | 'numbers' | boolean;
  /** Native form submit handler */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Completion handler called with finalized answers on last step */
  onComplete?: (data: Record<string, any>) => void;
  /** Callback fired when navigating backward */
  onPrevious?: (item: string) => void;
  /** Callback fired when navigating forward */
  onNext?: (item: string) => void;
  /** Callback fired when skipping an optional step */
  onSkip?: (item: string) => void;
  /** Real-time flow state status callback */
  onStatusChange?: (status: QuestionnaireStatus) => void;
  /** Container style variant: 'card' (default with elevation) or 'plain' (unadorned) */
  variant?: 'card' | 'plain';
  /** Supports hidden="until-found" so browser search (Ctrl+F) finds inactive questions */
  hiddenUntilFound?: boolean;
  children?: React.ReactNode;
}

export type QuestionnaireRootProps = QuestionnaireProps;

export const QuestionnaireRoot = React.forwardRef<HTMLFormElement, QuestionnaireProps>(
  (
    {
      className,
      items,
      item: controlledItemProp,
      value: controlledValueProp,
      defaultItem: defaultItemProp,
      defaultValue: defaultValueProp,
      onItemChange,
      onValueChange,
      values: controlledValuesProp,
      answers: controlledAnswersProp,
      defaultValues = {},
      defaultAnswers,
      onValuesChange,
      onAnswersChange,
      shortcuts = 'letters',
      onSubmit,
      onComplete,
      onPrevious,
      onNext,
      onSkip,
      onStatusChange,
      variant = 'card',
      hiddenUntilFound = false,
      children,
      ...props
    },
    ref
  ) => {
    // Unify alias props
    const controlledItem = controlledItemProp ?? controlledValueProp;
    const defaultItem = defaultItemProp ?? defaultValueProp;
    const handleItemChange = onItemChange ?? onValueChange;

    const controlledValues = controlledValuesProp ?? controlledAnswersProp;
    const initialValues = defaultAnswers ?? defaultValues;
    const handleValuesChange = onValuesChange ?? onAnswersChange;

    // Collect item definitions from prop if provided
    const propItemNames = React.useMemo(() => items?.map((i) => i.name) ?? [], [items]);

    // Registered item state (supports both dynamic declarative children and static items array)
    const [itemMap, setItemMap] = React.useState<Map<string, QuestionnaireItemMeta>>(() => {
      const map = new Map<string, QuestionnaireItemMeta>();
      if (items) {
        for (const it of items) {
          map.set(it.name, { required: it.required, type: it.type });
        }
      }
      return map;
    });

    const [declaredItemNames, setDeclaredItemNames] = React.useState<string[]>(propItemNames);

    const itemNames = React.useMemo(() => {
      const merged = new Set([...propItemNames, ...declaredItemNames]);
      return Array.from(merged);
    }, [propItemNames, declaredItemNames]);

    const registerItem = React.useCallback((name: string, meta?: QuestionnaireItemMeta) => {
      setDeclaredItemNames((prev) => (prev.includes(name) ? prev : [...prev, name]));
      if (meta) {
        setItemMap((prev) => {
          const next = new Map(prev);
          next.set(name, meta);
          return next;
        });
      }
      return () => {
        setDeclaredItemNames((prev) => prev.filter((n) => n !== name));
      };
    }, []);

    const updateItemMeta = React.useCallback((name: string, meta: QuestionnaireItemMeta) => {
      setItemMap((prev) => {
        const next = new Map(prev);
        next.set(name, { ...next.get(name), ...meta });
        return next;
      });
    }, []);

    const getItemMeta = React.useCallback(
      (name: string) => {
        return itemMap.get(name);
      },
      [itemMap]
    );

    // Active item navigation state
    const [uncontrolledItem, setUncontrolledItem] = React.useState<string>(
      () => defaultItem || (items && items[0]?.name) || ''
    );
    const [direction, setDirection] = React.useState<'forward' | 'backward'>('forward');

    const activeItem = controlledItem !== undefined ? controlledItem : uncontrolledItem;

    // Fallback: if activeItem is empty and items are registered, activate the first one
    React.useEffect(() => {
      if (!activeItem && itemNames.length > 0) {
        const first = itemNames[0];
        if (controlledItem === undefined) {
          setUncontrolledItem(first);
        }
        handleItemChange?.(first);
      }
    }, [activeItem, itemNames, controlledItem, handleItemChange]);

    const activeIndex = Math.max(0, itemNames.indexOf(activeItem));
    const totalItems = itemNames.length;
    const isFirst = activeIndex <= 0;
    const isLast = activeIndex >= totalItems - 1 && totalItems > 0;
    const currentMeta = getItemMeta(activeItem);
    const canSkip = currentMeta?.required !== true;
    const canGoBack = !isFirst;
    const percentage = totalItems > 0 ? ((activeIndex + 1) / totalItems) * 100 : 0;

    // Answer / Values state
    const [internalValues, setInternalValues] = React.useState<Record<string, any>>(initialValues);
    const values = controlledValues !== undefined ? controlledValues : internalValues;

    // Error state per item
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const setError = React.useCallback((name: string, error: string | null) => {
      setErrors((prev) => {
        if (!error) {
          if (!prev[name]) return prev;
          const copy = { ...prev };
          delete copy[name];
          return copy;
        }
        return { ...prev, [name]: error };
      });
    }, []);

    const setAnswer = React.useCallback(
      (fieldName: string, value: any, itemName?: string) => {
        const nextValues = { ...values, [fieldName]: value };
        if (controlledValues === undefined) {
          setInternalValues(nextValues);
        }
        handleValuesChange?.(nextValues);

        // Clear error on the item when user provides an answer
        const relatedItem = itemName || fieldName;
        setError(relatedItem, null);
      },
      [values, controlledValues, handleValuesChange, setError]
    );

    const changeActiveItem = React.useCallback(
      (nextItem: string, dir: 'forward' | 'backward') => {
        setDirection(dir);
        if (controlledItem === undefined) {
          setUncontrolledItem(nextItem);
        }
        handleItemChange?.(nextItem);
      },
      [controlledItem, handleItemChange]
    );

    // Validation for current step
    const validateCurrent = React.useCallback((): boolean => {
      if (!activeItem) return true;
      const meta = getItemMeta(activeItem);
      if (meta?.required) {
        const answer = values[activeItem];
        const textAnswer = values[`${activeItem}_text`];
        const hasChoice =
          Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== null && answer !== '';
        const hasText = textAnswer !== undefined && textAnswer !== null && String(textAnswer).trim().length > 0;

        if (!hasChoice && !hasText) {
          setError(activeItem, 'Please select or provide an answer to continue.');
          return false;
        }
      }
      setError(activeItem, null);
      return true;
    }, [activeItem, getItemMeta, values, setError]);

    const goToPrevious = React.useCallback(() => {
      if (!canGoBack) return;
      const prevItem = itemNames[activeIndex - 1];
      if (prevItem) {
        setError(activeItem, null);
        changeActiveItem(prevItem, 'backward');
        onPrevious?.(prevItem);
      }
    }, [canGoBack, itemNames, activeIndex, activeItem, changeActiveItem, onPrevious, setError]);

    const goToNext = React.useCallback(() => {
      if (!validateCurrent()) return;
      if (isLast) return;
      const nextItem = itemNames[activeIndex + 1];
      if (nextItem) {
        changeActiveItem(nextItem, 'forward');
        onNext?.(nextItem);
      }
    }, [validateCurrent, isLast, itemNames, activeIndex, changeActiveItem, onNext]);

    const skipCurrent = React.useCallback(() => {
      if (!canSkip) {
        setError(activeItem, 'This question is required and cannot be skipped.');
        return;
      }
      setError(activeItem, null);
      if (!isLast) {
        const nextItem = itemNames[activeIndex + 1];
        if (nextItem) {
          changeActiveItem(nextItem, 'forward');
          onSkip?.(activeItem);
        }
      } else {
        onSkip?.(activeItem);
      }
    }, [canSkip, isLast, itemNames, activeIndex, activeItem, changeActiveItem, onSkip, setError]);

    const resetQuestionnaire = React.useCallback(() => {
      setErrors({});
      if (itemNames[0]) {
        changeActiveItem(itemNames[0], 'backward');
      }
      if (controlledValues === undefined) {
        setInternalValues(initialValues);
      }
      handleValuesChange?.(initialValues);
    }, [itemNames, changeActiveItem, controlledValues, initialValues, handleValuesChange]);

    // Notify status changes
    React.useEffect(() => {
      onStatusChange?.({
        activeItem,
        activeIndex,
        totalItems,
        isFirst,
        isLast,
        progress: percentage,
        canSubmit: isLast && (!currentMeta?.required || validateCurrent()),
        canSkip,
        canGoBack,
      });
    }, [
      activeItem,
      activeIndex,
      totalItems,
      isFirst,
      isLast,
      percentage,
      canSkip,
      canGoBack,
      currentMeta?.required,
      validateCurrent,
      onStatusChange,
    ]);

    // Native Form submit handling
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      if (!isLast) {
        // Prevent accidental form submission on enter press when still on intermediate steps
        e.preventDefault();
        goToNext();
        return;
      }

      // We are on the final step: validate the last step
      if (!validateCurrent()) {
        e.preventDefault();
        return;
      }

      onComplete?.(values);
      if (onSubmit) {
        onSubmit(e);
      }
    };

    const contextValue: QuestionnaireContextValue = {
      itemNames,
      registerItem,
      updateItemMeta,
      getItemMeta,
      activeItem,
      setActiveItem: (name) => changeActiveItem(name, 'forward'),
      direction,
      goToPrevious,
      goToNext,
      skipCurrent,
      resetQuestionnaire,
      isFirst,
      isLast,
      canGoBack,
      canSkip,
      activeIndex,
      totalItems,
      percentage,
      values,
      setAnswer,
      errors,
      setError,
      shortcuts,
      items,
      hiddenUntilFound,
    };

    // Auto-render data-driven items when items array is provided without children
    const renderedChildren =
      children ??
      (items && items.length > 0 ? (
        <>
          <QuestionnaireProgress />
          {items.map((itemDef) => (
            <QuestionnaireItem
              key={itemDef.name}
              name={itemDef.name}
              required={itemDef.required}
              type={itemDef.type}
            >
              <QuestionnaireTitle>{itemDef.prompt ?? itemDef.title}</QuestionnaireTitle>
              {itemDef.description && (
                <QuestionnaireDescription>{itemDef.description}</QuestionnaireDescription>
              )}
              {itemDef.choices && itemDef.choices.length > 0 && (
                <QuestionnaireChoices>
                  {itemDef.choices.map((choice) => (
                    <QuestionnaireChoice
                      key={choice.value}
                      value={choice.value}
                      label={choice.label}
                      description={choice.description}
                      shortcut={choice.shortcut}
                      disabled={choice.disabled}
                    />
                  ))}
                </QuestionnaireChoices>
              )}
              {itemDef.input && (
                <QuestionnaireInput
                  name={itemDef.input.name}
                  label={itemDef.input.label}
                  placeholder={itemDef.input.placeholder}
                />
              )}
              <QuestionnaireError />
            </QuestionnaireItem>
          ))}
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <div className="flex items-center gap-2">
              <QuestionnaireSkip />
              <QuestionnaireNext />
              <QuestionnaireSubmit />
            </div>
          </QuestionnaireActions>
        </>
      ) : null);

    return (
      <QuestionnaireContext.Provider value={contextValue}>
        <form
          ref={ref}
          role="form"
          data-state={isLast ? 'last' : isFirst ? 'first' : 'in-progress'}
          data-status={isLast && (!currentMeta?.required || validateCurrent()) ? 'can-submit' : 'answering'}
          onSubmit={handleSubmit}
          className={cn(
            '@container w-full max-w-2xl mx-auto flex flex-col',
            variant === 'card' &&
              'bg-surface rounded-lg p-6 @md:p-8 border border-outline-variant shadow-ambient',
            className
          )}
          {...props}
        >
          {renderedChildren}
        </form>
      </QuestionnaireContext.Provider>
    );
  }
);
QuestionnaireRoot.displayName = 'QuestionnaireRoot';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Progress
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  format?: (info: { current: number; total: number; percentage: number }) => React.ReactNode;
  showIndicator?: boolean;
  showBar?: boolean;
}

export const QuestionnaireProgress: React.FC<QuestionnaireProgressProps> = ({
  className,
  format,
  showIndicator = true,
  showBar = true,
  ...props
}) => {
  const { activeIndex, totalItems, percentage, isLast } = useQuestionnaire();

  if (totalItems === 0) return null;

  return (
    <div
      data-status={isLast ? 'complete' : 'in-progress'}
      data-active-step={activeIndex + 1}
      data-total-steps={totalItems}
      className={cn('flex flex-col gap-2 w-full mb-6', className)}
      {...props}
    >
      {showIndicator && (
        <div className="flex items-center justify-between font-sans text-sm font-medium text-on-surface-variant">
          <span>
            {format
              ? format({ current: activeIndex + 1, total: totalItems, percentage })
              : `Question ${activeIndex + 1} of ${totalItems}`}
          </span>
          <span className="font-mono text-xs tabular-nums text-on-surface-variant">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      {showBar && (
        <Progress
          value={percentage}
          max={100}
          size="sm"
          aria-label={`Questionnaire progress: ${activeIndex + 1} of ${totalItems}`}
        />
      )}
    </div>
  );
};
QuestionnaireProgress.displayName = 'QuestionnaireProgress';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Item
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireItemProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  name: string;
  required?: boolean;
  type?: 'single' | 'multiple';
  hiddenUntilFound?: boolean;
}

export const QuestionnaireItem = React.forwardRef<HTMLFieldSetElement, QuestionnaireItemProps>(
  (
    {
      className,
      name,
      required = false,
      type = 'single',
      hiddenUntilFound: itemHiddenUntilFound,
      children,
      ...props
    },
    ref
  ) => {
    const {
      registerItem,
      updateItemMeta,
      activeItem,
      setActiveItem,
      direction,
      values,
      setAnswer,
      shortcuts,
      errors,
      hiddenUntilFound: rootHiddenUntilFound,
    } = useQuestionnaire();

    const shouldHiddenUntilFound = itemHiddenUntilFound ?? rootHiddenUntilFound ?? false;

    const fieldsetRef = React.useRef<HTMLFieldSetElement | null>(null);

    // Merge internal and forwarded refs
    const setRefs = React.useCallback(
      (node: HTMLFieldSetElement | null) => {
        fieldsetRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Register item name and metadata with Root
    React.useEffect(() => {
      return registerItem(name, { required, type });
    }, [registerItem, name, required, type]);

    React.useEffect(() => {
      updateItemMeta(name, { required, type });
    }, [updateItemMeta, name, required, type]);

    const isActive = activeItem === name;
    const hasError = Boolean(errors[name]);

    // Registered choices for this item
    const [choices, setChoices] = React.useState<RegisteredChoice[]>([]);

    const registerChoice = React.useCallback((choice: RegisteredChoice) => {
      setChoices((prev) => {
        const existingIdx = prev.findIndex((c) => c.value === choice.value);
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = choice;
          return next;
        }
        return [...prev, choice];
      });
      return () => {
        setChoices((prev) => prev.filter((c) => c.value !== choice.value));
      };
    }, []);

    // Automatic shortcut generator for choices in this item
    const getShortcutForChoice = React.useCallback(
      (choiceValue: string, explicitShortcut?: string): string | undefined => {
        if (explicitShortcut) return explicitShortcut;
        if (!shortcuts) return undefined;

        const idx = choices.findIndex((c) => c.value === choiceValue);
        if (idx < 0) return undefined;

        if (shortcuts === 'numbers') {
          return idx < 9 ? String(idx + 1) : undefined;
        }
        // Letters mode (default)
        return idx < 26 ? String.fromCharCode(65 + idx) : undefined;
      },
      [choices, shortcuts]
    );

    // Focus active item and toggle inert attribute when active state changes
    React.useEffect(() => {
      const el = fieldsetRef.current;
      if (!el) return;
      if (isActive) {
        el.removeAttribute('inert');
        el.focus();
      } else {
        el.setAttribute('inert', '');
      }
    }, [isActive]);

    // Hidden until found support (beforematch event for browser Ctrl+F find-in-page)
    React.useEffect(() => {
      const el = fieldsetRef.current;
      if (!el || !shouldHiddenUntilFound) return;

      if (!isActive) {
        el.setAttribute('hidden', 'until-found');
      } else {
        el.removeAttribute('hidden');
      }

      const handleBeforeMatch = () => {
        setActiveItem(name);
      };

      el.addEventListener('beforematch', handleBeforeMatch);
      return () => {
        el.removeEventListener('beforematch', handleBeforeMatch);
      };
    }, [isActive, shouldHiddenUntilFound, setActiveItem, name]);

    // Keyboard shortcuts listener when active
    React.useEffect(() => {
      if (!isActive || !shortcuts) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        // Ignore typing in interactive form fields
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }

        if (event.metaKey || event.ctrlKey || event.altKey) {
          return;
        }

        const pressedKey = event.key.toUpperCase();
        for (const choice of choices) {
          const assigned = getShortcutForChoice(choice.value, choice.shortcut);
          if (assigned && assigned.toUpperCase() === pressedKey && !choice.disabled) {
            event.preventDefault();
            // Toggle selection
            if (type === 'multiple') {
              const currentList = Array.isArray(values[name]) ? values[name] : [];
              const nextList = currentList.includes(choice.value)
                ? currentList.filter((v: string) => v !== choice.value)
                : [...currentList, choice.value];
              setAnswer(name, nextList, name);
            } else {
              setAnswer(name, choice.value, name);
            }
            break;
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, shortcuts, choices, getShortcutForChoice, type, values, name, setAnswer]);

    const itemContextValue: QuestionnaireItemContextValue = {
      name,
      required,
      type,
      isActive,
      direction,
      registerChoice,
      choices,
      getShortcutForChoice,
      error: errors[name],
      hiddenUntilFound: shouldHiddenUntilFound,
    };

    if (!isActive && !shouldHiddenUntilFound) {
      return (
        <fieldset
          ref={setRefs}
          hidden
          aria-hidden="true"
          data-state="inactive"
          data-required={required ? '' : undefined}
          className="border-none p-0 m-0 hidden"
          {...props}
        >
          {/* Synchronize form data for native FormData submissions */}
          {type === 'multiple'
            ? (Array.isArray(values[name]) ? values[name] : []).map(
                (val: string, idx: number) => (
                  <Input key={idx} type="hidden" name={`${name}[]`} value={val} />
                )
              )
            : values[name] !== undefined && (
                <Input type="hidden" name={name} value={String(values[name])} />
              )}
        </fieldset>
      );
    }

    return (
      <QuestionnaireItemContext.Provider value={itemContextValue}>
        <fieldset
          ref={setRefs}
          tabIndex={-1}
          aria-hidden={!isActive ? true : undefined}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? `${name}-error` : undefined}
          data-state={isActive ? 'active' : 'inactive'}
          data-active={isActive ? '' : undefined}
          data-required={required ? '' : undefined}
          data-invalid={hasError ? '' : undefined}
          className={cn(
            'w-full border-none p-0 m-0 flex flex-col focus:outline-none',
            !isActive && shouldHiddenUntilFound && '[&[hidden]:not([hidden="until-found"])]:hidden',
            isActive && (direction === 'forward' ? 'animate-step-forward' : 'animate-step-backward'),
            'motion-reduce:animate-none',
            className
          )}
          {...props}
        >
          {/* Hidden inputs to guarantee standard FormData serialization */}
          {type === 'multiple'
            ? (Array.isArray(values[name]) ? values[name] : []).map(
                (val: string, idx: number) => (
                  <Input key={idx} type="hidden" name={`${name}[]`} value={val} />
                )
              )
            : values[name] !== undefined && (
                <Input type="hidden" name={name} value={String(values[name])} />
              )}
          {children}
        </fieldset>
      </QuestionnaireItemContext.Provider>
    );
  }
);
QuestionnaireItem.displayName = 'QuestionnaireItem';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Title
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireTitleProps extends React.HTMLAttributes<HTMLLegendElement> {}

export const QuestionnaireTitle = React.forwardRef<HTMLLegendElement, QuestionnaireTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <legend
        ref={ref}
        className={cn(
          'font-heading font-semibold text-xl @md:text-2xl text-on-surface mb-2 p-0 w-full leading-tight text-balance',
          className
        )}
        {...props}
      >
        {children}
      </legend>
    );
  }
);
QuestionnaireTitle.displayName = 'QuestionnaireTitle';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Description
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const QuestionnaireDescription = React.forwardRef<
  HTMLParagraphElement,
  QuestionnaireDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('font-sans text-base text-on-surface-variant mb-6 leading-relaxed text-pretty', className)}
      {...props}
    >
      {children}
    </p>
  );
});
QuestionnaireDescription.displayName = 'QuestionnaireDescription';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Choices
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoicesProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
}

export const QuestionnaireChoices = React.forwardRef<HTMLDivElement, QuestionnaireChoicesProps>(
  ({ className, columns = 1, children, ...props }, ref) => {
    const itemContext = useQuestionnaireItem();
    const isMultiple = itemContext?.type === 'multiple';

    return (
      <div
        ref={ref}
        role={isMultiple ? 'group' : 'radiogroup'}
        className={cn(
          'w-full',
          columns === 1 && 'flex flex-col gap-2.5',
          columns === 2 && 'grid grid-cols-1 @md:grid-cols-2 gap-2.5',
          columns === 3 && 'grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-2.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
QuestionnaireChoices.displayName = 'QuestionnaireChoices';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Choice
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

export const QuestionnaireChoice = React.forwardRef<HTMLDivElement, QuestionnaireChoiceProps>(
  (
    {
      className,
      value,
      label,
      description,
      shortcut,
      disabled = false,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const rootContext = useQuestionnaire();
    const itemContext = useQuestionnaireItem();

    const isMultiple = itemContext?.type === 'multiple';
    const itemName = itemContext?.name ?? '';
    const choices = itemContext?.choices ?? [];

    // Register with item
    React.useEffect(() => {
      if (itemContext) {
        return itemContext.registerChoice({ value, shortcut, disabled });
      }
    }, [itemContext, value, shortcut, disabled]);

    // Current selection state
    const currentAnswer = rootContext.values[itemName];
    const isSelected = isMultiple
      ? Array.isArray(currentAnswer) && currentAnswer.includes(value)
      : currentAnswer === value;

    const shortcutKey = itemContext?.getShortcutForChoice(value, shortcut);

    const toggle = () => {
      if (disabled) return;
      if (isMultiple) {
        const currentList = Array.isArray(currentAnswer) ? currentAnswer : [];
        const nextList = currentList.includes(value)
          ? currentList.filter((v: string) => v !== value)
          : [...currentList, value];
        rootContext.setAnswer(itemName, nextList, itemName);
      } else {
        rootContext.setAnswer(itemName, value, itemName);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;
      toggle();
    };

    // WAI-ARIA roving tabindex and arrow key navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (onKeyDown) onKeyDown(e);
      if (e.defaultPrevented) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
        return;
      }

      // Arrow keys roving tabindex navigation in single-choice mode
      if (!isMultiple && choices.length > 1) {
        const currentIdx = choices.findIndex((c) => c.value === value);
        if (currentIdx >= 0) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIdx = (currentIdx + 1) % choices.length;
            const nextChoice = choices[nextIdx];
            if (nextChoice && !nextChoice.disabled) {
              rootContext.setAnswer(itemName, nextChoice.value, itemName);
            }
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIdx = (currentIdx - 1 + choices.length) % choices.length;
            const prevChoice = choices[prevIdx];
            if (prevChoice && !prevChoice.disabled) {
              rootContext.setAnswer(itemName, prevChoice.value, itemName);
            }
          }
        }
      }
    };

    // Determine tabindex: in radiogroup, active/selected choice gets 0; else first gets 0
    let tabIndex = disabled ? -1 : 0;
    if (!isMultiple && choices.length > 0) {
      if (isSelected) {
        tabIndex = 0;
      } else {
        const hasAnySelected = choices.some((c) => c.value === currentAnswer);
        const firstEnabled = choices.find((c) => !c.disabled);
        tabIndex = !hasAnySelected && firstEnabled?.value === value ? 0 : -1;
      }
    }

    const choiceContextValue: QuestionnaireChoiceContextValue = {
      value,
      isSelected,
      isMultiple: Boolean(isMultiple),
      shortcutKey,
      disabled,
      description,
    };

    return (
      <QuestionnaireChoiceContext.Provider value={choiceContextValue}>
        <div
          ref={ref}
          role={isMultiple ? 'checkbox' : 'radio'}
          aria-checked={isSelected}
          aria-disabled={disabled}
          tabIndex={tabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          data-state={isSelected ? 'checked' : 'unchecked'}
          data-checked={isSelected ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-invalid={Boolean(itemContext?.error) ? '' : undefined}
          className={cn(
            'group w-full min-h-11 py-3 px-4 rounded-md flex items-center justify-between gap-3 text-left cursor-pointer select-none',
            'transition-colors duration-quick ease-standard motion-reduce:transition-none',
            // Focus vs Selection Distinction per DESIGN.md:
            // Floating 2px focus ring with outline-offset: 2px
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            // Active selection uses flush 2px border + surface wash
            isSelected
              ? 'border-2 border-primary bg-primary-container text-on-primary-container'
              : 'border border-outline bg-surface hover:bg-surface-container text-on-surface',
            disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
            className
          )}
          {...props}
        >
          {children ? (
            children
          ) : (
            <>
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <QuestionnaireChoiceInput />
                <QuestionnaireChoiceLabel>{label ?? value}</QuestionnaireChoiceLabel>
              </div>
              {shortcutKey && <QuestionnaireChoiceShortcut>{shortcutKey}</QuestionnaireChoiceShortcut>}
            </>
          )}
        </div>
      </QuestionnaireChoiceContext.Provider>
    );
  }
);
QuestionnaireChoice.displayName = 'QuestionnaireChoice';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.ChoiceInput
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceInputProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const QuestionnaireChoiceInput: React.FC<QuestionnaireChoiceInputProps> = ({
  className,
  ...props
}) => {
  const choiceContext = useQuestionnaireChoice();
  const isSelected = choiceContext?.isSelected ?? false;
  const isMultiple = choiceContext?.isMultiple ?? false;

  return (
    <span
      aria-hidden="true"
      data-state={isSelected ? 'checked' : 'unchecked'}
      data-checked={isSelected ? '' : undefined}
      className={cn(
        'relative flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-quick ease-standard motion-reduce:transition-none',
        isMultiple ? 'size-5 rounded-xs' : 'size-5 rounded-full',
        isSelected
          ? isMultiple
            ? 'border-2 border-primary bg-primary text-on-primary'
            : 'border-2 border-primary bg-surface'
          : 'border border-outline group-hover:border-on-surface-variant bg-surface',
        className
      )}
      {...props}
    >
      {isSelected &&
        (isMultiple ? (
          <Icon name="check" size="xs" aria-hidden="true" />
        ) : (
          <span className="size-2.5 rounded-full bg-primary" />
        ))}
    </span>
  );
};
QuestionnaireChoiceInput.displayName = 'QuestionnaireChoiceInput';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.ChoiceLabel
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: React.ReactNode;
}

export const QuestionnaireChoiceLabel: React.FC<QuestionnaireChoiceLabelProps> = ({
  className,
  children,
  description,
  ...props
}) => {
  const choiceContext = useQuestionnaireChoice();
  const desc = description ?? choiceContext?.description;

  return (
    <div className={cn('flex flex-col flex-1 text-left min-w-0', className)} {...props}>
      <span className="font-sans text-sm font-medium text-on-surface select-none leading-snug">
        {children}
      </span>
      {desc && (
        <span className="font-sans text-xs text-on-surface-variant select-none mt-0.5 leading-normal">
          {desc}
        </span>
      )}
    </div>
  );
};
QuestionnaireChoiceLabel.displayName = 'QuestionnaireChoiceLabel';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.ChoiceShortcut
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireChoiceShortcutProps extends React.HTMLAttributes<HTMLElement> {}

export const QuestionnaireChoiceShortcut: React.FC<QuestionnaireChoiceShortcutProps> = ({
  className,
  children,
  ...props
}) => {
  const choiceContext = useQuestionnaireChoice();
  const shortcutKey = children || choiceContext?.shortcutKey;

  if (!shortcutKey) return null;

  return (
    <Kbd size="sm" className={cn('shrink-0 select-none', className)} {...props}>
      {shortcutKey}
    </Kbd>
  );
};
QuestionnaireChoiceShortcut.displayName = 'QuestionnaireChoiceShortcut';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Input
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'size'> {
  name?: string;
  label?: string;
  placeholder?: string;
}

export const QuestionnaireInput: React.FC<QuestionnaireInputProps> = ({
  name,
  label,
  placeholder = 'Type another answer…',
  className,
  value,
  onChange,
  ...props
}) => {
  const itemContext = useQuestionnaireItem();
  const rootContext = useQuestionnaire();
  const fieldName = name || (itemContext ? `${itemContext.name}_text` : 'custom_input');

  const textValue = (value !== undefined ? value : rootContext?.values[fieldName]) ?? '';

  const handleChange: React.ComponentPropsWithoutRef<typeof Input>['onChange'] = (e) => {
    if (onChange) {
      onChange(e);
    }
    if (rootContext) {
      rootContext.setAnswer(fieldName, e.target.value, itemContext?.name);
    }
  };

  return (
    <div className={cn('w-full mt-3', className)}>
      {label && (
        <span className="block font-sans text-xs font-medium text-on-surface-variant mb-1.5 select-none">
          {label}
        </span>
      )}
      <Input
        name={fieldName}
        value={textValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full"
        {...props}
      />
    </div>
  );
};
QuestionnaireInput.displayName = 'QuestionnaireInput';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Error
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
}

export const QuestionnaireError: React.FC<QuestionnaireErrorProps> = ({
  name,
  className,
  children,
  ...props
}) => {
  const itemContext = useQuestionnaireItem();
  const rootContext = useQuestionnaire();

  const itemName = name || itemContext?.name;
  const errorText = children || (itemName ? rootContext.errors[itemName] : itemContext?.error);

  if (!errorText) return null;

  return (
    <div
      role="alert"
      id={itemName ? `${itemName}-error` : undefined}
      aria-live="assertive"
      data-state="visible"
      className={cn(
        'flex items-center gap-1.5 font-sans text-sm font-medium text-error select-none mt-3 animate-error-shake motion-reduce:animate-none',
        className
      )}
      {...props}
    >
      <Icon name="error" size="sm" aria-hidden="true" />
      <span>{errorText}</span>
    </div>
  );
};
QuestionnaireError.displayName = 'QuestionnaireError';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Actions
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const QuestionnaireActions = React.forwardRef<HTMLDivElement, QuestionnaireActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-3 pt-6 mt-6 border-t border-outline-variant w-full',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
QuestionnaireActions.displayName = 'QuestionnaireActions';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Previous
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnairePreviousProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  showIcon?: boolean;
  hideWhenDisabled?: boolean;
  hideWhenFirst?: boolean;
}

export const QuestionnairePrevious: React.FC<QuestionnairePreviousProps> = ({
  className,
  showIcon = true,
  hideWhenDisabled = false,
  hideWhenFirst = false,
  children = 'Previous',
  disabled,
  onClick,
  ...props
}) => {
  const rootContext = useQuestionnaire();
  const canGoBack = rootContext ? rootContext.canGoBack : false;
  const isFirst = rootContext ? rootContext.isFirst : false;
  const isDisabled = disabled ?? !canGoBack;

  if ((hideWhenDisabled && isDisabled) || (hideWhenFirst && isFirst)) {
    return null;
  }

  return (
    <Button
      variant="outline"
      colorRole="neutral"
      disabled={isDisabled}
      data-state={isDisabled ? 'disabled' : 'enabled'}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (!e.defaultPrevented && rootContext) {
          rootContext.goToPrevious();
        }
      }}
      className={className}
      {...props}
    >
      {showIcon && <Icon name="arrow_back" size="sm" aria-hidden="true" />}
      <span>{children}</span>
    </Button>
  );
};
QuestionnairePrevious.displayName = 'QuestionnairePrevious';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Skip
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireSkipProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  showIcon?: boolean;
  hideWhenDisabled?: boolean;
}

export const QuestionnaireSkip: React.FC<QuestionnaireSkipProps> = ({
  className,
  showIcon = true,
  hideWhenDisabled = true,
  children = 'Skip',
  disabled,
  onClick,
  ...props
}) => {
  const rootContext = useQuestionnaire();
  const canSkip = rootContext ? rootContext.canSkip : true;
  const isDisabled = disabled ?? !canSkip;

  if (hideWhenDisabled && isDisabled) {
    return null;
  }

  return (
    <Button
      variant="text"
      colorRole="neutral"
      disabled={isDisabled}
      data-state={isDisabled ? 'disabled' : 'enabled'}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (!e.defaultPrevented && rootContext) {
          rootContext.skipCurrent();
        }
      }}
      className={className}
      {...props}
    >
      <span>{children}</span>
      {showIcon && <Icon name="skip_next" size="sm" aria-hidden="true" />}
    </Button>
  );
};
QuestionnaireSkip.displayName = 'QuestionnaireSkip';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Next
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireNextProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  showIcon?: boolean;
  hideWhenLast?: boolean;
}

export const QuestionnaireNext: React.FC<QuestionnaireNextProps> = ({
  className,
  showIcon = true,
  hideWhenLast = true,
  children = 'Next',
  onClick,
  ...props
}) => {
  const rootContext = useQuestionnaire();
  const isLast = rootContext ? rootContext.isLast : false;

  if (hideWhenLast && isLast) {
    return null;
  }

  return (
    <Button
      variant="filled"
      colorRole="primary"
      data-state="enabled"
      onClick={(e) => {
        if (onClick) onClick(e);
        if (!e.defaultPrevented && rootContext) {
          rootContext.goToNext();
        }
      }}
      className={className}
      {...props}
    >
      <span>{children}</span>
      {showIcon && <Icon name="arrow_forward" size="sm" aria-hidden="true" />}
    </Button>
  );
};
QuestionnaireNext.displayName = 'QuestionnaireNext';

/* -------------------------------------------------------------------------------------------------
 * Questionnaire.Submit
 * -----------------------------------------------------------------------------------------------*/

export interface QuestionnaireSubmitProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  showIcon?: boolean;
  showOnlyWhenLast?: boolean;
}

export const QuestionnaireSubmit: React.FC<QuestionnaireSubmitProps> = ({
  className,
  showIcon = true,
  showOnlyWhenLast = true,
  children = 'Submit',
  type = 'submit',
  ...props
}) => {
  const rootContext = useQuestionnaire();
  const isLast = rootContext ? rootContext.isLast : true;

  if (showOnlyWhenLast && !isLast) {
    return null;
  }

  return (
    <Button
      variant="filled"
      colorRole="primary"
      type={type}
      data-state="enabled"
      className={className}
      {...props}
    >
      <span>{children}</span>
      {showIcon && <Icon name="check" size="sm" aria-hidden="true" />}
    </Button>
  );
};
QuestionnaireSubmit.displayName = 'QuestionnaireSubmit';

/* -------------------------------------------------------------------------------------------------
 * Compound & Flat Exports
 * -----------------------------------------------------------------------------------------------*/

export const Questionnaire = Object.assign(QuestionnaireRoot, {
  Root: QuestionnaireRoot,
  Progress: QuestionnaireProgress,
  Item: QuestionnaireItem,
  Title: QuestionnaireTitle,
  Description: QuestionnaireDescription,
  Choices: QuestionnaireChoices,
  Choice: QuestionnaireChoice,
  ChoiceInput: QuestionnaireChoiceInput,
  ChoiceLabel: QuestionnaireChoiceLabel,
  ChoiceShortcut: QuestionnaireChoiceShortcut,
  Input: QuestionnaireInput,
  Error: QuestionnaireError,
  Actions: QuestionnaireActions,
  Previous: QuestionnairePrevious,
  Skip: QuestionnaireSkip,
  Next: QuestionnaireNext,
  Submit: QuestionnaireSubmit,
});

export default Questionnaire;
