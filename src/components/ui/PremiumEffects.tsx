'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NoiseTextureProps {
  opacity?: number;
  className?: string;
}

export function NoiseTexture({ opacity = 0.04, className }: NoiseTextureProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-0', className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

interface AuroraBackgroundProps {
  variant?: 'cool' | 'warm' | 'elite';
  className?: string;
  animated?: boolean;
}

export function AuroraBackground({
  variant = 'elite',
  className,
  animated = true,
}: AuroraBackgroundProps) {
  const gradients = {
    cool: 'bg-[var(--gradient-mesh-cool)]',
    warm: 'bg-[var(--gradient-mesh-warm)]',
    elite: 'bg-[var(--gradient-mesh-elite)]',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-0 opacity-60',
        gradients[variant],
        animated && 'animate-aurora',
        className
      )}
    />
  );
}

interface GradientOrbProps {
  className?: string;
  color?: 'accent' | 'success' | 'error' | 'warm' | 'cool';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function GradientOrb({
  className,
  color = 'accent',
  size = 'md',
  blur = 'lg',
  animated = true,
}: GradientOrbProps) {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[512px] h-[512px]',
  };

  const blurs = {
    sm: 'blur-3xl',
    md: 'blur-[100px]',
    lg: 'blur-[120px]',
  };

  const colors = {
    accent: 'bg-[var(--color-accent-500)]',
    success: 'bg-[var(--color-success)]',
    error: 'bg-[var(--color-error)]',
    warm: 'bg-[var(--color-accent-600)]',
    cool: 'bg-[var(--color-accent-400)]',
  };

  return (
    <div
      className={cn(
        'rounded-full opacity-30 pointer-events-none',
        sizes[size],
        blurs[blur],
        colors[color],
        animated && 'animate-float-slow',
        className
      )}
    />
  );
}

interface SpotlightEffectProps {
  children: ReactNode;
  className?: string;
  size?: number;
}

export function SpotlightEffect({ children, className, size = 600 }: SpotlightEffectProps) {
  return (
    <div
      className={cn('group relative', className)}
      style={{
        background: `radial-gradient(${size}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15), transparent 40%)`,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
      }}
    >
      {children}
    </div>
  );
}

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  color?: 'accent' | 'success' | 'error' | 'warning';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function GlowBorder({
  children,
  className,
  color = 'accent',
  intensity = 'medium',
}: GlowBorderProps) {
  const colors = {
    accent: 'rgba(99, 102, 241',
    success: 'rgba(34, 197, 94',
    error: 'rgba(248, 113, 113',
    warning: 'rgba(251, 191, 36',
  };

  const intensities = {
    subtle: '0.3',
    medium: '0.5',
    strong: '0.7',
  };

  const baseColor = colors[color];
  const opacity = intensities[intensity];

  return (
    <div
      className={cn('relative rounded-2xl p-[1px]', className)}
      style={{
        background: `linear-gradient(135deg, ${baseColor}, ${opacity}), ${baseColor}, ${opacity})`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite',
      }}
    >
      <div className="relative bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface ShimmerEffectProps {
  children: ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function ShimmerEffect({ children, className, speed = 'normal' }: ShimmerEffectProps) {
  const speeds = {
    slow: '3s',
    normal: '2s',
    fast: '1s',
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 -translate-x-full skew-x-12"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          animation: `shineSweep ${speeds[speed]} ease-in-out infinite`,
        }}
      />
      {children}
    </div>
  );
}

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong' | 'heavy';
  border?: boolean;
  shadow?: boolean;
}

export function GlassPanel({
  children,
  className,
  intensity = 'medium',
  border = true,
  shadow = false,
}: GlassPanelProps) {
  const intensities = {
    subtle: 'bg-[var(--color-bg-glass-crystal)] backdrop-blur-md',
    medium: 'bg-[var(--color-bg-glass)] backdrop-blur-xl',
    strong: 'bg-[var(--color-bg-glass-strong)] backdrop-blur-2xl',
    heavy: 'bg-[var(--color-bg-glass-heavy)] backdrop-blur-3xl',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        intensities[intensity],
        border && 'border [var(--glass-border-strong)]',
        shadow && 'shadow-2xl shadow-black/40',
        className
      )}
    >
      {children}
    </div>
  );
}
