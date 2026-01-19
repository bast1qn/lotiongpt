'use client';

import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export interface KeyboardShortcuts {
  newChat: ShortcutConfig;
  toggleSidebar: ShortcutConfig;
  sendMessage: ShortcutConfig;
  copyLastResponse: ShortcutConfig;
  editLastMessage: ShortcutConfig;
  focusSearch: ShortcutConfig;
  showShortcuts: ShortcutConfig;
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

export const formatShortcut = (shortcut: ShortcutConfig): string => {
  const parts: string[] = [];
  if (shortcut.ctrlKey) parts.push(isMac ? '⌃' : 'Ctrl');
  if (shortcut.metaKey) parts.push('⌘');
  if (shortcut.shiftKey) parts.push(isMac ? '⇧' : 'Shift');
  if (shortcut.altKey) parts.push(isMac ? '⌥' : 'Alt');
  parts.push(shortcut.key.toUpperCase());
  return parts.join(isMac ? '' : '+');
};

export function useKeyboardShortcuts(
  shortcuts: Partial<KeyboardShortcuts>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField = target.matches('input, textarea, [contenteditable]');

      Object.values(shortcuts).forEach((shortcut) => {
        if (!shortcut) return;

        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const metaMatch = shortcut.metaKey ? e.metaKey : !e.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.altKey ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          // For shortcuts that should work in input fields (like Cmd+Enter to send)
          const allowInInput = shortcut.key === 'enter' && shortcut.metaKey;

          if (!isInputField || allowInInput) {
            if (shortcut.preventDefault !== false) {
              e.preventDefault();
            }
            shortcut.action();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Default shortcuts definitions
export const DEFAULT_SHORTCUTS = {
  newChat: {
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    description: 'Neuer Chat',
    action: () => {},
  },
  toggleSidebar: {
    key: 'b',
    ctrlKey: true,
    metaKey: true,
    description: 'Sidebar umschalten',
    action: () => {},
  },
  sendMessage: {
    key: 'enter',
    ctrlKey: false,
    metaKey: true,
    description: 'Nachricht senden',
    action: () => {},
    preventDefault: true,
  },
  copyLastResponse: {
    key: 'c',
    ctrlKey: true,
    metaKey: false,
    shiftKey: true,
    description: 'Letzte Antwort kopieren',
    action: () => {},
  },
  editLastMessage: {
    key: 'e',
    ctrlKey: true,
    metaKey: true,
    description: 'Letzte Nachricht bearbeiten',
    action: () => {},
  },
  focusSearch: {
    key: '/',
    ctrlKey: true,
    metaKey: true,
    description: 'Suche fokussieren',
    action: () => {},
  },
  showShortcuts: {
    key: '?',
    description: 'Tastaturkürzel anzeigen',
    action: () => {},
  },
} as const;
