'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Icons } from './Icons';
import { ImageAttachment } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, images?: ImageAttachment[]) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        newImages.push({
          type: 'image',
          data: base64,
          mimeType: file.type,
          name: file.name,
        });
      }
    }

    setImages((prev) => [...prev, ...newImages]);
  };

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if ((trimmed || images.length > 0) && !isLoading) {
      onSend(trimmed, images.length > 0 ? images : undefined);
      setInput('');
      setImages([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const imageFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((f) => dataTransfer.items.add(f));
      await handleFileSelect(dataTransfer.files);
    }
  };

  const canSend = (input.trim() || images.length > 0) && !isLoading;

  return (
    <div className="flex-shrink-0 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            'relative rounded-2xl transition-all duration-200',
            'bg-[var(--color-bg-tertiary)]',
            'border border-[var(--color-border-subtle)]',
            isDragging && 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5 scale-[1.01]',
            isLoading && 'opacity-70',
            'shadow-lg shadow-black/20'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group animate-fade-in-up"
                >
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt={img.name || 'Uploaded image'}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-[var(--color-border-subtle)]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <span className="text-xs font-bold">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-500)]/10 rounded-2xl z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-[var(--color-primary-500)]">
                <Icons.Image />
                <span className="text-sm font-medium">Bild hier ablegen</span>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 p-3">
            {/* Attachment button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
                'text-[var(--color-text-muted)]',
                'hover:text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/10',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="Bild hinzufügen"
            >
              <Icons.Image />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Schreibe eine Nachricht..."
              rows={1}
              disabled={isLoading}
              className={cn(
                'flex-1 bg-transparent text-[var(--color-text-primary)]',
                'placeholder-[var(--color-text-muted)] text-[15px]',
                'resize-none focus:outline-none py-2.5 px-2',
                'disabled:opacity-50 min-h-[40px] max-h-[200px]',
                'leading-relaxed'
              )}
            />

            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
                canSend
                  ? 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] shadow-md shadow-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary-glow-strong)] hover:scale-105'
                  : 'text-[var(--color-text-muted)] cursor-not-allowed bg-[var(--color-bg-elevated)]'
              )}
              title={canSend ? 'Senden' : 'Nachricht eingeben...'}
            >
              <Icons.Send />
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
          Enter zum Senden, Shift + Enter für neue Zeile
        </p>
      </div>
    </div>
  );
}
