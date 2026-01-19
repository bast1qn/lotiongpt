'use client';

import { useState, useEffect } from 'react';
import { Chat } from '@/types/chat';
import { storage } from '@/lib/storage';
import { truncateTitle, formatDate, isToday, isThisWeek } from '@/lib/utils';
import { Icons } from './Icons';
import { SettingsModal } from './SettingsModal';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

type FilterMode = 'all' | 'today' | 'week';

export function Sidebar({ currentChatId, onChatSelect, onNewChat, isOpen, onClose }: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    setChats(storage.getChats());
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteChat(id);
    loadChats();
    if (currentChatId === id) {
      const remaining = storage.getChats();
      if (remaining.length > 0) {
        onChatSelect(remaining[0].id);
      } else {
        onNewChat();
      }
    }
  };

  // Filter chats based on search and filter mode
  const filteredChats = chats
    .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(chat => {
      if (filterMode === 'today') return isToday(chat.updatedAt);
      if (filterMode === 'week') return isThisWeek(chat.updatedAt);
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Group chats by date
  const groupedChats: Record<string, Chat[]> = {};
  filteredChats.forEach(chat => {
    const dateKey = formatDate(chat.updatedAt);
    if (!groupedChats[dateKey]) {
      groupedChats[dateKey] = [];
    }
    groupedChats[dateKey].push(chat);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-[280px] h-full
          flex flex-col
          bg-[var(--color-bg-secondary)] text-white
          border-r border-[var(--color-border-subtle)]
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          flex-shrink-0
          shadow-2xl shadow-black/50
        `}
      >
        {/* TOP SECTION: Navigation */}
        <nav className="flex-shrink-0 p-3 border-b border-[var(--color-border-subtle)]">
          <div className="flex flex-col gap-1">
            {/* Primary Nav */}
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-lg shadow-[var(--color-primary-glow)] hover:shadow-xl hover:shadow-[var(--color-primary-glow-strong)] transition-all duration-200 hover-scale">
              <Icons.Chat />
              <span className="text-sm font-medium">Chats</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-white hover:bg-[var(--color-bg-elevated)] transition-all duration-200">
              <Icons.Folder />
              <span className="text-sm">Projekte</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-white hover:bg-[var(--color-bg-elevated)] transition-all duration-200">
              <Icons.Grid />
              <span className="text-sm">Artefakte</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-tertiary)] hover:text-white hover:bg-[var(--color-bg-elevated)] transition-all duration-200">
              <Icons.Code />
              <span className="text-sm">Code</span>
            </button>
          </div>
        </nav>

        {/* SEARCH & FILTER SECTION */}
        <div className="flex-shrink-0 px-3 py-2 border-b border-[var(--color-border-subtle)] space-y-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chats durchsuchen..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Icons.Close />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterMode('all')}
              className={cn(
                'flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterMode === 'all'
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              Alle
            </button>
            <button
              onClick={() => setFilterMode('today')}
              className={cn(
                'flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterMode === 'today'
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              Heute
            </button>
            <button
              onClick={() => setFilterMode('week')}
              className={cn(
                'flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterMode === 'week'
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              Woche
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {Object.entries(groupedChats).map(([dateLabel, dateChats], groupIndex) => (
            <div key={dateLabel} className={cn('animate-fade-in', `stagger-${groupIndex + 1}`)}>
              <h3 className="text-[11px] font-semibold text-[var(--color-text-muted)] px-2 mb-2 uppercase tracking-wider">
                {dateLabel}
              </h3>
              <div className="flex flex-col gap-0.5 mb-4">
                {dateChats.map((chat, index) => (
                  <div
                    key={chat.id}
                    className={`
                      relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200
                      ${currentChatId === chat.id
                        ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-glow)]'
                        : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)]'
                      }
                    `}
                    onClick={() => {
                      onChatSelect(chat.id);
                      onClose();
                    }}
                  >
                    <span className="text-sm truncate flex-1 pr-2">
                      {truncateTitle(chat.title)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id, e);
                      }}
                      className={cn(
                        'opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0',
                        currentChatId === chat.id
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      )}
                      aria-label="Chat löschen"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3">
                <Icons.Search />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {searchQuery ? 'Keine Chats gefunden' : 'Noch keine Chats'}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: User Profile */}
        <div className="flex-shrink-0 border-t border-[var(--color-border-subtle)] p-3">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all duration-200 group"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-md shadow-[var(--color-primary-glow)] group-hover:shadow-lg group-hover:shadow-[var(--color-primary-glow-strong)] transition-all duration-200">
              B
            </div>

            {/* User Info */}
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm text-[var(--color-text-primary)] font-medium truncate">Basti</div>
              <div className="text-xs text-[var(--color-text-tertiary)] truncate">Pro Plan</div>
            </div>

            {/* Settings Icon */}
            <div className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-500)] transition-colors">
              <Icons.Settings />
            </div>
          </button>
        </div>
      </aside>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
