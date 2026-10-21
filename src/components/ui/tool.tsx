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
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Icon } from './icon';
import { Chip } from './chip';
import { CodeBlock } from './code-block';
import { cn } from '@/lib/utils';

export type ToolStatus = 'calling' | 'complete' | 'error';

export interface ToolRootProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root> {
  status?: ToolStatus;
  children?: React.ReactNode;
  className?: string;
}

const ToolRoot = React.forwardRef<HTMLDivElement, ToolRootProps>(
  ({ status = 'complete', children, className, ...props }, ref) => {
    return (
      <BaseCollapsible.Root
        ref={ref}
        data-slot="tool-root"
        data-status={status}
        className={cn(
          '@container w-full rounded-xl border border-outline-variant/80 bg-surface overflow-hidden',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          status === 'calling' && 'border-primary/50',
          status === 'error' && 'border-error/50',
          className
        )}
        {...props}
      >
        {children}
      </BaseCollapsible.Root>
    );
  }
);
ToolRoot.displayName = 'Tool.Root';

export interface ToolHeaderProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  name: string;
  status?: ToolStatus;
  duration?: string | number;
  iconName?: string;
  children?: React.ReactNode;
  className?: string;
}

const ToolHeader = React.forwardRef<HTMLButtonElement, ToolHeaderProps>(
  ({ name, status = 'complete', duration, iconName, children, className, ...props }, ref) => {
    const formattedDuration = React.useMemo(() => {
      if (!duration) return null;
      if (typeof duration === 'number') return `${duration.toFixed(1)}s`;
      return duration;
    }, [duration]);

    const defaultIcon =
      status === 'calling'
        ? 'progress_activity'
        : status === 'error'
        ? 'error'
        : iconName || 'terminal';

    return (
      <BaseCollapsible.Trigger
        ref={ref}
        data-slot="tool-header"
        className={cn(
          'group flex items-center justify-between w-full min-h-[44px] px-3.5 py-2.5 cursor-pointer text-left select-none',
          'hover:bg-surface-container/40 transition-colors duration-quick ease-standard motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              'size-6 rounded-md flex items-center justify-center shrink-0 select-none text-xs',
              status === 'calling' && 'bg-primary-container text-on-primary-container font-bold',
              status === 'complete' && 'bg-surface-container text-primary',
              status === 'error' && 'bg-error-container text-on-error-container'
            )}
            aria-hidden="true"
          >
            <Icon
              name={defaultIcon}
              size="xs"
              className={status === 'calling' ? 'animate-spin' : undefined}
            />
          </div>

          <span className="font-mono text-xs font-semibold text-on-surface truncate">
            {name}
          </span>

          {formattedDuration && (
            <span className="font-mono text-[11px] tabular-nums text-on-surface-variant/80 hidden @sm:inline">
              {formattedDuration}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status === 'calling' ? (
            <Chip size="sm" pattern="outline-neutral-fill" colorRole="primary" className="text-[10px] h-5 py-0">
              Running
            </Chip>
          ) : status === 'error' ? (
            <Chip size="sm" pattern="high-contrast-mixed" colorRole="error" className="text-[10px] h-5 py-0">
              Failed
            </Chip>
          ) : (
            <Chip size="sm" pattern="outline-neutral-fill" colorRole="neutral" className="text-[10px] h-5 py-0">
              Complete
            </Chip>
          )}

          {children}

          <span
            className="pl-1 text-on-surface-variant shrink-0 group-data-[panel-open]:rotate-180 transition-transform duration-quick ease-standard motion-reduce:transition-none"
            aria-hidden="true"
          >
            <Icon name="expand_more" size="xs" />
          </span>
        </div>
      </BaseCollapsible.Trigger>
    );
  }
);
ToolHeader.displayName = 'Tool.Header';

export interface ToolContentProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> {
  children?: React.ReactNode;
  className?: string;
}

const ToolContent = React.forwardRef<HTMLDivElement, ToolContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <BaseCollapsible.Panel
        ref={ref}
        data-slot="tool-content"
        className={cn(
          "overflow-hidden h-[var(--collapsible-panel-height)] transition-[height] duration-quick ease-standard motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden",
          className
        )}
        {...props}
      >
        <div className="p-3.5 pt-1 space-y-3 border-t border-outline-variant/40 text-xs">
          {children}
        </div>
      </BaseCollapsible.Panel>
    );
  }
);
ToolContent.displayName = 'Tool.Content';

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
  const codeString = React.useMemo(() => {
    if (!input) return '';
    if (typeof input === 'string') return input;
    return JSON.stringify(input, null, 2);
  }, [input]);

  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      <span className="font-label text-xs font-semibold text-on-surface-variant">
        {title}
      </span>
      {children ? (
        children
      ) : codeString ? (
        <CodeBlock language="json">
          <div className="flex items-center justify-between px-3 py-1 border-b border-outline-variant/40 bg-surface-container/60">
            <span className="text-[10px] font-mono text-on-surface-variant">arguments.json</span>
            <CodeBlock.CopyButton value={codeString} />
          </div>
          <CodeBlock.Content>
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
  const codeString = React.useMemo(() => {
    if (!output) return '';
    if (typeof output === 'string') return output;
    return JSON.stringify(output, null, 2);
  }, [output]);

  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      <span className="font-label text-xs font-semibold text-on-surface-variant">
        {title}
      </span>
      {children ? (
        children
      ) : codeString ? (
        <CodeBlock language="json">
          <div className="flex items-center justify-between px-3 py-1 border-b border-outline-variant/40 bg-surface-container/60">
            <span className="text-[10px] font-mono text-on-surface-variant">result.json</span>
            <CodeBlock.CopyButton value={codeString} />
          </div>
          <CodeBlock.Content>
            <code>{codeString}</code>
          </CodeBlock.Content>
        </CodeBlock>
      ) : null}
    </div>
  );
};
ToolOutput.displayName = 'Tool.Output';

export interface ToolErrorProps extends React.HTMLAttributes<HTMLDivElement> {
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
    <div
      role="alert"
      className={cn(
        'p-3 rounded-lg bg-error-container text-on-error-container border border-error/30 font-mono text-xs space-y-1',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 font-bold">
        <Icon name="error" size="xs" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div>{children || error}</div>
    </div>
  );
};
ToolError.displayName = 'Tool.Error';

/* -------------------------------------------------------------------------------------------------
 * Full Tool Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface ToolProps {
  name: string;
  status?: ToolStatus;
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
    return (
      <ToolRoot
        ref={ref}
        status={status}
        defaultOpen={defaultOpen || status === 'error'}
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
              {input && <ToolInput input={input} />}
              {output && <ToolOutput output={output} />}
              {error && <ToolError error={error} />}
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
  Content: ToolContent,
  Input: ToolInput,
  Args: ToolInput,
  Output: ToolOutput,
  Result: ToolOutput,
  Error: ToolError,
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
  ToolContent as ToolCallContent,
  ToolInput as ToolCallInput,
  ToolOutput as ToolCallOutput,
};

export default Tool;
