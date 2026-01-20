'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rounded',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[var(--color-bg-tertiary)]',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

// Chat skeleton for sidebar
export function ChatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <Skeleton variant="circular" width={36} height={36} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Message skeleton for chat area
export function MessageSkeleton() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <Skeleton variant="circular" width={36} height={36} />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={14} />
        </div>
        <Skeleton variant="rounded" width="100%" height={60} />
        <Skeleton variant="rounded" width="80%" height={16} />
        <Skeleton variant="rounded" width="90%" height={16} />
      </div>
    </div>
  );
}

// Input skeleton
export function InputSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton width={100} height={36} />
        <Skeleton width={100} height={36} />
        <Skeleton width={40} height={36} />
        <div className="flex-1" />
        <Skeleton width={60} height={24} />
      </div>
      <Skeleton variant="rounded" width="100%" height={56} />
    </div>
  );
}
