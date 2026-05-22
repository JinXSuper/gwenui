/**
 * Block: AI Chat Hero
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React, { ChangeEvent, FocusEvent, KeyboardEvent, useState, useRef } from "react";
import {
  Plus, ChevronDown, Mic, Check, ChevronRight, Brain, X,
  Paperclip, Cloud, MoreHorizontal, Image, Video, LayoutGrid, Sparkles, Music, BookOpen, UserCircle, ArrowUp, Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  modelName?: string;
  onModelClick?: () => void;
  onModelSelect?: (model: string) => void;
  onMicClick?: () => void;
  onPlusClick?: () => void;
  uploadedFile?: { name: string; url: string; duration?: string; type: string } | null;
  onRemoveFile?: () => void;
  onUploadFile?: (file: File) => void;
  onSubmitClick?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder = "Ask Gwen...",
  modelName = "Pro",
  onModelClick,
  onModelSelect,
  onMicClick,
  onPlusClick,
  uploadedFile = null,
  onRemoveFile,
  onUploadFile,
  onSubmitClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState<"Fast" | "Deep Think" | "Spicy">("Fast");

  // Plus button menu triggers
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showPlusSubmenu, setShowPlusSubmenu] = useState(false);
  const [personalIntelligence, setPersonalIntelligence] = useState(true);

  // File upload input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
    setShowPlusMenu(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile?.(file);
    }
  };

  // Check if we are in clean pill mode (no uploaded file preview)
  const isPill = !uploadedFile;

  return (
    <div
      className={`w-full flex transition-all duration-300 focus-within:ring-1 focus-within:ring-white/10 shadow-2xl relative z-10 select-none ${
        isPill
          ? "flex-row items-center rounded-full min-h-[64px] pl-3 pr-4 gap-4"
          : "flex-col rounded-[28px] px-5 py-4 gap-3"
      }`}
      style={{ background: "var(--chat-input-bg)", backdropFilter: "blur(var(--chat-input-blur))", WebkitBackdropFilter: "blur(var(--chat-input-blur))", border: "1px solid var(--chat-input-border)" }}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* --- RENDER OPTION 1: SINGLE-LINE DYNAMIC GEMINI PILL --- */}
      {isPill ? (
        <>
          {/* Plus Button Menu */}
          <div className="relative flex-shrink-0 mr-2">
            <button
              onClick={() => {
                setShowPlusMenu(!showPlusMenu);
                setShowPlusSubmenu(false);
                setShowDropdown(false);
                onPlusClick?.();
              }}
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[--text-muted] hover:bg-white/5 hover:text-white transition-all duration-150 cursor-pointer outline-none"
            >
              <Plus size={26} className={`transition-transform duration-200 ${showPlusMenu ? "rotate-45 text-[--primary]" : ""}`} />
            </button>

            {/* Plus popover menu (Ask Gwen) */}
            <AnimatePresence>
              {showPlusMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => {
                      setShowPlusMenu(false);
                      setShowPlusSubmenu(false);
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-0 mb-3.5 z-30 w-64 chat-popover rounded-2xl p-2 shadow-2xl flex flex-col font-sans"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-[--primary]/10 pb-2">
                      <span className="text-[11px] font-semibold text-white/40 tracking-wider uppercase">Ask Gwen</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPlusMenu(false);
                          setShowPlusSubmenu(false);
                        }}
                        className="w-5 h-5 rounded-full hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Upload Section */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={handleFileSelectClick}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                      >
                        <Paperclip size={14} className="text-white/50" />
                        <span>Upload files</span>
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                      >
                        <Cloud size={14} className="text-white/50" />
                        <span>Add from Drive</span>
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <MoreHorizontal size={14} className="text-white/50" />
                          <span>More uploads</span>
                        </div>
                        <ChevronRight size={12} className="text-white/30" />
                      </button>
                    </div>

                    <div className="h-[1px] bg-[--primary]/10 my-1.5 opacity-60" />

                    {/* Tools Section */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Image size={14} className="text-white/50" />
                          <span>Create image</span>
                        </div>
                        <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded-md font-semibold font-sans">New</span>
                      </button>

                      <button
                        type="button"
                        disabled
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/30 transition-all cursor-not-allowed flex items-center gap-2.5"
                      >
                        <Video size={14} className="text-white/20" />
                        <span>Create video</span>
                      </button>

                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                      >
                        <LayoutGrid size={14} className="text-white/50" />
                        <span>Canvas</span>
                      </button>

                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                      >
                        <Sparkles size={14} className="text-[--primary]" />
                        <span>Deep Research</span>
                      </button>

                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Music size={14} className="text-white/50" />
                          <span>Create music</span>
                        </div>
                        <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded-md font-semibold font-sans">New</span>
                      </button>

                      {/* Submenu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPlusSubmenu(!showPlusSubmenu)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                            showPlusSubmenu
                              ? "bg-white/5 text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <MoreHorizontal size={14} className="text-white/50" />
                            <span>More tools</span>
                          </div>
                          <ChevronRight size={14} className="text-white/40" />
                        </button>

                        <AnimatePresence>
                          {showPlusSubmenu && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, x: -10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95, x: -10 }}
                              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute bottom-0 left-full ml-2.5 z-40 w-56 chat-popover rounded-2xl p-1.5 shadow-2xl flex flex-col gap-0.5"
                            >
                              <button
                                type="button"
                                className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                              >
                                <BookOpen size={14} className="text-white/50" />
                                <span>Guided Learning</span>
                              </button>

                              <div
                                className="w-full px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between select-none"
                                onClick={() => setPersonalIntelligence(!personalIntelligence)}
                              >
                                <div className="flex items-center gap-2.5">
                                  <UserCircle size={14} className="text-white/50" />
                                  <span>Personal Intelligence</span>
                                </div>
                                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center ${personalIntelligence ? "bg-[--primary]" : "bg-white/20"}`}>
                                  <motion.div
                                    layout
                                    className="w-3 h-3 rounded-full bg-white shadow-md"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Textarea fits in the middle row */}
          <div className="flex-1 min-w-0 flex items-center">
            <textarea
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitClick?.();
                } else {
                  onKeyDown?.(e);
                }
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-base leading-6 text-[--text] placeholder:text-[--text-muted]/50 caret-[--primary] min-w-0 resize-none h-6 py-0 max-h-[140px] font-sans font-normal overflow-hidden"
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Model Selector Badge */}
            <div className="relative hidden md:block">
              <div
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowSubmenu(false);
                  onModelClick?.();
                }}
                className="flex items-center hover:bg-white/5 gap-1 bg-transparent rounded-full px-3 py-2 text-sm text-[--text-muted] hover:text-white font-normal cursor-pointer transition-colors duration-150 flex-shrink-0 select-none"
              >
                <div className="flex items-center gap-1">
                  {thinkingLevel === "Deep Think" && (
                    <Brain size={13} className="text-[--primary] animate-pulse mr-0.5" />
                  )}
                  <span className="leading-none">{modelName}</span>
                </div>
                <ChevronDown size={14} className="text-[--text-muted]/60" />
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => {
                        setShowDropdown(false);
                        setShowSubmenu(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full right-0 mb-3.5 z-30 w-64 chat-popover rounded-2xl p-2 shadow-2xl flex flex-col font-sans"
                    >
                      <div className="flex flex-col gap-1">
                        {[
                          { id: "Gwen 1.0 Tiny", desc: "Fastest answers" },
                          { id: "Gwen 1.0 Mini", desc: "All-around help" },
                          { id: "Gwen 1.0 Pro", desc: "Advanced maths and code" },
                          { id: "Gwen 1.0 Supreme", desc: "Expert reasoning & creativity" }
                        ].map((model) => {
                          const isSelected = model.id === modelName;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                onModelSelect?.(model.id);
                                setShowDropdown(false);
                                setShowSubmenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                                isSelected
                                  ? "bg-[--primary]/8 text-white"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {isSelected && <Check size={13} className="text-[--primary]" />}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-semibold text-white/90">{model.id}</span>
                                <span className="text-[10px] text-white/40 font-normal">{model.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="h-[1px] bg-[--primary]/10 my-1.5 opacity-60" />

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowSubmenu(!showSubmenu)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                            showSubmenu
                              ? "bg-white/5 text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-white/90">Thinking level</span>
                              <span className="text-[10px] text-[--primary] font-normal">{thinkingLevel === "Fast" ? "Fast" : "Deep Think"}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-white/40" />
                        </button>

                        <AnimatePresence>
                          {showSubmenu && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, x: 10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95, x: 10 }}
                              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute bottom-[0px] right-full mr-2.5 z-40 w-56 chat-popover rounded-2xl p-1.5 shadow-2xl flex flex-col gap-0.5"
                            >
                              {[
                                { id: "Fast", desc: "Best for speed & quick answers" },
                                { id: "Deep Think", desc: "Complex problem solving & math" },
                                { id: "Spicy", desc: "Sensual version of Gwen" },
                              ].map((level) => {
                                const isLevelSelected = level.id === thinkingLevel;
                                return (
                                  <button
                                    key={level.id}
                                    type="button"
                                    onClick={() => {
                                      setThinkingLevel(level.id as "Fast" | "Deep Think" | "Spicy");
                                      setShowSubmenu(false);
                                      setShowDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                                      isLevelSelected
                                        ? "bg-[--primary]/8 text-white"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                    }`}
                                  >
                                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      {isLevelSelected && <Check size={13} className="text-[--primary]" />}
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="font-semibold text-white/90">{level.id}</span>
                                      <span className="text-[10px] text-white/40 font-normal">{level.desc}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Mic / Send morphing */}
            <AnimatePresence mode="wait">
              {!value.trim() ? (
                <motion.button
                  key="mic-button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  onClick={onMicClick}
                  type="button"
                  className="w-9 h-9 rounded-full text-[--text-muted] flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors duration-150 cursor-pointer flex-shrink-0 outline-none"
                >
                  <Mic size={18} />
                </motion.button>
              ) : (
                <motion.button
                  key="send-button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  type="button"
                  onClick={onSubmitClick}
                  className="w-8 h-8 rounded-full bg-[--primary] flex items-center justify-center hover:bg-white/5 transition-colors duration-150 cursor-pointer flex-shrink-0 outline-none"
                >
                  <ArrowUp size={16} className="text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* --- RENDER OPTION 2: SPACIOUS BLOCK CARD WITH FILE PREVIEW --- */
        <>
          {/* File Previews Area */}
          <AnimatePresence>
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex justify-start pt-1 select-none"
              >
                <div className="relative w-20 h-20 rounded-[20px] overflow-hidden group shadow-lg">
                  <img
                    src={uploadedFile.url}
                    alt={uploadedFile.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Play timestamp badge overlay (reproducing ▷ 0:56) */}
                  {uploadedFile.duration && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                      <Play size={7} fill="white" className="text-white" />
                      <span>{uploadedFile.duration}</span>
                    </div>
                  )}
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={onRemoveFile}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  >
                    <X size={10} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Area */}
          <div className="w-full flex items-start">
            <textarea
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitClick?.();
                } else {
                  onKeyDown?.(e);
                }
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-sm text-white/85 placeholder:text-white/30 caret-[--primary] min-w-0 resize-none h-[56px] py-1 font-sans"
            />
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between mt-1">
            {/* Left Side: Plus Button Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPlusMenu(!showPlusMenu);
                  setShowPlusSubmenu(false);
                  setShowDropdown(false);
                  onPlusClick?.();
                }}
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0 outline-none"
              >
                <Plus size={20} className={`transition-transform duration-200 ${showPlusMenu ? "rotate-45 text-[--primary]" : ""}`} />
              </button>

              <AnimatePresence>
                {showPlusMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => {
                        setShowPlusMenu(false);
                        setShowPlusSubmenu(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-0 mb-2.5 z-30 w-64 chat-popover rounded-2xl p-2 shadow-2xl flex flex-col font-sans"
                    >
                      <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-[--primary]/10 pb-2">
                        <span className="text-[11px] font-semibold text-white/40 tracking-wider uppercase">Ask Gwen</span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPlusMenu(false);
                            setShowPlusSubmenu(false);
                          }}
                          className="w-5 h-5 rounded-full hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={handleFileSelectClick}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                        >
                          <Paperclip size={14} className="text-white/50" />
                          <span>Upload files</span>
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                        >
                          <Cloud size={14} className="text-white/50" />
                          <span>Add from Drive</span>
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <MoreHorizontal size={14} className="text-white/50" />
                            <span>More uploads</span>
                          </div>
                          <ChevronRight size={12} className="text-white/30" />
                        </button>
                      </div>

                      <div className="h-[1px] bg-[--primary]/10 my-1.5 opacity-60" />

                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <Image size={14} className="text-white/50" />
                            <span>Create image</span>
                          </div>
                          <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded-md font-semibold font-sans">New</span>
                        </button>

                        <button
                          type="button"
                          disabled
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/30 transition-all cursor-not-allowed flex items-center gap-2.5"
                        >
                          <Video size={14} className="text-white/20" />
                          <span>Create video</span>
                        </button>

                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                        >
                          <LayoutGrid size={14} className="text-white/50" />
                          <span>Canvas</span>
                        </button>

                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                        >
                          <Sparkles size={14} className="text-[--primary]" />
                          <span>Deep Research</span>
                        </button>

                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <Music size={14} className="text-white/50" />
                            <span>Create music</span>
                          </div>
                          <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded-md font-semibold font-sans">New</span>
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowPlusSubmenu(!showPlusSubmenu)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                              showPlusSubmenu
                                ? "bg-white/5 text-white"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <MoreHorizontal size={14} className="text-white/50" />
                              <span>More tools</span>
                            </div>
                            <ChevronRight size={14} className="text-white/40" />
                          </button>

                          <AnimatePresence>
                            {showPlusSubmenu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-full ml-2.5 z-40 w-56 chat-popover rounded-2xl p-1.5 shadow-2xl flex flex-col gap-0.5"
                              >
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-2.5"
                                  >
                                  <BookOpen size={14} className="text-white/50" />
                                  <span>Guided Learning</span>
                                </button>

                                <div
                                  className="w-full px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-between select-none"
                                  onClick={() => setPersonalIntelligence(!personalIntelligence)}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <UserCircle size={14} className="text-white/50" />
                                    <span>Personal Intelligence</span>
                                  </div>
                                  <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 flex items-center ${personalIntelligence ? "bg-[--primary]" : "bg-white/20"}`}>
                                    <motion.div
                                      layout
                                      className="w-3 h-3 rounded-full bg-white shadow-md"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Model Badge, Send button (pre-populated because file exists) */}
            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <div
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowSubmenu(false);
                    onModelClick?.();
                  }}
                  className="flex items-center hover:bg-white/5 gap-1 bg-white/5 rounded-full px-3 py-1.5 text-xs text-white/75 font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-150 flex-shrink-0 select-none"
                >
                  <div className="flex items-center gap-1">
                    {thinkingLevel === "Deep Think" && (
                      <Brain size={12} className="text-[--primary] animate-pulse" />
                    )}
                    <span>{modelName}</span>
                  </div>
                  <ChevronDown size={12} className="text-white/45" />
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-20 cursor-default"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowSubmenu(false);
                        }}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-full right-0 mb-2.5 z-30 w-64 chat-popover rounded-2xl p-2 shadow-2xl flex flex-col font-sans"
                      >
                        <div className="flex flex-col gap-1">
                          {[
                            { id: "Gwen 1.0 Tiny", desc: "Fastest answers" },
                            { id: "Gwen 1.0 Mini", desc: "All-around help" },
                            { id: "Gwen 1.0 Pro", desc: "Advanced maths and code" },
                            { id: "Gwen 1.0 Supreme", desc: "Expert reasoning & creativity" }
                          ].map((model) => {
                            const isSelected = model.id === modelName;
                            return (
                              <button
                                key={model.id}
                                type="button"
                                onClick={() => {
                                  onModelSelect?.(model.id);
                                  setShowDropdown(false);
                                  setShowSubmenu(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                                  isSelected
                                    ? "bg-[--primary]/8 text-white"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {isSelected && <Check size={13} className="text-[--primary]" />}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-semibold text-white/90">{model.id}</span>
                                  <span className="text-[10px] text-white/40 font-normal">{model.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="h-[1px] bg-[--primary]/10 my-1.5 opacity-60" />

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowSubmenu(!showSubmenu)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                              showSubmenu
                                ? "bg-white/5 text-white"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5" />
                              <div className="flex flex-col text-left">
                                <span className="font-semibold text-white/90">Thinking level</span>
                                <span className="text-[10px] text-[--primary] font-normal">{thinkingLevel === "Fast" ? "Fast" : "Deep Think"}</span>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-white/40" />
                          </button>

                          <AnimatePresence>
                            {showSubmenu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-[0px] right-full mr-2.5 z-40 w-56 chat-popover rounded-2xl p-1.5 shadow-2xl flex flex-col gap-0.5"
                              >
                                {[
                                  { id: "Fast", desc: "Best for speed & quick answers" },
                                  { id: "Deep Think", desc: "Complex problem solving & math" }
                                ].map((level) => {
                                  const isLevelSelected = level.id === thinkingLevel;
                                  return (
                                    <button
                                      key={level.id}
                                      type="button"
                                      onClick={() => {
                                        setThinkingLevel(level.id as "Fast" | "Deep Think" | "Spicy");
                                        setShowSubmenu(false);
                                        setShowDropdown(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                                        isLevelSelected
                                          ? "bg-[--primary]/8 text-white"
                                          : "text-white/70 hover:bg-white/5 hover:text-white"
                                      }`}
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {isLevelSelected && <Check size={13} className="text-[--primary]" />}
                                      </div>
                                      <div className="flex flex-col text-left">
                                        <span className="font-semibold text-white/90">{level.id}</span>
                                        <span className="text-[10px] text-white/40 font-normal">{level.desc}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Always show Send button since uploadedFile exists */}
              <AnimatePresence mode="wait">
                <motion.button
                  key="send-button-file"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  type="button"
                  onClick={onSubmitClick}
                  className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center hover:bg-white/5 transition-colors duration-150 cursor-pointer flex-shrink-0 outline-none"
                >
                  <ArrowUp size={16} className="text-[--primary]" />
                </motion.button>
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
