import { Compass, Calendar } from 'lucide-react'

async function getSuggested() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL + '/api/suggested'
      : 'http://localhost:3000/api/suggested',
    { cache: 'no-store' }
  ).catch(() => null)

  if (res && res.ok) return res.json()
  // fallback
  return [
    { city: 'Jaipur, India', highlights: ['Amber Fort', 'Hawa Mahal', 'Block-print bazaars'], best: 'Oct–Mar' },
    { city: 'Kyoto, Japan', highlights: ['Fushimi Inari', 'Arashiyama', 'Tea ceremony'], best: 'Mar–May / Oct–Nov' },
    { city: 'Lisbon, Portugal', highlights: ['Tram 28', 'Belém', 'Pastéis'], best: 'Apr–Jun / Sep–Oct' },
    { city: 'Bali, Indonesia', highlights: ['Ubud rice terraces', 'Uluwatu', 'Snorkeling'], best: 'Apr–Oct' },
    { city: 'Mumbai, India', highlights: ['Colaba', 'Marine Drive', 'Street food'], best: 'Nov–Feb' },
  ]
}

export default async function Trips() {
  const SUGGESTED = await getSuggested()
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {SUGGESTED.map((t: any) => (
        <article
          key={t.city}
          className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <h3 className="mb-2 text-xl font-semibold flex items-center gap-2 text-green-800">
            <Compass className="h-5 w-5 text-green-600" /> {t.city}
          </h3>

          <p className="text-sm text-green-700/80">
            <span className="font-medium text-green-800/90">Highlights:</span> {t.highlights.join(', ')}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-xs text-green-700/70">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>
              <span className="font-medium text-green-800/90">Best time:</span> {t.best}
            </span>
          </p>
        </article>
      ))}
    </div>
  )
}
