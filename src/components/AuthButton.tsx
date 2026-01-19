'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Icons } from './Icons';
import type { Profile } from '@/lib/db/profiles';
import { getProfile } from '@/lib/db/profiles';

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
      <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-elevated)] animate-pulse" />
    );
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all"
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
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-bg-elevated)] transition-all group"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-[var(--color-primary-glow)] group-hover:shadow-lg group-hover:shadow-[var(--color-primary-glow-strong)] transition-all">
          {initials}
        </div>
        {/* User Info - hidden on mobile */}
        <div className="hidden sm:block text-left">
          <div className="text-sm text-[var(--color-text-primary)] font-medium">
            {profile?.full_name || 'Benutzer'}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {user.email}
          </div>
        </div>
        {/* Chevron */}
        <Icons.ChevronDown />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl shadow-xl z-50 animate-fade-in-up">
            <div className="p-2">
              <a
                href="/account"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all"
                onClick={() => setShowMenu(false)}
              >
                <Icons.Settings />
                Konto
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Ausloggen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
