'use client';

import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function EmptyState({
  title = 'Wie kann ich helfen?',
  description = 'Ich kann dir bei verschiedenen Aufgaben helfen.',
  suggestions = [
    'Erkläre mir Quantum Computing',
    'Schreibe eine E-Mail für...',
    'Hilf mir bei einem Python Skript',
  ],
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center h-full px-6',
      'animate-fade-in-up',
      className
    )}>
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[var(--color-primary-500)] opacity-20 blur-3xl rounded-full animate-pulse-subtle" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-glow)] animate-pulse-glow">
          <Icons.Logo />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-8 max-w-md text-center">
          {description}
        </p>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm',
                'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-default)]',
                'hover:shadow-md hover:shadow-black/20',
                'transition-all duration-200 ease-out',
                'hover-scale',
                'animate-fade-in-up',
                `stagger-${index + 1}`
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="mt-12 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]">
            Enter
          </kbd>
          <span>senden</span>
        </div>
        <div className="w-px h-3 bg-[var(--color-border-subtle)]" />
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]">
            Shift + Enter
          </kbd>
          <span>neue Zeile</span>
        </div>
      </div>
    </div>
  );
}
