'use client';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 sm:gap-4 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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

      {/* Typing bubbles - Enhanced with glow */}
      <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] shadow-md shadow-[var(--color-accent-glow)]/50">
        <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full animate-bounce-dot typing-dot-1 shadow-sm shadow-[var(--color-accent-glow)]" />
        <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full animate-bounce-dot typing-dot-2 shadow-sm shadow-[var(--color-accent-glow)]" />
        <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full animate-bounce-dot typing-dot-3 shadow-sm shadow-[var(--color-accent-glow)]" />
      </div>
    </div>
  );
}
