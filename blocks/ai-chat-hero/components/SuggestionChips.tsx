/**
 * Block: AI Chat Hero
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React from "react";
import { motion } from "framer-motion";

export interface SuggestionChip {
  label: string;
  prompt: string;
}

interface SuggestionChipsProps {
  chips?: SuggestionChip[];
  onChipClick?: (prompt: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  chips = [],
  onChipClick,
}) => {
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center w-full">
      {chips.map((chip, idx) => (
        <motion.button
          key={idx}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChipClick?.(chip.prompt)}
          className="px-4 py-2 rounded-full text-xs font-medium text-white/65 bg-white/5 hover:bg-white/10 hover:text-white/90 border border-white/8 hover:border-white/15 transition-all duration-150 cursor-pointer select-none backdrop-blur-sm"
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
};
