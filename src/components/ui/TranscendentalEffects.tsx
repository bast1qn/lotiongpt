'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TranscendentalCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  enable3D?: boolean;
  enableParticles?: boolean;
  enableGlow?: boolean;
}

export function TranscendentalCard({
  children,
  className,
  intensity = 'medium',
  enable3D = true,
  enableParticles = true,
  enableGlow = true,
}: TranscendentalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const intensityConfig = {
    subtle: { scale: 1.02, rotate: 2, translateZ: 10 },
    medium: { scale: 1.05, rotate: 5, translateZ: 20 },
    strong: { scale: 1.08, rotate: 8, translateZ: 30 },
  };

  const config = intensityConfig[intensity];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative rounded-3xl overflow-hidden',
        'transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)',
        'preserve-3d',
        enable3D && 'hover:animate-card-tilt',
        enableGlow && 'hover:shadow-glow-transcendental',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* v13.0 Spotlight Effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)',
        }}
      />

      {/* v13.0 Holographic Border */}
      {enable3D && (
        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute -inset-[2px] rounded-3xl animate-gradient-shift opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.5), rgba(255, 0, 255, 0.4), rgba(0, 255, 136, 0.3))',
              backgroundSize: '300% 300%',
            }}
          />
        </div>
      )}

      {/* v13.0 Particle Effect */}
      {enableParticles && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[var(--particle-quantum-1)] rounded-full animate-particle-vortex" style={{ animationDelay: '0ms' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[var(--particle-quantum-2)] rounded-full animate-particle-vortex" style={{ animationDelay: '200ms' }} />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-[var(--particle-quantum-3)] rounded-full animate-particle-vortex" style={{ animationDelay: '400ms' }} />
        </div>
      )}

      {/* v13.0 Plasma Glow */}
      {enableGlow && (
        <div
          className={cn(
            'absolute -inset-4 rounded-3xl blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none',
            isHovered && 'opacity-100 animate-plasma-glow'
          )}
          style={{
            background: 'radial-gradient(ellipse at center, var(--plasma-core) 0%, var(--plasma-outer) 70%, transparent 100%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full transform-gpu">{children}</div>
    </div>
  );
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: 'quantum' | 'cosmic' | 'holo';
}

export function ParticleField({ count = 20, className, color = 'quantum' }: ParticleFieldProps) {
  const colorMap = {
    quantum: ['--particle-quantum-1', '--particle-quantum-2', '--particle-quantum-3', '--particle-quantum-4', '--particle-quantum-5'],
    cosmic: ['--particle-cosmic-1', '--particle-cosmic-2', '--particle-cosmic-3', '--particle-cosmic-4', '--particle-cosmic-5'],
    holo: ['--holo-cyan', '--holo-magenta', '--holo-lime', '--holo-gold'],
  };

  const colors = colorMap[color];

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-particle-swirl opacity-40"
          style={{
            background: `var(${colors[i % colors.length]})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3000}ms`,
            animationDuration: `${3 + Math.random() * 2}s`,
            '--tx': `${(Math.random() - 0.5) * 200}px`,
            '--ty': `${(Math.random() - 0.5) * 200}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

interface VolumetricGlowProps {
  className?: string;
  color?: 'accent' | 'success' | 'error' | 'warning';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function VolumetricGlow({ className, color = 'accent', intensity = 'medium' }: VolumetricGlowProps) {
  const colorMap = {
    accent: 'rgba(99, 102, 241, 0.6)',
    success: 'rgba(34, 197, 94, 0.6)',
    error: 'rgba(248, 113, 113, 0.6)',
    warning: 'rgba(251, 191, 36, 0.6)',
  };

  const intensityMap = {
    subtle: '60px',
    medium: '100px',
    strong: '160px',
  };

  return (
    <div
      className={cn('absolute inset-0 rounded-3xl pointer-events-none', className)}
      style={{
        boxShadow: `0 0 ${intensityMap[intensity]} ${colorMap[color]}`,
        filter: 'blur(20px)',
      }}
    />
  );
}

interface MorphingBlobProps {
  className?: string;
  gradient?: 'aurora' | 'plasma' | 'holo' | 'cyberpunk';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MorphingBlob({ className, gradient = 'aurora', size = 'md' }: MorphingBlobProps) {
  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const gradientMap = {
    aurora: 'var(--gradient-aurora)',
    plasma: 'var(--gradient-plasma)',
    holo: 'var(--gradient-hologram)',
    cyberpunk: 'var(--gradient-cyberpunk)',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-liquid-morph filter blur-2xl opacity-60',
        sizeMap[size],
        className
      )}
      style={{
        background: gradientMap[gradient],
        backgroundSize: '200% 200%',
      }}
    />
  );
}

interface QuantumTunnelProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function QuantumTunnel({ children, isActive = false, className }: QuantumTunnelProps) {
  return (
    <div className={cn('relative', className)}>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl animate-quantum-tunnel bg-gradient-to-br from-[var(--color-accent-500)]/20 via-transparent to-[var(--color-accent-600)]/20" />
        </div>
      )}
      <div className={cn('relative z-10', isActive && 'animate-quantum-tunnel')}>
        {children}
      </div>
    </div>
  );
}

interface HoloTextProps {
  children: string;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function HoloText({ children, className, intensity = 'medium' }: HoloTextProps) {
  const intensityMap = {
    subtle: '0 0 20px rgba(255, 255, 255, 0.3)',
    medium: '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
    strong: '0 0 40px rgba(99, 102, 241, 0.7), 0 0 80px rgba(139, 92, 246, 0.5), 0 0 120px rgba(168, 85, 247, 0.3)',
  };

  return (
    <span
      className={cn(
        'relative inline-block animate-holographic-shift',
        className
      )}
      style={{
        textShadow: intensityMap[intensity],
      }}
    >
      {children}
    </span>
  );
}
