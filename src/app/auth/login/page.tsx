'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4 relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[var(--color-accent-500)] opacity-[0.08] blur-[100px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[var(--color-accent-600)] opacity-[0.06] blur-[100px] rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }} />

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Enhanced Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] flex items-center justify-center shadow-2xl shadow-[var(--color-accent-glow-strong)] animate-glow hover:scale-100 transition-transform duration-120">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Enhanced Card with glassmorphism */}
        <div className="bg-[var(--color-bg-glass-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl shadow-black/50">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-2">
            Willkommen zurück
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
            Melde dich an, um deine Chats zu sehen
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
                Passwort
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-500)] focus:shadow-lg focus:shadow-[var(--color-accent-glow)] transition-all duration-120"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Error */}
            {error && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-error-bg)] to-[var(--color-error-bg)]/50 border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm animate-shake">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3.5 rounded-xl font-semibold transition-all duration-120 relative overflow-hidden',
                loading
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] hover:to-[var(--color-accent-700)] text-white shadow-lg shadow-[var(--color-accent-glow-strong)] hover:shadow-xl hover:shadow-[var(--color-accent-glow-strong)] hover:scale-100'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Einloggen...
                </span>
              ) : 'Einloggen'}
            </button>
          </form>

          {/* Enhanced Signup Link */}
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
            Noch kein Account?{' '}
            <a href="/auth/signup" className="text-[var(--color-accent-500)] hover:text-[var(--color-accent-400)] font-semibold hover:underline underline-offset-4 transition-all">
              Registrieren
            </a>
          </p>
        </div>

        {/* Enhanced Back Link */}
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          <a href="/" className="hover:text-[var(--color-text-secondary)] transition-colors inline-flex items-center gap-1 hover:gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Zurück zur Startseite
          </a>
        </p>
      </div>
    </div>
  );
}
