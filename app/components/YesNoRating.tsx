"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface YesNoRatingProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function YesNoRating({ value, onChange }: YesNoRatingProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -2 }}
        onClick={() => onChange(1)}
        className={cn(
          "flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all duration-500 outline-none backdrop-blur-sm relative overflow-hidden",
          value === 1
            ? "text-white border border-[var(--color-brand-accent)]"
            : "bg-[var(--color-brand-surface)]/60 text-[var(--color-brand-muted)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-accent)]/50 hover:text-white"
        )}
        style={
          value === 1
            ? {
                background: "linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-accent-hover))",
                boxShadow: "0 0 30px var(--color-brand-accent-glow), inset 0 1px 0 rgba(255,255,255,0.1)",
              }
            : undefined
        }
      >
        {/* Shimmer on selected */}
        {value === 1 && (
          <span
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
        <Check className="w-5 h-5 relative z-10" strokeWidth={2.5} />
        <span className="relative z-10">SÍ, POR SUPUESTO</span>
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -2 }}
        onClick={() => onChange(0)}
        className={cn(
          "flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all duration-500 outline-none backdrop-blur-sm",
          value === 0
            ? "bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20"
            : "bg-[var(--color-brand-surface)]/60 text-[var(--color-brand-muted)] border border-[var(--color-brand-border)] hover:border-white/20 hover:text-white"
        )}
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
        NO EN ESTA OCASIÓN
      </motion.button>
    </div>
  );
}
