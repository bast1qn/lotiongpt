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
      {/* Elite Logo with Aurora Glow Effect */}
      <div className="relative mb-14 animate-scale-in-spring">
        {/* Aurora glow layers */}
        <div className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[var(--color-accent-500)] opacity-25 blur-3xl animate-aurora" />
        <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--color-accent-600)] opacity-15 blur-2xl animate-pulse-subtle" />

        {/* Main logo container with floating effect */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] flex items-center justify-center shadow-2xl shadow-[var(--color-accent-glow-ultra)] transition-transform duration-500 hover:scale-105 animate-float-slow">
          <Icons.Logo />

          {/* Inner shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/25 via-transparent to-transparent" />

          {/* Animated border glow */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-gradient-shift bg-[length:200%_200%]" />
        </div>

        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-[var(--color-accent-400)] animate-float opacity-60" style={{ animationDelay: '0ms' }} />
        <div className="absolute -bottom-3 -left-3 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-500)] animate-float opacity-40" style={{ animationDelay: '500ms' }} />
        <div className="absolute top-1/2 -right-6 w-1 h-1 rounded-full bg-[var(--color-accent-300)] animate-float opacity-30" style={{ animationDelay: '1000ms' }} />
      </div>

      {/* Title - Elite typography */}
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4 animate-fade-in-up">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-14 max-w-lg text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {description}
        </p>
      )}

      {/* Elite Suggestions with enhanced styling */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3.5 max-w-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'group relative px-6 py-3.5 rounded-2xl text-sm font-medium overflow-hidden',
                'bg-[var(--color-bg-tertiary)]/90 border border-[var(--color-border-medium)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-300)]',
                'hover:bg-[var(--color-accent-500)]/12 hover:border-[var(--color-accent-500)]/40',
                'transition-all duration-180 hover:scale-105 hover:shadow-xl hover:shadow-[var(--color-accent-glow)]',
                'animate-fade-in-up',
              )}
              style={{ animationDelay: `${150 + index * 80}ms` }}
            >
              {/* Multi-layer shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-180" />
              <span className="relative">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Elite Keyboard hint */}
      <div className="mt-20 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-[var(--color-text-faint)]">
        <div className="flex items-center gap-3">
          <kbd className="px-4 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 border border-[var(--color-border-medium)] font-mono font-semibold shadow-lg shadow-[var(--shadow-card)]">
            Enter
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">senden</span>
        </div>
        <div className="w-px h-5 bg-[var(--color-border-subtle)]" />
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 border border-[var(--color-border-medium)] font-mono shadow-lg shadow-[var(--shadow-card)]">
            Shift
          </kbd>
          <span className="text-[var(--color-text-faint)]">+</span>
          <kbd className="px-4 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 border border-[var(--color-border-medium)] font-mono font-semibold shadow-lg shadow-[var(--shadow-card)]">
            Enter
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">neue Zeile</span>
        </div>
      </div>
    </div>
  );
}
