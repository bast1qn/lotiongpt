'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/performance';
import { cn } from '@/lib/utils';

interface PremiumLayoutProps {
  children: ReactNode;
  className?: string;
  showBackground?: boolean;
}

export function PremiumLayout({
  children,
  className,
  showBackground = true,
}: PremiumLayoutProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'min-h-screen w-screen overflow-hidden',
        'bg-[var(--color-bg-primary)]',
        'text-[var(--color-text-primary)]',
        className
      )}
    >
      {/* Skip links for accessibility */}
      <SkipLinks />

      {/* Background effects */}
      {showBackground && !prefersReducedMotion && (
        <>
          <AnimatedBackgroundEffects />
          <NoiseTextureOverlay />
        </>
      )}

      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* Focus visible styles enhancement */}
      <style jsx global>{`
        :focus-visible {
          outline: 2px solid var(--color-accent-500) !important;
          outline-offset: 3px !important;
          border-radius: 4px !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18) !important;
        }
      `}</style>
    </div>
  );
}

function SkipLinks() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-gradient-to-r focus:from-[var(--color-accent-500)] focus:to-[var(--color-accent-600)] focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-2xl focus:shadow-[var(--shadow-glow-ultra)] focus:transition-all focus:duration-200"
      >
        Zum Hauptinhalt springen
      </a>
      <a
        href="#sidebar"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-gradient-to-r focus:from-[var(--color-accent-500)] focus:to-[var(--color-accent-600)] focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-2xl focus:shadow-[var(--shadow-glow-ultra)] focus:transition-all focus:duration-200"
      >
        Zur Navigation springen
      </a>
    </>
  );
}

function AnimatedBackgroundEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Multi-layer gradient mesh */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15), transparent 40%)`,
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-[var(--color-accent-500)]/8 blur-3xl animate-float-slow" />
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/6 blur-3xl animate-float-gentle" style={{ animationDelay: '-2s' }} />
        <div className="absolute w-72 h-72 rounded-full bg-indigo-500/6 blur-3xl animate-float-slow" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Aurora effect */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[var(--gradient-mesh-elite)] animate-aurora" />
      </div>
    </div>
  );
}

function NoiseTextureOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

interface PremiumContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function PremiumContainer({ children, size = 'lg', className }: PremiumContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </div>
  );
}

interface PremiumSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'accent';
}

export function PremiumSection({
  children,
  className,
  spacing = 'lg',
  variant = 'default',
}: PremiumSectionProps) {
  const spacings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const variants = {
    default: 'bg-transparent',
    muted: 'bg-[var(--color-bg-elevated)]/50',
    accent: 'bg-gradient-to-br from-[var(--color-accent-500)]/5 to-[var(--color-accent-600)]/5',
  };

  return (
    <section className={cn('w-full', spacings[spacing], variants[variant], className)}>
      {children}
    </section>
  );
}

interface PremiumGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PremiumGrid({ children, cols = 3, gap = 'lg', className }: PremiumGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div className={cn('grid', gridCols[cols], gaps[gap], className)}>
      {children}
    </div>
  );
}

interface PremiumFlexProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}

export function PremiumFlex({
  children,
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
}: PremiumFlexProps) {
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const gaps = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        alignments[align],
        justifications[justify],
        gaps[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}
