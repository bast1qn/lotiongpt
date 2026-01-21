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
  timestamp?: string;
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
  onRetry,
  timestamp,
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState(message.content);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isError = message.isError && !isUser;

  const formatTimestamp = (ts?: string) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `Vor ${diffMins} Min${diffMins > 1 ? '.' : 'ute'}`;
    if (diffHours < 24) return `Vor ${diffHours} Stund${diffHours > 1 ? 'en' : 'e'}`;
    if (diffDays < 7) return `Vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const highlightText = (text: string, query: string): string => {
    if (!query.trim() || query.length > 100) return text;

    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const highlighted = text.replace(regex, '<mark class="bg-[var(--color-accent-500)]/35 text-[var(--color-text-primary)] px-0.5 rounded-sm">$1</mark>');
      return DOMPurify.sanitize(highlighted, {
        ALLOWED_TAGS: ['mark'],
        ALLOWED_ATTR: ['class']
      });
    } catch {
      return text;
    }
  };

  const formatMessageWithHighlight = (content: string) => {
    const formatted = formatMessage(content);

    if (searchQuery.trim() && searchQuery.length <= 100) {
      return highlightText(formatted, searchQuery);
    }

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

  const codeBlocks = message.content.match(/```[\s\S]*?```/g) || [];
  const hasCodeBlocks = codeBlocks.length > 0;

  return (
    <>
      <div
        className={cn(
          'flex gap-4 sm:gap-5 group animate-message-in relative',
          isUser ? 'flex-row-reverse' : ''
        )}
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => {
          setShowTimestamp(true);
          setShowActions(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setShowTimestamp(false);
          setShowActions(false);
          setIsHovered(false);
        }}
        onFocus={() => {
          setShowTimestamp(true);
          setShowActions(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowTimestamp(false);
            setShowActions(false);
          }
        }}
      >
        {/* v12.0 Hyper-Premium Avatar with glow effects */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center relative overflow-hidden',
            'transition-all duration-300 hover:scale-110',
            isUser
              ? 'bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] shadow-[var(--shadow-message-user)] hover:shadow-[var(--glow-multi-layer)]'
              : 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-surface)] border border-[var(--color-border-medium)] shadow-[var(--shadow-message-assistant)] hover:shadow-[var(--shadow-depth-2)]'
          )}
          aria-hidden="true"
        >
          {/* Enhanced shine overlay with pulse */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/22 via-transparent to-white/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isUser && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent animate-pulse-subtle" />
          )}
          {isUser ? (
            <span className="text-white text-sm font-bold relative z-10">B</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-accent-400)] relative z-10"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          )}
        </div>

        {/* Content Container */}
        <div className={cn('flex-1 min-w-0 space-y-3', isUser ? 'text-right' : '')}>
          {/* Ultra Premium Message Header */}
          <div className={cn('flex items-center gap-2 mb-1', isUser && 'flex-row-reverse')}>
            <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">
              {isUser ? 'Du' : 'LotionGPT'}
            </span>

            {/* Timestamp - Ultra Premium */}
            {timestamp && showTimestamp && (
              <span
                className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded-lg',
                  'bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm border border-[var(--color-border-subtle)]',
                  'text-[var(--color-text-muted)]',
                  'animate-fade-in transition-all duration-200',
                  isUser && 'order-first'
                )}
              >
                {formatTimestamp(timestamp)}
              </span>
            )}

            {/* Ultra Premium Action Buttons */}
            {!isEditing && (
              <div
                className={cn(
                  'flex items-center gap-0.5 transition-all duration-200',
                  showActions ? 'opacity-100' : 'opacity-0'
                )}
              >
                {/* Copy Button - Enhanced v10.0 */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    'p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center',
                    copiedCode === 'all'
                      ? 'text-[var(--color-accent-400)] bg-[var(--color-accent-500)]/20 shadow-md shadow-[var(--color-accent-glow-subtle)] scale-105'
                      : 'text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] hover:scale-105'
                  )}
                  title={copiedCode === 'all' ? 'Kopiert!' : 'Kopieren'}
                  aria-label={copiedCode === 'all' ? 'Nachricht wurde kopiert' : 'Nachricht kopieren'}
                  aria-pressed={copiedCode === 'all'}
                >
                  {copiedCode === 'all' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <Icons.Copy />
                  )}
                </button>

                {/* Star Button - Enhanced v10.0 */}
                {onToggleStar && (
                  <button
                    onClick={onToggleStar}
                    className={cn(
                      'p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center',
                      isStarred
                        ? 'text-yellow-400 bg-yellow-400/15 shadow-md shadow-yellow-400/20 scale-105'
                        : 'text-[var(--color-text-faint)] hover:text-yellow-400 hover:bg-yellow-400/10 hover:scale-105'
                    )}
                    title={isStarred ? 'Markierung aufheben' : 'Markieren'}
                    aria-label={isStarred ? 'Nachricht markierung aufheben' : 'Nachricht markieren'}
                    aria-pressed={isStarred}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isStarred ? 'animate-icon-bounce' : ''}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                )}

                {/* Edit Button - Enhanced v10.0 */}
                {isUser && onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-xl text-[var(--color-text-faint)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Bearbeiten"
                    aria-label="Nachricht bearbeiten"
                  >
                    <Icons.Edit />
                  </button>
                )}

                {/* Delete Button - Enhanced v10.0 */}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 rounded-xl text-[var(--color-text-faint)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-soft)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Lschen"
                    aria-label="Nachricht lschen"
                  >
                    <Icons.Trash />
                  </button>
                )}

                {/* Branch Button - Enhanced v10.0 */}
                {onBranch && !isUser && (
                  <button
                    onClick={onBranch}
                    className="p-2 rounded-xl text-[var(--color-text-faint)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
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

                {/* Regenerate Button - Enhanced v10.0 */}
                {!isUser && isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-2 rounded-xl text-[var(--color-text-faint)] hover:text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Neu generieren"
                    aria-label="Antwort neu generieren"
                  >
                    <Icons.Refresh />
                  </button>
                )}

                {/* Copy Code Dropdown - Enhanced v10.0 */}
                {!isUser && hasCodeBlocks && (
                  <div className="relative group/code">
                    <button
                      className="p-2 rounded-xl text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 hover:scale-105 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Code kopieren"
                      aria-label="Code-Optionen anzeigen"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <Icons.Code />
                    </button>
                    <div className="absolute right-0 top-full mt-1.5 bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-xl opacity-0 invisible group-hover/code:opacity-100 group-hover/code:visible transition-all duration-200 z-10 min-w-[160px]">
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

          {/* Images - Ultra Premium */}
          {message.images && message.images.length > 0 && (
            <div className={cn('flex flex-wrap gap-2.5', isUser ? 'justify-end' : '')}>
              {message.images.map((img, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => setExpandedImage(`data:${img.mimeType};base64,${img.data}`)}
                  className="relative group/img overflow-hidden rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-500)]/50 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-[var(--color-accent-glow-subtle)]"
                >
                  <img
                    src={`data:${img.mimeType};base64,${img.data}`}
                    alt={img.name || 'Attached image'}
                    className="max-h-64 max-w-xs object-cover transition-transform duration-300 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                    <div className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                      <Icons.Maximize />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* File Attachments - Ultra Premium */}
          {message.files && message.files.length > 0 && (
            <div className={cn('flex flex-wrap gap-2', isUser ? 'justify-end' : '')}>
              {message.files.map((file, fileIndex) => {
                const config = FILE_TYPE_CONFIGS[file.type];
                const isImage = file.type === 'image' && file.data;

                return (
                  <div
                    key={fileIndex}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
                      'bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm border-[var(--color-border-medium)]',
                      'hover:border-[var(--color-accent-500)]/40',
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

          {/* Text content - v12.0 Hyper-Premium Bubbles */}
          {isEditing ? (
            // v12.0 Ultra Premium Edit Mode with enhanced effects
            <div className="bg-[var(--color-bg-tertiary)]/95 backdrop-blur-md border border-[var(--color-accent-500)]/60 rounded-3xl p-5 shadow-xl shadow-[var(--color-accent-glow-strong)] relative overflow-hidden">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-50">
                <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-600)] to-[var(--color-accent-500)] animate-gradient-shift" />
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[var(--color-text-primary)] text-[15px] leading-relaxed resize-none focus:outline-none min-h-[100px] max-h-[300px] relative z-10"
                autoFocus
              />
              <div className="flex gap-3 mt-4 justify-end relative z-10">
                <button
                  onClick={onCancelEdit}
                  className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white rounded-2xl transition-all duration-200 shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-ultra)] hover:scale-105 relative overflow-hidden btn-beam"
                >
                  <span className="relative">Speichern</span>
                </button>
              </div>
            </div>
          ) : message.content ? (
            // v12.0 Hyper-Premium Normal Display
            <div
              className={cn(
                'message-premium-v12 relative inline-block rounded-3xl px-5 py-3.5 max-w-full',
                'transition-all duration-300 overflow-hidden',
                isError
                  ? 'bg-[var(--color-error-soft)]/95 backdrop-blur-sm text-[var(--color-error)] border border-[var(--color-error)]/55 rounded-tl-2xl shadow-[var(--color-error-glow)] animate-error-pulse'
                  : isUser
                    ? 'bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] text-white rounded-tr-2xl shadow-[var(--shadow-message-user)] hover:shadow-[var(--glow-pulse-wave)] border-beam'
                    : 'bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-medium)] rounded-tl-2xl shadow-[var(--shadow-message-assistant)] hover:border-[var(--color-border-accent)]/40 hover:shadow-[var(--shadow-depth-2)]',
                isSearchMatch && 'ring-2 ring-[var(--color-accent-500)] ring-offset-2 ring-offset-[var(--color-bg-primary)]'
              )}
            >
              {/* v12.0 Enhanced gradient overlay for user messages */}
              {isUser && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/22 via-transparent to-white/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-premium" />
                </>
              )}
              {/* Subtle noise texture for premium feel */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-fine" />
              <div
                className="relative text-[15px] leading-[1.75] prose prose-invert prose-p:last:mb-0 prose-p:my-1.5 prose-headings:my-2.5 prose-headings:font-semibold prose-a:text-[var(--color-accent-300)] prose-a:no-underline prose-a:border-b prose-a:border-[var(--color-accent-500)]/45 hover:prose-a:border-[var(--color-accent-500)]/75 prose-code:bg-[var(--color-bg-primary)]/55 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-[var(--color-border-subtle)] prose-pre:bg-[var(--color-bg-primary)]/85 prose-pre:border prose-pre:border-[var(--color-border-medium)] prose-pre:rounded-2xl max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessageWithHighlight(message.content) }}
              />
            </div>
          ) : null}

          {/* Ultra Premium Suggested Follow-ups */}
          {!isUser && !isEditing && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-4">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="group relative px-4 py-2 text-xs font-medium bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm hover:bg-[var(--color-accent-500)]/15 border border-[var(--color-border-medium)] hover:border-[var(--color-accent-500)]/40 text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] rounded-2xl transition-all duration-180 hover:scale-105 shadow-sm hover:shadow-md hover:shadow-[var(--color-accent-glow-subtle)] overflow-hidden"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Ultra Premium Retry button */}
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-5 py-3 text-sm font-medium bg-[var(--color-error-soft)]/90 backdrop-blur-sm hover:bg-[var(--color-error)]/25 border border-[var(--color-error)]/50 text-[var(--color-error)] rounded-2xl transition-all duration-180 flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-2 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-error-glow)]"
              aria-label="Nachricht erneut senden"
            >
              <Icons.Refresh />
              <span>Erneut versuchen</span>
            </button>
          )}
        </div>
      </div>

      {/* Ultra Premium Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[var(--z-max)] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-[92vw] max-h-[92vh] animate-scale-in-spring">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[92vh] object-contain rounded-3xl shadow-2xl"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-5 -right-5 w-12 h-12 bg-[var(--color-bg-elevated)]/90 hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-medium)] rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-180 hover:scale-110 backdrop-blur-sm"
            >
              <Icons.Close />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
