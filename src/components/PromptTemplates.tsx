'use client';

import { useState } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES, PromptTemplate } from '@/lib/templates';

interface PromptTemplatesProps {
  onTemplateSelect: (prompt: string) => void;
}

export function PromptTemplates({ onTemplateSelect }: PromptTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = selectedCategory === 'all'
    ? PROMPT_TEMPLATES
    : PROMPT_TEMPLATES.filter(t => t.category === selectedCategory);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] hover:shadow-md transition-all duration-300 hover:scale-105"
        title="Vorlagen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3 3H2" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h1" />
          <path d="M15 9h3" />
          <path d="M15 12h3" />
          <path d="M15 15h3" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(false)}
        className="p-2.5 hover:bg-[var(--color-primary-500)]/20 rounded-xl text-[var(--color-primary-500)] bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-600)]/10 shadow-md shadow-[var(--color-primary-glow)] transition-all duration-300 hover:scale-105 border border-[var(--color-primary-500)]/20"
        title="Vorlagen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3 3H2" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h1" />
          <path d="M15 9h3" />
          <path d="M15 12h3" />
          <path d="M15 15h3" />
        </svg>
      </button>

      {/* Enhanced Templates Dropdown */}
      <div className="absolute bottom-full left-0 mb-3 w-80 bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-black/50 animate-slide-in-bottom z-20 max-h-[450px] flex flex-col overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-[var(--color-primary-500)] opacity-5 blur-3xl -z-10" />

        {/* Enhanced Categories */}
        <div className="p-3 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-transparent">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300',
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-lg shadow-[var(--color-primary-glow-strong)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] border border-transparent hover:border-[var(--color-border-subtle)]'
                )}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Templates List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 sidebar-scroll">
          {filteredTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => {
                onTemplateSelect(template.prompt);
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-[var(--color-bg-elevated)] hover:to-transparent border border-transparent hover:border-[var(--color-border-subtle)] transition-all duration-300 group animate-bounce-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {template.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-500)] transition-colors">
                    {template.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
                    {template.description}
                  </p>
                </div>
                <span className="w-5 h-5 text-[var(--color-text-muted)] rotate-[-90deg] group-hover:text-[var(--color-primary-500)] group-hover:translate-x-0.5 transition-all duration-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.ChevronDown />
                </span>
              </div>
            </button>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="py-8 text-center text-[var(--color-text-muted)] text-sm">
              Keine Vorlagen in dieser Kategorie
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="p-2 border-t border-[var(--glass-border)] bg-gradient-to-b from-transparent to-[var(--glass-highlight)]">
          <p className="text-[10px] text-center text-[var(--color-text-muted)]">
            Klicken zum Auswählen
          </p>
        </div>
      </div>
    </div>
  );
}
