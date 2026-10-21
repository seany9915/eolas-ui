import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Icon } from './icon';
import { Progress } from './progress';
import { Tooltip } from './tooltip';

export type AttachmentType = 'audio' | 'pdf' | 'image' | 'video' | 'document' | 'generic';
export type AttachmentStatus = 'idle' | 'uploading' | 'completed' | 'error';
export type AttachmentVariant = 'card' | 'chip' | 'compact' | 'default';

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileSize?: string;
  fileType?: AttachmentType;
  status?: AttachmentStatus;
  uploadProgress?: number;
  errorMessage?: string;
  variant?: AttachmentVariant;
  onRemove?: () => void;
  onDownload?: () => void;
}

const fileTypeIcons: Record<AttachmentType, { icon: string; wash: string; text: string }> = {
  audio: {
    icon: 'mic',
    wash: 'bg-primary-container',
    text: 'text-on-primary-container',
  },
  pdf: {
    icon: 'description',
    wash: 'bg-error-container',
    text: 'text-on-error-container',
  },
  image: {
    icon: 'image',
    wash: 'bg-secondary-container',
    text: 'text-on-secondary-container',
  },
  video: {
    icon: 'movie',
    wash: 'bg-tertiary-container',
    text: 'text-on-tertiary-container',
  },
  document: {
    icon: 'article',
    wash: 'bg-surface-container',
    text: 'text-on-surface-variant',
  },
  generic: {
    icon: 'attach_file',
    wash: 'bg-surface-container',
    text: 'text-on-surface-variant',
  },
};

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      fileName,
      fileSize,
      fileType = 'generic',
      status = 'idle',
      uploadProgress = 0,
      errorMessage,
      variant = 'default',
      onRemove,
      onDownload,
      ...props
    },
    ref
  ) => {
    const config = fileTypeIcons[fileType] || fileTypeIcons.generic;
    const isUploading = status === 'uploading';
    const isError = status === 'error';

    if (variant === 'chip' || variant === 'compact') {
      return (
        <div
          ref={ref}
          role="group"
          aria-label={`File attachment: ${fileName}`}
          className={cn(
            'inline-flex items-center gap-2 px-2.5 py-1 min-h-[36px] max-w-[280px] rounded-md bg-surface-container border border-outline-variant shrink-0',
            'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
            isError ? 'border-error' : 'hover:border-outline',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded select-none',
              config.wash,
              config.text
            )}
            aria-hidden="true"
          >
            <Icon name={config.icon} size="xs" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col pr-1">
            <Tooltip content={fileName}>
              <span className="truncate font-sans text-xs font-medium text-on-surface cursor-default">
                {fileName}
              </span>
            </Tooltip>
            {fileSize && (
              <span className="font-mono text-[10px] tabular-nums text-on-surface-variant/80">
                {fileSize}
              </span>
            )}
          </div>

          {onRemove && (
            <Tooltip content={`Remove ${fileName}`}>
              <Button
                type="button"
                variant="ghost"
                colorRole="neutral"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                expandedTouchTarget
                className="size-6 min-h-[24px] min-w-[24px] p-0 shrink-0 text-on-surface-variant hover:text-error"
                aria-label={`Remove ${fileName}`}
              >
                <Icon name="close" size="xs" aria-hidden="true" />
              </Button>
            </Tooltip>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`File attachment: ${fileName}`}
        className={cn(
          '@container relative flex flex-col w-full rounded-lg border bg-surface p-3 transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          isError ? 'border-error' : 'border-outline-variant hover:border-outline',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/* File Type Icon with Semantic Wash */}
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-md select-none',
              config.wash,
              config.text
            )}
            aria-hidden="true"
          >
            <Icon name={config.icon} size="md" />
          </div>

          {/* Filename and Meta */}
          <div className="flex min-w-0 flex-1 flex-col">
            <Tooltip content={fileName}>
              <span className="truncate font-sans text-sm font-medium text-on-surface cursor-default">
                {fileName}
              </span>
            </Tooltip>
            <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant tabular-nums">
              {fileSize && <span>{fileSize}</span>}
              {isUploading && (
                <span className="text-primary font-medium">Uploading ({Math.round(uploadProgress)}%)</span>
              )}
              {isError && (
                <span className="text-error font-medium">{errorMessage || 'Upload failed'}</span>
              )}
            </div>
          </div>

          {/* Action Triggers with Minimum 44px Touch Targets */}
          <div className="flex items-center">
            {onDownload && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onDownload}
                aria-label={`Download ${fileName}`}
                className="rounded-sm text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="download" size="sm" />
              </Button>
            )}
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${fileName}`}
                className="rounded-sm text-on-surface-variant hover:text-error"
              >
                <Icon name="close" size="sm" />
              </Button>
            )}
          </div>
        </div>

        {/* Upload Progress Track */}
        {isUploading && (
          <Progress
            value={uploadProgress}
            showValue={false}
            size="sm"
            aria-label={`Upload progress for ${fileName}`}
            className="w-full mt-2.5"
          />
        )}
      </div>
    );
  }
);

Attachment.displayName = 'Attachment';
