import React from 'react'
import { codeToHtml } from 'shiki'
import { CodeSnippet } from '../ui/CodeSnippet'

interface SmartCodeBlockProps {
  code?: string
  language?: string
  title?: string
}

export async function SmartCodeBlock({
  code,
  language = 'tsx',
  title,
}: SmartCodeBlockProps) {
  const displayCode = code || ''
  let highlightedHtml: React.ReactNode = undefined
  try {
    const html = await codeToHtml(displayCode, {
      lang: language,
      theme: 'vesper',
    })
    highlightedHtml = (
      <div
        className="shiki-highlighted-code leading-5 font-mono text-xs overflow-auto text-[var(--foreground)]/85"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch {
    /* fallback to plain code in CodeSnippet */
  }

  return (
    <CodeSnippet
      title={title}
      tabs={[
        {
          id: language,
          code: displayCode,
          highlightedCode: highlightedHtml,
        },
      ]}
    />
  )
}

export default SmartCodeBlock
