import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from './mdxComponents'

const contentDir = path.join(process.cwd(), 'src/content/docs')

export async function getMdxContent(slugArray: string[]) {
  const filePath = path.join(contentDir, ...slugArray) + '.mdx'
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)

  const compiled = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, {
            theme: 'vesper',
            keepBackground: false,
          }],
        ],
      },
    },
    components: mdxComponents,
  })

  return { content: compiled.content, frontmatter: data }
}

// Load MDX for block docs pages (src/content/docs/blocks/<slug>.mdx)
export async function getBlockMdxContent(slug: string) {
  const filePath = path.join(contentDir, 'blocks', slug + '.mdx')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)

  const compiled = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, {
            theme: 'vesper',
            keepBackground: true,
          }],
        ],
      },
    },
    components: mdxComponents,
  })

  return { content: compiled.content, frontmatter: data }
}
