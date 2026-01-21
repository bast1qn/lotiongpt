'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Multi-layer gradient mesh background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[var(--gradient-mesh-elite)] animate-aurora" />
        <div className="absolute inset-0 bg-[var(--gradient-aurora-animated)] animate-aurora" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full bg-[var(--color-accent-500)]/10 blur-3xl animate-float-slow"
          style={{ top: '10%', left: '20%', animationDelay: '0s' }}
        />
        <div
          className="absolute w-80 h-80 rounded-full bg-[var(--color-accent-600)]/10 blur-3xl animate-float-gentle"
          style={{ top: '60%', right: '15%', animationDelay: '-2s' }}
        />
        <div
          className="absolute w-72 h-72 rounded-full bg-[var(--color-accent-400)]/8 blur-3xl animate-float-slow"
          style={{ bottom: '20%', left: '40%', animationDelay: '-4s' }}
        />
        <div
          className="absolute w-64 h-64 rounded-full bg-purple-500/8 blur-3xl animate-float-gentle"
          style={{ top: '40%', left: '60%', animationDelay: '-6s' }}
        />
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[var(--color-accent-400)] animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  variant?: 'subtle' | 'medium' | 'strong';
}

export function GradientBorder({
  children,
  className,
  animated = true,
  variant = 'medium',
}: GradientBorderProps) {
  const variants = {
    subtle: 'from-[var(--color-accent-500)]/20 via-[var(--color-accent-400)]/30 to-[var(--color-accent-500)]/20',
    medium: 'from-[var(--color-accent-500)]/40 via-[var(--color-accent-400)]/50 to-[var(--color-accent-500)]/40',
    strong: 'from-[var(--color-accent-500)]/60 via-[var(--color-accent-400)]/70 to-[var(--color-accent-500)]/60',
  };

  return (
    <div className={cn('relative rounded-2xl p-[2px]', className)}>
      <div
        className={cn(
          'absolute inset-0 rounded-2xl bg-gradient-to-r',
          variants[variant],
          animated && 'animate-gradient-shift bg-[length:200%_200%]'
        )}
      />
      <div className="relative bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
