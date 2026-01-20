'use client';

import { useState, useEffect, useCallback } from 'react';
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
    'Analysiere diesen Code',
    'Erstelle ein Projektplan',
  ],
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSuggestionClick?.(suggestions[index]);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }
  }, [onSuggestionClick, suggestions]);

  // Auto-cycle through suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

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
      {/* Elite Logo with Multi-layer Aurora Glow Effect v10.0 */}
      <div className="relative mb-14">
        {/* Enhanced ambient aurora glow layers v10.0 */}
        <div className="absolute inset-0 w-40 h-40 rounded-full bg-[var(--color-accent-500)] opacity-18 blur-3xl animate-aurora-shift" />
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-[var(--color-accent-600)] opacity-12 blur-2xl animate-glow-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-[var(--color-accent-400)] opacity-15 blur-xl animate-ambient-drift" style={{ animationDelay: '2s' }} />

        {/* Orbital particles with enhanced effects v10.0 */}
        <div className="absolute -top-2 -right-5 w-3 h-3 rounded-full bg-gradient-to-br from-[var(--color-accent-400)] to-[var(--color-accent-500)] animate-float opacity-80 shadow-lg shadow-[var(--color-accent-glow)]" style={{ animationDelay: '0ms' }} />
        <div className="absolute -bottom-5 -left-4 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] animate-float opacity-60 shadow-md shadow-[var(--color-accent-glow-subtle)]" style={{ animationDelay: '700ms' }} />
        <div className="absolute top-1/2 -right-10 w-2 h-2 rounded-full bg-gradient-to-br from-[var(--color-accent-300)] to-[var(--color-accent-400)] animate-float opacity-50 shadow-sm" style={{ animationDelay: '1400ms' }} />
        <div className="absolute top-5 -left-8 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-600)] animate-float opacity-40 shadow-sm" style={{ animationDelay: '2100ms' }} />
        <div className="absolute -top-8 left-1/2 w-1 h-1 rounded-full bg-[var(--color-accent-400)] animate-orb-float opacity-35" style={{ animationDelay: '2800ms' }} />

        {/* Main logo container with elite floating effect v10.0 */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] flex items-center justify-center shadow-2xl shadow-[var(--color-accent-glow-ultra)] transition-all duration-300 ease-spring hover:scale-105 animate-float-slow overflow-hidden">
          {/* Enhanced animated shine overlay v10.0 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-400" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-shimmer-slow" />

          {/* Inner glow ring - enhanced v10.0 */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/60 to-transparent opacity-80 animate-gradient-morph bg-[length:300%_300%]" />

          {/* Logo icon */}
          <Icons.Logo />

          {/* Animated border glow effect - enhanced v10.0 */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-400 animate-gradient-morph bg-[length:200%_200%]" />
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

      {/* Ultra Premium Suggestions with multi-layer effects - Enhanced v10.0 */}
      {suggestions && suggestions.length > 0 && (
        <div className="w-full max-w-2xl" role="list" aria-label="Vorgeschlagene Prompts">
          {/* Keyboard hint for navigation */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-[var(--color-text-muted)] animate-fade-in" style={{ animationDelay: '120ms' }}>
            <span className="px-2 py-1 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]">
              Navigieren mit Pfeiltasten
            </span>
            <span className="px-2 py-1 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]">
              Enter zum Auswhlen
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(null)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className={cn(
                  'group relative px-5 py-3.5 rounded-2xl text-sm font-medium overflow-hidden',
                  'bg-[var(--color-bg-glass)] backdrop-blur-md border transition-all duration-200 ease-spring',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-300)]',
                  'hover:bg-[var(--color-accent-500)]/18 hover:scale-105 hover:shadow-xl',
                  'animate-fade-in-up focus:outline-none min-h-[44px] cursor-pointer active:scale-100',
                  'focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
                  // Auto-selected state
                  selectedIndex === index && 'border-[var(--color-accent-500)]/50 bg-[var(--color-accent-500)]/15 shadow-lg shadow-[var(--color-accent-glow-subtle)]',
                  // Hover state
                  focusedIndex === index && 'border-[var(--color-accent-500)]/60 bg-[var(--color-accent-500)]/18'
                )}
                style={{ animationDelay: `${150 + index * 80}ms` }}
                aria-label={`Vorschlag verwenden: ${suggestion}`}
                aria-pressed={selectedIndex === index}
                tabIndex={selectedIndex === index ? 0 : -1}
              >
                {/* Enhanced multi-layer shine effect on hover v10.0 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Enhanced subtle inner glow on hover/selected v10.0 */}
                <div className={cn(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300',
                  'from-[var(--color-accent-500)]/0 via-[var(--color-accent-500)]/8 to-[var(--color-accent-500)]/0',
                  (focusedIndex === index || selectedIndex === index) && 'opacity-100'
                )} />

                {/* Enhanced selection indicator v10.0 */}
                {selectedIndex === index && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-[var(--color-accent-500)] to-[var(--color-accent-600)] shadow-md shadow-[var(--color-accent-glow)] animate-pop-in" />
                )}

                {/* Enhanced border shimmer effect v10.0 */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[var(--color-accent-500)]/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {suggestion}
                  {selectedIndex === index && (
                    <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-accent-500)]/25 text-[var(--color-accent-300)] font-mono border border-[var(--color-accent-500)]/30">
                      Enter
                    </kbd>
                  )}
                </span>
              </button>
            ))}
          </div>
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
