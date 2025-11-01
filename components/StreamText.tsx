'use client'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * StreamText
 * - Streams text from an API route and renders it as pretty Markdown.
 * - Toggle between pretty (Markdown) and raw view.
 * - Cancel in-flight generation. Auto-scroll as content streams.
 *
 * Requires:
 *   npm i react-markdown remark-gfm @tailwindcss/typography
 *   // tailwind.config.ts => plugins: [require('@tailwindcss/typography')]
 */
export default function StreamText({
  endpoint,
  body,
  onComplete
}: {
  endpoint: string
  body: any
  onComplete?: (text: string) => void
}) {
  const [text, setText] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Abort on unmount
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (!isLoading) return
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [text, isLoading])

  async function start() {
    setText('')
    setLoading(true)
    abortRef.current = new AbortController()

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      signal: abortRef.current.signal
    }).catch((e) => {
      console.error(e)
      return null
    })

    if (!res || !res.body) {
      setLoading(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let finalText = ''
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        finalText += chunk
        setText((t) => t + chunk)
      }
    } catch (err) {
      // likely aborted; swallow
    } finally {
      setLoading(false)
      onComplete?.(finalText)
    }
  }

  function cancel() {
    abortRef.current?.abort()
    setLoading(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={start}
          className="btn btn-ghost border border-green-200 hover:bg-green-100 text-green-800"
          disabled={isLoading}
          aria-label="Generate itinerary"
        >
          {isLoading ? 'Generating…' : 'Generate Itinerary'}
        </button>

        <button
          type="button"
          className="btn btn-ghost border border-green-200 hover:bg-green-100 text-green-800"
          onClick={() => setShowRaw((v) => !v)}
          disabled={!text && !isLoading}
          title="Toggle between pretty view and raw markdown"
          aria-pressed={showRaw}
        >
          {showRaw ? 'Pretty View' : 'Show Raw Markdown'}
        </button>

        <button
          type="button"
          className="btn btn-ghost border border-green-200 hover:bg-green-100 text-green-800 disabled:opacity-50"
          onClick={cancel}
          disabled={!isLoading}
          aria-label="Cancel generation"
        >
          Cancel
        </button>
      </div>

      <div
        ref={containerRef}
        className="mt-4 rounded-2xl border border-green-200 bg-white p-4 min-h-40 max-h-[100vh] overflow-auto shadow-sm"
      >
        {isLoading && (
          <div className="text-sm text-green-800/80">Generating itinerary…</div>
        )}

        {!isLoading && text && (
          showRaw ? (
            <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-slate-800">
              {text}
            </pre>
          ) : (
            <article className="prose max-w-none prose-headings:mt-4 prose-p:my-2 prose-li:my-1 prose-hr:border-green-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
              </ReactMarkdown>
            </article>
          )
        )}

        {!isLoading && !text && (
          <div className="text-sm text-green-800/80">Click “Generate Itinerary”.</div>
        )}
      </div>
    </div>
  )
}
