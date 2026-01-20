'use client';

import { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { fetchSnippets, createSnippet, updateSnippet, deleteSnippet, searchSnippets } from '@/lib/db/snippets';
import { SNIPPET_LANGUAGES } from '@/types/chat';
import type { CodeSnippet, SnippetFormData } from '@/types/chat';
import { useToast } from '@/lib/hooks/useToast';

interface CodeSnippetsPanelProps {
  onInsertSnippet?: (code: string) => void;
}

export function CodeSnippetsPanel({ onInsertSnippet }: CodeSnippetsPanelProps) {
  const { showToast } = useToast();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<SnippetFormData>({
    title: '',
    code: '',
    language: 'javascript',
    tags: [],
  });

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    setIsLoading(true);
    const data = await fetchSnippets();
    setSnippets(data);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSnippets();
      return;
    }
    setIsLoading(true);
    const results = await searchSnippets(searchQuery);
    setSnippets(results);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.code.trim()) {
      showToast('Bitte fülle alle Felder aus', 'error');
      return;
    }

    let result;
    if (isEditing) {
      result = await updateSnippet(isEditing, formData);
    } else {
      result = await createSnippet(formData);
    }

    if (result) {
      showToast(isEditing ? 'Snippet aktualisiert' : 'Snippet erstellt', 'success');
      await loadSnippets();
      resetForm();
    } else {
      showToast('Fehler beim Speichern', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteSnippet(id);
    if (success) {
      showToast('Snippet gelöscht', 'success');
      await loadSnippets();
    }
  };

  const handleInsert = (code: string) => {
    if (onInsertSnippet) {
      onInsertSnippet(code);
      showToast('Code in Chat eingefügt', 'success');
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({ title: '', code: '', language: 'javascript', tags: [] });
  };

  const filteredSnippets = searchQuery
    ? snippets
    : snippets;

  const languageIcon = SNIPPET_LANGUAGES.find(l => l.id === formData.language)?.icon || '📄';

  return (
    <div className="p-3 space-y-3">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          Code Snippets
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:shadow-md transition-all duration-120 hover:scale-100"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Enhanced Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Snippets durchsuchen..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
          <Icons.Search />
        </div>
      </div>

      {/* Enhanced Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="space-y-3 p-4 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)] shadow-lg animate-slide-in-bottom">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titel (z.B. API Fetch)"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
            autoFocus
          />

          <textarea
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Code..."
            rows={4}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120 font-mono text-[12px]"
          />

          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
          >
            {SNIPPET_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-xl transition-all duration-120 hover:shadow-md"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white rounded-xl transition-all duration-120 shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100"
            >
              {isEditing ? 'Speichern' : 'Erstellen'}
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Snippets List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3 shadow-md">
            <Icons.Code />
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {searchQuery ? 'Keine Snippets gefunden' : 'Noch keine Snippets'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Speichere häufig genutzten Code
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSnippets.map((snippet, index) => {
            const langInfo = SNIPPET_LANGUAGES.find(l => l.id === snippet.language);
            return (
              <div
                key={snippet.id}
                className="group relative p-3 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:shadow-md transition-all duration-120 animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Enhanced Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-500)] transition-colors">
                      {snippet.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                      {langInfo?.icon} {langInfo?.name}
                    </span>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleInsert(snippet.code)}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-120 hover:scale-100"
                      title="In Chat einfügen"
                    >
                      <Icons.Plus />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(snippet.id);
                        setFormData({
                          title: snippet.title,
                          code: snippet.code,
                          language: snippet.language,
                          tags: snippet.tags,
                        });
                      }}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-120 hover:scale-100"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(snippet.id)}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all duration-120 hover:scale-100"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>

                {/* Enhanced Code Preview */}
                <pre className="text-xs text-[var(--color-text-secondary)] font-mono overflow-x-auto whitespace-pre-wrap bg-[var(--color-bg-secondary)] rounded-xl p-3 max-h-24 border border-[var(--color-border-subtle)]">
                  {snippet.code.slice(0, 150)}
                  {snippet.code.length > 150 && '...'}
                </pre>

                {/* Tags */}
                {snippet.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {snippet.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
