import React from 'react';
import { codeToHtml } from 'shiki';
import { VirtualIDE, VirtualIDEFile } from './VirtualIDE';
import { CodeSnippet } from '../ui/CodeSnippet';

interface SmartCodeBlockProps {
  files?: VirtualIDEFile[];
  code?: string;
  language?: string;
  title?: string;
}

export async function SmartCodeBlock({
  files,
  code,
  language = 'tsx',
  title,
}: SmartCodeBlockProps) {
  // If multiple files are provided, render VirtualIDE
  if (files && files.length > 0) {
    const highlightedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const html = await codeToHtml(file.content, {
            lang: file.language || 'tsx',
            theme: 'vesper',
          });
          
          // Shiki adds its own pre wrapper with styles. Let's clean it up slightly if needed,
          // or just render it inside our scroll area!
          return {
            ...file,
            highlightedHtml: html,
          };
        } catch (e) {
          return file;
        }
      })
    );

    return (
      <VirtualIDE 
        files={highlightedFiles} 
        title={title} 
      />
    );
  }

  // Fallback to single code snippet
  const displayCode = code || '';
  let highlightedHtml: React.ReactNode = undefined;
  try {
    const html = await codeToHtml(displayCode, {
      lang: language,
      theme: 'vesper',
    });
    highlightedHtml = (
      <div 
        className="shiki-highlighted-code leading-5 font-mono text-xs overflow-auto text-[var(--foreground)]/85"
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  } catch (e) {}

  const tabs = [
    {
      id: language,
      code: displayCode,
      highlightedCode: highlightedHtml,
    },
  ];

  return (
    <CodeSnippet 
      title={title} 
      tabs={tabs} 
    />
  );
}

export default SmartCodeBlock;
