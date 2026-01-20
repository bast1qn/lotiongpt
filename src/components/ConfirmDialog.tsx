'use client';

import { useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Bestatigen',
  cancelLabel = 'Abbrechen',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default (safer for destructive actions)
      cancelButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Trap focus within dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = document.querySelectorAll(
        '[data-confirm-dialog] button, [data-confirm-dialog] button:not([disabled])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      confirmBg: 'bg-[var(--color-error)] hover:bg-red-600',
      confirmIcon: <Icons.Trash />,
      iconBg: 'bg-[var(--color-error-soft)]',
      iconColor: 'text-[var(--color-error)]',
    },
    warning: {
      confirmBg: 'bg-[var(--color-warning)] hover:bg-amber-600',
      confirmIcon: <Icons.AlertCircle />,
      iconBg: 'bg-[var(--color-warning-soft)]',
      iconColor: 'text-[var(--color-warning)]',
    },
    info: {
      confirmBg: 'bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)]',
      confirmIcon: <Icons.Info />,
      iconBg: 'bg-[var(--color-info-soft)]',
      iconColor: 'text-[var(--color-info)]',
    },
  }[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[var(--z-overlay)] animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
        <div
          data-confirm-dialog
          className={cn(
            'relative w-full max-w-md bg-[var(--color-bg-secondary)]',
            'border border-[var(--color-border-medium)] rounded-2xl',
            'shadow-2xl shadow-black/50',
            'animate-scale-in-spring p-6'
          )}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
        >
          {/* Icon */}
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            variantConfig.iconBg
          )}>
            <span className={cn('text-xl', variantConfig.iconColor)}>
              {variantConfig.confirmIcon}
            </span>
          </div>

          {/* Content */}
          <h2
            id="confirm-title"
            className="text-lg font-semibold text-[var(--color-text-primary)] mb-2"
          >
            {title}
          </h2>
          <p
            id="confirm-description"
            className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed"
          >
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium',
                'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-medium)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-elevated)]',
                'transition-all duration-200 hover:scale-[1.02]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]'
              )}
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white',
                'shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]',
                variantConfig.confirmBg,
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]'
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
