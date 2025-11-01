'use client'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownViewer({ text }: { text: string }) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:mt-4 prose-p:my-2 prose-li:my-1 prose-hr:border-white/10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </article>
  )
}
