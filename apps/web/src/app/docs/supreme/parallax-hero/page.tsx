import type { SourceFile } from "@/components/docs/PreviewPanel";
import { PreviewPanel } from "@/components/docs/PreviewPanel";
import { DocsSplitLayout } from "@/components/layout/DocsSplitLayout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { getMdxContent } from "@/lib/mdx";
import fs from "fs";
import path from "path";

export default async function ParallaxHeroBlockPage() {
  const { content } = await getMdxContent(["supreme", "parallax-hero"]);

  let files: SourceFile[] = [];
  try {
    const blockDir = path.join(process.cwd(), "../../blocks/parallax-hero");
    files = [
      { name: "index.tsx",           path: "parallax-hero/index.tsx",                          content: fs.readFileSync(path.join(blockDir, "index.tsx"), "utf-8"),                          language: "tsx" },
      { name: "FloatingImage.tsx",   path: "parallax-hero/components/FloatingImage.tsx",        content: fs.readFileSync(path.join(blockDir, "components/FloatingImage.tsx"), "utf-8"),        language: "tsx" },
      { name: "TextHoverEffect.tsx", path: "parallax-hero/components/TextHoverEffect.tsx",      content: fs.readFileSync(path.join(blockDir, "components/TextHoverEffect.tsx"), "utf-8"),      language: "tsx" },
      { name: "block.json",          path: "parallax-hero/block.json",                          content: fs.readFileSync(path.join(blockDir, "block.json"), "utf-8"),                          language: "json" },
    ];
  } catch { files = []; }

  const leftContent = (
    <div className="w-full flex flex-col flex-1 py-4">
      <DocsBreadcrumb />
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 uppercase">Supreme</span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider text-purple-400 bg-purple-400/10 border border-purple-400/20 uppercase">Exclusive</span>
      </div>
      <div className="prose-gwenui max-w-none w-full">{content}</div>
      <DocsPrevNext />
      <DocsFooter tags={["Next.js 14+", "TypeScript", "Tailwind CSS v4", "Framer Motion"]} />
    </div>
  );

  return (
    <DocsSplitLayout
      leftContent={leftContent}
      sourceFiles={files}
      rightContent={<PreviewPanel src="https://gwenui-hero-parallax.vercel.app" />}
      type="component"
    />
  );
}

function DocsFooter({ tags }: { tags: string[] }) {
  return (
    <div className="w-full pt-8 pb-4 border-t border-[var(--docs-border-faint)] flex flex-col xl:flex-row items-center xl:justify-between gap-6 mt-auto">
      <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-[var(--docs-text-faint)] font-medium tracking-wide">
        {tags.map((t) => (
          <span key={t} className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">{t}</span>
        ))}
      </div>
      <div className="text-[12px] text-[var(--docs-text-dim)] text-center xl:text-right">
        Made by{" "}
        <a href="https://github.com/JinXSuper" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--docs-text-heading)] transition-colors">
          JinXSuper
        </a>{" "}
        with Gwen <span className="text-orange-500/50">🧡</span>
      </div>
    </div>
  );
}
