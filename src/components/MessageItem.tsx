'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';
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
  onRetry?: () => void;
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
  onSuggestionClick,
  onRetry
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState(message.content);
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const isError = message.isError && !isUser;

  // Highlight search matches in text with XSS protection
  const highlightText = (text: string, query: string): string => {
    // Limit query length to prevent ReDoS attacks
    if (!query.trim() || query.length > 100) return text;

    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const highlighted = text.replace(regex, '<mark class="bg-[var(--color-accent-500)]/35 text-[var(--color-text-primary)] px-0.5 rounded-sm">$1</mark>');

      // Sanitize HTML to prevent XSS attacks - only allow <mark> tags
      return DOMPurify.sanitize(highlighted, {
        ALLOWED_TAGS: ['mark'],
        ALLOWED_ATTR: ['class']
      });
    } catch {
      // If regex fails, return original text
      return text;
    }
  };

  // Format message with optional highlighting
  const formatMessageWithHighlight = (content: string) => {
    const formatted = formatMessage(content);

    // Only apply highlighting if search query is valid
    if (searchQuery.trim() && searchQuery.length <= 100) {
      return highlightText(formatted, searchQuery);
    }

    // Sanitize formatted content to prevent XSS from markdown
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'a', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'mark', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'class', 'target', 'rel']
    });
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
          'flex gap-3 sm:gap-4 group animate-message-in',
          isUser ? 'flex-row-reverse' : ''
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Premium Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-9 h-9 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md',
            'transition-all duration-200',
            isUser
              ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] shadow-[var(--color-accent-glow)]'
              : 'bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]'
          )}
          aria-hidden="true"
        >
          {isUser ? (
            <span className="text-white text-sm font-bold">B</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-accent-500)]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          )}
        </div>

        {/* Content Container */}
        <div className={cn('flex-1 min-w-0 space-y-3', isUser ? 'text-right' : '')}>
          {/* Premium Message Header with Actions */}
          <div className={cn('flex items-center gap-2 mb-1', isUser && 'flex-row-reverse')}>
            <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">
              {isUser ? 'Du' : 'LotionGPT'}
            </span>
            {/* Message Actions - Premium */}
            {!isEditing && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200 hover:opacity-100 touch:opacity-100 focus-within:opacity-100">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    'p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1 hover:scale-110',
                    copiedCode === 'all'
                      ? 'text-[var(--color-accent-500)] bg-[var(--color-accent-500)]/15 shadow-md shadow-[var(--color-accent-glow-subtle)]'
                      : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                  )}
                  title={copiedCode === 'all' ? 'Kopiert!' : 'Kopieren'}
                  aria-label={copiedCode === 'all' ? 'Nachricht wurde kopiert' : 'Nachricht kopieren'}
                  aria-pressed={copiedCode === 'all'}
                >
                  <Icons.Copy />
                </button>

                {/* Star Button */}
                {onToggleStar && (
                  <button
                    onClick={onToggleStar}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 hover:scale-110',
                      isStarred
                        ? 'text-yellow-400 bg-yellow-400/15 shadow-md shadow-yellow-400/20'
                        : 'text-[var(--color-text-tertiary)] hover:text-yellow-400 hover:bg-yellow-400/10'
                    )}
                    title={isStarred ? 'Markierung aufheben' : 'Markieren'}
                    aria-label={isStarred ? 'Nachricht markierung aufheben' : 'Nachricht markieren'}
                    aria-pressed={isStarred}
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
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1"
                    title="Bearbeiten"
                    aria-label="Nachricht bearbeiten"
                  >
                    <Icons.Edit />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-soft)] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-1"
                    title="Lschen"
                    aria-label="Nachricht lschen"
                  >
                    <Icons.Trash />
                  </button>
                )}

                {/* Branch Button */}
                {onBranch && !isUser && (
                  <button
                    onClick={onBranch}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1"
                    title="Verzweigen (Branch)"
                    aria-label="Verzweigung von dieser Nachricht erstellen"
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
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1"
                    title="Neu generieren"
                    aria-label="Antwort neu generieren"
                  >
                    <Icons.Refresh />
                  </button>
                )}

                {/* Copy Code Buttons (if code blocks exist) */}
                {!isUser && hasCodeBlocks && (
                  <div className="relative group/code">
                    <button
                      className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 hover:scale-105"
                      title="Code kopieren"
                    >
                      <Icons.Code />
                    </button>
                    {/* Premium Dropdown for code blocks */}
                    <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-xl opacity-0 invisible group-hover/code:opacity-100 group-hover/code:visible transition-all duration-200 z-10 min-w-[160px]">
                      <button
                        onClick={() => handleCopyCodeBlock(message.content)}
                        className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors rounded-t-xl flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Alles kopieren
                      </button>
                      {codeBlocks.map((block, i) => {
                        const lang = block.match(/```(\w*)/)?.[1] || 'code';
                        return (
                          <button
                            key={i}
                            onClick={() => handleCopyCodeBlock(block.replace(/```\w*\n?/g, '').replace(/```/g, ''))}
                            className={cn(
                              'w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors flex items-center gap-2',
                              i < codeBlocks.length - 1 || 'rounded-b-xl'
                            )}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="16 18 22 12 16 6" />
                              <polyline points="8 6 2 12 8 18" />
                            </svg>
                            {lang || 'text'} Code
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images - Premium */}
          {message.images && message.images.length > 0 && (
            <div className={cn('flex flex-wrap gap-2.5', isUser ? 'justify-end' : '')}>
              {message.images.map((img, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => setExpandedImage(`data:${img.mimeType};base64,${img.data}`)}
                  className="relative group/img overflow-hidden rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-500)] transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-[var(--color-accent-glow-subtle)]"
                >
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt={img.name || 'Attached image'}
                    className="max-h-64 max-w-xs object-cover transition-transform duration-300 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                    <div className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                      <Icons.Maximize />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* File Attachments - Premium */}
          {message.files && message.files.length > 0 && (
            <div className={cn('flex flex-wrap gap-2', isUser ? 'justify-end' : '')}>
              {message.files.map((file, fileIndex) => {
                const config = FILE_TYPE_CONFIGS[file.type];
                const isImage = file.type === 'image' && file.data;

                return (
                  <div
                    key={fileIndex}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl border shadow-sm',
                      'bg-[var(--color-bg-tertiary)]/80 border-[var(--color-border-medium)]',
                      'hover:border-[var(--color-accent-500)] hover:shadow-md transition-all duration-200',
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
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm', config.color)}>
                        {config.icon}
                      </div>
                    )}
                    <div className="min-w-0 max-w-[150px]">
                      <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
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

          {/* Text content - Premium bubbles */}
          {isEditing ? (
            // Premium Edit Mode
            <div className="bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-accent-500)] rounded-2xl p-4 shadow-lg shadow-[var(--color-accent-glow-subtle)]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[var(--color-text-primary)] text-[15px] leading-relaxed resize-none focus:outline-none min-h-[80px] max-h-[300px]"
                autoFocus
              />
              <div className="flex gap-2 mt-3 justify-end">
                <button
                  onClick={onCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-xl transition-all duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white rounded-xl transition-all duration-200 shadow-lg shadow-[var(--color-accent-glow)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-105"
                >
                  Speichern
                </button>
              </div>
            </div>
          ) : message.content ? (
            // Premium Normal Display
            <div
              className={cn(
                'inline-block rounded-2xl px-4 py-3 max-w-full',
                'transition-all duration-200 shadow-sm',
                isError
                  ? 'bg-[var(--color-error-soft)] text-[var(--color-error)] border border-[var(--color-error)]/40 rounded-tl-sm shadow-[var(--color-error-glow)]'
                  : isUser
                    ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white rounded-tr-sm shadow-[var(--shadow-message-user)]'
                    : 'bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded-tl-sm shadow-[var(--shadow-message-assistant)]',
                isSearchMatch && 'ring-2 ring-[var(--color-accent-500)] ring-offset-2 ring-offset-[var(--color-bg-primary)]'
              )}
            >
              <div
                className="text-[15px] leading-[1.65] prose prose-invert prose-p:last:mb-0 prose-p:my-1 prose-headings:my-2 prose-headings:font-semibold prose-a:text-[var(--color-accent-400)] prose-a:no-underline hover:prose-a:underline prose-code:bg-[var(--color-bg-elevated)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-[var(--color-bg-primary)] prose-pre:border prose-pre:border-[var(--color-border-subtle)] prose-pre:rounded-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessageWithHighlight(message.content) }}
              />
            </div>
          ) : null}

          {/* Premium Suggested Follow-ups */}
          {!isUser && !isEditing && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--color-bg-tertiary)]/60 hover:bg-[var(--color-accent-500)]/10 border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-500)]/30 text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Premium Retry button for error messages */}
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2.5 text-sm font-medium bg-[var(--color-error-soft)] hover:bg-[var(--color-error)]/20 border border-[var(--color-error)]/40 text-[var(--color-error)] rounded-xl transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-1 hover:scale-105 hover:shadow-[var(--color-error-glow)]"
              aria-label="Nachricht erneut senden"
            >
              <Icons.Refresh />
              <span>Erneut versuchen</span>
            </button>
          )}
        </div>
      </div>

      {/* Premium Lightbox for expanded images */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] animate-scale-in-spring">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Icons.Close />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
