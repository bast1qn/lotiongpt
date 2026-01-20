'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FirstMessageCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function FirstMessageCelebration({ isVisible, onComplete }: FirstMessageCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate celebration particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 500,
      }));
      setParticles(newParticles);

      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Sparkle particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-celebrate-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
          }}
        >
          <div className={cn(
            'w-2 h-2 rounded-full',
            'bg-gradient-to-br from-[var(--color-accent-400)] to-[var(--color-accent-600)]',
            'shadow-lg shadow-[var(--color-accent-glow)]'
          )} />
        </div>
      ))}

      {/* Central glow burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-celebrate-burst">
          <div className={cn(
            'w-32 h-32 rounded-full',
            'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)]',
            'opacity-20 blur-3xl'
          )} />
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-20">
        <div className="animate-celebrate-text">
          <span className={cn(
            'text-2xl font-bold',
            'bg-gradient-to-r from-[var(--color-accent-400)] to-[var(--color-accent-600)]',
            'bg-clip-text text-transparent',
            'drop-shadow-lg'
          )}>
            Los geht's!
          </span>
        </div>
      </div>
    </div>
  );
}

// Add the keyframes needed for celebration
// These should be added to animations.css:
/*
@keyframes celebrateParticle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx, -100px), var(--ty, -200px)) scale(0);
    opacity: 0;
  }
}

@keyframes celebrateBurst {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes celebrateText {
  0% {
    transform: scale(0.5) translateY(20px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 0;
  }
}

.animate-celebrate-particle {
  animation: celebrateParticle 1.5s ease-out forwards;
}

.animate-celebrate-burst {
  animation: celebrateBurst 1s ease-out forwards;
}

.animate-celebrate-text {
  animation: celebrateText 1.5s ease-out forwards;
}
*/
