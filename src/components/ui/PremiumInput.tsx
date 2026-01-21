'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'neon' | 'ethereal';
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  function PremiumInput(
    { className, label, error, icon, variant = 'default', type = 'text', showCharacterCount, maxLength, value, ...props },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const characterCount = typeof value === 'string' ? value.length : 0;

    const variants = {
      default: 'bg-[var(--color-bg-elevated)] border-[var(--color-border-medium)]',
      glass: 'bg-[var(--color-bg-glass)] backdrop-blur-xl border-[var(--glass-border)]',
      neon: 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)] shadow-[var(--input-glow)]',
      ethereal: 'bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border-[var(--glass-border-strong)] shadow-[var(--shadow-depth-1)]',
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 transition-colors duration-200">
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none transition-colors duration-200 group-focus-within:text-[var(--color-accent-500)]">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            maxLength={maxLength}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'border',
              'transition-all duration-200 ease-spring',
              'focus:outline-none',
              // v12.0 Elite focus enhancements
              variant === 'ethereal' ? 'focus:shadow-[var(--input-glow-premium)]' : 'focus:shadow-[var(--input-glow)]',
              'focus:border-[var(--input-border-focus)]',
              'hover:border-[var(--input-border-hover)]',
              variants[variant],
              icon && 'pl-12',
              showCharacterCount && 'pr-20',
              error && 'border-[var(--color-error)]',
              className
            )}
            {...props}
          />

          {/* v12.0 Animated gradient border on focus */}
          {(variant === 'neon' || variant === 'ethereal') && (
            <div className={cn(
              'absolute inset-0 rounded-xl transition-opacity duration-300 -z-10 blur-sm',
              variant === 'ethereal'
                ? 'bg-gradient-to-r from-[var(--color-accent-500)]/30 via-[var(--color-accent-400)]/30 to-[var(--color-accent-500)]/30'
                : 'bg-gradient-to-r from-[var(--color-accent-500)]/20 via-[var(--color-accent-400)]/20 to-[var(--color-accent-500)]/20',
              isFocused ? 'opacity-100' : 'opacity-0'
            )} />
          )}

          {/* v12.0 Character counter with animation */}
          {showCharacterCount && maxLength && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-all duration-200',
              characterCount >= maxLength ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]',
              isFocused && 'text-[var(--color-text-tertiary)]'
            )}>
              <span className={cn(
                'transition-all duration-300',
                characterCount >= maxLength * 0.9 && characterCount < maxLength && 'text-[var(--color-warning)]',
                characterCount >= maxLength && 'animate-pulse'
              )}>
                {characterCount}
              </span>
              <span className="text-[var(--color-text-faint)]">/{maxLength}</span>
            </div>
          )}
        </div>

        {/* v12.0 Enhanced error message with animation */}
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)] flex items-center gap-1.5 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
  variant?: 'default' | 'glass' | 'neon' | 'ethereal';
  autoResize?: boolean;
  showCharacterCount?: boolean;
}

export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  function PremiumTextarea(
    { className, label, error, variant = 'default', autoResize = false, showCharacterCount, maxLength, value, ...props },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const characterCount = typeof value === 'string' ? value.length : 0;

    const variants = {
      default: 'bg-[var(--color-bg-elevated)] border-[var(--color-border-medium)]',
      glass: 'bg-[var(--color-bg-glass)] backdrop-blur-xl border-[var(--glass-border)]',
      neon: 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)] shadow-[var(--input-glow)]',
      ethereal: 'bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border-[var(--glass-border-strong)] shadow-[var(--shadow-depth-1)]',
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
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 transition-colors duration-200">
            {label}
          </label>
        )}

        <div className="relative group">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            onInput={handleInput}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'border',
              'transition-all duration-200 ease-spring',
              'focus:outline-none',
              // v12.0 Elite focus enhancements
              variant === 'ethereal' ? 'focus:shadow-[var(--input-glow-premium)]' : 'focus:shadow-[var(--input-glow)]',
              'focus:border-[var(--input-border-focus)]',
              'hover:border-[var(--input-border-hover)]',
              'resize-none',
              variants[variant],
              showCharacterCount && 'pr-20',
              error && 'border-[var(--color-error)]',
              autoResize && 'overflow-hidden',
              className
            )}
            {...props}
          />

          {/* v12.0 Animated gradient border on focus */}
          {(variant === 'neon' || variant === 'ethereal') && (
            <div className={cn(
              'absolute inset-0 rounded-xl transition-opacity duration-300 -z-10 blur-sm',
              variant === 'ethereal'
                ? 'bg-gradient-to-r from-[var(--color-accent-500)]/30 via-[var(--color-accent-400)]/30 to-[var(--color-accent-500)]/30'
                : 'bg-gradient-to-r from-[var(--color-accent-500)]/20 via-[var(--color-accent-400)]/20 to-[var(--color-accent-500)]/20',
              isFocused ? 'opacity-100' : 'opacity-0'
            )} />
          )}

          {/* v12.0 Character counter with animation */}
          {showCharacterCount && maxLength && (
            <div className={cn(
              'absolute right-3 bottom-3 text-xs font-medium transition-all duration-200 bg-[var(--color-bg-tertiary)]/90 backdrop-blur-sm px-2 py-1 rounded-lg',
              characterCount >= maxLength ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]',
              isFocused && 'text-[var(--color-text-tertiary)]'
            )}>
              <span className={cn(
                'transition-all duration-300',
                characterCount >= maxLength * 0.9 && characterCount < maxLength && 'text-[var(--color-warning)]',
                characterCount >= maxLength && 'animate-pulse'
              )}>
                {characterCount}
              </span>
              <span className="text-[var(--color-text-faint)]">/{maxLength}</span>
            </div>
          )}
        </div>

        {/* v12.0 Enhanced error message with animation */}
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)] flex items-center gap-1.5 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
