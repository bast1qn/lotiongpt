'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('glm-4.6');
  const [visionModel, setVisionModel] = useState('glm-4.6v-flashx');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);

  useEffect(() => {
    if (isOpen) {
      const settings = storage.getSettings();
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setVisionModel(settings.visionModel || 'glm-4.6v-flashx');
      setTemperature(settings.temperature);
      setMaxTokens(settings.maxTokens);
    }
  }, [isOpen]);

  const handleSave = () => {
    storage.saveSettings({
      apiKey,
      model,
      visionModel,
      temperature,
      maxTokens,
      thinking: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)] shadow-2xl animate-scale-in-spring overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Icons.X />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* API Key */}
          <div className="space-y-2">
            <label className="block text-sm text-[var(--color-text-secondary)]">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dein Z.ai API Key"
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
            />
          </div>

          {/* Text Model */}
          <div className="space-y-2">
            <label className="block text-sm text-[var(--color-text-secondary)]">
              Text-Modell
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['glm-4.6', 'glm-4.7'].map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={cn(
                    'p-2.5 rounded-lg text-sm font-medium transition-all',
                    model === m
                      ? 'bg-[var(--color-primary-500)] text-white shadow-md shadow-[var(--color-primary-glow)]'
                      : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)]'
                  )}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Vision Model */}
          <div className="space-y-2">
            <label className="block text-sm text-[var(--color-text-secondary)]">
              Vision-Modell (für Bilder)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'glm-4.6v-flashx', label: 'FlashX', desc: 'Kostenlos' },
                { id: 'glm-4.6v-flash', label: 'Flash', desc: 'Schnell' },
                { id: 'glm-4.6v', label: 'Pro', desc: 'Beste Qualität' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setVisionModel(m.id)}
                  className={cn(
                    'p-2.5 rounded-lg text-sm font-medium transition-all flex flex-col items-center',
                    visionModel === m.id
                      ? 'bg-[var(--color-primary-500)] text-white shadow-md shadow-[var(--color-primary-glow)]'
                      : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)]'
                  )}
                >
                  <span>{m.label}</span>
                  <span className={cn('text-[10px]', visionModel === m.id ? 'text-white/70' : 'text-[var(--color-text-muted)]')}>
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-[var(--color-text-secondary)]">
                Temperature
              </label>
              <span className="text-sm text-[var(--color-primary-500)]">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[var(--color-bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary-500)]"
            />
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <label className="block text-sm text-[var(--color-text-secondary)]">
              Max Tokens
            </label>
            <input
              type="number"
              min="100"
              max="32000"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2.5 text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--color-border-subtle)] flex justify-end gap-2 bg-[var(--color-bg-tertiary)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-lg text-sm font-medium transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg text-sm font-medium shadow-md shadow-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary-glow-strong)] transition-all"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
