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
  description = 'Stelle eine Frage, lade ein Bild hoch oder starte einfach ein Gesprch.',
  suggestions = [
    'Erklre mir Quantum Computing',
    'Schreibe eine E-Mail fr...',
    'Hilf mir bei einem Python Skript',
  ],
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center h-full px-6',
      'animate-fade-in',
      className
    )}>
      {/* Premium Logo with Glow Effect */}
      <div className="relative mb-12 animate-scale-in-spring">
        {/* Glow layers */}
        <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--color-accent-500)] opacity-20 blur-2xl animate-pulse-subtle" />
        <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--color-accent-500)] opacity-10 blur-xl animate-pulse" />

        {/* Main logo container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] flex items-center justify-center shadow-xl shadow-[var(--color-accent-glow-strong)] transition-transform duration-500 hover:scale-105">
          <Icons.Logo />

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Title - Premium typography with gradient */}
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4 animate-fade-in-up">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-12 max-w-lg text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {description}
        </p>
      )}

      {/* Premium Suggestions with enhanced styling */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'group relative px-5 py-3 rounded-2xl text-sm font-medium overflow-hidden',
                'bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-400)]',
                'hover:bg-[var(--color-accent-500)]/10 hover:border-[var(--color-accent-500)]/30',
                'transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-accent-glow-subtle)]',
                'animate-fade-in-up',
              )}
              style={{ animationDelay: `${150 + index * 80}ms` }}
            >
              {/* Background shine on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Premium Keyboard hint */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2.5">
          <kbd className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)] font-mono font-medium shadow-sm">
            Enter
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">senden</span>
        </div>
        <div className="w-px h-4 bg-[var(--color-border-subtle)]" />
        <div className="flex items-center gap-2">
          <kbd className="px-2.5 py-2 rounded-xl bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)] font-mono shadow-sm">
            Shift
          </kbd>
          <span className="text-[var(--color-text-faint)]">+</span>
          <kbd className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)] font-mono font-medium shadow-sm">
            Enter
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">neue Zeile</span>
        </div>
      </div>
    </div>
  );
}
