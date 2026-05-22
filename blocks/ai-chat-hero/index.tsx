/**
 * Block: AI Chat Hero
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatInput } from "./components/ChatInput";
import { SuggestionChips } from "./components/SuggestionChips";
import { useChatInput } from "./hooks/useChatInput";

import { Sparkles, SquarePen, Menu, ChevronDown, X, Settings, Search, Compass, Check } from "lucide-react";

export interface AIChatHeroProps {
  headline?: string;
  headlineAccent?: string;
  placeholder?: string;
  modelName?: string;
  chips?: { label: string; prompt: string }[];
  avatarInitials?: string;
  onSubmit?: (value: string) => void;
  onChipClick?: (prompt: string) => void;
  onModelClick?: () => void;
  onMicClick?: () => void;
  className?: string;
  fullscreen?: boolean;
}

const DEFAULT_CHIPS = [
  { label: "Explain quantum computing", prompt: "Explain quantum computing in simple terms" },
  { label: "Write a thank you note", prompt: "Write a professional thank you email to a recruiter" },
  { label: "Create a study plan", prompt: "Create a 4-week study schedule for learning React" },
  { label: "Code a simple game", prompt: "Write a simple HTML/CSS/JS game in a single file" }
];

const GLOW_CONFIG = {
  fadeInDuration: 0.75,
  mobile: {
    ambientLight: "var(--mobile-ambient, oklch(60% 0.2 45 / 25%))",
    radialCenter: "var(--mobile-radial-center, oklch(65% 0.22 45 / 45%))",
    radialEdge: "var(--mobile-radial-edge, oklch(55% 0.18 40 / 15%))",
    width: "600px",
    height: "400px",
    blur: "60px",
  },
  desktop: {
    radialCenter: "var(--desktop-radial-center, oklch(68% 0.18 48 / 35%))",
    radialMiddle: "var(--desktop-radial-middle, oklch(58% 0.14 48 / 20%))",
    radialEdge: "var(--desktop-radial-edge, oklch(35% 0.08 250 / 8%))",
    width: "1700px",
    height: "500px",
    blur: "85px",
  }
};

export default function AIChatHero({
  headline = "I'm Gwen, lets build our dreams together!",
  headlineAccent = "Gwen",
  placeholder = "Ask Gwen...",
  modelName = "Gwen 1.0 Supreme",
  chips,
  avatarInitials = "JS",
  onSubmit,
  onChipClick,
  onModelClick,
  onMicClick,
  className = "",
  fullscreen = false,
}: AIChatHeroProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeModel, setActiveModel] = useState(modelName);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileModelDropdown, setShowMobileModelDropdown] = useState(false);

  // File preview & send state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; duration?: string; type: string } | null>(null);

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleUploadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video");
    setUploadedFile({
      name: file.name,
      url: isVideo ? "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300" : url,
      duration: isVideo ? "0:12" : undefined,
      type: file.type
    });
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed || uploadedFile) {
      onSubmit?.(trimmed);
      setValue("");
      setUploadedFile(null);
    }
  };

  // Bind useChatInput hook
  const {
    value,
    setValue,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    isFocused,
  } = useChatInput(onSubmit);

  const handleChipClick = (prompt: string) => {
    setValue(prompt);
    onChipClick?.(prompt);
    onSubmit?.(prompt);
    setValue("");
  };

  const renderHeadline = () => {
    if (!headlineAccent || !headline.includes(headlineAccent)) {
      return headline;
    }
    const parts = headline.split(headlineAccent);
    return (
      <>
        {parts[0]}
        <span
          style={{
            background: "linear-gradient(90deg, var(--primary), var(--primary-hover))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {headlineAccent}
        </span>
        {parts[1]}
      </>
    );
  };

  // Easing specification
  const easeTransition = [0.16, 1, 0.3, 1] as const;

  const inlineStyles = {
    "--upgrade-blue": "#0b5cff",
    "--upgrade-text": "#73a3ff",
    "--upgrade-icon": "#8cb4ff",
    "--mobile-ambient": "oklch(60% 0.2 45 / 25%)",
    "--mobile-radial-center": "oklch(65% 0.22 45 / 45%)",
    "--mobile-radial-edge": "oklch(55% 0.18 40 / 15%)",
    "--desktop-radial-center": "oklch(68% 0.18 48 / 35%)",
    "--desktop-radial-middle": "oklch(58% 0.14 48 / 20%)",
    "--desktop-radial-edge": "oklch(35% 0.08 250 / 8%)",
  } as React.CSSProperties;

  return (
    <div 
      className={`flex flex-row bg-[--bg] overflow-hidden w-screen h-screen ${className}`}
      style={inlineStyles}
    >
      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[310px] bg-[--surface] z-50 p-6 flex flex-col gap-6 md:hidden font-sans"
            >
              {/* Close row */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--primary] to-[--primary-hover] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[--bg] fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C12 2 14.5 8.5 22 12C14.5 15.5 12 22 12 22C12 22 9.5 15.5 2 12C9.5 8.5 12 2 12 2Z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-white tracking-wide">Gwen AI</span>
                </div>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {[
                  { icon: SquarePen, label: "New Chat" },
                  { icon: Search, label: "Search" },
                  { icon: Compass, label: "Explore" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setShowMobileSidebar(false)}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-white/80 hover:bg-white/5 flex items-center gap-4 transition-colors cursor-pointer"
                    >
                      <Icon size={20} className="text-white/45" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1" />

              {/* Settings button */}
              <button
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-white/80 hover:bg-white/5 flex items-center gap-4 transition-colors cursor-pointer"
              >
                <Settings size={20} className="text-white/45" />
                <span>Settings</span>
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-4 px-4 py-3 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[--primary] to-[--primary-hover] flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-[--bg]">{avatarInitials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white/95">Active Account</span>
                  <span className="text-xs text-white/45">gwen@jinxsuper.com</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop only) */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <ChatSidebar avatarInitials={avatarInitials} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[--bg]">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden w-full h-16 flex items-center justify-between px-4 select-none bg-[--surface]/20 backdrop-blur-sm z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>
            
            {/* Interactive mobile model select button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMobileModelDropdown(!showMobileModelDropdown)}
                className="flex items-center gap-2 text-sm font-bold bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 text-white/90 select-none cursor-pointer transition-colors duration-150"
              >
                <span>Gwen {activeModel}</span>
                <ChevronDown size={16} className="text-white/45" />
              </button>

              <AnimatePresence>
                {showMobileModelDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setShowMobileModelDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="absolute top-full left-0 mt-3 z-40 w-[240px] bg-[--surface] rounded-[24px] p-2.5 shadow-2xl flex flex-col font-sans"
                    >
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: "Gwen 1.0 Tiny", desc: "Fastest answers" },
                          { id: "Gwen 1.0 Mini", desc: "All-around help" },
                          { id: "Gwen 1.0 Pro", desc: "Advanced maths and code" },
                          { id: "Gwen 1.0 Supreme", desc: "Expert reasoning & creativity" }
                        ].map((model) => {
                          const isSelected = model.id === activeModel;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                setActiveModel(model.id);
                                setShowMobileModelDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-start gap-4 ${
                                isSelected
                                  ? "bg-[--primary]/10 text-white"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {isSelected && <Check size={16} className="text-[--primary]" />}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-[14px] text-white/90">{model.id}</span>
                                <span className="text-[12px] text-white/40 font-normal">{model.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
            <SquarePen size={22} />
          </button>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 flex flex-col items-center relative px-6 md:px-6 py-6 md:py-10 overflow-hidden">
          
          {/* Top-Right Header Actions (Desktop only) */}
          <div className="hidden md:flex absolute top-4 right-5 z-20 items-center gap-2 select-none">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1.5 bg-[--upgrade-blue]/10 hover:bg-[--upgrade-blue]/20 border border-[--upgrade-blue]/25 text-[--upgrade-text] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-blue-950/10 transition-all duration-150 cursor-pointer"
            >
              <Sparkles size={13} className="text-[--upgrade-icon]" />
              <span>Upgrade</span>
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:bg-white/5 hover:text-white/80 transition-all duration-150 cursor-pointer">
              <SquarePen size={17} />
            </button>
          </div>

          {/* Bottom ambient glow (Bright Orange) - MOBILE ONLY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: GLOW_CONFIG.fadeInDuration, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-[70vh] pointer-events-none z-0 md:hidden"
            style={{
              background: `linear-gradient(to top, var(--mobile-ambient) 0%, transparent 100%)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: GLOW_CONFIG.fadeInDuration, ease: "easeOut", delay: 0.1 }}
            className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 pointer-events-none z-0 md:hidden"
            style={{
              width: GLOW_CONFIG.mobile.width,
              height: GLOW_CONFIG.mobile.height,
              filter: `blur(${GLOW_CONFIG.mobile.blur})`,
              background: `radial-gradient(ellipse at bottom, var(--mobile-radial-center) 0%, var(--mobile-radial-edge) 40%, transparent 80%)`,
            }}
          />

          {/* Content Wrapper */}
          <div className="relative z-10 w-full h-full max-w-[720px] flex flex-col items-center md:justify-center md:-translate-y-6">
          
          {/* Top spacer to vertically center headline on mobile */}
          <div className="flex-1 md:hidden" />
          
          {/* Header Group */}
          <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:mb-12">
          
          {/* Custom Logo (Mobile Only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeTransition }}
            className="relative -mb-4 flex items-center justify-center md:hidden"
          >
            <div className="w-10 h-10 rounded-full blur-[14px] absolute bg-[--primary] opacity-25 mix-blend-screen" />
            <div className="w-12 h-12 relative flex items-center justify-center drop-shadow-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[--primary] fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 14.5 8.5 22 12C14.5 15.5 12 22 12 22C12 22 9.5 15.5 2 12C9.5 8.5 12 2 12 2Z" />
              </svg>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: easeTransition,
              delay: 0,
            }}
            className="text-[32px] font-normal text-white/85 text-center tracking-tight leading-snug select-none"
          >
            {renderHeadline()}
          </motion.h1>
          </div>

          {/* Bottom spacer to push input down on mobile */}
          <div className="flex-[1.5] md:hidden" />

          {/* Input Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: easeTransition,
              delay: 0.08,
            }}
            className="w-full flex flex-col items-center gap-8 relative z-10"
          >
            {/* Center ambient glow (Deep Blue/Gwen Orange transition) centered behind the input - DESKTOP ONLY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: GLOW_CONFIG.fadeInDuration, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
              style={{
                width: GLOW_CONFIG.desktop.width,
                height: GLOW_CONFIG.desktop.height,
                filter: `blur(${GLOW_CONFIG.desktop.blur})`,
                background: `radial-gradient(circle, var(--desktop-radial-center) 0%, var(--desktop-radial-middle) 40%, var(--desktop-radial-edge) 70%, transparent 100%)`,
              }}
            />

            {/* Suggestion Chips - only visible when input is empty and no file is uploaded */}
            {!value.trim() && !uploadedFile && (
              <SuggestionChips chips={chips || DEFAULT_CHIPS} onChipClick={handleChipClick} />
            )}

            <ChatInput
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              modelName={activeModel}
              onModelSelect={(model) => setActiveModel(model)}
              onModelClick={onModelClick}
              onMicClick={onMicClick}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
              onUploadFile={handleUploadFile}
              onSubmitClick={handleSubmit}
            />
            {/* Bottom Disclaimer */}
            <div className="text-[11px] text-white/30 text-center select-none font-sans mt-4">
              Gwen is AI and can make mistakes.
            </div>
          </motion.div>
        </div>

      </div> {/* Closes Inner Content Area */}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md bg-[--surface] rounded-2xl p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[--primary] to-[--primary-hover] flex items-center justify-center shadow-lg shadow-[--primary]/15">
                  <Sparkles size={20} className="text-[--bg]" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-2 select-none">
                  Upgrade to Gwen Advanced
                </h2>
                <p className="text-xs text-[--text-muted] select-none">
                  Get access to premium models and high-performance developer tools built with Gwen Noir.
                </p>
              </div>
              
              {/* Features List */}
              <div className="flex flex-col gap-3 font-sans">
                {[
                  "Access to our flagship model Sonnet 4 Ultra",
                  "10x higher context windows & rate limits",
                  "Sub-second priority response speeds",
                  "Exclusive premium Gwen Noir design systems"
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-white/80 select-none">
                    <span className="text-[--primary] font-bold">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Pricing details */}
              <div className="flex items-baseline gap-1 select-none font-sans">
                <span className="text-2xl font-bold text-white">$20</span>
                <span className="text-xs text-[--text-muted]">/ month</span>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2 font-sans">
                <button
                  onClick={() => {
                    alert("Upgrade feature successfully integrated!");
                    setShowUpgradeModal(false);
                  }}
                  style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-hover))" }}
                  className="w-full text-[--bg] text-sm font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-[--primary]/25 hover:brightness-105 transition-all cursor-pointer outline-none"
                >
                  Start 14-Day Free Trial
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full hover:bg-white/5 text-white/80 text-sm font-medium py-2 rounded-lg transition-all cursor-pointer outline-none"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

