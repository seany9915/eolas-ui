'use client';

/**
 * Tool primitive (ToolCall).
 *
 * Base UI Integration: Consumes Base UI Collapsible primitive, Button primitive, and Icon primitive.
 *
 * TAXONOMY & USAGE:
 * - Use Tool to represent an agent tool invocation from input parameters to returned output,
 *   supporting live execution states ('calling', 'complete', 'error').
 * - Conforms to shadcn AI Elements Tool specification and DESIGN.md:
 *   - High-contrast visual hierarchy with calm neutral container fill.
 *   - Monospace font for tool function names and JSON argument inspection.
 *   - Accessible Collapsible disclosure with rotation chevron and keyboard navigation.
 *   - Integrates seamlessly with CodeBlock for syntax-highlighted parameters.
 */
import * as React from 'react';
import { Badge } from './badge';
import { CodeBlock } from './code-block';
import { InlineAlert } from './inline-alert';
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
import { useChatMessageContext } from './chat-message-context';
import { cn } from '@/lib/utils';

export type ToolStatus = 'calling' | 'complete' | 'error';

function toTraceStatus(status: ToolStatus): TraceStatus {
  if (status === 'calling') return 'running';
  if (status === 'error') return 'error';
  return 'complete';
}

interface ToolContextValue {
  variant: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
}

const ToolContext = React.createContext<ToolContextValue>({ variant: 'default' });

interface ToolLineRowProps {
  name: string;
  status: ToolStatus;
  duration?: string | number;
  iconName?: string;
  children?: React.ReactNode;
}

const ToolLineRow: React.FC<ToolLineRowProps> = ({
  name,
  status,
  duration,
  iconName,
  children,
}) => {
  const traceStatus = toTraceStatus(status);
  const formattedDuration = React.useMemo(() => {
    if (!duration) return null;
    if (typeof duration === 'number') return `${duration.toFixed(1)}s`;
    return duration;
  }, [duration]);

  const resolvedIconName =
    status === 'calling' || status === 'error' ? undefined : iconName || 'terminal';

  return (
    <TraceLine status={traceStatus}>
      <TraceIcon name={resolvedIconName} status={traceStatus} />
      <TraceTitle className="font-mono" title={name}>
        {name}
      </TraceTitle>
      {formattedDuration && (
        <TraceDescription duration={formattedDuration} className="hidden @sm:flex" />
      )}
      <div className="flex items-center gap-2 shrink-0">
        {status === 'calling' ? (
          <Badge size="sm" variant="outline" colorRole="neutral" className="text-xs leading-none h-5 py-0.5 px-2">
            Running
          </Badge>
        ) : status === 'error' ? (
          <Badge size="sm" variant="filled" colorRole="error" className="text-xs leading-none h-5 py-0.5 px-2">
            Failed
          </Badge>
        ) : (
          <Badge size="sm" variant="outline" colorRole="success" className="text-xs leading-none h-5 py-0.5 px-2">
            Complete
          </Badge>
        )}
        {children}
      </div>
    </TraceLine>
  );
};

export interface ToolRootProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsible>, 'className'> {
  status?: ToolStatus;
  variant?: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
  children?: React.ReactNode;
  className?: string;
}

const ToolRoot = React.forwardRef<HTMLDivElement, ToolRootProps>(
  ({ status = 'complete', variant, children, className, open, defaultOpen, onOpenChange, disabled, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'default');

    return (
      <ToolContext.Provider value={{ variant: resolvedVariant }}>
        <Trace
          ref={ref}
          variant={resolvedVariant}
          data-slot="tool-root"
          data-status={status}
          className={cn(
            resolvedVariant !== 'ghost' && resolvedVariant !== 'unboxed' && status === 'calling' && 'border-primary',
            resolvedVariant !== 'ghost' && resolvedVariant !== 'unboxed' && status === 'error' && 'border-error',
            className
          )}
        >
          <TraceCollapsible
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            disabled={disabled}
            {...props}
          >
            {children}
          </TraceCollapsible>
        </Trace>
      </ToolContext.Provider>
    );
  }
);
ToolRoot.displayName = 'Tool.Root';

