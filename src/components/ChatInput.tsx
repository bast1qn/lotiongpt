'use client';

import { useState, useRef, useEffect, KeyboardEvent, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Icons } from './Icons';
import { ImageAttachment, FileAttachment } from '@/types/chat';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { FileUpload } from './FileUpload';
import { PromptTemplates } from './PromptTemplates';

export type ChatModel = 'glm-4.6' | 'glm-4.7' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gpt-4.1' | 'claude-4.5-sonnet';

export interface ChatInputRef {
  send: () => void;
  focus: () => void;
}

interface ChatInputProps {
  onSend: (message: string, images?: ImageAttachment[], files?: FileAttachment[]) => void;
  isLoading?: boolean;
  selectedModel?: ChatModel;
  onModelChange?: (model: ChatModel) => void;
  thinkingEnabled?: boolean;
  onThinkingChange?: (enabled: boolean) => void;
  showFileUpload?: boolean;
  onToggleFileUpload?: () => void;
  onTemplateSelect?: (prompt: string) => void;
}

const MODEL_INFO: Record<ChatModel, { name: string; provider: string; icon: string }> = {
  'glm-4.6': { name: 'GLM-4.6', provider: 'Zhipu AI', icon: '🇨🇳' },
  'glm-4.7': { name: 'GLM-4.7', provider: 'Zhipu AI', icon: '🇨🇳' },
  'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', provider: 'Google', icon: '🌐' },
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', provider: 'Google', icon: '⚡' },
  'gpt-4.1': { name: 'GPT-4.1', provider: 'OpenAI', icon: '🤖' },
  'claude-4.5-sonnet': { name: 'Claude 4.5', provider: 'Anthropic', icon: '🧠' },
};

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(function ChatInput({
  onSend,
  isLoading = false,
  selectedModel = 'glm-4.7',
  onModelChange,
  thinkingEnabled = true,
  onThinkingChange,
  showFileUpload = false,
  onToggleFileUpload,
  onTemplateSelect
}, ref) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  // Handle send - defined before useImperativeHandle
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if ((trimmed || images.length > 0 || files.length > 0) && !isLoading) {
      onSend(trimmed, images.length > 0 ? images : undefined, files.length > 0 ? files : undefined);
      setInput('');
      setImages([]);
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [input, images, files, isLoading, onSend]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    send: handleSend,
    focus: () => textareaRef.current?.focus(),
  }), [handleSend]);

  // Get initial settings from storage
  useEffect(() => {
    const settings = storage.getSettings();
    if (onModelChange) {
      const modelMap: Record<string, ChatModel> = {
        'glm-4.6': 'glm-4.6',
        'glm-4.7': 'glm-4.7',
      };
      onModelChange(modelMap[settings.model] || 'glm-4.7');
    }
    if (onThinkingChange) {
      onThinkingChange(settings.thinking ?? true);
    }
  }, [onModelChange, onThinkingChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelPickerRef.current && !modelPickerRef.current.contains(event.target as Node)) {
        setShowModelPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleFileSelect = async (fileList: FileList) => {
    const newImages: ImageAttachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
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

    // Check if files are being dragged
    if (e.dataTransfer.files.length > 0) {
      // If we have image files, add them to images
      const imageFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        imageFiles.forEach(f => dataTransfer.items.add(f));
        handleFileSelect(dataTransfer.files);
      }
    }
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

  const handleFilesAdd = (newFiles: FileAttachment[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
    onTemplateSelect?.(prompt);
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

  const hasAttachments = images.length > 0 || files.length > 0;
  const canSend = (input.trim() || hasAttachments) && !isLoading;

  return (
    <div className="flex-shrink-0 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Premium Controls Bar */}
        <div className="flex items-center gap-2 mb-3">
          {/* Premium Model Selector */}
          <div className="relative" ref={modelPickerRef}>
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                'bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:border-[var(--color-accent-500)]/50 hover:bg-[var(--color-bg-elevated)] hover:shadow-md hover:shadow-[var(--color-accent-glow-subtle)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]'
              )}
              aria-label="Modell auswahlen"
              aria-haspopup="listbox"
              aria-expanded={showModelPicker}
            >
              <span>{MODEL_INFO[selectedModel].icon}</span>
              <span className="hidden sm:inline">{MODEL_INFO[selectedModel].name}</span>
              <Icons.ChevronDown />
            </button>

            {/* Model Dropdown */}
            {showModelPicker && (
              <div
                className="absolute bottom-full left-0 mb-2 w-60 bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-2xl shadow-black/50 animate-fade-in-up z-20"
                role="listbox"
                aria-label="KI-Modelle"
              >
                <div className="p-2 space-y-0.5">
                  <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Zhipu AI
                  </div>
                  {(['glm-4.6', 'glm-4.7'] as ChatModel[]).map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        onModelChange?.(model);
                        setShowModelPicker(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]',
                        selectedModel === model
                          ? 'bg-[var(--color-accent-500)]/15 text-[var(--color-accent-500)] shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                      )}
                      role="option"
                      aria-selected={selectedModel === model}
                    >
                      <span>{MODEL_INFO[model].icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{MODEL_INFO[model].name}</div>
                        <div className="text-xs opacity-70">{MODEL_INFO[model].provider}</div>
                      </div>
                      {selectedModel === model && <Icons.Check />}
                    </button>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">
                    Google
                  </div>
                  {(['gemini-2.5-pro', 'gemini-2.5-flash'] as ChatModel[]).map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        onModelChange?.(model);
                        setShowModelPicker(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        selectedModel === model
                          ? 'bg-[var(--color-accent-500)]/15 text-[var(--color-accent-500)] shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                      )}
                    >
                      <span>{MODEL_INFO[model].icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{MODEL_INFO[model].name}</div>
                        <div className="text-xs opacity-70">{MODEL_INFO[model].provider}</div>
                      </div>
                      {selectedModel === model && <Icons.Check />}
                    </button>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">
                    Other
                  </div>
                  {(['gpt-4.1', 'claude-4.5-sonnet'] as ChatModel[]).map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        onModelChange?.(model);
                        setShowModelPicker(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        selectedModel === model
                          ? 'bg-[var(--color-accent-500)]/15 text-[var(--color-accent-500)] shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                      )}
                    >
                      <span>{MODEL_INFO[model].icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{MODEL_INFO[model].name}</div>
                        <div className="text-xs opacity-70">{MODEL_INFO[model].provider}</div>
                      </div>
                      {selectedModel === model && <Icons.Check />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium Thinking Toggle */}
          <button
            onClick={() => onThinkingChange?.(!thinkingEnabled)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              'border',
              thinkingEnabled
                ? 'bg-[var(--color-accent-500)]/15 border-[var(--color-accent-500)]/50 text-[var(--color-accent-500)] shadow-md shadow-[var(--color-accent-glow-subtle)]'
                : 'bg-[var(--color-bg-tertiary)]/80 border-[var(--color-border-medium)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-accent-500)]/30'
            )}
            title={thinkingEnabled ? 'Thinking ist aktiv' : 'Thinking ist deaktiviert'}
          >
            <Icons.Zap />
            <span className="hidden sm:inline">Thinking: {thinkingEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Premium File Upload Toggle */}
          <button
            onClick={onToggleFileUpload}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              'border',
              showFileUpload
                ? 'bg-[var(--color-accent-500)]/15 border-[var(--color-accent-500)]/50 text-[var(--color-accent-500)] shadow-md shadow-[var(--color-accent-glow-subtle)]'
                : 'bg-[var(--color-bg-tertiary)]/80 border-[var(--color-border-medium)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-accent-500)]/30'
            )}
            title="Dateien anfgen"
          >
            <Icons.Paperclip />
            <span className="hidden sm:inline">Dateien</span>
          </button>

          {/* Prompt Templates */}
          <PromptTemplates onTemplateSelect={handleTemplateSelect} />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Premium Token Estimate & Attachment Count */}
          <div className="flex items-center gap-3">
            {hasAttachments && (
              <span className="text-xs font-medium text-[var(--color-accent-400)] bg-[var(--color-accent-500)]/10 px-2 py-1 rounded-lg">
                {images.length + files.length} {images.length + files.length === 1 ? 'Anhang' : 'Anhange'}
              </span>
            )}
            {input.length > 0 && (
              <span className="text-xs font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)]/80 px-2 py-1 rounded-lg border border-[var(--color-border-subtle)]">
                ~{Math.ceil(input.length / 4)} tokens
              </span>
            )}
          </div>
        </div>

        {/* Premium File Upload Panel */}
        {showFileUpload && (
          <div className="mb-3 animate-slide-in-bottom">
            <FileUpload
              files={files}
              onFilesAdd={handleFilesAdd}
              onFileRemove={handleFileRemove}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Premium Input Container */}
        <div
          className={cn(
            'relative rounded-2xl transition-all duration-200',
            'bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm',
            'border border-[var(--color-border-medium)]',
            'shadow-inner-subtle',
            isDragging && 'border-[var(--color-accent-500)] bg-[var(--color-accent-500)]/10 shadow-lg shadow-[var(--color-accent-glow)]',
            isLoading && 'opacity-70'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Image Previews (premium, kept for quick image paste) */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2.5 p-4 pb-0">
              {images.map((img, index) => (
                <div key={index} className="relative group animate-scale-in">
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt={img.name || 'Uploaded image'}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl border-2 border-[var(--color-border-subtle)] shadow-lg hover:shadow-xl hover:shadow-[var(--color-accent-glow-subtle)] transition-all duration-200"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <span className="text-sm font-bold"></span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Premium Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent-500)]/10 rounded-2xl z-10 backdrop-blur-md animate-fade-in">
              <div className="flex flex-col items-center gap-3 text-[var(--color-accent-500)] animate-scale-in-spring">
                <div className="p-3 rounded-2xl bg-[var(--color-accent-500)]/20 shadow-lg shadow-[var(--color-accent-glow)]">
                  <Icons.Image />
                </div>
                <span className="text-sm font-semibold">Bild hier ablegen</span>
              </div>
            </div>
          )}

          <div className="flex items-end gap-3 p-4">
            {/* Attachment button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={cn(
                'p-2.5 rounded-lg transition-all flex-shrink-0',
                'text-[var(--color-text-muted)]',
                'hover:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10',
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
              aria-label="Nachricht eingeben"
              aria-describedby="chat-input-hint"
              maxLength={10000}
            />

            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'p-2 rounded-md transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-tertiary)]',
                canSend
                  ? 'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-600)]'
                  : 'text-[var(--color-text-muted)] cursor-not-allowed bg-[var(--color-bg-elevated)]'
              )}
              title={canSend ? 'Senden' : 'Nachricht eingeben...'}
              aria-label={canSend ? 'Nachricht senden' : 'Nachricht eingeben zum Senden'}
            >
              <Icons.Send />
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p id="chat-input-hint" className="text-center text-xs text-[var(--color-text-muted)] mt-2">
          Enter zum Senden, Shift + Enter für neue Zeile
        </p>
      </div>
    </div>
  );
});
