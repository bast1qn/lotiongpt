'use client';

import { useState } from 'react';
import { Chat } from '@/types/chat';
import { formatDate, isToday, isThisWeek } from '@/lib/utils';
import { Icons } from './Icons';
import { SettingsModal } from './SettingsModal';
import { AuthButton } from './AuthButton';
import { ProjectsPanel } from './ProjectsPanel';
import { CodeSnippetsPanel } from './CodeSnippetsPanel';
import { ArtifactsPanel } from './ArtifactsPanel';
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
}

type FilterMode = 'all' | 'today' | 'week';
type PanelMode = 'none' | 'projects' | 'snippets' | 'artifacts';

export function Sidebar({ currentChatId, onChatSelect, onNewChat, onDeleteChat, chats, onRefreshChats, isOpen, onClose }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [panelMode, setPanelMode] = useState<PanelMode>('none');
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteChat(id);
  };

  return (
    <>
      {/* Elite Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Elite Glass Effect */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50',
          'h-full flex flex-col',
          'bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl',
          'border-r border-[var(--color-border-default)]',
          'transition-all duration-180 var(--ease-spring)',
          isCollapsed ? 'w-16' : 'w-[280px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          'flex-shrink-0'
        )}
      >
        {/* Elite Toggle Button - Desktop only */}
        <div className="hidden lg:block absolute -right-3.5 top-6 z-10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-2xl bg-[var(--color-bg-tertiary)]/90 backdrop-blur-md border border-[var(--color-border-medium)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-400)] hover:border-[var(--color-accent-500)]/40 hover:shadow-lg hover:shadow-[var(--color-accent-glow-subtle)] transition-all duration-180 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
            aria-label={isCollapsed ? 'Sidebar erweitern' : 'Sidebar minimieren'}
            aria-expanded={isCollapsed}
          >
            <svg
              className={cn('w-4 h-4 transition-transform duration-180', isCollapsed ? 'rotate-180' : '')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsed View - Elite Icon only */}
        {isCollapsed ? (
          <div className="flex flex-col h-full p-3">
            {/* New Chat Icon - Elite */}
            <button
              onClick={onNewChat}
              className="flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] text-white shadow-xl shadow-[var(--shadow-message-user)] hover:shadow-2xl hover:shadow-[var(--color-accent-glow-ultra)] hover:scale-105 transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
              title="Neuer Chat"
              aria-label="Neuen Chat erstellen"
            >
              <Icons.Chat />
            </button>

            {/* Navigation Icons - Elite */}
            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'projects' ? 'none' : 'projects');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
                panelMode === 'projects'
                  ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Projekte"
              aria-label="Projekte anzeigen"
              aria-pressed={panelMode === 'projects'}
            >
              <Icons.Folder />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
                panelMode === 'snippets'
                  ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Code Snippets"
              aria-label="Code Snippets anzeigen"
              aria-pressed={panelMode === 'snippets'}
            >
              <Icons.Code />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-2 rounded-2xl transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
                panelMode === 'artifacts'
                  ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg shadow-[var(--color-accent-glow-subtle)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Artefakte"
              aria-label="Artefakte anzeigen"
              aria-pressed={panelMode === 'artifacts'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Settings Icon - Elite */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center w-12 h-12 mb-2 rounded-2xl text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-400)] transition-all duration-180 hover:scale-105"
              title="Einstellungen"
            >
              <Icons.Settings />
            </button>
          </div>
        ) : (
          /* Expanded View - Elite Full Sidebar */
          <>
            {/* TOP SECTION: Elite Navigation */}
            <nav className="flex-shrink-0 p-5 space-y-2">
              {/* Elite New Chat Button */}
              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-550)] to-[var(--color-accent-600)] text-white shadow-xl shadow-[var(--shadow-message-user)] hover:shadow-2xl hover:shadow-[var(--color-accent-glow-ultra)] hover:scale-[1.02] transition-all duration-180 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Icons.Chat />
                <span className="text-sm font-semibold relative z-10">Neuer Chat</span>
              </button>

              {/* Elite Navigation Buttons */}
              <button
                onClick={() => setPanelMode(panelMode === 'projects' ? 'none' : 'projects')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180',
                  panelMode === 'projects'
                    ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icons.Folder />
                <span className="text-sm font-medium">Projekte</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180',
                  panelMode === 'snippets'
                    ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icons.Code />
                <span className="text-sm font-medium">Code Snippets</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-180',
                  panelMode === 'artifacts'
                    ? 'bg-[var(--color-accent-500)]/18 text-[var(--color-accent-400)] shadow-lg'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm font-medium">Artefakte</span>
              </button>
            </nav>

            {/* PANEL: Projects, Snippets, or Artifacts - Premium */}
            {panelMode === 'projects' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Projekte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-105"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ProjectsPanel currentChatId={currentChatId} onRefreshChats={onRefreshChats} />
              </div>
            )}

            {panelMode === 'snippets' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom max-h-[400px] overflow-y-auto sidebar-scroll">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Code Snippets
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-105"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <CodeSnippetsPanel />
              </div>
            )}

            {panelMode === 'artifacts' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 animate-slide-in-bottom max-h-[400px] overflow-y-auto sidebar-scroll">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Artefakte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-200 hover:scale-105"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ArtifactsPanel currentChatId={currentChatId} />
              </div>
            )}

            {/* SEARCH & FILTER SECTION - Premium */}
            {panelMode === 'none' && (
              <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border-subtle)] space-y-3">
                {/* Premium Search Input */}
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chats durchsuchen..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border-medium)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow-subtle)] transition-all duration-200"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 transition-all duration-200 hover:scale-110"
                    >
                      <Icons.Close />
                    </button>
                  )}
                </div>

                {/* Premium Filter Pills */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                      filterMode === 'all'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Alle
                  </button>
                  <button
                    onClick={() => setFilterMode('today')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                      filterMode === 'today'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Heute
                  </button>
                  <button
                    onClick={() => setFilterMode('week')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                      filterMode === 'week'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Woche
                  </button>
                </div>
              </div>
            )}

            {/* MIDDLE SECTION: Premium Chat List */}
            {panelMode === 'none' && (
              <div className="flex-1 overflow-y-auto px-4 py-3 sidebar-scroll">
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
                            'relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200',
                            currentChatId === chat.id
                              ? 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white shadow-lg shadow-[var(--color-accent-glow)]'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]/80'
                          )}
                          onClick={() => {
                            onChatSelect(chat.id);
                            onClose();
                          }}
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          <span className="text-sm font-medium truncate flex-1 pr-2">
                            {chat.title.length > 35 ? chat.title.slice(0, 35) + '...' : chat.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id, e);
                            }}
                            className={cn(
                              'opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110',
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
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] flex items-center justify-center mb-4">
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
              </div>
            )}

            {/* BOTTOM SECTION: Premium Settings & Auth */}
            <div className="flex-shrink-0 border-t border-[var(--color-border-subtle)] p-4 space-y-1.5">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all duration-200 group"
              >
                <div className="flex-shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-500)] transition-colors duration-200">
                  <Icons.Settings />
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">Einstellungen</span>
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
