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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50',
          'h-full flex flex-col',
          'bg-[var(--color-bg-secondary)]',
          'border-r border-[var(--color-border-default)]',
          'transition-all duration-200 ease-out',
          isCollapsed ? 'w-16' : 'w-[280px]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          'flex-shrink-0'
        )}
      >
        {/* Toggle Button - Desktop only */}
        <div className="hidden lg:block absolute -right-3 top-6 z-10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-primary-500)] hover:border-[var(--color-primary-500)] transition-all"
            aria-label={isCollapsed ? 'Sidebar erweitern' : 'Sidebar minimieren'}
          >
            <svg
              className={cn('w-3 h-3 transition-transform', isCollapsed ? 'rotate-180' : '')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsed View - Icon only */}
        {isCollapsed ? (
          <div className="flex flex-col h-full p-2">
            {/* New Chat Icon */}
            <button
              onClick={onNewChat}
              className="flex items-center justify-center w-12 h-12 mb-2 rounded-lg bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] transition-all"
              title="Neuer Chat"
            >
              <Icons.Chat />
            </button>

            {/* Navigation Icons */}
            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'projects' ? 'none' : 'projects');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-1 rounded-lg transition-all',
                panelMode === 'projects'
                  ? 'bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Projekte"
            >
              <Icons.Folder />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-1 rounded-lg transition-all',
                panelMode === 'snippets'
                  ? 'bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Code Snippets"
            >
              <Icons.Code />
            </button>

            <button
              onClick={() => {
                setIsCollapsed(false);
                setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts');
              }}
              className={cn(
                'flex items-center justify-center w-12 h-12 mb-1 rounded-lg transition-all',
                panelMode === 'artifacts'
                  ? 'bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)]'
                  : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              )}
              title="Artefakte"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Settings Icon */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center w-12 h-12 mb-1 rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-primary-500)] transition-all"
              title="Einstellungen"
            >
              <Icons.Settings />
            </button>
          </div>
        ) : (
          /* Expanded View - Full Sidebar */
          <>
            {/* TOP SECTION: Navigation */}
            <nav className="flex-shrink-0 p-4 space-y-2">
              {/* New Chat Button */}
              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] transition-all"
              >
                <Icons.Chat />
                <span className="text-sm font-medium">Neuer Chat</span>
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => setPanelMode(panelMode === 'projects' ? 'none' : 'projects')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                  panelMode === 'projects'
                    ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icons.Folder />
                <span className="text-sm">Projekte</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'snippets' ? 'none' : 'snippets')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                  panelMode === 'snippets'
                    ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icons.Code />
                <span className="text-sm">Code Snippets</span>
              </button>

              <button
                onClick={() => setPanelMode(panelMode === 'artifacts' ? 'none' : 'artifacts')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                  panelMode === 'artifacts'
                    ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm">Artefakte</span>
              </button>
            </nav>

            {/* PANEL: Projects, Snippets, or Artifacts */}
            {panelMode === 'projects' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-default)] animate-fade-in-down">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
                    Projekte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ProjectsPanel currentChatId={currentChatId} onRefreshChats={onRefreshChats} />
              </div>
            )}

            {panelMode === 'snippets' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-default)] animate-fade-in-down max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
                    Code Snippets
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <CodeSnippetsPanel />
              </div>
            )}

            {panelMode === 'artifacts' && (
              <div className="flex-shrink-0 border-y border-[var(--color-border-default)] animate-fade-in-down max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
                    Artefakte
                  </h3>
                  <button
                    onClick={() => setPanelMode('none')}
                    className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <Icons.Close />
                  </button>
                </div>
                <ArtifactsPanel currentChatId={currentChatId} />
              </div>
            )}

            {/* SEARCH & FILTER SECTION */}
            {panelMode === 'none' && (
              <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--color-border-default)] space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chats durchsuchen..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] transition-all"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 transition-colors"
                    >
                      <Icons.Close />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={cn(
                      'flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      filterMode === 'all'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Alle
                  </button>
                  <button
                    onClick={() => setFilterMode('today')}
                    className={cn(
                      'flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      filterMode === 'today'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Heute
                  </button>
                  <button
                    onClick={() => setFilterMode('week')}
                    className={cn(
                      'flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      filterMode === 'week'
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    )}
                  >
                    Woche
                  </button>
                </div>
              </div>
            )}

            {/* MIDDLE SECTION: Chat List */}
            {panelMode === 'none' && (
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {Object.entries(groupedChats).map(([dateLabel, dateChats]) => (
                  <div key={dateLabel}>
                    <h3 className="text-[11px] font-medium text-[var(--color-text-muted)] px-2 mb-2 uppercase tracking-wide">
                      {dateLabel}
                    </h3>
                    <div className="flex flex-col gap-1 mb-4">
                      {dateChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            'relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-colors duration-150',
                            currentChatId === chat.id
                              ? 'bg-[var(--color-primary-500)] text-white'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                          )}
                          onClick={() => {
                            onChatSelect(chat.id);
                            onClose();
                          }}
                        >
                          <span className="text-sm truncate flex-1 pr-2">
                            {chat.title.length > 35 ? chat.title.slice(0, 35) + '...' : chat.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id, e);
                            }}
                            className={cn(
                              'opacity-0 group-hover:opacity-100 p-1 rounded transition-all flex-shrink-0',
                              currentChatId === chat.id
                                ? 'hover:bg-white/15 text-white/70 hover:text-white'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-error)]'
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
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center mb-3">
                      <Icons.Search />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {searchQuery ? 'Keine Chats gefunden' : 'Noch keine Chats'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* BOTTOM SECTION: Settings & Auth */}
            <div className="flex-shrink-0 border-t border-[var(--color-border-default)] p-4 space-y-2">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-all group"
              >
                <div className="flex-shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-500)] transition-colors">
                  <Icons.Settings />
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">Einstellungen</span>
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
