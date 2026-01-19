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

    e.target.value = '';
  }, [disabled, processFiles]);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-3">
      {/* Enhanced File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => {
            const config = FILE_TYPE_CONFIGS[file.type];
            const isImage = file.type === 'image';

            return (
              <div
                key={index}
                className={cn(
                  'relative group animate-bounce-in',
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border',
                  'bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)]',
                  'border-[var(--color-border-subtle)]',
                  'hover:border-[var(--color-border-default)] hover:shadow-lg',
                  'transition-all duration-300'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon/Thumbnail with glow */}
                <div className={cn(
                  'w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0',
                  'transition-all duration-300 group-hover:scale-110',
                  isImage ? 'p-0.5 shadow-md' : config.color
                )}>
                  {isImage && file.data ? (
                    <img
                      src={`data:${file.mimeType};base64,${file.data}`}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-xl">{config.icon}</span>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 max-w-[140px]">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                    <Icons.Info />
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Enhanced Remove Button */}
                <button
                  onClick={() => onFileRemove(index)}
                  disabled={disabled}
                  className={cn(
                    'flex-shrink-0 p-1.5 rounded-lg transition-all duration-300',
                    'text-[var(--color-text-muted)] hover:text-[var(--color-error)]',
                    'hover:bg-[var(--color-error-bg)] hover:scale-110',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Icons.Close />
                </button>
              </div>
            );
          })}

          {/* Enhanced Total Size Badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-600)]/5 border border-[var(--color-primary-500)]/20 text-[10px] text-[var(--color-primary-500)] font-medium">
            <Icons.Paperclip />
            {formatFileSize(totalSize)}
          </div>
        </div>
      )}

      {/* Enhanced Upload Area */}
      <div
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all duration-300',
          'min-h-[100px] flex flex-col items-center justify-center p-5 overflow-hidden',
          isDragging
            ? 'border-[var(--color-primary-500)] bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-600)]/5 scale-[1.01] shadow-lg shadow-[var(--color-primary-glow)]'
            : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Animated gradient border on drag */}
        {isDragging && (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-500)]/20 via-[var(--color-primary-600)]/20 to-[var(--color-primary-500)]/20 animate-shimmer -z-10" />
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
          accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.txt,.md,.py,.js,.ts,.json,.xml,.csv,.mp3,.wav"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
            isDragging
              ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-lg shadow-[var(--color-primary-glow-strong)] scale-110'
              : 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] border border-[var(--color-border-subtle)]'
          )}>
            <Icons.Paperclip />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {isDragging ? 'Datei loslassen' : 'Dateien hierher ziehen'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              oder klicken zum Auswählen
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            {[
              { icon: '📄', label: 'Dokumente' },
              { icon: '💻', label: 'Code' },
              { icon: '🖼️', label: 'Bilder' },
              { icon: '📊', label: 'Daten' },
              { icon: '🎵', label: 'Audio' },
            ].map((item) => (
              <span
                key={item.label}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-default)] transition-all"
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File Limits Info */}
      <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] px-1">
        <span className="flex items-center gap-1">
          <Icons.Info />
          Max: 25MB pro Datei
        </span>
        <span>PDF, DOC, TXT, MD, Code, Bilder, Audio</span>
      </div>
    </div>
  );
}
