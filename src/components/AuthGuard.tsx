'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Icons } from './Icons';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    let mounted = mountedRef;
    const supabase = createClient();

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // Check if component is still mounted before updating state
        if (!mounted.current) return;

        if (!session) {
          router.push('/auth/login');
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch {
        if (!mounted.current) return;
        router.push('/auth/login');
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Single auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Check if component is still mounted before updating state
      if (!mounted.current) return;

      if (session) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        router.push('/auth/login');
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] flex items-center justify-center animate-pulse shadow-[var(--color-accent-glow)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-[var(--color-text-muted)]">Lade...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
