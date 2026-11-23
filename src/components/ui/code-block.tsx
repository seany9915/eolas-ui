'use client';

/**
 * CodeBlock primitive.
 *
 * Base UI Integration: Consumes Base UI Tooltip and Button primitives.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/components/base/code-block
 * - https://ui.shadcn.com/docs/ai-elements
 *
 * TAXONOMY & USAGE:
 * - Displays source code, JSON parameters, database query outputs,
 *   and formatted clinical data structures inside agent execution traces or messages.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px touch targets on copy buttons.
 * - Follows DESIGN.md tokens: Roboto Mono typography, high-contrast text,
 *   concentric radius, and floating 2px focus ring.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Tooltip } from './tooltip';
import { announce } from '@/lib/announce';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export type CodeBlockSize = 'sm' | 'default';
export type CodeBlockVariant = 'default' | 'flush' | 'ghost' | 'destructive';
export type CodeBlockLineVariant = 'added' | 'removed' | 'highlighted';

interface CodeBlockContextValue {
  size: CodeBlockSize;
  variant: CodeBlockVariant;
}

const CodeBlockContext = React.createContext<CodeBlockContextValue>({
  size: 'default',
  variant: 'default',
});

/* -------------------------------------------------------------------------------------------------
 * CodeBlock (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  language?: string;
  size?: CodeBlockSize;
  variant?: CodeBlockVariant;
}

const CodeBlockRoot = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ children, className, language, size = 'default', variant = 'default', ...props }, ref) => {
    const contextValue = React.useMemo<CodeBlockContextValue>(
      () => ({ size, variant }),
      [size, variant]
    );

    return (
      <CodeBlockContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="code-block"
          data-language={language}
          data-size={size}
          data-variant={variant}
          className={cn(
            '@container group/code-block relative w-full font-mono text-xs overflow-hidden',
            'transition-[border-color,background-color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
            variant === 'default' && 'rounded-lg border border-outline-variant bg-surface-container-low',
            variant === 'destructive' && 'rounded-lg border border-error/40 bg-error-container/30 text-on-surface',
            variant === 'flush' && 'rounded-sm border-none bg-surface-container-low',
            variant === 'ghost' && 'rounded-sm border-none bg-transparent',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CodeBlockContext.Provider>
    );
  }
);
CodeBlockRoot.displayName = 'CodeBlock';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockHeader
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { size, variant } = React.useContext(CodeBlockContext);

    return (
      <div
        ref={ref}
        data-slot="code-block-header"
        className={cn(
          'flex items-center justify-between border-b',
          size === 'sm' ? 'px-3 py-1.5 min-h-8' : 'px-3.5 py-2 min-h-10',
          variant === 'destructive'
            ? 'border-error/30 bg-error-container/40'
            : 'border-outline-variant/40 bg-surface-container-high/60',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CodeBlockHeader.displayName = 'CodeBlockHeader';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockTitle
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlockTitle = React.forwardRef<HTMLSpanElement, CodeBlockTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="code-block-title"
        className={cn('font-sans text-xs font-semibold text-on-surface truncate flex items-center gap-1.5', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
CodeBlockTitle.displayName = 'CodeBlockTitle';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockActions
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  floating?: boolean;
}

export const CodeBlockActions = React.forwardRef<HTMLDivElement, CodeBlockActionsProps>(
  ({ children, className, floating = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="code-block-actions"
        data-floating={floating ? '' : undefined}
        className={cn(
          'flex items-center gap-1.5 shrink-0',
          floating
            ? 'absolute top-2 end-2 opacity-0 group-hover/code-block:opacity-100 focus-within:opacity-100 transition-opacity duration-quick motion-reduce:transition-none'
            : 'ms-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CodeBlockActions.displayName = 'CodeBlockActions';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockCopyButton
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockCopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CodeBlockCopyButton: React.FC<CodeBlockCopyButtonProps> = ({
  value,
  label = 'Copy code',
  copiedLabel = 'Copied to clipboard',
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    announce(copiedLabel);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip content={copied ? copiedLabel : label}>
      <Button
        type="button"
        variant="ghost"
        colorRole="neutral"
        size="sm"
        data-slot="code-block-copy-button"
        onClick={handleCopy}
        expandedTouchTarget
        aria-label={copied ? copiedLabel : label}
        className={cn(
          'size-7 min-h-[28px] min-w-[28px] p-0 text-on-surface-variant hover:text-on-surface transition-colors',
          copied && 'text-primary',
          className
        )}
      >
        <Icon name={copied ? 'check' : 'content_copy'} size="xs" aria-hidden="true" />
      </Button>
    </Tooltip>
  );
};
CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockContent
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockContentProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  className?: string;
  wrap?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
}

export const CodeBlockContent = React.forwardRef<HTMLPreElement, CodeBlockContentProps>(
  ({ children, className, wrap = false, lineNumbers = false, startLine = 1, ...props }, ref) => {
    const { size, variant } = React.useContext(CodeBlockContext);

    const renderedChildren = React.useMemo(() => {
      if (!lineNumbers) return children;
      if (typeof children === 'string') {
        return children.split('\n').map((line, index) => (
          <CodeBlockLine key={index} lineNumber={startLine + index}>
            {line.length > 0 ? line : ' '}
          </CodeBlockLine>
        ));
      }
      let lineIndex = 0;
      return React.Children.map(children, (child) => {
        if (React.isValidElement<CodeBlockLineProps>(child) && child.type === CodeBlockLine) {
          const currentLine = startLine + lineIndex;
          lineIndex += 1;
          return child.props.lineNumber === undefined
            ? React.cloneElement(child, { lineNumber: currentLine })
            : child;
        }
        return child;
      });
    }, [children, lineNumbers, startLine]);

    return (
      <pre
        ref={ref}
        data-slot="code-block-content"
        data-wrap={wrap ? '' : undefined}
        data-line-numbers={lineNumbers ? '' : undefined}
        className={cn(
          'overflow-x-auto font-mono leading-relaxed selection:bg-primary-container selection:text-on-primary-container',
          size === 'sm' ? 'p-2.5 text-xs' : 'p-3.5 text-xs',
          variant === 'destructive' ? 'text-on-error-container' : 'text-on-surface',
          wrap && 'whitespace-pre-wrap break-words [&_[data-slot=code-block-line]]:min-w-0',
          '[scrollbar-width:thin] [scrollbar-color:color-mix(in_oklch,var(--outline-variant)_60%,transparent)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline-variant/60 [&::-webkit-scrollbar-track]:bg-transparent',
          className
        )}
        {...props}
      >
        {renderedChildren}
      </pre>
    );
  }
);
CodeBlockContent.displayName = 'CodeBlockContent';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockLine
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockLineProps extends React.HTMLAttributes<HTMLDivElement> {
  lineNumber?: number;
  variant?: CodeBlockLineVariant;
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlockLine = React.forwardRef<HTMLDivElement, CodeBlockLineProps>(
  ({ lineNumber, variant, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="code-block-line"
        data-variant={variant}
        className={cn(
          'flex items-baseline gap-3 min-w-max px-1 rounded-sm',
          variant === 'added' && 'bg-success-container/40 text-on-surface',
          variant === 'removed' && 'bg-error-container/40 text-on-surface',
          variant === 'highlighted' && 'bg-primary-container/50 text-on-surface',
          !variant && 'hover:bg-state-hover',
          className
        )}
        {...props}
      >
        {lineNumber !== undefined && (
          <span
            className="w-6 shrink-0 font-mono text-xs tabular-nums text-on-surface-variant/75 text-end select-none"
            aria-hidden="true"
          >
            {lineNumber}
          </span>
        )}
        <span className="flex-1 min-w-0">{children}</span>
      </div>
    );
  }
);
CodeBlockLine.displayName = 'CodeBlockLine';

/* -------------------------------------------------------------------------------------------------
 * CodeBlockFooter
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlockFooter = React.forwardRef<HTMLDivElement, CodeBlockFooterProps>(
  ({ children, className, ...props }, ref) => {
    const { size, variant } = React.useContext(CodeBlockContext);

    return (
      <div
        ref={ref}
        data-slot="code-block-footer"
        className={cn(
          'border-t font-sans text-xs text-on-surface-variant flex items-center justify-between',
          size === 'sm' ? 'px-3 py-1' : 'px-3.5 py-1.5',
          variant === 'destructive'
            ? 'border-error/30 bg-error-container/40'
            : 'border-outline-variant/40 bg-surface-container-low',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CodeBlockFooter.displayName = 'CodeBlockFooter';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const CodeBlock = Object.assign(CodeBlockRoot, {
  Header: CodeBlockHeader,
  Title: CodeBlockTitle,
  Actions: CodeBlockActions,
  CopyButton: CodeBlockCopyButton,
  Content: CodeBlockContent,
  Line: CodeBlockLine,
  Footer: CodeBlockFooter,
});

export const CodeBlockCompound = CodeBlock;
export default CodeBlock;
