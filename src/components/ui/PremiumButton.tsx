'use client';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glow?: boolean;
  children: ReactNode;
}

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  function PremiumButton(
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      glow = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) {
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white border-transparent',
      secondary: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border-medium)]',
      ghost: 'bg-transparent text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-bg-hover)]',
      neon: 'bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-400)] to-[var(--color-accent-500)] text-white border-[var(--color-border-accent)] shadow-[var(--shadow-glow-strong)]',
      gradient: 'bg-[var(--gradient-primary)] text-white border-transparent animate-gradient-shift bg-[length:200%_200%]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-medium',
          'transition-all duration-200 ease-spring',
          'border',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
          'hover-lift-sm',
          'active:scale-95',
          variants[variant],
          sizes[size],
          glow && 'hover:shadow-[var(--shadow-glow-ultra)]',
          (disabled || loading) && 'opacity-50 cursor-not-allowed hover:scale-100',
          className
        )}
        {...props}
      >
        {/* Animated gradient shine */}
        {variant === 'primary' || variant === 'gradient' ? (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
        ) : null}

        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Button content */}
        <span className={cn('relative z-10', loading && 'opacity-50')}>
          {children}
        </span>

        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

interface PremiumIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: string;
  variant?: 'default' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const PremiumIconButton = forwardRef<HTMLButtonElement, PremiumIconButtonProps>(
  function PremiumIconButton(
    { icon, tooltip, variant = 'default', size = 'md', className, ...props },
    ref
  ) {
    const variants = {
      default: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-medium)]',
      ghost: 'bg-transparent text-[var(--color-text-tertiary)] border-transparent',
      glow: 'bg-[var(--color-bg-glass)] text-[var(--color-accent-400)] border-[var(--color-border-accent)] shadow-[var(--shadow-glow)]',
    };

    const sizes = {
      sm: 'w-8 h-8 rounded-lg',
      md: 'w-10 h-10 rounded-xl',
      lg: 'w-12 h-12 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'transition-all duration-200 ease-spring',
          'border',
          'hover-lift-sm',
          'active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
          variants[variant],
          sizes[size],
          'hover:text-[var(--color-text-primary)]',
          variant === 'glow' && 'hover:shadow-[var(--shadow-glow-strong)] hover:text-[var(--color-accent-300)]',
          className
        )}
        title={tooltip}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {icon}
        </span>
      </button>
    );
  }
);
