"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Code2, Smartphone, Tablet, Monitor } from "lucide-react";

const GITHUB_RAW = "https://raw.githubusercontent.com/JinXSuper/jinxsuper-gwen-ui-login/main/components";

const blocks = [
  {
    id: "auth-login",
    name: "Auth — Login",
    category: "Authentication",
    command: "npx @gwenui/cli add login",
    previewUrl: "https://gwen-ui-login.vercel.app/login",
    githubUrl: "https://github.com/JinXSuper/jinxsuper-gwen-ui-login",
    codeFiles: [
      { label: "login-form.tsx", url: `${GITHUB_RAW}/login-form.tsx` },
      { label: "Grainient.tsx", url: `${GITHUB_RAW}/Grainient.tsx` },
      { label: "button.tsx", url: `${GITHUB_RAW}/ui/button.tsx` },
      { label: "card.tsx", url: `${GITHUB_RAW}/ui/card.tsx` },
      { label: "field.tsx", url: `${GITHUB_RAW}/ui/field.tsx` },
      { label: "input.tsx", url: `${GITHUB_RAW}/ui/input.tsx` },
      { label: "label.tsx", url: `${GITHUB_RAW}/ui/label.tsx` },
      { label: "separator.tsx", url: `${GITHUB_RAW}/ui/separator.tsx` },
    ],
  },
];

export function BlockPreview() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeBlock, setActiveBlock] = useState(blocks[0]);
  const [activeFile, setActiveFile] = useState(blocks[0].codeFiles[0]);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [copied, setCopied] = useState<"command" | "code" | null>(null);

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
    setActiveFile(activeBlock.codeFiles[0]);
  }, [activeBlock]);

  const copyToClipboard = (text: string, type: "command" | "code" = "command") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  return (
    <section className="relative z-10 w-full py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold mb-4 block">
            · Block Registry
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight heading-gradient-white mb-4">
            Ship-ready blocks.<br />
            <span className="heading-gradient-orange">Zero friction.</span>
          </h2>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Full-page Next.js workflow blocks. Copy the command, own the code.
          </p>
        </div>

        {/* Preview window */}
        <div className="rounded-2xl border overflow-hidden shadow-2xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 border-b gap-4 md:gap-0"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          >
            {/* Left: traffic lights + tabs */}
            <div className="flex items-center gap-6">
              {/* Traffic lights */}
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              {/* Tab switcher */}
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${activeTab === "preview"
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70"
                    }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${activeTab === "code"
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70"
                    }`}
                >
                  Code
                </button>
              </div>

              {/* Viewport switcher (Only for Preview tab) */}
              {activeTab === "preview" && (
                <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-6 ml-2">
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`p-1.5 rounded-md transition-all ${viewport === "mobile" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewport("tablet")}
                    className={`p-1.5 rounded-md transition-all ${viewport === "tablet" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                    title="Tablet View"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`p-1.5 rounded-md transition-all ${viewport === "desktop" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                    title="Desktop View"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {/* Copy install command */}
              <button
                onClick={() => copyToClipboard(activeBlock.command, "command")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 whitespace-nowrap"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--border)",
                  color: "var(--primary)",
                }}
              >
                <span>$</span>
                <span>{activeBlock.command}</span>
                {copied === "command" ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60" />
                )}
              </button>

              {/* Copy code button (Visible only when in Code tab) */}
              {activeTab === "code" && (
                <button
                  onClick={() => copyToClipboard(fileContent || "", "code")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <Code2 className="w-3 h-3" />
                  <span>{copied === "code" ? "Copied!" : "</>  Copy"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="relative overflow-hidden bg-black/40 flex justify-center" style={{ height: "600px" }}>
            {activeTab === "preview" ? (
              <div
                className="h-full transition-all duration-500 ease-in-out relative flex justify-center bg-[var(--preview-bg)]"
                style={{ width: getViewportWidth() }}
              >
                {/* Mobile/Tablet Frame decoration */}
                {viewport !== "desktop" && (
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[2.5rem] z-20 shadow-2xl shadow-black/50" />
                )}

                <iframe
                  src={activeBlock.previewUrl}
                  className={`w-full h-full border-0 ${viewport !== "desktop" ? "rounded-[1.8rem] p-1" : ""}`}
                  title={`${activeBlock.name} preview`}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col bg-[var(--preview-bg)]">
                {/* File selector sub-tabs */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b overflow-x-auto no-scrollbar shrink-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-1">
                    {activeBlock.codeFiles.map((file) => (
                      <button
                        key={file.label}
                        onClick={() => setActiveFile(file)}
                        className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all ${activeFile.label === file.label
                            ? "bg-white/10 text-white"
                            : "text-white/30 hover:text-white/60"
                          }`}
                      >
                        {file.label}
                      </button>
                    ))}
                  </div>
                  <a
                    href={activeBlock.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:block text-[10px] text-white/30 hover:text-white/60 transition-colors whitespace-nowrap font-mono"
                  >
                    View on GitHub →
                  </a>
                </div>

                {/* Code display */}
                <div className="flex-1 w-full overflow-auto p-6 font-mono text-sm leading-relaxed relative"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {isLoadingFile ? (
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                      <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                    </div>
                  ) : (
                    <pre className="whitespace-pre">{fileContent}</pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Block selector */}
        <div className="flex items-center gap-2 mt-4 flex-wrap justify-center sm:justify-start">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => setActiveBlock(block)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150`}
              style={activeBlock.id === block.id ? {
                borderColor: "var(--primary)",
                color: "var(--primary)",
                background: "var(--border)",
              } : {
                borderColor: "var(--active-glass-border)",
                color: "var(--muted-foreground)",
              }}
            >
              {block.name}
            </button>
          ))}

          {/* Coming soon pill */}
          <span className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/5 text-white/20 cursor-default">
            + More coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