export interface ToolHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children' | 'className'> {
  name: string;
  status?: ToolStatus;
  duration?: string | number;
  iconName?: string;
  children?: React.ReactNode;
  className?: string;
}

const ToolHeader = React.forwardRef<HTMLButtonElement, ToolHeaderProps>(
  ({ name, status = 'complete', duration, iconName, children, className, ...props }, ref) => {
    return (
      <TraceCollapsibleTrigger
        ref={ref}
        data-slot="tool-header"
        aria-label={props['aria-label'] || `${name} (${status === 'calling' ? 'Running' : status === 'error' ? 'Failed' : 'Complete'})`}
        className={className}
        {...props}
      >
        <ToolLineRow
          name={name}
          status={status}
          duration={duration}
          iconName={iconName}
        >
          {children}
        </ToolLineRow>
      </TraceCollapsibleTrigger>
    );
  }
);
ToolHeader.displayName = 'Tool.Header';

export interface ToolContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleContent>, 'className'> {
  children?: React.ReactNode;
  className?: string;
}

const ToolContent = React.forwardRef<HTMLDivElement, ToolContentProps>(
  ({ children, className, ...props }, ref) => {
    const { variant } = React.useContext(ToolContext);
    const isGhost = variant === 'ghost' || variant === 'unboxed';

    return (
      <TraceCollapsibleContent
        ref={ref}
        data-slot="tool-content"
        variant="flush"
        className={className}
        {...props}
      >
        <div
          className={cn(
            'flex flex-col gap-3 p-3.5 pt-2.5 text-sm font-sans text-on-surface-variant',
            isGhost && 'px-0'
          )}
        >
          {children}
        </div>
      </TraceCollapsibleContent>
    );
  }
);
ToolContent.displayName = 'Tool.Content';

function safeStringify(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  const ancestors: object[] = [];
  const replacer = function (this: unknown, _key: string, val: unknown) {
    if (typeof val === 'bigint') return `${val.toString()}n`;
    if (typeof val === 'object' && val !== null) {
      const thisIdx =
        typeof this === 'object' && this !== null ? ancestors.indexOf(this) : -1;
      if (thisIdx !== -1) {
        ancestors.length = thisIdx + 1;
      }
      if (ancestors.includes(val)) return '[Circular]';
      ancestors.push(val);
    }
    return val;
  };
  try {
    return JSON.stringify(value, replacer, 2) ?? String(value);
  } catch {
    try {
      return String(value);
    } catch {
      return '[Unserializable]';
    }
  }
}

