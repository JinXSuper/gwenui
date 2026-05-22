"use client";

import React from "react";
import { 
  SiNextdotjs, 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiRadixui, 
  SiShadcnui, 
  SiFramer, 
  SiVercel 
} from "@icons-pack/react-simple-icons";
import LogoLoop from "./LogoLoop";

/**
 * Custom SVG for Reactbits (rb monogram in a circle)
 */
const ReactbitsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M8 15V9h2a2 2 0 1 1 0 4H8" />
    <path d="M13 15V9h2a1.5 1.5 0 1 1 0 3H13a1.5 1.5 0 1 1 0 3h2" />
  </svg>
);

/**
 * Custom SVG for Aceternity (stylized A)
 */
const AceternityIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L3 21h18L12 3z" />
    <path d="M12 3v18" strokeOpacity="0.1" />
    <path d="M9 15h6" />
  </svg>
);

const techStack = [
  { title: "Next.js", node: <SiNextdotjs size={24} /> },
  { title: "React", node: <SiReact size={24} /> },
  { title: "TypeScript", node: <SiTypescript size={24} /> },
  { title: "Tailwind CSS", node: <SiTailwindcss size={24} /> },
  { title: "Radix UI", node: <SiRadixui size={24} /> },
  { title: "shadcn/ui", node: <SiShadcnui size={24} /> },
  { title: "Framer Motion", node: <SiFramer size={24} /> },
  { title: "Vercel", node: <SiVercel size={24} /> },
  { title: "Reactbits", node: <ReactbitsIcon size={24} /> },
  { title: "Aceternity", node: <AceternityIcon size={24} /> },
];

export function LogoCloudLoop() {
  return (
    <section className="relative z-10 w-full py-16 overflow-hidden">
      {/* top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      {/* bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <p className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold text-center mb-10">
        Powered by the Elite Stack
      </p>

      <LogoLoop
        logos={techStack}
        speed={100}
        direction="left"
        logoHeight={48} // Height of the pill container basically
        gap={64}
        fadeOut={true}
        fadeOutColor="var(--background)" // Matches Gwen Noir background
        pauseOnHover={true}
        renderItem={(item) => {
          const isNodeItem = 'node' in item;
          return (
            <div className="group/item flex items-center gap-3 transition-all duration-200 cursor-default">
              <div className="text-white/40 transition-colors duration-200 group-hover/item:text-orange-400">
                {isNodeItem ? item.node : <img src={item.src} alt={item.alt} className="h-6 w-auto" />}
              </div>
              <span className="text-sm font-medium text-white/30 font-sans transition-colors duration-200 group-hover/item:text-orange-400 whitespace-nowrap uppercase tracking-widest">
                {item.title}
              </span>
            </div>
          );
        }}
      />
    </section>
  );
}