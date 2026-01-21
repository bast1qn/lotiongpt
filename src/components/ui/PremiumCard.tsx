'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'neon';
  hover?: boolean;
  glow?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  function PremiumCard({
    children,
    className,
    variant = 'default',
    hover = true,
    glow = false,
    interactive = false,
    onClick,
  }, ref) {
    const variants = {
      default: 'bg-[var(--color-bg-elevated)] border-[var(--color-border-medium)]',
      glass: 'bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border-[var(--glass-border-strong)]',
      elevated: 'bg-[var(--color-bg-surface)] border-[var(--color-border-strong)] shadow-xl',
      neon: 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)] shadow-[var(--shadow-glow-strong)]',
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'relative rounded-2xl border p-6 transition-all duration-300',
          variants[variant],
          hover && 'hover-lift-md hover-scale-sm cursor-pointer',
          glow && 'hover:shadow-[var(--shadow-glow-ultra)] hover:border-[var(--color-border-accent)]',
          interactive && 'active:scale-95',
          'overflow-hidden',
          className
        )}
      >
        {/* Animated gradient overlay for premium cards */}
        {variant === 'neon' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-500)]/10 via-transparent to-[var(--color-accent-600)]/10 animate-gradient-shift rounded-2xl" />
        )}

        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        {/* Shimmer effect on hover */}
        {hover && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer-slow" />
          </div>
        )}

        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

interface PremiumCardHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function PremiumCardHeader({ title, description, icon, action }: PremiumCardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] flex items-center justify-center shadow-lg shadow-[var(--color-accent-glow-subtle)]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PremiumCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function PremiumCardFooter({ children, className }: PremiumCardFooterProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-[var(--color-border-subtle)]', className)}>
      {children}
    </div>
  );
}
