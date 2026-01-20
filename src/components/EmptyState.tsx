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
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-6 relative',
        'animate-fade-in',
        className
      )}
      role="region"
      aria-labelledby="empty-state-title"
      aria-describedby="empty-state-description"
    >
      {/* Ultra Premium Logo with Multi-layer Aurora Glow Effect */}
      <div className="relative mb-14">
        {/* Ambient aurora glow layers - enhanced */}
        <div className="absolute inset-0 w-36 h-36 rounded-full bg-[var(--color-accent-500)] opacity-15 blur-3xl animate-aurora" />
        <div className="absolute inset-0 w-28 h-28 rounded-full bg-[var(--color-accent-600)] opacity-10 blur-2xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-[var(--color-accent-400)] opacity-12 blur-xl animate-ambient-drift" style={{ animationDelay: '2s' }} />

        {/* Floating orbital particles */}
        <div className="absolute -top-1 -right-4 w-2.5 h-2.5 rounded-full bg-[var(--color-accent-400)] animate-float opacity-70 shadow-lg shadow-[var(--color-accent-glow-subtle)]" style={{ animationDelay: '0ms' }} />
        <div className="absolute -bottom-4 -left-3 w-2 h-2 rounded-full bg-[var(--color-accent-500)] animate-float opacity-50 shadow-md shadow-[var(--color-accent-glow-subtle)]" style={{ animationDelay: '700ms' }} />
        <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-300)] animate-float opacity-40 shadow-sm" style={{ animationDelay: '1400ms' }} />
        <div className="absolute top-4 -left-6 w-1 h-1 rounded-full bg-[var(--color-accent-600)] animate-float opacity-30" style={{ animationDelay: '2100ms' }} />

        {/* Main logo container with ultra premium floating effect */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] flex items-center justify-center shadow-2xl shadow-[var(--color-accent-glow-ultra)] transition-all duration-500 hover:scale-105 animate-float-slow overflow-hidden">
          {/* Animated shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />

          {/* Inner glow ring */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/50 to-transparent opacity-70 animate-gradient-shift bg-[length:250%_250%]" />

          {/* Logo icon */}
          <Icons.Logo />

          {/* Animated border glow effect */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-gradient-shift bg-[length:200%_200%]" />
        </div>
      </div>

      {/* Ultra Premium Title with animated gradient text */}
      <h2 id="empty-state-title" className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4 animate-fade-in-up tracking-tight">
        {title}
      </h2>

      {/* Enhanced Description */}
      {description && (
        <p id="empty-state-description" className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-14 max-w-lg text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {description}
        </p>
      )}

      {/* Ultra Premium Suggestions with multi-layer effects */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3.5 max-w-2xl" role="list" aria-label="Vorgeschlagene Prompts">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                'group relative px-6 py-3.5 rounded-2xl text-sm font-medium overflow-hidden',
                'bg-[var(--color-bg-glass)] backdrop-blur-md border border-[var(--color-border-medium)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-300)]',
                'hover:bg-[var(--color-accent-500)]/15 hover:border-[var(--color-accent-500)]/50',
                'transition-all duration-180 hover:scale-105 hover:shadow-xl hover:shadow-[var(--color-accent-glow)]',
                'animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] min-h-[44px]',
                'cursor-pointer'
              )}
              style={{ animationDelay: `${150 + index * 80}ms` }}
              aria-label={`Vorschlag verwenden: ${suggestion}`}
            >
              {/* Multi-layer shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-180" />

              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)]/0 via-[var(--color-accent-500)]/5 to-[var(--color-accent-500)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Border shimmer effect */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[var(--color-accent-500)]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <span className="relative z-10">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Ultra Premium Keyboard hint with enhanced styling */}
      <div className="mt-20 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-[var(--color-text-faint)]">
        <div className="flex items-center gap-3">
          <kbd className="px-4 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 backdrop-blur-sm border border-[var(--color-border-medium)] font-mono font-semibold shadow-lg shadow-[var(--shadow-card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative">Enter</span>
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">senden</span>
        </div>
        <div className="w-px h-5 bg-[var(--color-border-subtle)]" />
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 backdrop-blur-sm border border-[var(--color-border-medium)] font-mono shadow-lg shadow-[var(--shadow-card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative">Shift</span>
          </kbd>
          <span className="text-[var(--color-text-faint)]">+</span>
          <kbd className="px-4 py-2.5 rounded-2xl bg-[var(--color-bg-tertiary)]/90 backdrop-blur-sm border border-[var(--color-border-medium)] font-mono font-semibold shadow-lg shadow-[var(--shadow-card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative">Enter</span>
          </kbd>
          <span className="text-[var(--color-text-tertiary)]">neue Zeile</span>
        </div>
      </div>
    </div>
  );
}
