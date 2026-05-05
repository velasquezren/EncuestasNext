"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  maxValue: number;
  value: number | null;
  onChange: (value: number) => void;
}

export function StarRating({ maxValue, value, onChange }: StarRatingProps) {
  const stars = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {stars.map((s) => {
          const isActive = value && value >= s;
          return (
            <motion.button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              whileTap={{ scale: 0.85, rotate: -10 }}
              whileHover={{ scale: 1.15, y: -4 }}
              className="relative outline-none focus:outline-none transition-transform duration-200 p-1"
              aria-label={`${s} estrellas`}
            >
              <Star
                strokeWidth={1.5}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 transition-all duration-300",
                  isActive
                    ? "text-[var(--color-brand-gold)] fill-[var(--color-brand-gold)] drop-shadow-[0_0_14px_var(--color-brand-gold-glow)]"
                    : "text-[var(--color-brand-border)] fill-transparent hover:text-[var(--color-brand-muted)]"
                )}
              />
              {/* Sparkle ring on active stars */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, var(--color-brand-gold-glow) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
