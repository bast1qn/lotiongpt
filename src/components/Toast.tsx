'use client';

import { useToast } from '@/lib/hooks/useToast';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Toaster() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => hideToast(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
  onClose: () => void;
  index: number;
}

function ToastItem({ toast, onClose, index }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 3000;

  const config = {
    success: {
      icon: <Icons.CheckCircle />,
      gradient: 'from-emerald-500/15 to-green-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      progressColor: 'bg-emerald-400',
      glowColor: 'shadow-emerald-500/20',
    },
    error: {
      icon: <Icons.AlertCircle />,
      gradient: 'from-red-500/15 to-rose-500/5',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15',
      progressColor: 'bg-red-400',
      glowColor: 'shadow-red-500/20',
    },
    warning: {
      icon: <Icons.AlertCircle />,
      gradient: 'from-amber-500/15 to-yellow-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      progressColor: 'bg-amber-400',
      glowColor: 'shadow-amber-500/20',
    },
    info: {
      icon: <Icons.Info />,
      gradient: 'from-blue-500/15 to-cyan-500/5',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      progressColor: 'bg-blue-400',
      glowColor: 'shadow-blue-500/20',
    },
  }[toast.type];

  // Progress bar animation
  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden',
        'flex items-center gap-3 px-4 py-3.5 rounded-xl min-w-[320px] max-w-md',
        'bg-[var(--color-bg-glass-strong)] backdrop-blur-xl',
        'border', config.borderColor,
        'shadow-xl shadow-black/40',
        'animate-toast-in',
        'hover:scale-[1.02] transition-transform duration-200'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Progress bar - Premium */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className={cn(
              'h-full transition-all duration-75 ease-out shadow-lg',
              config.progressColor
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Icon - Premium */}
      <span className={cn(
        'flex-shrink-0 p-2 rounded-xl shadow-sm',
        config.iconBg,
        config.iconColor
      )}>
        {config.icon}
      </span>

      {/* Message */}
      <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
        {toast.message}
      </span>

      {/* Close button - Premium */}
      <button
        onClick={onClose}
        className="flex-shrink-0 p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 hover:scale-110"
      >
        <Icons.Close />
      </button>
    </div>
  );
}
