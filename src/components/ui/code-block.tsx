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
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * CodeBlock (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  language?: string;
  variant?: 'default' | 'flush' | 'ghost';
}

const CodeBlockRoot = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ children, className, language, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="code-block"
        data-language={language}
        className={cn(
          '@container relative w-full font-mono text-xs overflow-hidden',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          variant === 'default' && 'rounded-lg border border-outline-variant bg-surface-container/60',
          (variant === 'flush' || variant === 'ghost') && 'rounded-sm border-none bg-surface-container/60',
          className
        )}
        {...props}
      >
        {children}
      </div>
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
    return (
      <div
        ref={ref}
        data-slot="code-block-header"
        className={cn(
          'flex items-center justify-between px-3.5 py-2 border-b border-outline-variant/40 bg-surface-container min-h-[38px]',
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
          floating ? 'absolute top-2 right-2 z-10' : 'ml-auto',
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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(value);
    setCopied(true);
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
}

export const CodeBlockContent = React.forwardRef<HTMLPreElement, CodeBlockContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        data-slot="code-block-content"
        className={cn(
          'p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed text-on-surface selection:bg-primary-container selection:text-on-primary-container',
          '[scrollbar-width:thin] [scrollbar-color:theme(colors.outline-variant/60)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline-variant/60 [&::-webkit-scrollbar-track]:bg-transparent',
          className
        )}
        {...props}
      >
        {children}
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
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlockLine = React.forwardRef<HTMLDivElement, CodeBlockLineProps>(
  ({ lineNumber, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="code-block-line"
        className={cn('flex items-baseline gap-3 min-w-max hover:bg-surface-variant/30 px-1 rounded-xs', className)}
        {...props}
      >
        {lineNumber !== undefined && (
          <span
            className="w-6 shrink-0 font-mono text-[10px] tabular-nums text-on-surface-variant/50 text-right select-none"
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
    return (
      <div
        ref={ref}
        data-slot="code-block-footer"
        className={cn(
          'px-3.5 py-1.5 border-t border-outline-variant/40 bg-surface-container/60 font-sans text-[11px] text-on-surface-variant flex items-center justify-between',
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
