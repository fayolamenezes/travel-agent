import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'

export const runtime = 'edge'

export async function POST(req: NextRequest){
  const body = await req.json()
  const { destination, startDate, endDate, interests, travelers, budget } = body

  // Simple current weather context via /api/weather (server-to-server for consistency)
  let weather = null
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/weather?destination=${encodeURIComponent(destination)}`)
    if(res.ok) weather = await res.json()
  } catch {}

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const sys = `You are a detail-oriented travel planner. Create practical, walkable day plans with time blocks, nearby clustering, food recs, and commute hints. Tailor to interests, budget, and pacing. Output markdown.`

  const user = {
    role: 'user' as const,
    content: [
      { type: 'text', text: `Build a ${destination} itinerary from ${startDate} to ${endDate}. Interests: ${interests || 'balanced mix'}. Travelers: ${travelers}. Budget: ${budget || 'moderate'}.` },
      weather ? { type: 'text', text: `Weather hints: ${JSON.stringify({ daily: weather?.daily?.slice(0,3)?.map((d:any)=>({dt:d.dt,temp:d.temp?.day,desc:d.weather?.[0]?.description})) })}` } as any : { type: 'text', text: '' }
    ]
  }

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [ { role: 'system', content: sys }, user as any ],
    temperature: 0.7,
    stream: true
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller){
      for await (const chunk of stream){
        const delta = (chunk as any).choices?.[0]?.delta?.content || ''
        if(delta) controller.enqueue(encoder.encode(delta))
      }
      controller.close()
    }
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' }})
}
