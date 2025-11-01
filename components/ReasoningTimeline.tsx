'use client'
import { useEffect, useRef, useState } from 'react'
import { Loader2, ListTree, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'

/**
 * Public-safe reasoning summary:
 * Streams a concise, user-facing rationale (not hidden chain-of-thought).
 */
export default function ReasoningTimeline({ payload }: { payload: any }) {
  const [steps, setSteps] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // For smooth collapse/expand
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<string>('0px')

  useEffect(() => {
    // whenever expanded or steps change, recompute height
    const el = panelRef.current
    if (!el) return
    if (expanded) {
      // measure the content and set max-height to its scrollHeight
      const h = el.scrollHeight
      setMaxHeight(h + 'px')
      // re-measure after next paint in case fonts load
      requestAnimationFrame(() => setMaxHeight(el.scrollHeight + 'px'))
    } else {
      setMaxHeight('0px')
    }
  }, [expanded, steps])

  async function generate() {
    setLoading(true)
    setSteps([])
    setGenerated(true)
    try {
      const res = await fetch('/api/reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      if (reader) {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          const newLines = lines.filter(Boolean)
          if (newLines.length) {
            setSteps(prev => [...prev, ...newLines])
          }
        }
      }
      // auto-expand on first successful generation
      setExpanded(true)
    } catch (e) {
      console.error('Timeline generation failed:', e)
    } finally {
      setLoading(false)
    }
  }

  const hasSteps = steps.length > 0

  return (
    <section className="rounded-2xl border border-green-200 bg-white p-6 md:p-8 shadow-md hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-green-700" />
          <h2 className="text-xl font-semibold text-green-900">Reasoning Timeline</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Generate / Refresh */}
          <button
            onClick={generate}
            disabled={loading}
            className="btn btn-ghost border border-green-200 hover:bg-green-100 text-green-800 text-sm"
            title={generated ? 'Refresh timeline' : 'Generate timeline'}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" /> Generating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {generated ? <RefreshCw className="h-4 w-4" /> : null}
                {generated ? 'Refresh' : 'Show Timeline'}
              </span>
            )}
          </button>

          {/* Expand / Collapse */}
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            disabled={!hasSteps && !loading}
            aria-expanded={expanded}
            aria-controls="reasoning-panel"
            className="btn btn-ghost border border-green-200 hover:bg-green-100 text-green-800 text-sm"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <span className="flex items-center gap-2">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {expanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
        </div>
      </div>

      {/* Subtext */}
      {!hasSteps && !loading && !generated && (
        <p className="text-sm text-green-800/80">
          Click <strong>Show Timeline</strong> to see a concise explanation of how your plan is assembled
          (weather, distance, pacing, hours). This is a high-level summary — not hidden chain-of-thought.
        </p>
      )}

      {loading && (
        <p className="text-sm text-green-700 mt-1 animate-pulse">
          Summarizing trip reasoning (weather, pacing, attractions)…
        </p>
      )}

      {!loading && generated && !hasSteps && (
        <p className="text-sm text-green-700 mt-1">No reasoning steps available. Generate a plan first and try again.</p>
      )}

      {/* Collapsible panel */}
      <div
        id="reasoning-panel"
        ref={panelRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        {hasSteps && (
          <ol className="mt-4 space-y-2 list-decimal pl-5 text-sm text-green-900">
            {steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
