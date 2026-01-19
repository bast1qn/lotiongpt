'use client';

import { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { fetchProjects, createProject, updateProject, deleteProject, addChatToProject } from '@/lib/db/projects';
import type { Project, ProjectFormData, PROJECT_COLORS } from '@/types/chat';
import { useToast } from '@/lib/hooks/useToast';

interface ProjectsPanelProps {
  currentChatId: string | null;
  onRefreshChats?: () => void;
}

export function ProjectsPanel({ currentChatId, onRefreshChats }: ProjectsPanelProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    color: '#6366f1',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast('Bitte gib einen Projektnamen ein', 'error');
      return;
    }

    let result;
    if (isEditing) {
      result = await updateProject(isEditing, formData);
    } else {
      result = await createProject(formData);
    }

    if (result) {
      showToast(isEditing ? 'Projekt aktualisiert' : 'Projekt erstellt', 'success');
      await loadProjects();
      resetForm();
    } else {
      showToast('Fehler beim Speichern', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      showToast('Projekt gelöscht', 'success');
      await loadProjects();
    }
  };

  const handleAddChat = async (projectId: string) => {
    if (!currentChatId) {
      showToast('Kein Chat ausgewählt', 'error');
      return;
    }

    const success = await addChatToProject(currentChatId, projectId);
    if (success) {
      showToast('Chat zum Projekt hinzugefügt', 'success');
      setShowMenu(null);
      onRefreshChats?.();
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({ name: '', description: '', color: '#6366f1' });
  };

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          Projekte
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="space-y-2 p-3 bg-[var(--color-bg-tertiary)] rounded-xl animate-fade-in-down">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Projektname"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] transition-all"
            autoFocus
          />
          <input
            type="text"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beschreibung (optional)"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] transition-all"
          />

          {/* Color Picker */}
          <div className="flex gap-1.5 flex-wrap">
            {['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'].map((color) => (
              <button
                key={color}
                onClick={() => setFormData({ ...formData, color })}
                className={cn(
                  'w-6 h-6 rounded-full transition-all',
                  formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[var(--color-bg-tertiary)]' : ''
                )}
                style={{
                  backgroundColor: color
                }}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={resetForm}
              className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-sm bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg transition-colors"
            >
              {isEditing ? 'Speichern' : 'Erstellen'}
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3">
            <Icons.Folder />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Noch keine Projekte
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Organisiere deine Chats in Projekten
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all"
            >
              {/* Color Indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {project.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {project.chatCount} {project.chatCount === 1 ? 'Chat' : 'Chats'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddChat(project.id)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Chat hinzufügen"
                >
                  <Icons.Plus />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(project.id);
                    setFormData({
                      name: project.name,
                      description: project.description,
                      color: project.color,
                    });
                  }}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all opacity-0 group-hover:opacity-100"
                >
                  <Icons.Edit />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all opacity-0 group-hover:opacity-100"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
