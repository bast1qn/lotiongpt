'use client';

import { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { fetchArtifacts, createArtifact, updateArtifact, deleteArtifact, downloadArtifact, ARTIFACT_FILE_TYPES, Artifact, ArtifactFormData } from '@/lib/db/artifacts';
import { useToast } from '@/lib/hooks/useToast';

interface ArtifactsPanelProps {
  currentChatId: string | null;
}

export function ArtifactsPanel({ currentChatId }: ArtifactsPanelProps) {
  const { showToast } = useToast();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const [formData, setFormData] = useState<ArtifactFormData>({
    name: '',
    content: '',
    fileType: 'html',
    language: '',
  });

  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async () => {
    setIsLoading(true);
    const data = await fetchArtifacts();
    setArtifacts(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      showToast('Bitte fülle alle Felder aus', 'error');
      return;
    }

    if (!currentChatId) {
      showToast('Kein Chat ausgewählt', 'error');
      return;
    }

    let result;
    if (isEditing) {
      result = await updateArtifact(isEditing, formData);
    } else {
      result = await createArtifact(formData, currentChatId);
    }

    if (result) {
      showToast(isEditing ? 'Artefakt aktualisiert' : 'Artefakt erstellt', 'success');
      await loadArtifacts();
      resetForm();
    } else {
      showToast('Fehler beim Speichern', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteArtifact(id);
    if (success) {
      showToast('Artefakt gelöscht', 'success');
      if (previewArtifact?.id === id) {
        setPreviewArtifact(null);
      }
      await loadArtifacts();
    }
  };

  const handleDownload = (artifact: Artifact) => {
    downloadArtifact(artifact);
    showToast('Download gestartet', 'success');
  };

  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({ name: '', content: '', fileType: 'html', language: '' });
  };

  const typeInfo = ARTIFACT_FILE_TYPES.find(t => t.id === formData.fileType);

  return (
    <div className="p-3 space-y-3">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          Artefakte
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:shadow-md transition-all duration-120 hover:scale-100"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Enhanced Preview Panel */}
      {previewArtifact && (
        <div className="p-4 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)] shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ARTIFACT_FILE_TYPES.find(t => t.id === previewArtifact.fileType)?.icon}</span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {previewArtifact.name}
              </span>
            </div>
            <button
              onClick={() => setPreviewArtifact(null)}
              className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-120"
            >
              <Icons.Close />
            </button>
          </div>
          <pre className="text-xs text-[var(--color-text-secondary)] font-mono overflow-x-auto whitespace-pre-wrap bg-[var(--color-bg-secondary)] rounded-xl p-3 max-h-40 border border-[var(--color-border-subtle)]">
            {previewArtifact.content.slice(0, 300)}
            {previewArtifact.content.length > 300 && '...'}
          </pre>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleDownload(previewArtifact)}
              className="flex-1 px-4 py-2 text-xs bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white rounded-xl transition-all duration-120 shadow-md shadow-[var(--color-accent-glow)] hover:shadow-lg hover:shadow-[var(--color-accent-glow-strong)]"
            >
              Download
            </button>
            <button
              onClick={() => {
                setIsEditing(previewArtifact.id);
                setFormData({
                  name: previewArtifact.name,
                  content: previewArtifact.content,
                  fileType: previewArtifact.fileType,
                  language: previewArtifact.language,
                });
                setPreviewArtifact(null);
              }}
              className="px-4 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-xl transition-all duration-120 hover:shadow-md"
            >
              Bearbeiten
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="space-y-3 p-4 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)] shadow-lg animate-slide-in-bottom">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name (z.B. index.html)"
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
            autoFocus
          />

          <select
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
          >
            {ARTIFACT_FILE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>

          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Inhalt..."
            rows={6}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120 font-mono text-[12px]"
          />

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

      {/* Enhanced Artifacts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] animate-pulse" />
        </div>
      ) : artifacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Noch keine Artefakte
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Speichere generierte Dateien
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {artifacts.map((artifact, index) => {
            const typeInfo = ARTIFACT_FILE_TYPES.find(t => t.id === artifact.fileType);
            return (
              <div
                key={artifact.id}
                className="group relative p-3 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:shadow-md transition-all duration-120 animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-100 transition-transform duration-120">
                    {typeInfo?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-500)] transition-colors">
                      {artifact.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {typeInfo?.name} · {artifact.content.length} Zeichen
                    </p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewArtifact(artifact)}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-120 hover:scale-100"
                      title="Vorschau"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDownload(artifact)}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10 transition-all duration-120 hover:scale-100"
                      title="Download"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(artifact.id)}
                      className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all duration-120 hover:scale-100"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
