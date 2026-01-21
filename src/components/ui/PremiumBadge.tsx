'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neon' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function PremiumBadge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
}: PremiumBadgeProps) {
  const variants = {
    default: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-medium)]',
    success: 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/20 shadow-[var(--color-success-glow)]',
    warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]/20 shadow-[var(--color-warning-glow)]',
    error: 'bg-[var(--color-error-soft)] text-[var(--color-error)] border-[var(--color-error)]/20 shadow-[var(--color-error-glow)]',
    info: 'bg-[var(--color-info-soft)] text-[var(--color-info)] border-[var(--color-info)]/20 shadow-[var(--color-info-glow)]',
    neon: 'bg-[var(--color-accent-soft)] text-[var(--color-accent-300)] border-[var(--color-border-accent)] shadow-[var(--shadow-glow-strong)] animate-pulse-subtle',
    gradient: 'bg-[var(--gradient-primary)] text-white border-transparent animate-gradient-shift bg-[length:200%_200%]',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
    lg: 'px-4 py-2 text-base rounded-xl',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-1.5 font-medium',
        'border',
        'transition-all duration-200 ease-spring',
        'hover-scale-sm',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full animate-pulse',
            variant === 'success' && 'bg-[var(--color-success)]',
            variant === 'warning' && 'bg-[var(--color-warning)]',
            variant === 'error' && 'bg-[var(--color-error)]',
            variant === 'info' && 'bg-[var(--color-info)]',
            variant === 'neon' && 'bg-[var(--color-accent-400)]',
            variant === 'default' && 'bg-[var(--color-text-tertiary)]',
            variant === 'gradient' && 'bg-white'
          )}
        />
      )}

      {icon && <span className="flex-shrink-0">{icon}</span>}

      <span className="relative z-10">{children}</span>

      {/* Animated shine for gradient/neon variants */}
      {(variant === 'gradient' || variant === 'neon') && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-50" />
      )}
    </div>
  );
}

interface PremiumPillProps {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'glow';
  color?: 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PremiumPill({
  children,
  variant = 'solid',
  color = 'accent',
  size = 'md',
  className,
}: PremiumPillProps) {
  const colors = {
    accent: {
      solid: 'bg-[var(--color-accent-500)] text-white',
      outline: 'bg-transparent text-[var(--color-accent-400)] border-[var(--color-accent-500)]/50',
      glow: 'bg-[var(--color-accent-500)]/20 text-[var(--color-accent-300)] border-[var(--color-accent-500)]/30 shadow-[var(--shadow-glow)]',
    },
    success: {
      solid: 'bg-[var(--color-success)] text-white',
      outline: 'bg-transparent text-[var(--color-success)] border-[var(--color-success)]/50',
      glow: 'bg-[var(--color-success)]/20 text-[var(--color-success)] border-[var(--color-success)]/30 shadow-[var(--color-success-glow)]',
    },
    warning: {
      solid: 'bg-[var(--color-warning)] text-white',
      outline: 'bg-transparent text-[var(--color-warning)] border-[var(--color-warning)]/50',
      glow: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)]/30 shadow-[var(--color-warning-glow)]',
    },
    error: {
      solid: 'bg-[var(--color-error)] text-white',
      outline: 'bg-transparent text-[var(--color-error)] border-[var(--color-error)]/50',
      glow: 'bg-[var(--color-error)]/20 text-[var(--color-error)] border-[var(--color-error)]/30 shadow-[var(--color-error-glow)]',
    },
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-full',
    md: 'px-4 py-2 text-sm rounded-full',
    lg: 'px-5 py-2.5 text-base rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold',
        'border',
        'transition-all duration-200 ease-spring',
        'hover-lift-sm',
        colors[color][variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
