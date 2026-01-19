'use client';

import { Message } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { useEffect, useRef, useMemo } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  onEditMessage?: (messageIndex: number, newContent: string) => void;
  onRegenerate?: () => void;
  onDeleteMessage?: (messageIndex: number) => void;
  editingMessageIndex?: number | null;
  searchQuery?: string;
  highlightedMessageIndex?: number | null;
}

export function MessageList({
  messages,
  isLoading,
  onSuggestionClick,
  onEditMessage,
  onRegenerate,
  onDeleteMessage,
  editingMessageIndex = null,
  searchQuery = '',
  highlightedMessageIndex = null
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find messages that match the search query
  const matchingMessageIndices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return messages
      .map((msg, idx) => ({ idx, matches: regex.test(msg.content) }))
      .filter(({ matches }) => matches)
      .map(({ idx }) => idx);
  }, [messages, searchQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, editingMessageIndex]);

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
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
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
                onEditComplete={(newContent) => onEditMessage?.(index, newContent)}
                onCancelEdit={() => onEditMessage?.(-1, '')}
                onEdit={() => onEditMessage?.(index, '')}
                onRegenerate={index === messages.length - 1 && message.role === 'assistant' && !isLoading ? onRegenerate : undefined}
                onDelete={onDeleteMessage ? () => onDeleteMessage(index) : undefined}
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
