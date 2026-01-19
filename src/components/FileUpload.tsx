'use client';

import { useState, useRef, useCallback } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { FILE_TYPE_CONFIGS, getFileType, formatFileSize, isFileAllowed, FileAttachment } from '@/types/chat';

interface FileUploadProps {
  files: FileAttachment[];
  onFilesAdd: (files: FileAttachment[]) => void;
  onFileRemove: (index: number) => void;
  disabled?: boolean;
}

export function FileUpload({ files, onFilesAdd, onFileRemove, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const processFiles = useCallback(async (fileList: FileList) => {
    const validFiles: FileAttachment[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const check = isFileAllowed(file);

      if (!check.allowed) {
        errors.push(`${file.name}: ${check.reason}`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const fileType = getFileType(file);

        validFiles.push({
          type: fileType,
          data: base64,
          mimeType: file.type,
          name: file.name,
          size: file.size,
        });
      } catch (error) {
        errors.push(`${file.name}: Fehler beim Lesen`);
      }
    }

    if (validFiles.length > 0) {
      onFilesAdd(validFiles);
    }

    return { addedCount: validFiles.length, errors };
  }, [onFilesAdd]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const { addedCount, errors } = await processFiles(e.dataTransfer.files);

    // Show errors via console for now, could be toast notifications
    if (errors.length > 0) {
      console.warn('File upload errors:', errors);
    }
  }, [disabled, processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;

    const { addedCount, errors } = await processFiles(e.target.files);

    if (errors.length > 0) {
      console.warn('File upload errors:', errors);
    }

    // Reset input
    e.target.value = '';
  }, [disabled, processFiles]);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-2">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => {
            const config = FILE_TYPE_CONFIGS[file.type];
            const isImage = file.type === 'image';

            return (
              <div
                key={index}
                className={cn(
                  'relative group animate-fade-in-up',
                  'flex items-center gap-2 px-3 py-2 rounded-lg border',
                  'bg-[var(--color-bg-tertiary)] border-[var(--color-border-subtle)]',
                  'hover:border-[var(--color-border-default)] transition-all'
                )}
              >
                {/* Icon/Thumbnail */}
                {isImage && file.data ? (
                  <img
                    src={`data:${file.mimeType};base64,${file.data}`}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className={cn('w-10 h-10 rounded flex items-center justify-center text-lg', config.color)}>
                    {config.icon}
                  </div>
                )}

                {/* File Info */}
                <div className="min-w-0 max-w-[150px]">
                  <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onFileRemove(index)}
                  disabled={disabled}
                  className={cn(
                    'p-1 rounded-md transition-colors',
                    'text-[var(--color-text-muted)] hover:text-[var(--color-error)]',
                    'hover:bg-[var(--color-error-bg)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Icons.Close />
                </button>
              </div>
            );
          })}

          {/* Total Size Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-bg-elevated)] text-[10px] text-[var(--color-text-muted)]">
            <Icons.Info />
            {formatFileSize(totalSize)}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-all duration-200',
          'min-h-[80px] flex flex-col items-center justify-center p-4',
          isDragging
            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5 scale-[1.01]'
            : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
          accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.txt,.md,.py,.js,.ts,.json,.xml,.csv,.mp3,.wav"
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            isDragging ? 'bg-[var(--color-primary-500)] text-white' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]'
          )}>
            <Icons.Paperclip />
          </div>

          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {isDragging ? 'Datei loslassen' : 'Dateien hierher ziehen'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              oder klicken zum Auswählen
            </p>
          </div>

          <div className="flex flex-wrap gap-1 justify-center mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              📄 PDF, DOC
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              💻 Code
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              🖼️ Bilder
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              📊 CSV, JSON
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              🎵 Audio
            </span>
          </div>
        </div>
      </div>

      {/* File Limits Info */}
      <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] px-1">
        <span>Max: 25MB pro Datei</span>
        <span>Unterstützte Formate: PDF, DOC, TXT, MD, Code, Bilder, Audio</span>
      </div>
    </div>
  );
}
