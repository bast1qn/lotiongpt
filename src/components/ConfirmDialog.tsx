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
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus management with restoration
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element to restore later
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Focus the cancel button by default (safer for destructive actions)
      // Small delay to ensure the dialog is rendered
      const timeoutId = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    } else {
      // Restore focus when dialog closes
      const timeoutId = setTimeout(() => {
        previousActiveElementRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Trap focus within dialog - improved
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // Get all focusable elements within the dialog
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

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

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
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
      {/* Elite Backdrop v10.0 */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[var(--z-overlay)] animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          data-confirm-dialog
          className={cn(
            'relative w-full max-w-md bg-[var(--color-bg-glass-strong)] backdrop-blur-xl',
            'border border-[var(--glass-border-strong)] rounded-2xl',
            'shadow-2xl shadow-black/70',
            'animate-modal-in p-6 overflow-hidden'
          )}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
        >
          {/* Subtle glow effect v10.0 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)]/5 to-transparent pointer-events-none" />

          {/* Icon */}
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg',
            variantConfig.iconBg
          )}>
            <span className={cn('text-2xl', variantConfig.iconColor)}>
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
                'bg-[var(--color-bg-tertiary)] border border-[var(--glass-border)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-elevated)]',
                'transition-all duration-200 ease-spring hover:scale-[1.02] active:scale-[1.01]',
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
                'shadow-lg hover:shadow-xl transition-all duration-200 ease-spring hover:scale-[1.02] active:scale-[1.01]',
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
