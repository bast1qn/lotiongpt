'use client';

import { Message } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { generateSuggestions } from '@/lib/suggestions';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  onEditMessage?: (messageIndex: number, newContent: string) => void;
  onRegenerate?: () => void;
  onDeleteMessage?: (messageIndex: number) => void;
  onToggleStar?: (messageIndex: number) => void;
  onBranch?: (messageIndex: number) => void;
  editingMessageIndex?: number | null;
  searchQuery?: string;
  highlightedMessageIndex?: number | null;
  starredIndices?: number[];
}

export function MessageList({
  messages,
  isLoading,
  onSuggestionClick,
  onEditMessage,
  onRegenerate,
  onDeleteMessage,
  onToggleStar,
  onBranch,
  editingMessageIndex = null,
  searchQuery = '',
  highlightedMessageIndex = null,
  starredIndices = []
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Find messages that match the search query
  const matchingMessageIndices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return messages
      .map((msg, idx) => ({ idx, matches: regex.test(msg.content) }))
      .filter(({ matches }) => matches)
      .map(({ idx }) => idx);
  }, [messages, searchQuery]);

  // Generate suggestions for each message
  const getSuggestions = useCallback((message: Message, index: number) => {
    // Only show suggestions for the last assistant message
    if (message.role !== 'assistant' || index !== messages.length - 1) return [];
    // Don't show if currently loading
    if (isLoading) return [];
    return generateSuggestions(message, messages);
  }, [messages, isLoading]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!showScrollButton) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, editingMessageIndex, showScrollButton]);

  // Track scroll position to show/hide jump button
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollButton(distanceFromBottom > 100);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  }, []);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyState
          title="Wie kann ich helfen?"
          description="Stelle eine Frage, lade ein Bild hoch oder starte einfach ein Gespräch."
          suggestions={[
            'Erkläre mir Quantum Computing',
            'Schreibe eine E-Mail für...',
            'Hilf mir bei einem Python Skript',
          ]}
          onSuggestionClick={onSuggestionClick}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Jump to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white rounded-full shadow-lg shadow-[var(--color-accent-glow)] transition-all duration-200 hover:scale-100 animate-fade-in-up flex items-center gap-2"
        >
          <span className="text-sm font-medium">Neue Nachricht</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
            <polyline points="18 15 12 9 6 9" />
          </svg>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="max-w-3xl mx-auto px-4 py-6"
      >
        <div className="flex flex-col gap-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              id={`message-${index}`}
              className={highlightedMessageIndex === index ? 'animate-pulse' : ''}
            >
              <MessageItem
                message={message}
                index={index}
                isLast={index === messages.length - 1}
                isEditing={editingMessageIndex === index}
                searchQuery={searchQuery}
                isSearchMatch={matchingMessageIndices.includes(index)}
                isStarred={starredIndices.includes(index)}
                suggestions={getSuggestions(message, index)}
                onSuggestionClick={onSuggestionClick}
                onEditComplete={(newContent) => onEditMessage?.(index, newContent)}
                onCancelEdit={() => onEditMessage?.(-1, '')}
                onEdit={() => onEditMessage?.(index, '')}
                onRegenerate={index === messages.length - 1 && message.role === 'assistant' && !isLoading ? onRegenerate : undefined}
                onDelete={onDeleteMessage ? () => onDeleteMessage(index) : undefined}
                onToggleStar={onToggleStar ? () => onToggleStar(index) : undefined}
                onBranch={onBranch && message.role === 'assistant' ? () => onBranch(index) : undefined}
              />
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
