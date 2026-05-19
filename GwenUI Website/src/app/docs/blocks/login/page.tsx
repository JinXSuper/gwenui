import Link from "next/link";
import { PreviewToolbar } from "@/components/docs/preview-toolbar";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { SmartCodeBlock } from "@/components/docs/SmartCodeBlock";
import { DocsSplitLayout } from "@/components/layout/DocsSplitLayout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { codeToHtml } from "shiki";
import { nav } from "../../nav";

const GITHUB_RAW = "https://raw.githubusercontent.com/JinXSuper/jinxsuper-gwen-ui-login/main/components";
const PAGE_PATHNAME = "/docs/blocks/login";

const loginBlockConfig = {
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
};

const rawIDEFiles = [
  {
    name: "index.tsx",
    path: "auth-login/index.tsx",
    content: `import React, { useState } from 'react';\nimport { motion } from 'framer-motion';\nimport { Card, CardHeader, CardContent } from './ui/card';\nimport { Button } from './ui/button';\nimport { Grainient } from './Grainient';\n\nexport function LoginForm() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  return (\n    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 text-white">\n      <Grainient className="absolute inset-0 z-0" />\n      \n      <motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.6 }}\n        className="relative z-10 w-full max-w-md px-4"\n      >\n        <Card>\n          <CardHeader>\n            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>\n            <p className="text-sm text-muted-foreground text-center">Login to your GwenUI account</p>\n          </CardHeader>\n          <CardContent>\n            <form className="flex flex-col gap-4 mt-4" onSubmit={(e) => e.preventDefault()}>\n              <input \n                type="email" \n                placeholder="Email Address" \n                value={email}\n                onChange={(e) => setEmail(e.target.value)}\n                className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm"\n              />\n              <input \n                type="password" \n                placeholder="Password" \n                value={password}\n                onChange={(e) => setPassword(e.target.value)}\n                className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm"\n              />\n              <Button className="w-full bg-orange-600 hover:bg-orange-500 py-3">Sign In</Button>\n            </form>\n          </CardContent>\n        </Card>\n      </motion.div>\n    </div>\n  );\n}`,
    language: "tsx"
  },
  {
    name: "Grainient.tsx",
    path: "auth-login/Grainient.tsx",
    content: `"use client";\n\nimport { useEffect, useRef } from 'react';\n\nexport function Grainient({ className }: { className?: string }) {\n  const canvasRef = useRef<HTMLCanvasElement>(null);\n\n  useEffect(() => {\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n    const ctx = canvas.getContext('2d');\n    if (!ctx) return;\n    \n    // Premium organic WebGL noise shader emulation\n    let animationFrameId: number;\n    const render = () => {\n      ctx.fillStyle = 'rgba(10, 10, 12, 0.15)';\n      ctx.fillRect(0, 0, canvas.width, canvas.height);\n      \n      // Draw subtle custom noise patterns\n      for (let i = 0; i < 100; i++) {\n        const x = Math.random() * canvas.width;\n        const y = Math.random() * canvas.height;\n        const radius = Math.random() * 2;\n        ctx.fillStyle = 'rgba(255, 81, 47, 0.03)';\n        ctx.beginPath();\n        ctx.arc(x, y, radius, 0, 2 * Math.PI);\n        ctx.fill();\n      }\n      animationFrameId = requestAnimationFrame(render);\n    };\n    render();\n    \n    return () => cancelAnimationFrame(animationFrameId);\n  }, []);\n\n  return <canvas ref={canvasRef} className={className} />;\n}`,
    language: "tsx"
  },
  {
    name: "button.tsx",
    path: "auth-login/ui/button.tsx",
    content: `import * as React from 'react';\nimport { Slot } from '@radix-ui/react-slot';\nimport { cva, type VariantProps } from 'class-variance-authority';\n\nconst buttonVariants = cva(\n  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",\n  {\n    variants: {\n      variant: {\n        default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md",\n        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",\n      },\n    },\n    defaultVariants: {\n      variant: "default",\n    },\n  }\n);\n\nexport interface ButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {\n  asChild?: boolean;\n}\n\nconst Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, variant, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : "button";\n    return (\n      <Comp\n        className={buttonVariants({ variant, className })}\n        ref={ref}\n        {...props}\n      />\n    );\n  }\n);\nButton.displayName = "Button";\n\nexport { Button };`,
    language: "tsx"
  },
  {
    name: "card.tsx",
    path: "auth-login/ui/card.tsx",
    content: `import * as React from 'react';\n\nexport function Card({ children, className }: any) {\n  return (\n    <div className={\`rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-2xl \${className}\`}>\n      {children}\n    </div>\n  );\n}\n\nexport function CardHeader({ children }: any) {\n  return <div className="flex flex-col gap-1.5">{children}</div>;\n}\n\nexport function CardContent({ children }: any) {\n  return <div className="mt-4">{children}</div>;\n}`,
    language: "tsx"
  }
];