export interface ToolInputProps extends React.HTMLAttributes<HTMLDivElement> {
  input?: Record<string, unknown> | string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const ToolInput: React.FC<ToolInputProps> = ({
  input,
  title = 'Arguments',
  children,
  className,
  ...props
}) => {
  const codeString = React.useMemo(() => safeStringify(input), [input]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      <span className="font-label text-xs font-semibold text-on-surface-variant">
        {title}
      </span>
      {children ? (
        children
      ) : codeString ? (
        <CodeBlock language="json" size="sm" variant="flush">
          <CodeBlock.Header className="px-3 py-1 bg-surface-container-high/60">
            <CodeBlock.Title className="text-xs font-mono text-on-surface-variant font-normal">arguments.json</CodeBlock.Title>
            <CodeBlock.CopyButton value={codeString} />
          </CodeBlock.Header>
          <CodeBlock.Content wrap className="max-h-64">
            <code>{codeString}</code>
          </CodeBlock.Content>
        </CodeBlock>
      ) : null}
    </div>
  );
};
ToolInput.displayName = 'Tool.Input';

export interface ToolOutputProps extends React.HTMLAttributes<HTMLDivElement> {
  output?: Record<string, unknown> | string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const ToolOutput: React.FC<ToolOutputProps> = ({
  output,
  title = 'Result',
  children,
  className,
  ...props
}) => {
  const codeString = React.useMemo(() => safeStringify(output), [output]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      <span className="font-label text-xs font-semibold text-on-surface-variant">
        {title}
      </span>
      {children ? (
        children
      ) : codeString ? (
        <CodeBlock language="json" size="sm" variant="flush">
          <CodeBlock.Header className="px-3 py-1 bg-surface-container-high/60">
            <CodeBlock.Title className="text-xs font-mono text-on-surface-variant font-normal">result.json</CodeBlock.Title>
            <CodeBlock.CopyButton value={codeString} />
          </CodeBlock.Header>
          <CodeBlock.Content wrap className="max-h-64">
            <code>{codeString}</code>
          </CodeBlock.Content>
        </CodeBlock>
      ) : null}
    </div>
  );
};
ToolOutput.displayName = 'Tool.Output';

export interface ToolErrorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  error?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const ToolError: React.FC<ToolErrorProps> = ({
  error,
  title = 'Error',
  children,
  className,
  ...props
}) => {
  return (
    <InlineAlert
      role="error"
      title={title}
      className={cn('font-mono text-xs', className)}
      {...props}
    >
      {children || error}
    </InlineAlert>
  );
};
ToolError.displayName = 'Tool.Error';

/* -------------------------------------------------------------------------------------------------
 * Full Tool Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface ToolProps {
  name: string;
  status?: ToolStatus;
  variant?: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
  input?: Record<string, unknown> | string;
  output?: Record<string, unknown> | string;
  error?: string;
  duration?: string | number;
  iconName?: string;
  defaultOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ToolComponent = React.forwardRef<HTMLDivElement, ToolProps>(
  (
    {
      name,
      status = 'complete',
      variant,
      input,
      output,
      error,
      duration,
      iconName,
      defaultOpen = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'default');
    const [open, setOpen] = React.useState(defaultOpen || status === 'error');

    React.useEffect(() => {
      if (status === 'error') setOpen(true);
    }, [status]);

    const hasBody = Boolean(
      children || input !== undefined || output !== undefined || error !== undefined
    );

    if (!hasBody) {
      return (
        <Trace
          ref={ref}
          variant={resolvedVariant}
          data-slot="tool-root"
          data-status={status}
          className={cn(
            resolvedVariant !== 'ghost' && resolvedVariant !== 'unboxed' && status === 'calling' && 'border-primary',
            resolvedVariant !== 'ghost' && resolvedVariant !== 'unboxed' && status === 'error' && 'border-error',
            className
          )}
          {...props}
        >
          <ToolLineRow
            name={name}
            status={status}
            duration={duration}
            iconName={iconName}
          />
        </Trace>
      );
    }

    return (
      <ToolRoot
        ref={ref}
        status={status}
        variant={resolvedVariant}
        open={open}
        onOpenChange={setOpen}
        className={className}
        {...props}
      >
        <ToolHeader
          name={name}
          status={status}
          duration={duration}
          iconName={iconName}
        />
        <ToolContent>
          {children ? (
            children
          ) : (
            <>
              {input !== undefined && <ToolInput input={input} />}
              {output !== undefined && <ToolOutput output={output} />}
              {error !== undefined && <ToolError error={error} />}
            </>
          )}
        </ToolContent>
      </ToolRoot>
    );
  }
);
ToolComponent.displayName = 'Tool';

/* -------------------------------------------------------------------------------------------------
 * Compound Export & Upstream Aliases
 * -----------------------------------------------------------------------------------------------*/
export const Tool = Object.assign(ToolComponent, {
  Root: ToolRoot,
  Header: ToolHeader,
  Trigger: ToolHeader,
  Content: ToolContent,
  Panel: ToolContent,
  Input: ToolInput,
  Args: ToolInput,
  Output: ToolOutput,
  Result: ToolOutput,
  Error: ToolError,
  State: Badge,
  Badge: Badge,
});

export {
  ToolRoot,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  ToolError,
  // shadcn AI Elements direct aliases
  Tool as ToolCall,
  ToolRoot as ToolCallRoot,
  ToolHeader as ToolCallHeader,
  ToolHeader as ToolTrigger,
  ToolContent as ToolCallContent,
  ToolContent as ToolPanel,
  ToolInput as ToolCallInput,
  ToolOutput as ToolCallOutput,
};

export default Tool;
