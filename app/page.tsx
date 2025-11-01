'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import StreamText from '@/components/StreamText'
import ReasoningTimeline from '@/components/ReasoningTimeline'
import WeatherWidget from '@/components/WeatherWidget'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'

export default function Page() {
  const { register, handleSubmit, watch, reset } = useForm()
  const [payload, setPayload] = useState<any | null>(null)
  const [latestPlan, setLatestPlan] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  function onSubmit(values: any) {
    const p = {
      destination: values.destination,
      startDate: values.startDate,
      endDate: values.endDate,
      interests: values.interests,
      travelers: Number(values.travelers || 1),
      budget: values.budget,
    }
    setPayload(p)
  }

  async function save() {
    if (!latestPlan || !payload) return alert('Generate a plan first, then save.')
    try {
      const res = await fetch('/api/itinerary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, planText: latestPlan }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Saved successfully (if DB configured).')
      reset()
      setPayload(null)
      setLatestPlan('')
    } catch (e: any) {
      alert(`Save failed: ${e?.message || e}`)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-green-700">Loading interface…</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* LEFT PANEL */}
      <section className="rounded-2xl border border-green-200 bg-white p-8 shadow-md hover:shadow-lg transition-all">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-green-900">Plan Your Trip</h1>
          <p className="text-sm text-green-800/70 mt-1">
            Fill in the details below to get your personalized itinerary powered by AI.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Destination</label>
            <div className="relative">
              <MapPin className="icon-left h-4 w-4 text-green-600" />
              <input
                {...register('destination', { required: true })}
                placeholder="e.g., Paris, Kyoto"
                className="input with-left-icon"
                autoComplete="off"
                aria-label="Destination"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="icon-left h-4 w-4 text-green-600" />
                <input
                  type="date"
                  {...register('startDate', { required: true })}
                  className="input with-left-icon"
                  aria-label="Start date"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="icon-left h-4 w-4 text-green-600" />
                <input
                  type="date"
                  {...register('endDate', { required: true })}
                  className="input with-left-icon"
                  aria-label="End date"
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Interests</label>
            <input
              {...register('interests')}
              placeholder="Food, culture, adventure, nightlife"
              className="input"
              autoComplete="off"
              aria-label="Interests"
            />
          </div>

          {/* Travelers + Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">Travelers</label>
              <div className="relative">
                <Users className="icon-left h-4 w-4 text-green-600" />
                <input
                  type="number"
                  min={1}
                  {...register('travelers')}
                  placeholder="2"
                  className="input with-left-icon"
                  autoComplete="off"
                  aria-label="Travelers"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">Budget</label>
              <div className="relative">
                <DollarSign className="icon-left h-4 w-4 text-green-600" />
                <select
                  {...register('budget')}
                  className="input with-left-icon with-right-caret"
                  aria-label="Budget"
                >
                  <option value="">Select</option>
                  <option>Backpacker</option>
                  <option>Moderate</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" type="submit">
              Generate Plan
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={save}
              disabled={!latestPlan}
            >
              Save Plan
            </button>
          </div>
        </form>

        {/* Tip + Weather */}
        <p className="mt-5 text-xs text-green-700/80 italic">
          💡 Tip: Leave interests empty to let AI balance your trip naturally.
        </p>
        {watch('destination') && (
          <div className="mt-6 border-t border-green-100 pt-4">
          <WeatherWidget
            destination={watch('destination')}
            startDate={watch('startDate')}
            endDate={watch('endDate')}
          />
          </div>
        )}
      </section>

      {/* RIGHT PANEL */}
      <section className="rounded-2xl border border-green-200 bg-white p-8 shadow-md hover:shadow-lg transition-all">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-green-900">Generated Itinerary</h2>
        </div>

        {payload ? (
          <StreamText endpoint="/api/itinerary" body={payload} onComplete={setLatestPlan} />
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 text-sm text-green-800 text-center">Start by filling out the form and click <strong>Generate Plan</strong> to begin.
          </div>
        )}
      </section>

      {payload && (
        <div className="md:col-span-2 mt-4">
          <ReasoningTimeline payload={payload} />
        </div>
      )}
    </div>
  )
}
