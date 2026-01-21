'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'neon';
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  function PremiumInput(
    { className, label, error, icon, variant = 'default', type = 'text', ...props },
    ref
  ) {
    const variants = {
      default: 'bg-[var(--color-bg-elevated)] border-[var(--color-border-medium)]',
      glass: 'bg-[var(--color-bg-glass)] backdrop-blur-xl border-[var(--glass-border)]',
      neon: 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)] shadow-[var(--input-glow)]',
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'border',
              'transition-all duration-200 ease-spring',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/50',
              'focus:border-[var(--input-border-focus)]',
              'focus:shadow-[var(--input-glow)]',
              'hover:border-[var(--input-border-hover)]',
              variants[variant],
              icon && 'pl-12',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]/50',
              className
            )}
            {...props}
          />

          {/* Animated gradient border on focus */}
          {variant === 'neon' && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-accent-500)]/20 via-[var(--color-accent-400)]/20 to-[var(--color-accent-500)]/20 opacity-0 peer-focus:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)] flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

interface PremiumTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass' | 'neon';
  autoResize?: boolean;
}

export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  function PremiumTextarea(
    { className, label, error, variant = 'default', autoResize = false, ...props },
    ref
  ) {
    const variants = {
      default: 'bg-[var(--color-bg-elevated)] border-[var(--color-border-medium)]',
      glass: 'bg-[var(--color-bg-glass)] backdrop-blur-xl border-[var(--glass-border)]',
      neon: 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)] shadow-[var(--input-glow)]',
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${Math.min(target.scrollHeight, 300)}px`;
      }
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          onInput={handleInput}
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
            'border',
            'transition-all duration-200 ease-spring',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/50',
            'focus:border-[var(--input-border-focus)]',
            'focus:shadow-[var(--input-glow)]',
            'hover:border-[var(--input-border-hover)]',
            'resize-none',
            variants[variant],
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]/50',
            autoResize && 'overflow-hidden',
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)] flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
