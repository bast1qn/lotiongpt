'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { MemoryList } from './MemoryList';

type Tab = 'settings' | 'memories';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
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
      {/* Enhanced Backdrop with gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal with glassmorphism */}
      <div className="relative w-full max-w-md bg-[var(--color-bg-glass-strong)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] shadow-2xl shadow-black/50 animate-scale-in-spring overflow-hidden">
        {/* Subtle glow effect behind modal */}
        <div className="absolute -inset-4 bg-[var(--color-accent-500)] opacity-5 blur-3xl -z-10" />

        {/* Header with Tabs - Enhanced */}
        <div className="border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-transparent">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                'flex-1 px-5 py-4 text-sm font-medium transition-all relative group',
                activeTab === 'settings'
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              <span className="relative z-10">Einstellungen</span>
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent-500)] to-transparent shadow-md shadow-[var(--color-accent-glow)]" />
              )}
              {activeTab !== 'settings' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent-500)] opacity-0 group-hover:opacity-50 transition-all duration-120" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={cn(
                'flex-1 px-5 py-4 text-sm font-medium transition-all relative group',
                activeTab === 'memories'
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              <span className="relative z-10">Memories</span>
              {activeTab === 'memories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent-500)] to-transparent shadow-md shadow-[var(--color-accent-glow)]" />
              )}
              {activeTab !== 'memories' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent-500)] opacity-0 group-hover:opacity-50 transition-all duration-120" />
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-md rounded-xl transition-all duration-120 m-1"
            >
              <Icons.X />
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'settings' ? (
          <>
            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto sidebar-scroll">
              {/* API Key */}
              <div className="space-y-2">
                <label className="block text-sm text-[var(--color-text-secondary)] font-medium">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Dein Z.ai API Key"
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120 placeholder:[var(--color-text-muted)]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                    <Icons.Lock />
                  </div>
                </div>
              </div>

              {/* Text Model */}
              <div className="space-y-2">
                <label className="block text-sm text-[var(--color-text-secondary)] font-medium">
                  Text-Modell
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['glm-4.6', 'glm-4.7'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={cn(
                        'p-3 rounded-xl text-sm font-medium transition-all duration-120 relative overflow-hidden',
                        model === m
                          ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100'
                          : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:shadow-md'
                      )}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision Model */}
              <div className="space-y-2">
                <label className="block text-sm text-[var(--color-text-secondary)] font-medium">
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
                        'p-2.5 rounded-xl text-sm font-medium transition-all duration-120 flex flex-col items-center',
                        visionModel === m.id
                          ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100'
                          : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:shadow-md'
                      )}
                    >
                      <span className="font-medium">{m.label}</span>
                      <span className={cn('text-[10px]', visionModel === m.id ? 'text-white/70' : 'text-[var(--color-text-muted)]')}>
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-[var(--color-text-secondary)] font-medium">
                    Temperature
                  </label>
                  <span className="text-sm font-semibold text-[var(--color-accent-500)] px-2 py-1 rounded-lg bg-[var(--color-accent-500)]/10">{temperature}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[var(--color-bg-tertiary)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[var(--color-accent-500)] [&::-webkit-slider-thumb]:to-[var(--color-accent-600)] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[var(--color-accent-glow)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-100"
                  />
                  <div className="absolute inset-0 h-2 bg-gradient-to-r from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/20 rounded-full pointer-events-none" style={{ width: `${temperature * 100}%` }} />
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="block text-sm text-[var(--color-text-secondary)] font-medium">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="32000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
                  className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
                />
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="px-5 py-4 border-t border-[var(--glass-border)] flex justify-end gap-3 bg-gradient-to-b from-[var(--glass-highlight)] to-[var(--color-bg-tertiary)]">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] rounded-xl text-sm font-medium transition-all duration-120 hover:shadow-md"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white rounded-xl text-sm font-medium shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100 transition-all duration-120"
              >
                Speichern
              </button>
            </div>
          </>
        ) : (
          <MemoryList onClose={onClose} />
        )}
      </div>
    </div>
  );
}
