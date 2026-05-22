import { CopyCodeButton } from '@/components/docs/CopyCodeButton'
import { PackageManagerTabs } from '@/components/docs/PackageManagerTabs'
import { SmartCodeBlock } from '@/components/docs/SmartCodeBlock'

export const mdxComponents = {
  pre: ({ children, ...props }: any) => (
    <div className="relative group">
      <CopyCodeButton />
      <pre {...props}>{children}</pre>
    </div>
  ),

  blockquote: ({ children }: any) => (
    <div className="border-l-2 border-[var(--primary)] bg-[var(--surface)]
                    px-4 py-3 rounded-r-lg my-4 text-sm text-[var(--text-muted)]">
      {children}
    </div>
  ),

  h1: ({ children, id }: any) => (
    <h1 id={id} className="group flex items-center gap-2 scroll-mt-20
                            font-bold text-3xl text-[var(--text)] mt-8 mb-4
                            font-[Lora,serif]">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40
                                     transition-opacity text-[var(--primary)]">#</a>
    </h1>
  ),

  h2: ({ children, id }: any) => (
    <h2 id={id} className="group flex items-center gap-2 scroll-mt-20
                            font-semibold text-xl text-[var(--text)] mt-8 mb-3">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40
                                     transition-opacity text-[var(--primary)]">#</a>
    </h2>
  ),

  h3: ({ children, id }: any) => (
    <h3 id={id} className="scroll-mt-20 font-semibold text-base
                            text-[var(--text)] mt-6 mb-2">
      {children}
    </h3>
  ),

  PackageManagerTabs,
  SmartCodeBlock,
}
