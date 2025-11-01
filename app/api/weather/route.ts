import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const destination = searchParams.get('destination') || ''
  const key = process.env.OPENWEATHER_API_KEY

  if (!key || !destination) {
    return Response.json({ error: 'missing' }, { status: 400 })
  }

  try {
    // 1️⃣ Get city coordinates
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${key}`
    )
    const [loc] = await geoRes.json()
    if (!loc) throw new Error('no location found')

    const { lat, lon, name } = loc

    // 2️⃣ Fetch 5-day forecast (3-hour intervals)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
    )
    const forecastData = await forecastRes.json()

    // 3️⃣ Simplify into daily summaries
    const days: Record<string, { temps: number[]; desc: string[] }> = {}
    for (const entry of forecastData.list) {
      const date = entry.dt_txt.split(' ')[0]
      days[date] = days[date] || { temps: [], desc: [] }
      days[date].temps.push(entry.main.temp)
      days[date].desc.push(entry.weather[0].description)
    }

    const daily = Object.entries(days).map(([date, d]) => ({
      date,
      temp: Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
      description: d.desc.sort((a, b) =>
        d.desc.filter(v => v === a).length - d.desc.filter(v => v === b).length
      ).pop()
    }))

    return Response.json({ city: name, daily })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'weather_failed' }, { status: 500 })
  }
}
