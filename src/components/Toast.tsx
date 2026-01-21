'use client';

import { useToast } from '@/lib/hooks/useToast';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';

export function Toaster() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Benachrichtigungen"
      aria-live="polite"
      aria-atomic="true"
    >
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
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onClose: () => void;
  index: number;
}

function ToastItem({ toast, onClose, index }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
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
      ariaLabel: 'Erfolg',
    },
    error: {
      icon: <Icons.AlertCircle />,
      gradient: 'from-red-500/15 to-rose-500/5',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15',
      progressColor: 'bg-red-400',
      glowColor: 'shadow-red-500/20',
      ariaLabel: 'Fehler',
    },
    warning: {
      icon: <Icons.AlertCircle />,
      gradient: 'from-amber-500/15 to-yellow-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      progressColor: 'bg-amber-400',
      glowColor: 'shadow-amber-500/20',
      ariaLabel: 'Warnung',
    },
    info: {
      icon: <Icons.Info />,
      gradient: 'from-blue-500/15 to-cyan-500/5',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      progressColor: 'bg-blue-400',
      glowColor: 'shadow-blue-500/20',
      ariaLabel: 'Information',
    },
  }[toast.type];

  // Handle close with exit animation
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for exit animation
  }, [onClose]);

  // Progress bar animation with pause on hover
  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleClose();
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, isPaused, handleClose]);

  // Keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && toast.action) {
      toast.action.onClick();
      handleClose();
    }
  }, [handleClose, toast.action]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden',
        'flex items-center gap-3 px-4 py-3.5 rounded-xl min-w-[320px] max-w-md',
        'bg-[var(--color-bg-glass-strong)] backdrop-blur-xl',
        'border', config.borderColor,
        'shadow-xl shadow-black/50',
        // v12.0 Elite entrance/exit animations
        isExiting ? 'animate-exit-to-right' : 'animate-premium-entrance',
        'hover:scale-[1.02] transition-transform duration-200',
        // v12.0 Enhanced glow effect
        config.glowColor,
        'hover-glow-expand'
      )}
      style={{
        animationDelay: isExiting ? '0ms' : `${index * 50}ms`,
        animationDuration: '300ms'
      }}
      role="alert"
      aria-label={`${config.ariaLabel}: ${toast.message}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Quantum glow effect behind toast */}
      <div className="absolute -inset-2 opacity-25 blur-xl -z-10 bg-gradient-to-br from-white/8 to-transparent pointer-events-none" />

      {/* Progress bar - v12.0 Premium */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className={cn(
              'h-full transition-all duration-75 ease-out shadow-lg relative overflow-hidden',
              config.progressColor
            )}
            style={{
              width: isPaused ? `${progress}%` : `${progress}%`,
              transitionDuration: isPaused ? '0ms' : '75ms'
            }}
          >
            {/* v12.0 Progress shimmer effect */}
            <div className="absolute inset-0 animate-shimmer-glow opacity-50" />
          </div>
        </div>
      )}

      {/* Icon - Premium with animation */}
      <span className={cn(
        'flex-shrink-0 p-2 rounded-xl shadow-sm animate-badge-pop',
        config.iconBg,
        config.iconColor
      )} aria-hidden="true">
        {config.icon}
      </span>

      {/* Message */}
      <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
        {toast.message}
      </span>

      {/* Action button (if provided) */}
      {toast.action && (
        <button
          onClick={() => {
            toast.action?.onClick();
            handleClose();
          }}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-default)] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-glass-strong)]"
          type="button"
        >
          {toast.action.label}
        </button>
      )}

      {/* Close button - Premium */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-glass-strong)]"
        aria-label="Schließen"
        type="button"
      >
        <Icons.Close />
      </button>

      {/* Keyboard hint */}
      <span className="sr-only">Drcke Escape zum Schließen</span>
    </div>
  );
}
