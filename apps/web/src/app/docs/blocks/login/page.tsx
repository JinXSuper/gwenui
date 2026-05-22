import type { SourceFile } from "@/components/docs/PreviewPanel";
import { PreviewPanel } from "@/components/docs/PreviewPanel";
import { DocsSplitLayout } from "@/components/layout/DocsSplitLayout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { getBlockMdxContent } from "@/lib/mdx";
import fs from "fs";
import path from "path";

export default async function LoginBlockPage() {
  const { content } = await getBlockMdxContent("login");

  let files: SourceFile[] = [];
  try {
    const blockDir = path.join(process.cwd(), "../../blocks/auth-login");
    files = [
      { name: "index.tsx",        path: "auth-login/index.tsx",                    content: fs.readFileSync(path.join(blockDir, "index.tsx"), "utf-8"),                    language: "tsx" },
      { name: "LoginForm.tsx",    path: "auth-login/components/LoginForm.tsx",      content: fs.readFileSync(path.join(blockDir, "components/LoginForm.tsx"), "utf-8"),      language: "tsx" },
      { name: "OAuthButtons.tsx", path: "auth-login/components/OAuthButtons.tsx",   content: fs.readFileSync(path.join(blockDir, "components/OAuthButtons.tsx"), "utf-8"),   language: "tsx" },
      { name: "block.json",       path: "auth-login/block.json",                    content: fs.readFileSync(path.join(blockDir, "block.json"), "utf-8"),                    language: "json" },
    ];
  } catch { files = []; }

  const leftContent = (
    <div className="w-full flex flex-col flex-1 py-4">
      <DocsBreadcrumb />
      <div className="prose-gwenui max-w-none w-full">{content}</div>
      <DocsPrevNext />
      <DocsFooter tags={["Next.js 16", "TypeScript", "Tailwind", "Radix UI"]} />
    </div>
  );

  return (
    <DocsSplitLayout
      leftContent={leftContent}
      sourceFiles={files}
      rightContent={<PreviewPanel src="https://gwen-ui-login.vercel.app/login" />}
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
