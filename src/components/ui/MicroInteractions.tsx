'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Press effect - scales down when pressed
 */
interface PressEffectProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function PressEffect({ children, scale = 0.95, className }: PressEffectProps) {
  return (
    <div
      className={cn('transition-transform duration-100 ease-spring active:scale-95', className)}
      style={{ '--tw-scale-x': scale, '--tw-scale-y': scale } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Magnetic button effect - follows mouse slightly
 */
interface MagneticEffectProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticEffect({ children, strength = 20, className }: MagneticEffectProps) {
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = (x / rect.width) * strength;
    const moveY = (y / rect.height) * strength;

    setTransform(`translate(${moveX}px, ${moveY}px)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('transition-transform duration-300 ease-out', className)}
      style={{ transform } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Ripple effect on click
 */
interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function RippleEffect({ children, className, color = 'rgba(255, 255, 255, 0.3)' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      onClick={handleClick}
      className={cn('relative overflow-hidden', className)}
    >
      {children}

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '0',
            height: '0',
            background: color,
            transform: 'translate(-50%, -50%)',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/**
 * Hover lift effect
 */
interface HoverLiftProps {
  children: ReactNode;
  lift?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  className?: string;
}

export function HoverLift({ children, lift = 'md', shadow = true, className }: HoverLiftProps) {
  const lifts = {
    sm: 'hover:-translate-y-1',
    md: 'hover:-translate-y-2',
    lg: 'hover:-translate-y-4',
  };

  const shadows = {
    sm: 'hover:shadow-lg',
    md: 'hover:shadow-xl',
    lg: 'hover:shadow-2xl',
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-spring',
        lifts[lift],
        shadow && shadows[lift],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Shimmer loading effect
 */
interface ShimmerProps {
  className?: string;
  variant?: 'default' | 'circle' | 'text';
  width?: string;
  height?: string;
}

export function Shimmer({ className, variant = 'default', width, height }: ShimmerProps) {
  const variants = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded-sm h-4',
  };

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-[var(--color-bg-tertiary)] via-white/[0.05] to-[var(--color-bg-tertiary)] bg-[length:200%_100%]',
        variants[variant],
        className
      )}
      style={{ width, height } as React.CSSProperties}
    />
  );
}

/**
 * Scale on hover effect
 */
interface ScaleOnHoverProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function ScaleOnHover({ children, scale = 1.05, className }: ScaleOnHoverProps) {
  return (
    <div
      className={cn('transition-transform duration-300 ease-spring hover:scale-105', className)}
      style={{ '--tw-scale-x': scale, '--tw-scale-y': scale } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Glow on hover effect
 */
interface GlowOnHoverProps {
  children: ReactNode;
  color?: 'accent' | 'success' | 'error' | 'warning';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export function GlowOnHover({
  children,
  color = 'accent',
  intensity = 'medium',
  className,
}: GlowOnHoverProps) {
  const glows = {
    accent: {
      subtle: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
      medium: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]',
      strong: 'hover:shadow-[0_0_60px_rgba(99,102,241,0.4)]',
    },
    success: {
      subtle: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]',
      medium: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]',
      strong: 'hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]',
    },
    error: {
      subtle: 'hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]',
      medium: 'hover:shadow-[0_0_40px_rgba(248,113,113,0.3)]',
      strong: 'hover:shadow-[0_0_60px_rgba(248,113,113,0.4)]',
    },
    warning: {
      subtle: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]',
      medium: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]',
      strong: 'hover:shadow-[0_0_60px_rgba(251,191,36,0.4)]',
    },
  };

  return (
    <div
      className={cn(
        'transition-shadow duration-300 ease-out',
        glows[color][intensity],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Border beam animation
 */
interface BorderBeamProps {
  children: ReactNode;
  size?: number;
  duration?: number;
  className?: string;
}

export function BorderBeam({ children, size = 200, duration = 15, className }: BorderBeamProps) {
  return (
    <div className={cn('relative rounded-2xl overflow-hidden', className)}>
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--color-accent-500) 360deg)`,
          animation: `rotate ${duration}s linear infinite`,
          transform: `scale(${size / 100})`,
        }}
      />
      <div className="absolute inset-[2px] bg-[var(--color-bg-primary)] rounded-2xl z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Typing effect for text
 */
interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingEffect({ text, speed = 50, className, onComplete }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {displayText.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-[var(--color-accent-500)] ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

/**
 * Count up animation for numbers
 */
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  className,
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return (
    <span className={className}>
      {count.toFixed(decimals)}
    </span>
  );
}
