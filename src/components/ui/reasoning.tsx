/**
 * Reasoning primitive.
 *
 * Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements
 * - https://ui.shadcn.com/docs/ai-elements/reasoning
 *
 * TAXONOMY & USAGE:
 * - Displays an AI agent's live or historical thinking process as it streams or settles.
 * - Supports both declarative compound composition:
 *     <Reasoning isStreaming={isStreaming}>
 *       <ReasoningTrigger />
 *       <ReasoningContent>{reasoningText}</ReasoningContent>
 *     </Reasoning>
 *   and shorthand invocation:
 *     <Reasoning duration="1.8s">{reasoningText}</Reasoning>
 * - Manages the dynamic transition:
 *   - While streaming: active spinning indicator, "Thinking...", auto-expanded to show thought stream.
 *   - When complete: psychology icon, "Thought", formatted elapsed duration badge, auto-collapsed.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on disclosure triggers.
 * - Follows DESIGN.md tokens: floating 2px focus ring, semantic colors, and zero triple-tints.
 */
import * as React from 'react';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  type TraceStatus,
} from './trace';
import { ShimmerText } from './shimmer-text';
import { Button } from './button';
import { Icon } from './icon';
import { useChatMessageContext } from './chat-message-context';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export interface ReasoningContextValue {
  isStreaming: boolean;
  computedStatus: TraceStatus;
  displayTitle: string;
  formattedDuration?: string;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

export function useReasoning() {
  const ctx = React.useContext(ReasoningContext);
  if (!ctx) {
    throw new Error('Reasoning compound subcomponents must be used within a <Reasoning> parent.');
  }
  return ctx;
}

/* -------------------------------------------------------------------------------------------------
 * ReasoningTrigger
 * -----------------------------------------------------------------------------------------------*/
export interface ReasoningTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children'> {
  children?: React.ReactNode;
  className?: string;
}

export const ReasoningTrigger = React.forwardRef<HTMLButtonElement, ReasoningTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { computedStatus, displayTitle, formattedDuration } = useReasoning();
    const isRunning = computedStatus === 'running';

    return (
      <TraceCollapsibleTrigger ref={ref} className={className} {...props}>
        {children ?? (
          <TraceLine status={computedStatus}>
            <TraceIcon
              name={isRunning ? 'progress_activity' : 'psychology'}
              status={isRunning ? 'running' : 'default'}
              className={!isRunning ? 'text-secondary' : undefined}
            />
            <TraceTitle>
              {isRunning ? (
                <ShimmerText variant="secondary" active={true}>
                  {displayTitle}
                </ShimmerText>
              ) : (
                displayTitle
              )}
            </TraceTitle>
            {formattedDuration && displayTitle !== `Thought for ${formattedDuration}` && (
              <TraceDescription>
                <span className="font-mono tabular-nums">{formattedDuration}</span>
              </TraceDescription>
            )}
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
    );
  }
);
ReasoningTrigger.displayName = 'ReasoningTrigger';

export interface ReasoningCopyButtonProps {
  value: string;
  className?: string;
}

export const ReasoningCopyButton: React.FC<ReasoningCopyButtonProps> = ({ value, className }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      colorRole="neutral"
      size="sm"
      onClick={handleCopy}
      expandedTouchTarget
      aria-label={copied ? 'Copied thoughts' : 'Copy thoughts'}
      className={cn('size-7 min-h-[28px] min-w-[28px] p-0 text-on-surface-variant hover:text-on-surface', className)}
    >
      <Icon name={copied ? 'check' : 'content_copy'} size="xs" aria-hidden="true" />
    </Button>
  );
};
ReasoningCopyButton.displayName = 'ReasoningCopyButton';

/* -------------------------------------------------------------------------------------------------
 * ReasoningContent
 * -----------------------------------------------------------------------------------------------*/
export interface ReasoningContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const ReasoningContent = React.forwardRef<HTMLDivElement, ReasoningContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TraceCollapsibleContent ref={ref} variant="flush" className={className} {...props}>
        <div className="px-3.5 py-3">
          <div className="border-l-2 border-outline-variant/40 pl-3.5 ml-1 my-0.5 space-y-2 whitespace-pre-wrap font-sans text-sm text-on-surface-variant leading-relaxed">
            {children}
          </div>
        </div>
      </TraceCollapsibleContent>
    );
  }
);
ReasoningContent.displayName = 'ReasoningContent';

/* -------------------------------------------------------------------------------------------------
 * Reasoning (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface ReasoningProps {
  isStreaming?: boolean;
  status?: TraceStatus;
  duration?: string | number;
  title?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  variant?: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
  className?: string;
}

export const ReasoningRoot = React.forwardRef<HTMLDivElement, ReasoningProps>(
  (
    {
      isStreaming = false,
      status,
      duration,
      title,
      defaultOpen,
      open,
      onOpenChange,
      children,
      variant,
      className,
    },
    ref
  ) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'embedded');
    const computedStatus: TraceStatus = status ?? (isStreaming ? 'running' : 'complete');
    const isRunning = computedStatus === 'running';

    const formattedDuration =
      typeof duration === 'number'
        ? `${duration.toFixed(1)}s`
        : duration;

    const defaultTitle = isRunning
      ? 'Thinking...'
      : formattedDuration
      ? `Thought for ${formattedDuration}`
      : 'Thought';
    const displayTitle = title ?? defaultTitle;

    // By default, open while streaming so the clinician can see live reasoning, collapse when complete
    const resolvedDefaultOpen = defaultOpen ?? isRunning;

    const isCompound = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === ReasoningTrigger ||
          child.type === ReasoningContent ||
          (child.type as { displayName?: string })?.displayName === 'ReasoningTrigger' ||
          (child.type as { displayName?: string })?.displayName === 'ReasoningContent')
    );

    return (
      <ReasoningContext.Provider
        value={{
          isStreaming,
          computedStatus,
          displayTitle,
          formattedDuration,
        }}
      >
        <div ref={ref} data-slot="reasoning" className={cn('w-full', className)}>
          <Trace variant={resolvedVariant}>
            <TraceCollapsible
              defaultOpen={resolvedDefaultOpen}
              open={open}
              onOpenChange={onOpenChange}
            >
              {isCompound ? (
                children
              ) : (
                <>
                  <ReasoningTrigger />
                  <ReasoningContent>{children}</ReasoningContent>
                </>
              )}
            </TraceCollapsible>
          </Trace>
        </div>
      </ReasoningContext.Provider>
    );
  }
);
ReasoningRoot.displayName = 'Reasoning';

export const ReasoningHeader = ReasoningTrigger;

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Reasoning = Object.assign(ReasoningRoot, {
  Header: ReasoningTrigger,
  Trigger: ReasoningTrigger,
  Content: ReasoningContent,
  CopyButton: ReasoningCopyButton,
});

export default Reasoning;
