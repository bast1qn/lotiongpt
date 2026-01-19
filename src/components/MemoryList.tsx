'use client';

import { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { fetchMemories, createMemory, updateMemory, deleteMemory } from '@/lib/db/memories';
import type { Memory, MemoryFormData, MemoryCategory } from '@/types/chat';
import { useToast } from '@/lib/hooks/useToast';

interface MemoryListProps {
  onClose: () => void;
}

const categoryLabels: Record<MemoryCategory, string> = {
  personal: 'Persönlich',
  preferences: 'Präferenzen',
  context: 'Kontext',
  other: 'Sonstiges',
};

const categoryIcons: Record<MemoryCategory, React.ReactNode> = {
  personal: <Icons.User />,
  preferences: <Icons.Settings />,
  context: <Icons.Chat />,
  other: <Icons.Grid />,
};

export function MemoryList({ onClose }: MemoryListProps) {
  const { showToast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [formData, setFormData] = useState<MemoryFormData>({
    key: '',
    value: '',
    category: 'personal',
  });
  const [filterCategory, setFilterCategory] = useState<MemoryCategory | 'all'>('all');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setIsLoading(true);
    const data = await fetchMemories();
    setMemories(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.key.trim() || !formData.value.trim()) {
      showToast('Bitte fülle alle Felder aus', 'error');
      return;
    }

    let result;
    if (editingMemory) {
      result = await updateMemory(editingMemory.id, formData);
    } else {
      result = await createMemory(formData);
    }

    if (result) {
      showToast(editingMemory ? 'Memory aktualisiert' : 'Memory erstellt', 'success');
      await loadMemories();
      resetForm();
    } else {
      showToast('Memory konnte nicht gespeichert werden', 'error');
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setFormData({
      key: memory.key,
      value: memory.value,
      category: memory.category,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteMemory(id);
    if (success) {
      showToast('Memory wurde entfernt', 'success');
      await loadMemories();
    } else {
      showToast('Memory konnte nicht gelöscht werden', 'error');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingMemory(null);
    setFormData({ key: '', value: '', category: 'personal' });
  };

  const filteredMemories = filterCategory === 'all'
    ? memories
    : memories.filter(m => m.category === filterCategory);

  return (
    <div className="max-h-[70vh] flex flex-col">
      {/* Add Button & Filter */}
      <div className="p-4 border-b border-[var(--color-border-subtle)] space-y-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg text-sm font-medium shadow-md shadow-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary-glow-strong)] transition-all"
          >
            <Icons.Plus />
            Neues Memory
          </button>
        ) : (
          <div className="space-y-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="Key (z.B. name)"
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] transition-all"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MemoryCategory })}
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary-500)] transition-all"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="Value (z.B. Max)"
              className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg text-sm font-medium transition-all"
              >
                <Icons.Check />
                {editingMemory ? 'Speichern' : 'Hinzufügen'}
              </button>
              <button
                onClick={resetForm}
                className="px-3 py-2 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-lg text-sm transition-all"
              >
                <Icons.X />
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filterCategory === 'all'
                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            Alle
          </button>
          {(Object.keys(categoryLabels) as MemoryCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                filterCategory === cat
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3">
              <Icons.Grid />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {filterCategory === 'all' ? 'Noch keine Memories' : 'Keine Memories in dieser Kategorie'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Die KI wird Dinge lernen, die du ihr sagst
            </p>
          </div>
        ) : (
          filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] transition-all"
            >
              {/* Category Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-text-muted)]">
                {categoryIcons[memory.category]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {memory.key}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
                    {categoryLabels[memory.category]}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                  {memory.value}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(memory)}
                  className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="p-1.5 hover:bg-[var(--color-error-bg)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-all"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Footer */}
      <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
        <p className="text-xs text-[var(--color-text-muted)] text-center">
          Sag "Merk dir..." damit die KI Dinge lernt
        </p>
      </div>
    </div>
  );
}
