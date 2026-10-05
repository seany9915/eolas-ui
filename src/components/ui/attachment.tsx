import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { Progress } from './progress';

export type AttachmentType = 'audio' | 'pdf' | 'image' | 'video' | 'document' | 'generic';
export type AttachmentStatus = 'idle' | 'uploading' | 'completed' | 'error';

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileSize?: string;
  fileType?: AttachmentType;
  status?: AttachmentStatus;
  uploadProgress?: number;
  errorMessage?: string;
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
      onRemove,
      onDownload,
      ...props
    },
    ref
  ) => {
    const config = fileTypeIcons[fileType] || fileTypeIcons.generic;
    const isUploading = status === 'uploading';
    const isError = status === 'error';

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`File attachment: ${fileName}`}
        className={cn(
          '@container relative flex flex-col rounded-lg border bg-surface p-3 transition-[border-color,background-color] duration-[var(--duration-quick)]',
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
            <span className="truncate font-sans text-sm font-medium text-on-surface" title={fileName}>
              {fileName}
            </span>
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
              <button
                type="button"
                onClick={onDownload}
                aria-label={`Download ${fileName}`}
                className="flex size-11 items-center justify-center rounded-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer"
              >
                <Icon name="download" size="sm" />
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${fileName}`}
                className="flex size-11 items-center justify-center rounded-sm text-on-surface-variant hover:bg-surface-container hover:text-error focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer"
              >
                <Icon name="close" size="sm" />
              </button>
            )}
          </div>
        </div>

        {/* Upload Progress Track */}
        {isUploading && (
          <Progress value={uploadProgress} showValue={false} size="sm" className="w-full mt-2.5" />
        )}
      </div>
    );
  }
);

Attachment.displayName = 'Attachment';
