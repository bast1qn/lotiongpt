'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface ChatSearchBarProps {
  isVisible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  onNavigate: (direction: 'up' | 'down') => void;
  currentResult: number;
  totalResults: number;
}

export function ChatSearchBar({
  isVisible,
  onClose,
  onSearch,
  onNavigate,
  currentResult,
  totalResults,
}: ChatSearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setQuery('');
    }
  }, [isVisible]);

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNavigate('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate('down');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [onNavigate, onClose]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)] animate-fade-in-down">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
          <Icons.Search />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Suche im Chat..."
          autoFocus
          className={cn(
            'w-full pl-10 pr-24 py-2 rounded-lg',
            'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
            'text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]',
            'focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)]',
            'transition-all'
          )}
        />
        {query && totalResults > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-xs text-[var(--color-text-muted)]">
              {currentResult + 1} / {totalResults}
            </span>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate('up')}
          disabled={totalResults === 0}
          className={cn(
            'p-2 rounded-lg transition-all',
            'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          title="Vorheriges Ergebnis (↑)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('down')}
          disabled={totalResults === 0}
          className={cn(
            'p-2 rounded-lg transition-all',
            'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          title="Nächstes Ergebnis (↓)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all"
          title="Schließen (Escape)"
        >
          <Icons.Close />
        </button>
      </div>
    </div>
  );
}

interface SearchMatch {
  index: number;
  startIndex: number;
  endIndex: number;
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      return `<mark class="bg-[var(--color-primary-500)]/30 text-[var(--color-text-primary)] px-0.5 rounded">${part}</mark>`;
    }
    return part;
  }).join('');
}

export function findMatches(text: string, query: string): SearchMatch[] {
  if (!query.trim()) return [];

  const matches: SearchMatch[] = [];
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: matches.length,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return matches;
}
