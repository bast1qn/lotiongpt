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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg pointer-events-auto animate-fade-in-down"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]">
                <Icons.Keyboard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Tastaturkürzel
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto">
            {shortcuts.map((category) => (
              <div key={category.title}>
                <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span
                            key={i}
                            className={cn(
                              'min-w-[28px] px-2 py-1 text-center text-xs font-medium rounded-lg',
                              'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
                              'text-[var(--color-text-primary)] shadow-sm',
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

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)] rounded-b-2xl">
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              Drücke <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">Escape</kbd> zum Schließen
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
