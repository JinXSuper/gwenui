/**
 * Block: AI Chat Hero
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePen, Search, Compass, Settings, LucideIcon } from "lucide-react";

interface ChatSidebarProps {
  avatarInitials?: string;
}

const TooltipButton = ({ icon: Icon, label, className = "" }: { icon: LucideIcon, label: string, className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/35 hover:bg-[--primary]/10 hover:text-[--primary] transition-colors duration-150 cursor-pointer flex-shrink-0 ${className}`}
      >
        <Icon size={20} />
      </motion.button>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -20, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, x: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute left-full ml-3 px-2.5 py-1.5 chat-popover text-xs font-medium text-white/90 rounded-md whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/5"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ avatarInitials = "A" }) => {
  return (
    <div
      className="w-[52px] h-full flex flex-col items-center py-4 gap-2 select-none flex-shrink-0 relative z-20"
      style={{ background: "var(--chat-sidebar-bg)", borderRight: "1px solid oklch(100% 0 0 / 6%)" }}
    >
      {/* GwenUI Logo */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 flex-shrink-0 overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, #4285F4 0%, #9B59D2 50%, #00BFA5 100%)" }}>
        <span className="text-white font-bold text-[13px] leading-none" style={{ fontFamily: "system-ui, sans-serif" }}>G</span>
      </div>

      {/* Main Buttons */}
      {[
        { icon: SquarePen, label: "New Chat" },
        { icon: Search, label: "Search" },
        { icon: Compass, label: "Explore" },
      ].map((item, idx) => (
        <TooltipButton key={idx} icon={item.icon} label={item.label} />
      ))}

      <div className="flex-1" />

      {/* Settings Button */}
      <TooltipButton icon={Settings} label="Settings" className="text-white/35 hover:bg-white/5 hover:text-white" />

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-[11px] font-semibold flex-shrink-0 mt-2 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
        {avatarInitials}
      </div>
    </div>
  );
};
