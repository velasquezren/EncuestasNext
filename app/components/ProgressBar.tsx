"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3">
      <div className="flex justify-between items-center text-sm font-medium tracking-wide">
        <span className="text-[var(--color-brand-muted)]">Paso {current} de {total}</span>
        <span
          className="text-[var(--color-brand-accent)] font-bold tabular-nums"
          style={{ textShadow: "0 0 12px var(--color-brand-accent-glow)" }}
        >
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--color-brand-surface)] rounded-full overflow-hidden border border-[var(--color-brand-border)]/30">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, var(--color-brand-surface), var(--color-brand-accent), var(--color-brand-accent-hover))",
            boxShadow: "0 0 14px var(--color-brand-accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Animated shimmer on the progress fill */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
