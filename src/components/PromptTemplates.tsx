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
        className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] transition-all duration-200"
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
        className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 transition-all duration-200"
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

      {/* Templates Dropdown */}
      <div className="absolute bottom-full left-0 mb-2 w-72 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl shadow-xl animate-fade-in-up z-20 max-h-[400px] flex flex-col">
        {/* Categories */}
        <div className="p-2 border-b border-[var(--color-border-subtle)]">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                  selectedCategory === cat.id
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onTemplateSelect(template.prompt);
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {template.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                    {template.description}
                  </p>
                </div>
                <span className="w-4 h-4 text-[var(--color-text-muted)] rotate-[-90deg] group-hover:text-[var(--color-primary-500)] transition-colors flex items-center justify-center">
                <Icons.ChevronDown />
              </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
