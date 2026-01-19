'use client';

import { Message } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export function MessageList({ messages, isLoading, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
            <MessageItem
              key={`${message.role}-${index}`}
              message={message}
              index={index}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
