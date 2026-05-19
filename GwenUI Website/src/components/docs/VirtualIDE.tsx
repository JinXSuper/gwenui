"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { 
  FileCode, 
  FileType, 
  Braces, 
  File, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Folder,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VirtualIDEFile {
  name: string;        // e.g. "index.tsx"
  path: string;        // e.g. "auth-login/index.tsx"
  content: string;     // raw file content string
  highlightedHtml?: string; // syntax highlighted HTML string from server (fallback)
  language: string;    // e.g. "tsx", "css", "json"
}

interface VirtualIDEProps {
  files: VirtualIDEFile[];
  defaultFile?: string;  // filename to show on load, default: first file
  height?: number;       // IDE height in px, default: 480
  title?: string;        // optional title shown in header
  isLoading?: boolean;
}

export function VirtualIDE({
  files,
  defaultFile,
  height = 480,
  title,
  isLoading = false
}: VirtualIDEProps) {
  // 1. File Contents React State (per file)
  const [fileContents, setFileContents] = useState<Record<string, string>>(() =>
    Object.fromEntries(files.map(f => [f.name, f.content]))
  );

  const [activeFilePath, setActiveFilePath] = useState<string>(
    files.find(f => f.name === defaultFile)?.path || files[0]?.path || ''
  );
  
  const [filetreeWidth, setFiletreeWidth] = useState<number>(200);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Expanded folders state tracking
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    files.forEach(file => {
      const folder = file.path.split('/')[0] || '';
      if (folder) initial[folder] = true;
    });
    return initial;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync contents if files prop changes
  useEffect(() => {
    setFileContents(Object.fromEntries(files.map(f => [f.name, f.content])));
    if (files.length > 0 && !activeFilePath) {
      setActiveFilePath(files[0].path);
    }
  }, [files]);

  // Restore filetree width on mount & track mobile width
  useEffect(() => {
    const savedWidth = localStorage.getItem('gwenui-ide-filetree-width');
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (parsed >= 140 && parsed <= 320) {
        setFiletreeWidth(parsed);
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle Resize Mouse Events
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const clamped = Math.max(140, Math.min(320, newWidth));
      setFiletreeWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      localStorage.setItem('gwenui-ide-filetree-width', filetreeWidth.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, filetreeWidth]);

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  const updateFileContent = (name: string, value: string) => {
    setFileContents(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    if (!activeFile) return;
    const currentCode = fileContents[activeFile.name] ?? activeFile.content;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCurrentFile = () => {
    if (!activeFile) return;
    setResetting(true);
    setFileContents(prev => ({ ...prev, [activeFile.name]: activeFile.content }));
    setTimeout(() => setResetting(false), 800);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  if (!activeFile && !isLoading) return null;

  // Custom Monaco Editor Theme definition
  function handleEditorWillMount(monaco: Monaco) {
    monaco.editor.defineTheme('gwen-noir', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF8C42' },
        { token: 'string', foreground: '86EFAC' },
        { token: 'number', foreground: 'FCA5A5' },
        { token: 'type', foreground: 'A78BFA' },
        { token: 'function', foreground: '7DD3FC' },
        { token: 'variable', foreground: 'E2E8F0' },
      ],
      colors: {
        'editor.background': '#09090B',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#ffffff08',
        'editor.selectionBackground': '#FF8C4230',
        'editor.inactiveSelectionBackground': '#FF8C4218',
        'editorLineNumber.foreground': '#374151',
        'editorLineNumber.activeForeground': '#FF8C42',
        'editorCursor.foreground': '#FF8C42',
        'editor.findMatchBackground': '#FF8C4240',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#ffffff10',
        'scrollbarSlider.hoverBackground': '#ffffff20',
        'scrollbarSlider.activeBackground': '#FF8C4240',
      },
    });
    monaco.editor.setTheme('gwen-noir');
  }

  // Group files by folder
  const groupedFiles: Record<string, VirtualIDEFile[]> = {};
  files.forEach(file => {
    const parts = file.path.split('/');
    const folder = parts.length > 1 ? parts[0] : '';
    if (!groupedFiles[folder]) {
      groupedFiles[folder] = [];
    }
    groupedFiles[folder].push(file);
  });

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      return <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
    if (fileName.endsWith('.css')) {
      return <FileType className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <Braces className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />;
  };

  const ideTitle = title || activeFile?.path.split('/')[0] || 'IDE';

  // Container height rules based on Fullscreen/Normal state
  const containerClasses = isFullscreen
    ? "fixed inset-4 z-50 overflow-hidden flex flex-col transition-all duration-300"
    : "overflow-hidden flex flex-col shadow-2xl my-6 transition-all duration-300";

  const containerStyles: React.CSSProperties = {
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: '#09090B',
    boxShadow: `
      0 0 0 1px oklch(68% 0.18 48 / 8%),
      0 24px 48px rgba(0, 0, 0, 0.4),
      0 8px 16px rgba(0, 0, 0, 0.3)
    `,
    height: isFullscreen ? 'calc(100vh - 32px)' : `${height}px`,
    zIndex: isFullscreen ? 100 : undefined
  };

  return (
    <>
      {/* Backdrop for fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      <div 
        ref={containerRef}
        className={containerClasses} 
        style={containerStyles}
      >
        {/* IDE Header */}
        <div 
          className="shrink-0 select-none flex items-center justify-between border-b border-[var(--border)]"
          style={{
            height: '40px',
            background: 'oklch(13% 0.005 265)',
            padding: '0 16px'
          }}
        >
          {/* macOS dots + Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="font-mono text-[12px] text-[var(--muted-foreground)] ml-3 truncate max-w-[200px]">
              {ideTitle}
            </span>
          </div>

          {/* Action buttons (Reset, Copy, Fullscreen) */}
          {!isLoading && (
            <div className="flex items-center gap-1.5">
              {/* Reset Button */}
              <button
                onClick={resetCurrentFile}
                disabled={resetting}
                className="h-[28px] px-2.5 flex items-center gap-1.5 border border-[var(--border)] bg-transparent hover:bg-[var(--glass)] rounded-md text-[12px] text-[var(--muted-foreground)] hover:text-white cursor-pointer transition-colors duration-150 disabled:opacity-50 select-none"
                title="Reset file content"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>Reset</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className="h-[28px] px-2.5 flex items-center gap-1.5 border border-[var(--border)] bg-transparent hover:bg-[var(--glass)] rounded-md text-[12px] text-[var(--muted-foreground)] hover:text-white cursor-pointer transition-colors duration-150 select-none"
                title="Copy current code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-[28px] px-2.5 flex items-center border border-[var(--border)] bg-transparent hover:bg-[var(--glass)] rounded-md text-[12px] text-[var(--muted-foreground)] hover:text-white cursor-pointer transition-colors duration-150 select-none"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <X className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Tabs Selector */}
        {isMobile && !isLoading && (
          <div className="flex items-center overflow-x-auto border-b border-[var(--border)] bg-black/40 px-2 py-1.5 gap-1.5 shrink-0 no-scrollbar select-none">
            {files.map(file => {
              const isActive = file.path === activeFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFilePath(file.path)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-mono transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive 
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold border border-[var(--primary)]/20"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--glass)] border border-transparent"
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Work Area */}
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {isLoading ? (
            /* Loading State Skeleton Layout */
            <div className="flex flex-1 min-h-0 bg-[#09090B]">
              {/* Left Filetree skeleton */}
              {!isMobile && (
                <div 
                  style={{ width: `${filetreeWidth}px` }}
                  className="shrink-0 border-r border-[var(--border)] bg-[oklch(11%_0.005_265)] p-3 flex flex-col gap-3"
                >
                  <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="h-4 w-28 bg-white/5 animate-pulse rounded" />
                    <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />
                    <div className="h-4 w-32 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
              )}
              {/* Right Code area skeleton */}
              <div className="flex-1 p-6 flex flex-col gap-3">
                <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-white/5 animate-pulse rounded" />
              </div>
            </div>
          ) : (
            /* Loaded State Active IDE Panels */
            <>
              {/* File Tree Panel (Left) */}
              {!isMobile && (
                <div 
                  style={{ 
                    width: `${filetreeWidth}px`,
                    background: 'oklch(11% 0.005 265)',
                    borderRight: '1px solid var(--border)',
                    padding: '8px 0'
                  }}
                  className="select-none flex flex-col shrink-0 overflow-y-auto no-scrollbar font-mono text-[12px] gap-1"
                >
                  <div 
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: 'var(--muted-foreground)',
                      padding: '4px 12px 8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Explorer
                  </div>

                  {Object.keys(groupedFiles).map(folder => {
                    const folderFiles = groupedFiles[folder];
                    const isExpanded = expandedFolders[folder] ?? true;

                    return (
                      <div key={folder} className="flex flex-col">
                        {/* Folder Header */}
                        {folder && (
                          <div 
                            onClick={() => toggleFolder(folder)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 12px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              color: 'var(--muted-foreground)',
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}
                            className="hover:bg-[oklch(100%_0_0_/_3%)] transition-colors duration-150"
                          >
                            <ChevronDown 
                              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-0' : '-rotate-90'
                              }`} 
                            />
                            <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                            <span>{folder}</span>
                          </div>
                        )}

                        {/* Files within Folder */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden flex flex-col gap-0.5"
                            >
                              {folderFiles.map(file => {
                                const isActive = file.path === activeFilePath;
                                return (
                                  <div
                                    key={file.path}
                                    onClick={() => setActiveFilePath(file.path)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: folder ? '4px 12px 4px 28px' : '4px 12px 4px 20px',
                                      fontSize: '12px',
                                      fontFamily: 'monospace',
                                      cursor: 'pointer',
                                      userSelect: 'none',
                                      borderLeft: '2px solid transparent',
                                      transition: 'all 150ms ease'
                                    }}
                                    className={
                                      isActive
                                        ? "bg-[oklch(68%_0.18_48_/_8%)] text-[var(--primary)] border-l-[var(--primary)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[oklch(100%_0_0_/_3%)] border-l-transparent hover:text-white"
                                    }
                                  >
                                    {getFileIcon(file.name)}
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Drag Handle (Desktop only) */}
              {!isMobile && (
                <div 
                  onMouseDown={startResize}
                  style={{
                    width: '4px',
                    background: isResizing ? 'var(--primary)' : 'var(--border)',
                    cursor: 'col-resize',
                    transition: 'background 150ms ease',
                    flexShrink: 0
                  }}
                  className="hover:bg-[var(--primary)]/70"
                />
              )}

              {/* Code Area hosting Monaco Editor */}
              <div 
                style={{
                  background: '#09090B',
                  flex: 1,
                  overflow: 'hidden'
                }}
                className="relative"
              >
                {activeFile && (
                  <Editor
                    height="100%"
                    language={activeFile.language}
                    value={fileContents[activeFile.name] ?? activeFile.content}
                    onChange={(value) => updateFileContent(activeFile.name, value ?? '')}
                    theme="gwen-noir"
                    beforeMount={handleEditorWillMount}
                    loading={
                      <div className="absolute inset-0 flex items-center justify-center bg-[#09090B] font-mono text-[11px] text-[var(--muted-foreground)] gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping" />
                        <span>Initializing editor...</span>
                      </div>
                    }
                    options={{
                      fontSize: 13,
                      fontFamily: 'var(--font-mono), "Fira Code", monospace',
                      fontLigatures: true,
                      lineNumbers: 'on',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      padding: { top: 16, bottom: 16 },
                      renderLineHighlight: 'line',
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      smoothScrolling: true,
                      tabSize: 2,
                      automaticLayout: true,
                      scrollbar: {
                        verticalScrollbarSize: 6,
                        horizontalScrollbarSize: 6,
                      },
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Orange VS Code style Status Bar at the bottom */}
        {!isLoading && activeFile && (
          <div 
            style={{
              height: '24px',
              background: 'oklch(68% 0.18 48)',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'oklch(15% 0.05 48)',
              fontFamily: 'monospace'
            }}
            className="shrink-0 select-none"
          >
            {/* Left side */}
            <div className="flex items-center gap-2">
              <span className="font-bold">{activeFile.name}</span>
              <span className="opacity-60">•</span>
              <span className="capitalize">{activeFile.language}</span>
            </div>

            {/* Right side */}
            <div className="font-bold tracking-wider">
              GWENUI
            </div>
          </div>
        )}
      </div>
    </>
  );
}
