"use client";

import { useState, useEffect, useId } from "react";
import { Copy, Check, Smartphone, Tablet, Monitor, Code2, RotateCw, RefreshCw, Maximize2, Search, Undo2, BookOpen, Sun, Minimize2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tree, Folder, File } from "@/components/ui/file-tree";

export interface CodeFile {
  label: string;
  url: string;
}

export interface BlockConfig {
  id: string;
  name: string;
  category: string;
  command: string;
  previewUrl: string;
  githubUrl: string;
  codeFiles: CodeFile[];
}

interface BlockViewerProps {
  block: BlockConfig;
  variant?: "default" | "pane";
}

export function BlockViewer({ block, variant = "default" }: BlockViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isLandscape, setIsLandscape] = useState(false);
  const [activeFile, setActiveFile] = useState<CodeFile>(block.codeFiles[0]);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [copied, setCopied] = useState<"command" | "code" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState("default");

  const uid = useId();

  // Fetch file content when activeFile changes
  useEffect(() => {
    if (activeTab === "code") {
      setIsLoadingFile(true);
      fetch(activeFile.url)
        .then((res) => res.text())
        .then((text) => {
          setFileContent(text);
          setIsLoadingFile(false);
        })
        .catch(() => {
          setFileContent("// Failed to load file from GitHub.");
          setIsLoadingFile(false);
        });
    }
  }, [activeFile, activeTab]);

  // Reset activeFile when block changes
  useEffect(() => {
    setActiveFile(block.codeFiles[0]);
  }, [block]);

  const copyToClipboard = (text: string, type: "command" | "code" = "command") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getViewportWidth = () => {
    if (deviceMode === "desktop") return "100%";
    if (deviceMode === "tablet") return isLandscape ? "768px" : "512px";
    return isLandscape ? "568px" : "320px";
  };

  const deviceMode = viewport;

  if (variant === "pane") {
    return (
      <div className="flex flex-col w-full h-full relative overflow-hidden bg-transparent select-none">
        {/* Flat Top Toolbar (Spacious Height 48px / h-12) */}
        <div
          className="w-full h-12 px-4 flex items-center justify-between shrink-0 border-b z-20 font-sans select-none"
          style={{
            backgroundColor: "var(--docs-nav-bg)",
            borderBottom: "1px solid var(--docs-border-faint)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left Side: Preview / Code tabs + Viewport Toggles */}
          <div className="flex items-center gap-3">
            {/* Tab switchers (Premium Capsule Switch) */}
            <div className="flex items-center bg-[var(--docs-card-bg)]/60 rounded-full p-1 border border-[var(--docs-border-strong)] shrink-0 btn-shadow-group">
              {(["preview", "code"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 uppercase tracking-wider ${
                      isActive 
                        ? "bg-[var(--docs-elem-surface-strong)] text-[var(--docs-text-heading)] font-semibold" 
                        : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)]/80 hover:bg-[var(--docs-elem-hover)]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="w-[1px] h-4 bg-[var(--docs-border-faint)] mx-1" />

            {/* Viewport Toggles (only visible in preview mode) - Styled as premium pill switcher */}
            {activeTab === "preview" && (
              <div className="flex items-center bg-[var(--docs-card-bg)]/60 rounded-full p-1 border border-[var(--docs-border-strong)] shrink-0 btn-shadow-group">
                {[
                  { id: "desktop", label: "Desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
                  { id: "tablet", label: "Tablet", icon: <Tablet className="w-3.5 h-3.5" /> },
                  { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
                ].map((device) => {
                  const isActive = viewport === device.id;
                  return (
                    <button
                      key={device.id}
                      onClick={() => {
                        setViewport(device.id as any);
                        setIsLandscape(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                        isActive 
                          ? "bg-[var(--docs-elem-surface-strong)] text-[var(--docs-text-heading)] font-semibold" 
                          : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)]/80 hover:bg-[var(--docs-elem-hover)]"
                      }`}
                    >
                      {device.icon}
                      <span className="capitalize hidden sm:inline">{device.label}</span>
                    </button>
                  );
                })}

                {viewport !== "desktop" && (
                  <>
                    <div className="w-[1px] h-4 bg-[var(--docs-border-faint)] mx-1" />
                    <button
                      onClick={() => setIsLandscape(!isLandscape)}
                      className={`p-1.5 px-3 rounded-full transition-all flex items-center justify-center ${
                        isLandscape
                          ? "text-[var(--docs-text-heading)] bg-[var(--docs-elem-surface-strong)]"
                          : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
                      }`}
                      title="Rotate Device"
                    >
                      <RotateCw className={`w-3.5 h-3.5 transition-transform duration-300 ${isLandscape ? "rotate-90 text-[var(--primary)]" : ""}`} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Refresh & Copy CLI Command */}
          <div className="flex items-center gap-3">
            {/* Refresh / Reload */}
            {activeTab === "preview" && (
              <button
                onClick={() => {
                  const frame = document.getElementById("pane-preview-frame") as HTMLIFrameElement;
                  if (frame) {
                    frame.style.opacity = "0.3";
                    frame.src = frame.src;
                    setTimeout(() => (frame.style.opacity = "1"), 250);
                  }
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
                title="Reload Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reload</span>
              </button>
            )}

            {/* CLI Copy Command Button */}
            <button
              onClick={() => copyToClipboard(block.command, "command")}
              className="flex items-center gap-2 px-4 py-1.5 bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] hover:bg-[var(--docs-elem-surface-strong)] rounded-full text-[11px] font-mono font-bold tracking-wider text-[var(--primary)] transition-all duration-200"
              title="Copy Install Command"
            >
              <span>$</span>
              <span>{block.command}</span>
              {copied === "command" ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>
          </div>
        </div>

        {/* Content Pane below toolbar */}
        <div className="flex-1 w-full relative overflow-hidden bg-transparent">
          {activeTab === "preview" ? (
            /* IMMERSIVE PREVIEW PANEL (Full Bleed for Desktop, Device borders padded/centered for others) */
            <div 
              className={`w-full h-full flex items-center justify-center relative overflow-hidden ${
                deviceMode === "desktop" ? "p-0" : "p-8"
              }`}
            >
              <div
                id="pane-preview-mockup"
                className={`relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  deviceMode === "desktop"
                    ? "w-full h-full rounded-none border-0"
                    : deviceMode === "tablet"
                    ? "rounded-[2rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl bg-[var(--docs-page-bg)]"
                    : "rounded-[2.8rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl bg-[var(--docs-page-bg)]"
                }`}
                style={{
                  width: getViewportWidth(),
                  height:
                    deviceMode === "desktop"
                      ? "100%"
                      : deviceMode === "tablet"
                      ? "min(768px, calc(100% - 48px))"
                      : "min(640px, calc(100% - 48px))",
                }}
              >
                {deviceMode === "mobile" && !isLandscape && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[var(--docs-card-bg)] rounded-full z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]/20 mr-2 ring-1 ring-[var(--docs-border-faint)]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--docs-page-bg)]" />
                  </div>
                )}

                <iframe
                  id="pane-preview-frame"
                  src={block.previewUrl}
                  scrolling="no"
                  className="w-full h-full border-0 transition-opacity duration-300 bg-transparent overflow-hidden"
                  title={`${block.name} Live Mockup`}
                />
              </div>
            </div>
          ) : (
            /* CODE MODE FOR PANE */
            <div className="w-full h-full flex overflow-hidden relative bg-[var(--docs-card-bg)]">
              {/* Left: FileTree */}
              <div className="w-56 border-r border-[var(--docs-border-faint)] bg-[var(--docs-page-bg)]/60 flex flex-col shrink-0 overflow-hidden pt-0">
                <div className="p-3 border-b border-[var(--docs-border-faint)] flex items-center gap-2 shrink-0">
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--docs-text-dim)]">Files</span>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  <Tree initialSelectedId={activeFile.label} className="w-full">
                    {block.codeFiles.some(f => ["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)) ? (
                      <>
                        {block.codeFiles.filter(f => !["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)).map((file) => (
                          <File
                            key={file.label}
                            value={file.label}
                            onClick={() => setActiveFile(file)}
                            isSelect={activeFile.label === file.label}
                          >
                            <span className="truncate">{file.label}</span>
                          </File>
                        ))}
                        <Folder element="ui" value="ui-folder">
                          {block.codeFiles.filter(f => ["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)).map((file) => (
                            <File
                              key={file.label}
                              value={file.label}
                              onClick={() => setActiveFile(file)}
                              isSelect={activeFile.label === file.label}
                            >
                              <span className="truncate">{file.label}</span>
                            </File>
                          ))}
                        </Folder>
                      </>
                    ) : (
                      block.codeFiles.map((file) => (
                        <File
                          key={file.label}
                          value={file.label}
                          onClick={() => setActiveFile(file)}
                          isSelect={activeFile.label === file.label}
                        >
                          <span className="truncate">{file.label}</span>
                        </File>
                      ))
                    )}
                  </Tree>
                </div>
              </div>

              {/* Right: Code Editor */}
              <div className="flex-1 h-full overflow-hidden flex flex-col">
                <div className="px-5 py-2.5 border-b border-[var(--docs-border-faint)] bg-black/40 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                    <span className="text-[11px] font-mono text-[var(--docs-text-body)] font-bold">{activeFile.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={block.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-[var(--docs-text-dim)] hover:text-[var(--docs-text-muted)] transition-colors"
                    >
                      GitHub ↗
                    </a>
                    <button
                      onClick={() => copyToClipboard(fileContent, "code")}
                      className="text-[10px] font-bold uppercase tracking-wider text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] transition-colors flex items-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied === "code" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-auto font-mono text-[11px] leading-[1.7] text-[var(--docs-text-body)] relative">
                  {isLoadingFile ? (
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-3/4 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                      <div className="h-3 w-5/6 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                    </div>
                  ) : (
                    <pre className="whitespace-pre tab-size-2 custom-scrollbar">
                      <code>{fileContent}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex flex-col w-full h-[640px] relative overflow-hidden transition-all duration-300 rounded-3xl border border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)]"
    >
      {/* Immersive Fullscreen Preview Modal Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-[var(--docs-page-bg)]/98 flex flex-col p-6 overflow-hidden select-none"
          >
            {/* Header bar: Minimal and clean matching the screenshot */}
            <div className="flex items-center justify-between w-full mb-6 px-4 shrink-0">
              {/* Top-left: Docs Meta */}
              <div className="flex items-center gap-2.5 text-[var(--docs-text-body)]">
                <BookOpen className="w-4 h-4 text-[var(--docs-text-faint)]" />
                <span className="text-[13px] font-medium tracking-wide">
                  Docs <span className="mx-1 text-[var(--docs-text-faint)]">·</span> <strong className="text-[var(--docs-text-heading)] font-semibold">{block.name}</strong>
                </span>
              </div>
              
              {/* Top-right Actions Panel grouped closely */}
              <div className="flex items-center gap-4 bg-[var(--docs-elem-surface-faint)] border border-[var(--docs-border-faint)] rounded-full px-4 py-1.5 backdrop-blur-xl shadow-xl">
                <button className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1" title="Search components">
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    setActiveTab(activeTab === "preview" ? "code" : "preview");
                    setIsFullscreen(false);
                  }}
                  className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1" 
                  title="View Source Code"
                >
                  <Code2 className="w-3.5 h-3.5" />
                </button>
                <button className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1" title="Reset Viewport">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const frame = document.getElementById("fullscreen-frame") as HTMLIFrameElement;
                    if (frame) {
                      frame.style.opacity = "0.3";
                      frame.src = frame.src;
                      setTimeout(() => (frame.style.opacity = "1"), 250);
                    }
                  }}
                  className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1"
                  title="Reload Preview"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1"
                  title="Exit Fullscreen"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3.5 bg-[var(--docs-border-faint)] mx-0.5" />
                <button className="text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-colors p-1" title="Toggle Glass Effect">
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Immersive centered preview workspace */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
              <div
                className={`relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  deviceMode === "desktop"
                    ? "w-full h-full border-0 bg-transparent"
                    : deviceMode === "tablet"
                    ? "rounded-[2rem] border-[12px] border-[var(--docs-elem-surface-strong)] ring-1 ring-[var(--docs-border-faint)] shadow-2xl"
                    : "rounded-[2.8rem] border-[12px] border-[var(--docs-elem-surface-strong)] ring-1 ring-[var(--docs-border-faint)] shadow-2xl"
                }`}
                style={{
                  width: getViewportWidth(),
                  height:
                    deviceMode === "desktop"
                      ? "100%"
                      : deviceMode === "tablet"
                      ? isLandscape
                        ? "512px"
                        : "768px"
                      : isLandscape
                      ? "320px"
                      : "640px",
                }}
              >
                {/* Camera notch for Mobile */}
                {deviceMode === "mobile" && !isLandscape && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[var(--docs-elem-surface-strong)] rounded-full z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-950/80 mr-2 ring-1 ring-white/5" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--docs-page-bg)]" />
                  </div>
                )}
                <iframe
                  id="fullscreen-frame"
                  src={block.previewUrl}
                  scrolling="no"
                  className="w-full h-full border-0 bg-[var(--docs-page-bg)] overflow-hidden"
                  title={`${block.name} Fullpage Mockup`}
                />
              </div>
            </div>

            {/* Bottom-left interactive variant switcher matching the screenshot */}
            <div className="absolute bottom-6 left-10 flex items-center gap-1.5 bg-[var(--docs-elem-surface-strong)]/40 border border-[var(--docs-border-faint)] rounded-full p-1 btn-shadow-group backdrop-blur-md z-50">
              {[
                { id: "default", label: "Default" },
                { id: "duration", label: "Custom Duration" },
                { id: "trigger", label: "Hover Trigger Only" },
              ].map((variant) => {
                const isActive = activeVariantId === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setActiveVariantId(variant.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 select-none ${
                      isActive
                        ? "bg-[var(--docs-text-heading)] text-[var(--docs-page-bg)] font-bold"
                        : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-surface-strong)]/20"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--docs-page-bg)]" />}
                    <span>{variant.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glass Tab Switcher (PREVIEW / CODE) on the top-left */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-0.5 bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] backdrop-blur-xl rounded-full p-1 btn-shadow-group">
        {(["preview", "code"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 z-10 ${
                isActive ? "text-black" : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)]/80"
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {isActive && (
                <motion.div
                  layoutId={`float-tab-bg-${uid}`}
                  className="absolute inset-0 bg-[var(--docs-text-heading)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative overflow-hidden bg-[var(--docs-page-bg)]/20 flex h-full">
        {activeTab === "preview" ? (
          /* PREVIEW MODE CONTAINER */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-auto pt-24">
            
            {/* Combined Floating Glass Device + Actions Controller in the top-center */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] backdrop-blur-xl rounded-full p-1 btn-shadow-group">
              {[
                { id: "desktop", label: "Desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
                { id: "tablet", label: "Tablet", icon: <Tablet className="w-3.5 h-3.5" /> },
                { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
              ].map((device) => {
                const isActive = viewport === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      setViewport(device.id as any);
                      setIsLandscape(false);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--docs-elem-surface-strong)] text-[var(--docs-text-heading)] shadow-inner"
                        : "text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)]/80"
                    }`}
                  >
                    {device.icon}
                    <span className="hidden sm:inline">{device.label}</span>
                  </button>
                );
              })}

              <div className="w-[1px] h-4 bg-[var(--docs-border-faint)] mx-1.5" />

              {/* Rotate Device (Only when mobile or tablet) */}
              {viewport !== "desktop" && (
                <button
                  onClick={() => setIsLandscape(!isLandscape)}
                  className={`p-1.5 rounded-full text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-all`}
                  title="Rotate Device"
                >
                  <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isLandscape ? "rotate-90 text-[var(--primary)]" : ""}`} />
                </button>
              )}

              {/* Reload Preview */}
              <button
                onClick={() => {
                  const frame = document.getElementById("preview-frame") as HTMLIFrameElement;
                  if (frame) {
                    frame.style.opacity = "0.3";
                    frame.src = frame.src;
                    setTimeout(() => (frame.style.opacity = "1"), 250);
                  }
                }}
                className="p-1.5 rounded-full text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-all"
                title="Reload Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Preview Toggle Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 rounded-full text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-all"
                title="Fullscreen Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Floating Glass CLI Installation command in the top-right */}
            <div className="absolute top-6 right-6 z-40 flex items-center">
              <button
                onClick={() => copyToClipboard(block.command, "command")}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] backdrop-blur-xl rounded-full text-[10px] font-mono font-bold tracking-wider text-[var(--primary)] hover:text-[var(--primary)]/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>$</span>
                <span>{block.command}</span>
                {copied === "command" ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60" />
                )}
              </button>
            </div>

            {/* Device frame wrapper */}
            <div
              id="preview-mockup"
              className={`relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl flex-shrink-0 bg-[var(--docs-page-bg)] ${
                deviceMode === "desktop"
                  ? "w-full h-full rounded-2xl border border-[var(--docs-border-faint)]"
                  : deviceMode === "tablet"
                  ? "rounded-[2rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)]"
                  : "rounded-[2.8rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)]"
              }`}
              style={{
                width: getViewportWidth(),
                height:
                  deviceMode === "desktop"
                    ? "100%"
                    : deviceMode === "tablet"
                    ? isLandscape
                      ? "512px"
                      : "768px"
                    : isLandscape
                    ? "320px"
                    : "640px",
              }}
            >
              {/* Overlay camera notch for Mobile Portrait */}
              {deviceMode === "mobile" && !isLandscape && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[var(--docs-card-bg)] rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]/20 mr-2 ring-1 ring-[var(--docs-border-faint)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--docs-page-bg)]" />
                </div>
              )}

              <iframe
                id="preview-frame"
                src={block.previewUrl}
                scrolling="no"
                className="w-full h-full border-0 transition-opacity duration-300 bg-[var(--docs-card-bg)] overflow-hidden"
                title={`${block.name} Live Mockup`}
              />
            </div>
          </div>
        ) : (
          /* CODE EXPLORER MODE (FILETREE + EDITOR) */
          <div className="w-full h-full flex overflow-hidden relative">
            {/* Floating Copy File Button in the top-right */}
            <div className="absolute top-6 right-6 z-40">
              <button
                onClick={() => copyToClipboard(fileContent, "code")}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--docs-card-bg)]/60 border border-[var(--docs-border-strong)] backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-wider text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Code2 className="w-3.5 h-3.5 opacity-70" />
                <span>{copied === "code" ? "Copied!" : "Copy File"}</span>
              </button>
            </div>

            {/* Left: FileTree Sidebar - Padded at the top to clear the floating switcher toggle */}
            <div className="w-64 border-r border-[var(--docs-border-faint)] bg-[var(--docs-page-bg)]/60 flex flex-col shrink-0 overflow-hidden pt-[72px]">
              <div className="p-4 border-b border-[var(--docs-border-faint)] flex items-center gap-2 shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--docs-text-dim)]">Project Files</span>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <Tree
                  initialSelectedId={activeFile.label}
                  className="w-full"
                >
                  {/* Group UI component files into a nested 'ui' folder if they exist */}
                  {block.codeFiles.some(f => ["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)) ? (
                    <>
                      {/* Root Files */}
                      {block.codeFiles.filter(f => !["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)).map((file) => (
                        <File
                          key={file.label}
                          value={file.label}
                          onClick={() => setActiveFile(file)}
                          isSelect={activeFile.label === file.label}
                        >
                          <span className="truncate">{file.label}</span>
                        </File>
                      ))}

                      {/* UI Subfolder */}
                      <Folder
                        element="ui"
                        value="ui-folder"
                      >
                        {block.codeFiles.filter(f => ["button.tsx", "card.tsx", "field.tsx", "input.tsx", "label.tsx", "separator.tsx"].includes(f.label)).map((file) => (
                          <File
                            key={file.label}
                            value={file.label}
                            onClick={() => setActiveFile(file)}
                            isSelect={activeFile.label === file.label}
                          >
                            <span className="truncate">{file.label}</span>
                          </File>
                        ))}
                      </Folder>
                    </>
                  ) : (
                    // Flat fallback list using Tree components
                    block.codeFiles.map((file) => (
                      <File
                        key={file.label}
                        value={file.label}
                        onClick={() => setActiveFile(file)}
                        isSelect={activeFile.label === file.label}
                      >
                        <span className="truncate">{file.label}</span>
                      </File>
                    ))
                  )}
                </Tree>
              </div>
            </div>

            {/* Right: Code Display Editor */}
            <div className="flex-1 h-full overflow-hidden flex flex-col bg-[var(--docs-card-bg)]">
              {/* Tab Header bar showing active filename */}
              <div className="px-6 py-3 border-b border-[var(--docs-border-faint)] bg-[var(--docs-page-bg)]/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  <span className="text-xs font-mono text-[var(--docs-text-body)] font-bold">{activeFile.label}</span>
                </div>
                <a
                  href={block.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[var(--docs-text-dim)] hover:text-[var(--docs-text-muted)] transition-colors mr-28"
                >
                  View on GitHub ↗
                </a>
              </div>

              {/* Scrollable code block */}
              <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-[1.7] text-[var(--docs-text-body)] relative">
                {isLoadingFile ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="h-4 w-3/4 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                    <div className="h-4 w-full bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-[var(--docs-elem-surface-strong)] rounded animate-pulse" />
                  </div>
                ) : (
                  <pre className="whitespace-pre tab-size-2 custom-scrollbar">
                    <code>{fileContent}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
