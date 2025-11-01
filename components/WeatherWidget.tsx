'use client'
import { useEffect, useMemo, useState } from 'react'

type Daily = { date: string; temp: number; description: string }

function iconFor(desc: string) {
  const d = desc?.toLowerCase() || ''
  if (d.includes('thunder')) return '⛈️'
  if (d.includes('storm')) return '🌩️'
  if (d.includes('snow')) return '❄️'
  if (d.includes('rain') || d.includes('drizzle')) return '🌧️'
  if (d.includes('cloud')) return '☁️'
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️'
  if (d.includes('clear')) return '☀️'
  return '🌤️'
}

function inRange(d: string, start?: string, end?: string) {
  if (!start || !end) return true
  const x = new Date(d).setHours(0,0,0,0)
  const s = new Date(start).setHours(0,0,0,0)
  const e = new Date(end).setHours(0,0,0,0)
  return x >= s && x <= e
}

export default function WeatherWidget({
  destination,
  startDate,
  endDate,
}: {
  destination: string
  startDate?: string
  endDate?: string
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'current' | 'trip'>('current')

  useEffect(() => {
    if (!destination) return
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const res = await fetch('/api/weather?destination=' + encodeURIComponent(destination))
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        if (!cancel) setData(json)
      } catch (e: any) {
        if (!cancel) setError(e?.message || 'Weather error')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [destination])

  const daily: Daily[] = useMemo(() => {
    if (!data?.daily) return []
    if ('date' in (data.daily[0] || {})) return data.daily as Daily[]
    // (fallbacks omitted: we already normalized server-side earlier)
    return []
  }, [data])

  // Filter for trip-dates tab
  const tripDays = useMemo(
    () => daily.filter(d => inRange(d.date, startDate, endDate)),
    [daily, startDate, endDate]
  )

  if (!destination) return null

  const rows = tab === 'current' ? daily.slice(0, 7) : tripDays
  const showEmptyTrip =
    tab === 'trip' && !loading && rows.length === 0 && startDate && endDate

  return (
    <div className="mt-3 rounded-2xl border border-green-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-medium text-green-900">
          Weather for {data?.city ? data.city : destination}
        </div>
        {loading && <span className="text-xs text-green-800/70">Loading…</span>}
      </div>

      {/* Tabs */}
      <div className="mt-3 inline-flex rounded-xl border border-green-200 bg-green-50 p-1">
        <button
          className={`px-3 py-1.5 text-xs rounded-lg transition ${
            tab === 'current'
              ? 'bg-white text-green-900 shadow-sm'
              : 'text-green-800/80 hover:bg-white/60'
          }`}
          onClick={() => setTab('current')}
        >
          Current (7-day)
        </button>
        <button
          className={`px-3 py-1.5 text-xs rounded-lg transition ${
            tab === 'trip'
              ? 'bg-white text-green-900 shadow-sm'
              : 'text-green-800/80 hover:bg-white/60'
          }`}
          onClick={() => setTab('trip')}
        >
          Trip dates
        </button>
      </div>

      {tab === 'trip' && (
        <p className="mt-2 text-xs text-green-800/70">
          {startDate && endDate
            ? `Showing days between ${new Date(startDate).toLocaleDateString()} and ${new Date(
                endDate
              ).toLocaleDateString()}.`
            : 'Pick start & end dates to filter the forecast.'}
        </p>
      )}

      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-3 grid gap-3 grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]">
          {(loading ? Array.from({ length: 5 }) : rows).map((d: any, i: number) => {
            if (loading) {
              return (
                <div key={i} className="rounded-xl border border-green-200 bg-green-50/40 p-3 animate-pulse overflow-hidden">
                  <div className="h-3 w-20 rounded bg-green-200/70 mb-2" />
                  <div className="h-6 w-16 rounded bg-green-200/70 mb-1" />
                  <div className="h-3 w-24 rounded bg-green-200/70" />
                </div>
              )
            }
            const prettyDate = new Date(d.date).toLocaleDateString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric'
            })
            const icon = iconFor(d.description)
            return (
              <div key={i} className="rounded-xl border border-green-200 bg-white p-3 shadow-sm overflow-hidden">
                <div className="text-xs text-green-800/80 leading-tight">{prettyDate}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl leading-none">{icon}</span>
                  <span className="text-xl font-semibold text-green-900 leading-none whitespace-nowrap">
                    {Math.round(d.temp)}°C
                  </span>
                </div>
                <div className="mt-1 text-xs capitalize text-green-800/80 leading-snug">
                  {d.description}
                </div>
              </div>
            )
          })}

          {showEmptyTrip && (
            <div className="col-span-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
              Trip dates are outside the available forecast window.  
              Free OpenWeather data usually provides ~7 days ahead.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
