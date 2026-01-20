'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
  messages: Message[];
  chatCreatedAt?: string;
  chatUpdatedAt?: string;
}

type ExportFormat = 'markdown' | 'json' | 'txt';

export function ExportModal({ isOpen, onClose, chatTitle, messages, chatCreatedAt, chatUpdatedAt }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const formatMessageAsMarkdown = (message: Message, index: number): string => {
    const roleLabel = message.role === 'user' ? '👤 **Du**' : '🤖 **LotionGPT**';
    return `${roleLabel}\n\n${message.content}\n\n---\n\n`;
  };

  const exportAsMarkdown = (): string => {
    let content = `# ${chatTitle}\n\n`;
    content += `*Exportiert am ${new Date().toLocaleString('de-DE')}*\n\n---\n\n`;

    messages.forEach((msg, idx) => {
      content += formatMessageAsMarkdown(msg, idx);
    });

    return content;
  };

  const exportAsJson = (): string => {
    return JSON.stringify({
      title: chatTitle,
      createdAt: chatCreatedAt,
      updatedAt: chatUpdatedAt,
      exportedAt: new Date().toISOString(),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        images: m.images,
        files: m.files,
      })),
    }, null, 2);
  };

  const exportAsTxt = (): string => {
    let content = `${chatTitle}\n`;
    content += `${'='.repeat(chatTitle.length)}\n\n`;
    content += `Exportiert am ${new Date().toLocaleString('de-DE')}\n\n`;

    messages.forEach((msg) => {
      const roleLabel = msg.role === 'user' ? '[Du]' : '[LotionGPT]';
      content += `${roleLabel}\n${msg.content}\n\n`;
    });

    return content;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'markdown':
          content = exportAsMarkdown();
          mimeType = 'text/markdown';
          extension = 'md';
          break;
        case 'json':
          content = exportAsJson();
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'txt':
          content = exportAsTxt();
          mimeType = 'text/plain';
          extension = 'txt';
          break;
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);

    try {
      let content: string;

      switch (format) {
        case 'markdown':
          content = exportAsMarkdown();
          break;
        case 'json':
          content = exportAsJson();
          break;
        case 'txt':
          content = exportAsTxt();
          break;
      }

      await navigator.clipboard.writeText(content);
      onClose();
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md pointer-events-auto animate-fade-in-down relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-[var(--color-accent-500)] opacity-5 blur-3xl -z-10" />

          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)]/20 to-[var(--color-accent-600)]/10 text-[var(--color-accent-500)] shadow-md shadow-[var(--color-accent-glow)]">
                <Icons.Download />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Chat exportieren
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-md transition-all duration-120"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Enhanced Format Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['markdown', 'txt', 'json'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-120 relative overflow-hidden',
                      format === fmt
                        ? 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100'
                        : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-default)] hover:shadow-md'
                    )}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Format Info */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)] flex-shrink-0">
                  <Icons.Info />
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {format === 'markdown' && 'Markdown-Format mit Syntax-Highlighting Unterstützung.'}
                  {format === 'json' && 'Vollständiger Chat-Export mit Metadaten für Backup/Import.'}
                  {format === 'txt' && 'Einfaches Text-Format für maximale Kompatibilität.'}
                </div>
              </div>
            </div>

            {/* Enhanced Preview */}
            <div className="p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Vorschau
                </p>
                <span className="text-xs text-[var(--color-accent-500)] bg-[var(--color-accent-500)]/10 px-2 py-0.5 rounded-lg font-medium">
                  {messages.length} Nachrichten
                </span>
              </div>
              <div className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                {messages[messages.length - 1]?.content.slice(0, 150)}...
              </div>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="px-6 py-5 border-t border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-[var(--color-bg-tertiary)] rounded-b-2xl flex gap-3">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="flex-1 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl transition-all duration-120 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isExporting ? 'Kopiere...' : 'In Zwischenablage'}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] rounded-xl transition-all duration-120 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100"
            >
              {isExporting ? 'Exportiere...' : 'Herunterladen'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
