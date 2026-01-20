'use client';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 sm:gap-4 animate-fade-in">
      {/* Avatar - Premium */}
      <div className="flex-shrink-0 w-9 h-9 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-accent-500)] animate-pulse-subtle"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Typing bubbles - Premium with enhanced glow */}
      <div className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] shadow-md">
        <span className="w-2.5 h-2.5 bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] rounded-full animate-bounce-dot typing-dot-1 shadow-md shadow-[var(--color-accent-glow)]" />
        <span className="w-2.5 h-2.5 bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] rounded-full animate-bounce-dot typing-dot-2 shadow-md shadow-[var(--color-accent-glow)]" />
        <span className="w-2.5 h-2.5 bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-600)] rounded-full animate-bounce-dot typing-dot-3 shadow-md shadow-[var(--color-accent-glow)]" />
      </div>
    </div>
  );
}
