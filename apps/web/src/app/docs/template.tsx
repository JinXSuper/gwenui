"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DocsTemplate — Morphing page transition for all /docs routes.
 * 
 * Next.js App Router re-mounts `template.tsx` on every navigation,
 * making it ideal for per-page transition animations.
 * 
 * SSR: The initial render outputs the full children immediately
 * (opacity starts at 0 but content is in the DOM for crawlers).
 * Hydration then kicks in the framer-motion entrance animation.
 */

const morphVariants = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.995,
    filter: "blur(3px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 1.003,
    filter: "blur(2px)",
  },
};

const morphTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const, // Custom cubic-bezier for smooth morph feel
};

export default function DocsTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={morphVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={morphTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
