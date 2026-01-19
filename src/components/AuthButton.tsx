'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Icons } from './Icons';
import type { Profile } from '@/lib/db/profiles';
import { getProfile } from '@/lib/db/profiles';
import { cn } from '@/lib/utils';

export function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const userProfile = await getProfile();
          setProfile(userProfile);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = createClient().auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    setShowMenu(false);
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] animate-shimmer-smooth" />
    );
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] hover:shadow-md transition-all duration-300 border border-transparent hover:border-[var(--color-border-subtle)]"
      >
        <Icons.User />
        <span className="hidden sm:inline">Einloggen</span>
      </a>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          'flex items-center gap-3 p-2 pr-3 rounded-xl transition-all duration-300',
          showMenu
            ? 'bg-[var(--color-bg-elevated)] shadow-md'
            : 'hover:bg-[var(--color-bg-elevated)] hover:shadow-md'
        )}
      >
        {/* Enhanced Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[var(--color-primary-glow-strong)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-primary-glow-intense)] hover:scale-105">
          {initials}
        </div>
        {/* User Info - hidden on mobile */}
        <div className="hidden sm:block text-left">
          <div className="text-sm text-[var(--color-text-primary)] font-semibold">
            {profile?.full_name || 'Benutzer'}
          </div>
          <div className="text-xs text-[var(--color-text-muted)] max-w-[140px] truncate">
            {user.email}
          </div>
        </div>
        {/* Enhanced Chevron */}
        <span className={cn(
          'text-[var(--color-text-muted)] transition-transform duration-300 flex items-center justify-center',
          showMenu && 'rotate-180'
        )}>
          <Icons.ChevronDown />
        </span>
      </button>

      {/* Enhanced Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40 animate-fade-in"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-3 w-56 bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-black/50 z-50 animate-slide-in-bottom overflow-hidden">
            {/* User info header */}
            <div className="p-4 border-b border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-highlight)] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)]/20 to-[var(--color-primary-600)]/20 flex items-center justify-center text-[var(--color-primary-500)] font-bold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {profile?.full_name || 'Benutzer'}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              <a
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-300 group"
                onClick={() => setShowMenu(false)}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors duration-300',
                  'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-500)] group-hover:bg-[var(--color-primary-500)]/10'
                )}>
                  <Icons.Settings />
                </div>
                Konto
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all duration-300 group"
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors duration-300',
                  'text-[var(--color-error)] group-hover:bg-[var(--color-error)]/20'
                )}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                Ausloggen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
