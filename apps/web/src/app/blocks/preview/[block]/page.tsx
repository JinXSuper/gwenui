/**
 * GwenUI Docs — Block Preview Route
 * Author: JinXSuper
 * License: MIT
 */

import { notFound } from "next/navigation"
import { blockRegistry } from "@/lib/block-registry"

interface PreviewPageProps {
  params: Promise<{ block: string }>
}

export default async function BlockPreviewPage({ params }: PreviewPageProps) {
  const { block: blockId } = await params
  const block = blockRegistry[blockId]
  if (!block) notFound()

  const { Component } = block

  return <Component />
}

export function generateStaticParams() {
  return Object.keys(blockRegistry).map((block) => ({ block }))
}
