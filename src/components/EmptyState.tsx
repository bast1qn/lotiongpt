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
  description = 'Stelle eine Frage, lade ein Bild hoch oder starte einfach ein Gespräch.',
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
      {/* Animated Logo - Enhanced */}
      <div className="relative mb-10">
        {/* Background glow with animation */}
        <div className="absolute inset-0 bg-[var(--color-primary-500)] opacity-30 blur-3xl rounded-full animate-pulse-glow" />
        {/* Secondary glow ring */}
        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] opacity-20 blur-2xl rounded-full animate-pulse-subtle" />

        {/* Main logo container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center shadow-xl shadow-[var(--color-primary-glow-strong)] animate-glow hover:scale-105 transition-transform duration-500">
          <Icons.Logo />
        </div>
      </div>

      {/* Title - Enhanced typography */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)] mb-3 animate-fade-in">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-10 max-w-md text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          {description}
        </p>
      )}

      {/* Suggestions - Enhanced styling */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'px-5 py-3 rounded-xl text-sm font-medium',
                'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]',
                'hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-primary-500)]/30',
                'hover:shadow-lg hover:shadow-[var(--color-primary-glow)]',
                'transition-all duration-300',
                'hover:scale-105',
                'animate-bounce-in',
              )}
              style={{ animationDelay: `${150 + index * 80}ms` }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hint - Enhanced styling */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] font-mono shadow-sm">
            Enter
          </kbd>
          <span>senden</span>
        </div>
        <div className="w-px h-3 bg-[var(--color-border-subtle)]" />
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] font-mono shadow-sm">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] font-mono shadow-sm">
            Enter
          </kbd>
          <span>neue Zeile</span>
        </div>
      </div>
    </div>
  );
}
