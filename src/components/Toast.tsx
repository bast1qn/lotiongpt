'use client';

import { useToast } from '@/lib/hooks/useToast';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-tooltip)] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const config = {
    success: {
      icon: <Icons.CheckCircle />,
      bgColor: 'bg-[var(--color-success-bg)]',
      borderColor: 'border-[var(--color-success)]',
      textColor: 'text-[var(--color-success)]',
    },
    error: {
      icon: <Icons.AlertCircle />,
      bgColor: 'bg-[var(--color-error-bg)]',
      borderColor: 'border-[var(--color-error)]',
      textColor: 'text-[var(--color-error)]',
    },
    warning: {
      icon: <Icons.AlertCircle />,
      bgColor: 'bg-[var(--color-warning-bg)]',
      borderColor: 'border-[var(--color-warning)]',
      textColor: 'text-[var(--color-warning)]',
    },
    info: {
      icon: <Icons.Info />,
      bgColor: 'bg-[var(--color-info-bg)]',
      borderColor: 'border-[var(--color-info)]',
      textColor: 'text-[var(--color-info)]',
    },
  }[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl',
        'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]',
        'shadow-lg shadow-black/30',
        'animate-fade-in-up',
        'hover:shadow-xl hover:shadow-black/40',
        'transition-all duration-200 ease-out'
      )}
    >
      <span className={cn('flex-shrink-0', config.textColor)}>
        {config.icon}
      </span>
      <span className="text-sm text-[var(--color-text-primary)]">
        {toast.message}
      </span>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
      >
        <Icons.Close />
      </button>
    </div>
  );
}
