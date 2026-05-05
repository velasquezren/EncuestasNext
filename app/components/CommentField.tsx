"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CommentField({
  value,
  onChange,
  placeholder = "Cuéntanos más al respecto...",
}: CommentFieldProps) {
  const [isOpen, setIsOpen] = useState(!!value);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      {!isOpen ? (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300"
          style={{
            color: "var(--color-brand-accent)",
            background: "var(--color-brand-accent-subtle)",
            border: "1px solid var(--color-brand-border)",
          }}
        >
          <MessageSquare className="w-4 h-4" />
          Añadir comentario opcional
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-[var(--color-brand-bg)] border rounded-2xl p-5 text-sm md:text-base text-white placeholder-[var(--color-brand-muted)] focus:outline-none transition-all resize-y"
                style={{
                  borderColor: isFocused ? "var(--color-brand-accent)" : "var(--color-brand-border)",
                  boxShadow: isFocused
                    ? "0 0 0 3px var(--color-brand-accent-glow), inset 0 2px 4px rgba(0,0,0,0.2)"
                    : "inset 0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="absolute top-4 right-4 text-xs font-medium text-[var(--color-brand-muted)] hover:text-white transition-colors"
                >
                  Quitar
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
