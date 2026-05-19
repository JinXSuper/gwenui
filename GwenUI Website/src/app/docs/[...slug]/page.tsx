import { getMdxContent } from '@/lib/mdx'
import { getPagination } from '@/content/docs/nav'
import { DocsPagination } from '@/components/docs/DocsPagination'
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb'
import { CopyPageButton } from '@/components/docs/CopyPageButton'

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params
  const pathname = '/docs/' + resolvedParams.slug.join('/')
  
  const { prev, next } = getPagination(pathname)
  
  // Try to load MDX content, handle 404 gracefully if file doesn't exist yet
  let content, frontmatter;
  try {
    const mdxData = await getMdxContent(resolvedParams.slug)
    content = mdxData.content
    frontmatter = mdxData.frontmatter
  } catch (error) {
    return (
      <article className="py-8">
        <h1 className="text-2xl font-bold">Page Under Construction</h1>
        <p className="text-[var(--docs-text-muted)] mt-2">MDX file not found for {pathname}</p>
      </article>
    )
  }

  return (
    <article className="w-full relative pb-20">
      <DocsBreadcrumb />

      <div className="flex items-start justify-between mt-6 mb-10 border-b border-[var(--docs-border-faint)] pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-[Lora,serif] font-bold text-4xl text-[var(--docs-text-heading)] tracking-tight">
            {frontmatter.title}
          </h1>
          <p className="text-[var(--docs-text-body)] text-[15px] leading-relaxed max-w-2xl">
            {frontmatter.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <CopyPageButton />
          <DocsPagination prev={prev} next={next} />
        </div>
      </div>

      {/* Compiled MDX Content */}
      <div data-mdx-content className="prose-gwenui max-w-none w-full">
        {content}
      </div>
    </article>
  )
}
