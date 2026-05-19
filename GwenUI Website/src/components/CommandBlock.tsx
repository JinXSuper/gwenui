"use client";

import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";

const COMMANDS = {
  npx: "npx @gwenui/cli init",
  npm: "npm install @gwenui/core",
  pnpm: "pnpm add @gwenui/core",
  yarn: "yarn add @gwenui/core",
  bash: "curl -sS https://gwenui.com/install.sh | bash",
};

export const CommandBlock = () => {
  const [activeTab, setActiveTab] = useState("npx");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMMANDS[activeTab as keyof typeof COMMANDS]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-20">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        {/* Tab List ala Linear/Vercel */}
        <Tabs.List className="flex gap-1 border-b border-white/5 px-2 mb-px overflow-x-auto no-scrollbar">
          {Object.keys(COMMANDS).map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="relative px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white data-[state=active]:text-primary"
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeCommandTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Code Content Area */}
        <div className="group relative overflow-hidden rounded-b-2xl border border-white/5 bg-background/40 backdrop-blur-md p-6 shadow-2xl">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 font-mono text-sm sm:text-base overflow-hidden">
              <Terminal size={18} className="text-white/20 shrink-0" />
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-primary font-bold select-none">$</span>
                <Tabs.Content value={activeTab} className="overflow-hidden">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, filter: "blur(12px)", x: -8 }}
                    animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      ease: [0.16, 1, 0.3, 1],
                      opacity: { duration: 0.3 }
                    }}
                    className="flex items-center"
                  >
                    <code className="text-white/80 tracking-tight whitespace-nowrap font-mono">
                      {COMMANDS[activeTab as keyof typeof COMMANDS]}
                    </code>
                  </motion.div>
                </Tabs.Content>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white active:scale-95 group/btn"
            >
              {copied ? (
                <Check size={18} className="text-success" />
              ) : (
                <Copy size={18} className="transition-transform group-hover/btn:scale-110" />
              )}
            </button>
          </div>
        </div>
      </Tabs.Root>
      
      {/* Detail Text */}
      <p className="mt-6 text-center text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
        Free and open source. MIT License (Soon).
      </p>
    </div>
  );
};
