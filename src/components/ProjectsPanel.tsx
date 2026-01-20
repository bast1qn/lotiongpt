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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          Projekte
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:shadow-md transition-all duration-120 hover:scale-100"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Enhanced Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="space-y-3 p-4 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)] shadow-lg animate-slide-in-bottom">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Projektname"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
            autoFocus
          />
          <input
            type="text"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Beschreibung (optional)"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
          />

          {/* Enhanced Color Picker */}
          <div className="flex gap-2 flex-wrap">
            {['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'].map((color) => (
              <button
                key={color}
                onClick={() => setFormData({ ...formData, color })}
                className={cn(
                  'w-7 h-7 rounded-full transition-all duration-120 relative',
                  formData.color === color ? 'scale-100' : 'hover:scale-100'
                )}
                style={{
                  backgroundColor: color,
                  boxShadow: formData.color === color ? `0 0 0 3px var(--color-bg-tertiary), 0 0 0 5px ${color}` : 'none',
                }}
              />
            ))}
          </div>

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

      {/* Enhanced Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3 shadow-md">
            <Icons.Folder />
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Noch keine Projekte
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Organisiere deine Chats in Projekten
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[var(--color-bg-elevated)] hover:to-transparent border border-transparent hover:border-[var(--color-border-subtle)] transition-all duration-120 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Enhanced Color Indicator with glow */}
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-md"
                style={{
                  backgroundColor: project.color,
                  boxShadow: `0 0 10px ${project.color}40`
                }}
              />

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-500)] transition-colors">
                  {project.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                  <Icons.Chat />
                  {project.chatCount} {project.chatCount === 1 ? 'Chat' : 'Chats'}
                </p>
              </div>

              {/* Enhanced Actions */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleAddChat(project.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-120 opacity-0 group-hover:opacity-100 hover:scale-100"
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
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-120 opacity-0 group-hover:opacity-100 hover:scale-100"
                >
                  <Icons.Edit />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all duration-120 opacity-0 group-hover:opacity-100 hover:scale-100"
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
