'use client';

import { Icons } from './Icons';
import { cn } from '@/lib/utils';

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

interface ShortcutItem {
  key: string;
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: ShortcutItem[];
}

const shortcuts: ShortcutCategory[] = [
  {
    title: 'Allgemein',
    shortcuts: [
      { key: 'newChat', keys: [isMac ? '⌘' : 'Ctrl', 'K'], description: 'Neuer Chat' },
      { key: 'toggleSidebar', keys: [isMac ? '⌘' : 'Ctrl', 'B'], description: 'Sidebar umschalten' },
      { key: 'showShortcuts', keys: ['?'], description: 'Tastaturkürzel anzeigen' },
    ],
  },
  {
    title: 'Chat',
    shortcuts: [
      { key: 'sendMessage', keys: [isMac ? '⌘' : 'Ctrl', 'Enter'], description: 'Nachricht senden' },
      { key: 'copyLastResponse', keys: [isMac ? '⌘' : 'Ctrl', 'Shift', 'C'], description: 'Letzte Antwort kopieren' },
      { key: 'editLastMessage', keys: [isMac ? '⌘' : 'Ctrl', 'E'], description: 'Letzte Nachricht bearbeiten' },
      { key: 'focusSearch', keys: [isMac ? '⌘' : 'Ctrl', '/'], description: 'Suche fokussieren' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { key: 'navUp', keys: [isMac ? '⌘' : 'Ctrl', '↑'], description: 'Vorherige Nachricht' },
      { key: 'navDown', keys: [isMac ? '⌘' : 'Ctrl', '↓'], description: 'Nächste Nachricht' },
      { key: 'close', keys: ['Escape'], description: 'Modal/Sidebar schließen' },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg pointer-events-auto animate-fade-in-down relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-[var(--color-accent-500)] opacity-5 blur-3xl -z-10" />

          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/10 text-[var(--color-accent-500)] shadow-md shadow-[var(--color-accent-glow)]">
                <Icons.Keyboard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Tastaturkürzel
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-md transition-all duration-120"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto sidebar-scroll">
            {shortcuts.map((category, categoryIndex) => (
              <div key={category.title} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 50}ms` }}>
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-default)] hover:shadow-md transition-all duration-120 group"
                    >
                      <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {shortcut.keys.map((key, i) => (
                          <span
                            key={i}
                            className={cn(
                              'min-w-[32px] px-2.5 py-1.5 text-center text-xs font-semibold rounded-lg',
                              'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-tertiary)]',
                              'border border-[var(--color-border-default)] shadow-sm',
                              'text-[var(--color-text-primary)]',
                              'group-hover:border-[var(--color-accent-500)]/30 group-hover:shadow-md group-hover:shadow-[var(--color-accent-glow)]',
                              'transition-all duration-120',
                              i > 0 && 'ml-1'
                            )}
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Footer */}
          <div className="px-6 py-4 border-t border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-[var(--color-bg-tertiary)] rounded-b-2xl">
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              Drücke <kbd className="px-2 py-1 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-sm font-mono">Escape</kbd> zum Schließen
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
