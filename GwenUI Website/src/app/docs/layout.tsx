"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/global/navbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { GrainientPanel } from "@/components/docs/GrainientPanel";
import { motion } from "framer-motion";

function DocsBlockLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--docs-page-bg)] flex flex-col">
      {/* Site Header Navbar */}
      <Navbar type="docs" />

      {/* Main layout container with sidebar and content */}
      <div className="flex pt-[52px] w-full flex-1 relative items-stretch">
        {/* Invisible vertical hover trigger strip along the left screen border */}
        <div
          onMouseEnter={() => setSidebarOpen(true)}
          className="fixed left-0 top-[52px] bottom-0 w-3 z-[9990] group flex items-center justify-start cursor-e-resize"
          title="Hover to reveal sidebar"
        >
          {/* Subtle glowing capsule line indicator */}
          <div
            className="w-[3px] h-20 bg-primary/20 rounded-r-md group-hover:h-32 group-hover:w-[5px] group-hover:bg-primary/80 transition-all duration-300 shadow-primary/10 group-hover:shadow-primary/40"
          />
        </div>

        {/* 
          Sticky left sidebar flat wrapper.
          Flat, clean sidebar flush against the content area and left viewport border.
          Transitions position on hover with high-performance spring dynamics.
        */}
        <motion.div
          animate={{
            x: sidebarOpen ? 0 : -280,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
            mass: 0.8,
          }}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          className="fixed left-0 top-[52px] bottom-0 w-[240px] z-50 overflow-hidden select-none flex flex-col bg-[var(--background)] border-r border-white/5"
        >
          {/* Docs Sidebar Navigation Content */}
          <div className="w-full h-full overflow-hidden flex flex-col bg-transparent">
            <DocsSidebar />
          </div>
        </motion.div>

        {/* Scrollable primary document view frame */}
        <main className="flex-1 min-w-0 h-[calc(100vh-52px)] overflow-hidden relative">
          {/* Viewport Top Receding Shadow */}
          <div 
            className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-40 opacity-100"
            style={{
              background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
            }}
          />

          {children}

          {/* Viewport Bottom Receding Shadow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-40 opacity-100"
            style={{
              background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
            }}
          />
        </main>
      </div>
    </div>
  );
}

function DocsTextLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--docs-page-bg)] flex flex-col relative overflow-hidden">
      <Navbar type="docs" />
      
      <div className="flex min-h-screen pt-[52px]">
        {/* Fixed Sidebar */}
        <div className="hidden md:block fixed left-0 top-[52px] bottom-0 w-[240px] z-40 bg-[var(--background)] border-r border-white/5">
          <div className="w-full h-full overflow-y-auto">
            <DocsSidebar />
          </div>
        </div>

        {/* Main Content (80%) */}
        <main
          className="flex-1 overflow-y-auto h-[calc(100vh-52px)] xl:mr-[20%] relative z-0"
          style={{ marginLeft: '240px' }}
        >
          <div className="max-w-3xl mx-auto px-8 py-12">
            {children}
          </div>
        </main>

        {/* Fixed Right Grainient Panel (20%) */}
        <GrainientPanel />
      </div>
    </div>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBlockPage = 
    (pathname.startsWith('/docs/blocks') || pathname.startsWith('/docs/supreme')) && 
    !pathname.endsWith('/overview');

  if (isBlockPage) {
    return <DocsBlockLayout>{children}</DocsBlockLayout>;
  }

  return <DocsTextLayout>{children}</DocsTextLayout>;
}
