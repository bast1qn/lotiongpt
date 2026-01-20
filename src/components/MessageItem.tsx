'use client';

import { useState } from 'react';
import { Message, FileAttachment, FILE_TYPE_CONFIGS, formatFileSize } from '@/types/chat';
import { formatMessage, copyToClipboard } from '@/lib/utils';
import { Icons } from './Icons';
import { useToast } from '@/lib/hooks/useToast';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  index?: number;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  onBranch?: () => void;
  isLast?: boolean;
  isEditing?: boolean;
  onEditComplete?: (newContent: string) => void;
  onCancelEdit?: () => void;
  searchQuery?: string;
  isSearchMatch?: boolean;
  isStarred?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function MessageItem({
  message,
  index = 0,
  onEdit,
  onRegenerate,
  onDelete,
  onToggleStar,
  onBranch,
  isLast = false,
  isEditing = false,
  onEditComplete,
  onCancelEdit,
  searchQuery = '',
  isSearchMatch = false,
  isStarred = false,
  suggestions = [],
  onSuggestionClick
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState(message.content);
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Highlight search matches in text
  const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-[var(--color-primary-500)]/30 text-[var(--color-text-primary)] px-0.5 rounded">$1</mark>');
  };

  // Format message with optional highlighting
  const formatMessageWithHighlight = (content: string) => {
    const formatted = formatMessage(content);
    if (searchQuery.trim()) {
      return highlightText(formatted, searchQuery);
    }
    return formatted;
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      showToast('In Zwischenablage kopiert', 'success');
      setCopiedCode('all');
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      showToast('Fehler beim Kopieren', 'error');
    }
  };

  const handleCopyCodeBlock = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      showToast('Code kopiert', 'success');
      setCopiedCode(code.slice(0, 20));
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleEditSave = () => {
    if (onEditComplete && editContent.trim() !== message.content) {
      onEditComplete(editContent.trim());
    } else if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      onCancelEdit?.();
    }
  };

  // Extract code blocks from message
  const codeBlocks = message.content.match(/```[\s\S]*?```/g) || [];
  const hasCodeBlocks = codeBlocks.length > 0;

  return (
    <>
      <div
        className={cn(
          'flex gap-3 sm:gap-4 group',
          isUser ? 'flex-row-reverse' : ''
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center',
            'transition-all',
            isUser
              ? 'bg-[var(--color-primary-500)]'
              : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]'
          )}
        >
          {isUser ? (
            <span className="text-white text-sm font-semibold">B</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-primary-500)]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          )}
        </div>

        {/* Content Container */}
        <div className={cn('flex-1 min-w-0 space-y-3', isUser ? 'text-right' : '')}>
          {/* Message Header with Actions */}
          <div className={cn('flex items-center gap-2 mb-1', isUser && 'flex-row-reverse')}>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              {isUser ? 'Du' : 'LotionGPT'}
            </span>
            {/* Message Actions - Visible on hover */}
            {!isEditing && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-300">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    copiedCode === 'all'
                      ? 'text-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                  )}
                  title={copiedCode === 'all' ? 'Kopiert!' : 'Kopieren'}
                >
                  <Icons.Copy />
                </button>

                {/* Star Button */}
                {onToggleStar && (
                  <button
                    onClick={onToggleStar}
                    className={cn(
                      'p-1.5 rounded-md transition-all',
                      isStarred
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-[var(--color-text-muted)] hover:text-yellow-400 hover:bg-yellow-400/10'
                    )}
                    title={isStarred ? 'Markierung aufheben' : 'Markieren'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                )}

                {/* Edit Button (for user messages) */}
                {isUser && onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all"
                    title="Bearbeiten"
                  >
                    <Icons.Edit />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all"
                    title="Löschen"
                  >
                    <Icons.Trash />
                  </button>
                )}

                {/* Branch Button */}
                {onBranch && !isUser && (
                  <button
                    onClick={onBranch}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/10 transition-all"
                    title="Verzweigen (Branch)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9a9 9 0 0 1-9 9" />
                    </svg>
                  </button>
                )}

                {/* Regenerate Button (for assistant) */}
                {!isUser && isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/10 transition-all"
                    title="Neu generieren"
                  >
                    <Icons.Refresh />
                  </button>
                )}

                {/* Copy Code Buttons (if code blocks exist) */}
                {!isUser && hasCodeBlocks && (
                  <div className="relative group/code">
                    <button
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-300 hover:scale-110"
                      title="Code kopieren"
                    >
                      <Icons.Code />
                    </button>
                    {/* Dropdown for code blocks */}
                    <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg shadow-xl opacity-0 invisible group-hover/code:opacity-100 group-hover/code:visible transition-all z-10 min-w-[150px]">
                      <button
                        onClick={() => handleCopyCodeBlock(message.content)}
                        className="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors rounded-t-lg"
                      >
                        Alles kopieren
                      </button>
                      {codeBlocks.map((block, i) => {
                        const lang = block.match(/```(\w*)/)?.[1] || 'code';
                        return (
                          <button
                            key={i}
                            onClick={() => handleCopyCodeBlock(block.replace(/```\w*\n?/g, '').replace(/```/g, ''))}
                            className={cn(
                              'w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors',
                              i < codeBlocks.length - 1 || 'rounded-b-lg'
                            )}
                          >
                            {lang} Code
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className={cn('flex flex-wrap gap-2', isUser ? 'justify-end' : '')}>
              {message.images.map((img, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => setExpandedImage(`data:${img.mimeType};base64,${img.data}`)}
                  className="relative group/img overflow-hidden rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-primary-500)] transition-all"
                >
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt={img.name || 'Attached image'}
                    className="max-h-64 max-w-xs object-cover transition-transform duration-200 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <div className="p-2 rounded-lg bg-black/50 backdrop-blur-sm">
                      <Icons.Maximize />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* File Attachments */}
          {message.files && message.files.length > 0 && (
            <div className={cn('flex flex-wrap gap-2', isUser ? 'justify-end' : '')}>
              {message.files.map((file, fileIndex) => {
                const config = FILE_TYPE_CONFIGS[file.type];
                const isImage = file.type === 'image' && file.data;

                return (
                  <div
                    key={fileIndex}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border',
                      'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)]',
                      'hover:border-[var(--color-primary-500)] transition-all',
                      isImage && 'overflow-hidden p-0'
                    )}
                  >
                    {isImage ? (
                      <img
                        src={`data:${file.mimeType};base64,${file.data}`}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-l-xl"
                      />
                    ) : (
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg', config.color)}>
                        {config.icon}
                      </div>
                    )}
                    <div className="min-w-0 max-w-[150px]">
                      <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text content */}
          {isEditing ? (
            // Edit Mode
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-primary-500)] rounded-2xl p-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[var(--color-text-primary)] text-[15px] leading-relaxed resize-none focus:outline-none min-h-[60px] max-h-[300px]"
                autoFocus
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-3 py-1.5 text-sm bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg transition-colors"
                >
                  Speichern
                </button>
              </div>
            </div>
          ) : message.content ? (
            // Normal Display
            <div
              className={cn(
                'inline-block rounded-xl px-4 py-2.5 max-w-full transition-all duration-200',
                isUser
                  ? 'bg-[var(--color-primary-500)] text-white rounded-tr-sm'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-tl-sm',
                isSearchMatch && 'ring-2 ring-[var(--color-primary-500)]'
              )}
            >
              <div
                className="text-[15px] leading-relaxed prose prose-invert prose-p:last:mb-0 max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessageWithHighlight(message.content) }}
              />
            </div>
          ) : null}

          {/* Suggested Follow-ups */}
          {!isUser && !isEditing && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 ml-1">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1.5 text-xs bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors duration-150"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for expanded images */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] animate-scale-in-spring">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            >
              <Icons.Close />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