export default async function LoginBlockPage() {
  // Static compile-time pagination resolution (Enables fast Next.js Static / ISR rendering)
  const allItems = nav.flatMap((g) => g.items);
  const currentIndex = allItems.findIndex((i) => i.href === PAGE_PATHNAME);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const prevItem = activeIndex > 0 ? allItems[activeIndex - 1] : null;
  const nextItem = activeIndex < allItems.length - 1 ? allItems[activeIndex + 1] : null;

  // Pre-highlight all VirtualIDE files at build time using Shiki!
  const highlightedFiles = await Promise.all(
    rawIDEFiles.map(async (file) => {
      try {
        const html = await codeToHtml(file.content, {
          lang: file.language,
          theme: "vesper",
        });
        return {
          ...file,
          highlightedHtml: html,
        };
      } catch (e) {
        return file;
      }
    })
  );

  // Left Content: Documentation and Instructions
  const leftContent = (
    <div className="w-full flex flex-col flex-1 py-4">
      {/* Breadcrumb */}
      <DocsBreadcrumb />

      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[var(--docs-text-heading)]">
        Login Block
      </h1>
      <p className="text-[15px] lg:text-[17px] text-[var(--docs-text-body)] leading-relaxed mb-12">
        A cinematic, dark-themed, glassmorphic login screen block with animated noise background effects and floating grid elements. Fully accessible, responsive, and ready to be dropped into any Next.js application.
      </p>

      {/* Quick Add command snippet (Manages tab internally) */}
      <CodeSnippet
        title="Installation"
        tabs={["npm", "pnpm", "yarn", "bun"].map((pm) => ({
          id: pm,
          icon: ">_",
          language: pm,
          code: `${pm} dlx @gwenui/cli add login`,
        }))}
      />

      {/* Manual Installation Guidelines (Manages tab internally) */}
      <CodeSnippet
        title="Manual Setup"
        tabs={[
          {
            id: "auto",
            language: "bash",
            code: "npx @gwenui/cli add login",
            highlightedCode: (
              <div className="text-xs text-[var(--docs-text-body)] leading-[1.6]">
                <p className="mb-3 font-semibold text-[var(--docs-text-heading)]">Recommended Automatic Installation:</p>
                <p className="mb-4 text-[var(--docs-text-muted)]">Run the following CLI tool to automatically configure, inject, and wire all the required components, backgrounds, and assets into your project workspace:</p>
                <pre className="p-3 bg-[var(--docs-elem-surface)] border border-[var(--docs-border-faint)] rounded-lg font-mono text-orange-500 mb-2">npx @gwenui/cli add login</pre>
              </div>
            )
          },
          {
            id: "manual",
            language: "tsx",
            code: "import { LoginForm } from '@/components/login-form';",
            highlightedCode: (
              <div className="text-xs text-[var(--docs-text-body)] leading-[1.6]">
                <p className="mb-3 font-semibold text-[var(--docs-text-heading)]">Manual Step-by-Step Installation:</p>
                <ol className="list-decimal list-inside space-y-2 text-[var(--docs-text-muted)] mb-4">
                  <li>Create a new directory at <code className="text-[var(--docs-text-heading)] font-mono">components/ui</code></li>
                  <li>Copy all the base UI elements (<code className="text-[var(--docs-text-heading)] font-mono">button.tsx</code>, <code className="text-[var(--docs-text-heading)] font-mono">card.tsx</code>, etc.) into that folder.</li>
                  <li>Inject the <code className="text-[var(--docs-text-heading)] font-mono">Grainient.tsx</code> component for the organic WebGL2 shader background.</li>
                  <li>Add the primary form layout <code className="text-[var(--docs-text-heading)] font-mono">login-form.tsx</code> to your main login page route.</li>
                </ol>
              </div>
            )
          }
        ]}
      />

      {/* Inline Virtual IDE showcasing structural source code files */}
      <div className="my-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--docs-text-faint)] mb-4">Component Source Code</h3>
        <SmartCodeBlock
          title="auth-login block"
          files={highlightedFiles}
        />
      </div>

      {/* Dependencies */}
      <div className="mb-10 mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--docs-text-faint)] mb-4">Required Dependencies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "framer-motion", purpose: "Fluid visual transitions" },
            { name: "lucide-react", purpose: "Vector icons library" },
            { name: "clsx & tailwind-merge", purpose: "Dynamic styling utility" },
            { name: "canvas-confetti", purpose: "Celebratory log-in feedback" },
          ].map((dep) => (
            <div
              key={dep.name}
              className="p-3.5 rounded-xl border border-[var(--docs-border-faint)] bg-[var(--docs-elem-surface)]/20 hover:bg-[var(--docs-elem-hover)] transition-colors"
            >
              <div className="text-xs font-mono font-bold text-[var(--docs-text-heading)]">{dep.name}</div>
              <div className="text-[11px] text-[var(--docs-text-faint)] mt-1">{dep.purpose}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <DocsPrevNext />

      {/* Docs Footer */}
      <div className="w-full pt-8 pb-4 border-t border-[var(--docs-border-faint)] flex flex-col xl:flex-row items-center xl:justify-between gap-6 mt-auto">
        <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-[var(--docs-text-faint)] font-medium tracking-wide">
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Next.js 16</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">TypeScript</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Tailwind</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Radix UI</span>
        </div>
        <div className="text-[12px] text-[var(--docs-text-dim)] text-center xl:text-right bg-transparent">
          Made by{" "}
          <a
            href="https://github.com/JinXSuper"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            JinXSuper
          </a>{" "}
          with Gwen <span className="text-orange-500/50">🧡</span>
        </div>
      </div>
    </div>
  );

  return (
    <DocsSplitLayout
      leftContent={leftContent}
      rightContent={
        <PreviewToolbar
          blockName="login"
          iframeSrc={loginBlockConfig.previewUrl}
          codeUrl={loginBlockConfig.codeFiles[0].url}
          files={highlightedFiles}
        />
      }
      type="component"
    />
  );
}
