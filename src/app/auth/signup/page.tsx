'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      // Signup
      const { data: { user }, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) throw signupError;

      if (user) {
        // Profil erstellen
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email!,
          full_name: fullName || null,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Fehler bei der Registrierung');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
        <div className="relative w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-success-bg)] flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-success)]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Erfolgreich registriert!
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Bitte bestätige deine Email-Adresse, um dich einzuloggen.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium shadow-md shadow-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary-glow-strong)] hover:scale-[1.02] transition-all"
          >
            Zum Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-glow)] animate-pulse-glow">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center mb-2">
            Konto erstellen
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            Registriere dich, um deine Chats zu speichern
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dein Name"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 6 Zeichen"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error)] text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 rounded-xl font-medium transition-all',
                loading
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary-glow-strong)] hover:scale-[1.02]'
              )}
            >
              {loading ? 'Registrieren...' : 'Konto erstellen'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Bereits ein Konto?{' '}
            <a href="/auth/login" className="text-[var(--color-primary-500)] hover:underline">
              Einloggen
            </a>
          </p>
        </div>

        {/* Back Link */}
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          <a href="/" className="hover:text-[var(--color-text-secondary)] transition-colors">
            ← Zurück zur Startseite
          </a>
        </p>
      </div>
    </div>
  );
}
