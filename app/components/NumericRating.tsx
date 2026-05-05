"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface NumericRatingProps {
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
}

export function NumericRating({ min, max, value, onChange }: NumericRatingProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {numbers.map((n, idx) => {
          const isSelected = value === n;
          // Derive a subtle hue shift per number for depth
          const delay = idx * 0.03;
          return (
            <motion.button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay }}
              className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-semibold text-lg outline-none relative overflow-hidden",
                "transition-all duration-300",
                isSelected
                  ? "text-white scale-110"
                  : "bg-[var(--color-brand-surface)] text-[var(--color-brand-muted)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-accent)]/50 hover:text-white"
              )}
              style={
                isSelected
                  ? {
                      background: "linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-accent-hover))",
                      boxShadow: "0 4px 24px var(--color-brand-accent-glow), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }
                  : undefined
              }
            >
              {n}
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between w-full mt-6 px-2 text-xs md:text-sm font-medium text-[var(--color-brand-muted)]">
        <span>Insatisfecho</span>
        <span>Excelente</span>
      </div>
    </div>
  );
}
