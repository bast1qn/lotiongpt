'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Chat } from '@/types/chat';
import { formatDate, isToday, isThisWeek } from '@/lib/utils';
import { Icons } from './Icons';
import { SettingsModal } from './SettingsModal';
import { AuthButton } from './AuthButton';
import { ProjectsPanel } from './ProjectsPanel';
import { CodeSnippetsPanel } from './CodeSnippetsPanel';
import { ArtifactsPanel } from './ArtifactsPanel';
import { ChatSkeleton } from './Skeleton';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  chats: Chat[];
  onRefreshChats: () => void;
  isOpen: boolean;
  onClose: () => void;
  isLoadingChats?: boolean;
}

type FilterMode = 'all' | 'today' | 'week';
type PanelMode = 'none' | 'projects' | 'snippets' | 'artifacts';

export function Sidebar({ currentChatId, onChatSelect, onNewChat, onDeleteChat, chats, onRefreshChats, isOpen, onClose, isLoadingChats = false }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [panelMode, setPanelMode] = useState<PanelMode>('none');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [focusedChatIndex, setFocusedChatIndex] = useState<number>(-1);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Focus trap when sidebar is open
  useEffect(() => {
    if (isOpen && !isCollapsed) {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isOpen, isCollapsed, onClose]);

  // Filter chats based on search and filter mode
  const filteredChats = chats
    .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(chat => {
      if (filterMode === 'today') return isToday(chat.updatedAt);
      if (filterMode === 'week') return isThisWeek(chat.updatedAt);
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Get flat list of chats for keyboard navigation (defined after filteredChats)
  const flatChats = filteredChats;
  const focusedChatId = focusedChatIndex >= 0 && focusedChatIndex < flatChats.length ? flatChats[focusedChatIndex].id : null;

  // Keyboard navigation for chat list
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (focusedChatIndex === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedChatIndex(prev => Math.min(prev + 1, flatChats.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedChatIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && focusedChatId) {
      e.preventDefault();
      onChatSelect(focusedChatId);
      onClose();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (focusedChatId) {
        onDeleteChat(focusedChatId);
        setFocusedChatIndex(-1);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFocusedChatIndex(-1);
    }
  }, [focusedChatIndex, flatChats, focusedChatId, onChatSelect, onDeleteChat, onClose]);

  // Group chats by date
  const groupedChats: Record<string, Chat[]> = {};
  filteredChats.forEach(chat => {
    const dateKey = formatDate(chat.updatedAt);
    if (!groupedChats[dateKey]) {
      groupedChats[dateKey] = [];
    }
    groupedChats[dateKey].push(chat);
  });

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteChat(id);
  };

  return (
    <>
      {/* Elite Mobile Overlay v10.0 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Quantum Elite Sidebar Container v11.0 */}
      <aside
        id="sidebar"
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50',
          'h-full flex flex-col',
          'bg-[var(--color-bg-glass-heavy)] backdrop-blur-xl',
          'border-r border-[var(--glass-border)]',
          'transition-all duration-200 ease-spring',
          isCollapsed ? 'w-16' : 'w-[280px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          'flex-shrink-0'
        )}
        aria-label="Hauptnavigation"
      >
        {/* Quantum enhanced ambient glow from the right v11.0 */}
        <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[var(--color-accent-500)]/6 via-[var(--color-accent-500)]/3 to-transparent pointer-events-none animate-aurora-pulse" />

        {/* Elite Collapse Toggle - Desktop only v10.0 */}
        <div className="hidden lg:block absolute -right-3.5 top-6 z-10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-2xl bg-[var(--color-bg-elevated)]/98 backdrop-blur-md border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] hover:border-[var(--color-accent-500)]/60 hover:shadow-lg hover:shadow-[var(--color-accent-glow-subtle)] transition-all duration-200 ease-spring hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] active:scale-95 group"
            aria-label={isCollapsed ? 'Sidebar erweitern' : 'Sidebar minimieren'}
            aria-expanded={isCollapsed}
          >
            <svg
              className={cn('w-4 h-4 transition-transform duration-200 ease-spring group-hover:rotate-12', isCollapsed ? 'rotate-180' : '')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsed View - Ultra Icon only */}
        {isCollapsed ? (
          <div className="flex flex-col h-full p-3">
            {/* New Chat Icon - Quantum Elite v11.0 */}
            <button
              onClick={onNewChat}
              className="group relative flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] text-white shadow-xl shadow-[var(--color-accent-glow-stronger)] hover:shadow-2xl hover:shadow-[var(--color-accent-glow-ultra)] hover:scale-110 transition-all duration-200 ease-spring focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] overflow-hidden active:scale-100"
              title="Neuer Chat"
              aria-label="Neuen Chat erstellen"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Icons.Chat />
            </button>

            {/* Ultra Premium Navigation Icons */}
            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'projects' ? 'none' : 'projects');
              }}
              className={cn(
                'group relative flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] overflow-hidden',
                panelMode === 'projects'
                  ? 'bg-gradient-to-br from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)] ring-1 ring-[var(--color-accent-500)]/30'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Projekte"
              aria-label="Projekte anzeigen"
              aria-pressed={panelMode === 'projects'}
            >
              {panelMode === 'projects' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/10 to-transparent" />}
              <Icons.Folder />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets');
              }}
              className={cn(
                'group relative flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] overflow-hidden',
                panelMode === 'snippets'
                  ? 'bg-gradient-to-br from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)] ring-1 ring-[var(--color-accent-500)]/30'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Code Snippets"
              aria-label="Code Snippets anzeigen"
              aria-pressed={panelMode === 'snippets'}
            >
              {panelMode === 'snippets' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/10 to-transparent" />}
              <Icons.Code />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts');
              }}
              className={cn(
                'group relative flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] overflow-hidden',
                panelMode === 'artifacts'
                  ? 'bg-gradient-to-br from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)] ring-1 ring-[var(--color-accent-500)]/30'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Artefakte"
              aria-label="Artefakte anzeigen"
              aria-pressed={panelMode === 'artifacts'}
            >
              {panelMode === 'artifacts' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/10 to-transparent" />}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Settings Icon - Ultra Premium */}
            <button
              onClick={() => setShowSettings(true)}
              className="group relative flex items-center justify-center w-12 h-12 mb-2 rounded-2xl text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-400)] transition-all duration-180 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
              title="Einstellungen"
            >
              <Icons.Settings />
            </button>
          </div>
        ) : (
          /* Expanded View - Ultra Full Sidebar */
          <>
            {/* TOP SECTION: Ultra Premium Navigation */}
            <nav className="flex-shrink-0 p-5 space-y-2">
              {/* Quantum Elite New Chat Button v11.0 */}
              <button
                onClick={onNewChat}
                className="group relative w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] text-white shadow-xl shadow-[var(--color-accent-glow-stronger)] hover:shadow-2xl hover:shadow-[var(--color-accent-glow-ultra)] hover:scale-[1.02] transition-all duration-200 ease-spring overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] active:scale-[1.01]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icons.Chat />
                <span className="text-sm font-semibold relative z-10">Neuer Chat</span>
              </button>

              {/* Ultra Premium Navigation Buttons */}
              <button
                onClick={() => setPanelMode(panelMode === 'projects' ? 'none' : 'projects')}
                className={cn(
                  'group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180 overflow-hidden',
                  panelMode === 'projects'
                    ? 'bg-gradient-to-r from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg ring-1 ring-[var(--color-accent-500)]/30'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {panelMode === 'projects' && <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-500)]/10 to-transparent" />}
                <Icons.Folder />
                <span className="text-sm font-medium relative">Projekte</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets')}
                className={cn(
                  'group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180 overflow-hidden',
                  panelMode === 'snippets'
                    ? 'bg-gradient-to-r from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg ring-1 ring-[var(--color-accent-500)]/30'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {panelMode === 'snippets' && <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-500)]/10 to-transparent" />}
                <Icons.Code />
                <span className="text-sm font-medium relative">Code Snippets</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts')}
                className={cn(
                  'group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180 overflow-hidden',
                  panelMode === 'artifacts'
                    ? 'bg-gradient-to-r from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/15 text-[var(--color-accent-400)] shadow-lg ring-1 ring-[var(--color-accent-500)]/30'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {panelMode === 'artifacts' && <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-500)]/10 to-transparent" />}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm font-medium relative">Artefakte</span>
              </button>
            </nav>

            {/* PANEL: Projects, Snippets, or Artifacts - Ultra Premium */}
            {panelMode === 'projects' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Projekte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ProjectsPanel currentChatId={currentChatId} onRefreshChats={onRefreshChats} />
              </div>
            )}

            {panelMode === 'snippets' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom backdrop-blur-sm max-h-[400px] overflow-y-auto sidebar-scroll">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Code Snippets
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <CodeSnippetsPanel />
              </div>
            )}

            {panelMode === 'artifacts' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom backdrop-blur-sm max-h-[400px] overflow-y-auto sidebar-scroll">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Artefakte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ArtifactsPanel currentChatId={currentChatId} />
              </div>
            )}

            {/* SEARCH & FILTER SECTION - Ultra Premium */}
            {panelMode === 'none' && (
              <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border-subtle)] space-y-3">
                {/* Ultra Premium Search Input */}
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chats durchsuchen..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm border border-[var(--color-border-medium)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-500)]/50 focus:shadow-lg focus:shadow-[var(--color-accent-glow-subtle)] focus:bg-[var(--color-bg-elevated)] transition-all duration-200"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent-500)] transition-colors duration-200 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 transition-all duration-200 hover:scale-110 rounded-lg hover:bg-[var(--color-bg-elevated)]"
                    >
                      <Icons.Close />
                    </button>
                  )}
                </div>

                {/* Ultra Premium Filter Pills */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden',
                      filterMode === 'all'
                        ? 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-hover)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-subtle)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-transparent'
                    )}
                  >
                    {filterMode === 'all' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/5 to-transparent" />}
                    <span className="relative">Alle</span>
                  </button>
                  <button
                    onClick={() => setFilterMode('today')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden',
                      filterMode === 'today'
                        ? 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-hover)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-subtle)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-transparent'
                    )}
                  >
                    {filterMode === 'today' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/5 to-transparent" />}
                    <span className="relative">Heute</span>
                  </button>
                  <button
                    onClick={() => setFilterMode('week')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden',
                      filterMode === 'week'
                        ? 'bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-hover)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-subtle)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-transparent'
                    )}
                  >
                    {filterMode === 'week' && <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/5 to-transparent" />}
                    <span className="relative">Woche</span>
                  </button>
                </div>
              </div>
            )}

            {/* MIDDLE SECTION: Ultra Premium Chat List */}
            {panelMode === 'none' && (
              <div className="flex-1 overflow-y-auto px-4 py-3 sidebar-scroll">
                {isLoadingChats ? (
                  <ChatSkeleton count={5} />
                ) : (
                  <>
                    {Object.entries(groupedChats).map(([dateLabel, dateChats]) => (
                      <div key={dateLabel}>
                        <h3 className="text-[10px] font-semibold text-[var(--color-text-muted)] px-3 mb-2 uppercase tracking-wider">
                          {dateLabel}
                        </h3>
                        <div className="flex flex-col gap-0.5 mb-5">
                          {dateChats.map((chat, idx) => (
                            <div
                              key={chat.id}
                              className={cn(
                                'group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden',
                                currentChatId === chat.id
                                  ? 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white shadow-lg shadow-[var(--color-accent-glow-strong)] ring-1 ring-[var(--color-accent-500)]/40'
                                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                              )}
                              onClick={() => {
                                onChatSelect(chat.id);
                                onClose();
                              }}
                              style={{ animationDelay: `${idx * 30}ms` }}
                            >
                              {/* Shimmer effect for active state */}
                              {currentChatId === chat.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                              )}
                              <span className="text-sm font-medium truncate flex-1 pr-2 relative z-10">
                                {chat.title.length > 35 ? chat.title.slice(0, 35) + '...' : chat.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat.id, e);
                                }}
                                className={cn(
                                  'opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-inset',
                                  currentChatId === chat.id
                                    ? 'hover:bg-white/20 text-white/70 hover:text-white'
                                    : 'text-[var(--color-text-faint)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-soft)]'
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
                      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] flex items-center justify-center mb-4 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)]">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                          {searchQuery ? 'Keine Chats gefunden' : 'Noch keine Chats'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {searchQuery ? 'Versuche einen anderen Suchbegriff' : 'Erstelle deinen ersten Chat'}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* BOTTOM SECTION: Ultra Premium Settings & Auth */}
            <div className="flex-shrink-0 border-t border-[var(--color-border-subtle)] p-4 space-y-1.5">
              <button
                onClick={() => setShowSettings(true)}
                className="group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent-500)]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex-shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-500)] transition-colors duration-200 relative">
                  <Icons.Settings />
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] relative">Einstellungen</span>
              </button>

              <AuthButton />
            </div>
          </>
        )}
      </aside>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
