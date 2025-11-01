import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'
export const runtime = 'edge'

export async function POST(req: NextRequest){
  const body = await req.json()
  const { destination, startDate, endDate, interests } = body
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const sys = `Generate a brief, user-facing planning timeline as bullet points. Do NOT reveal hidden chain-of-thought or internal tokens. Keep each bullet short (<=20 words).`

  const user = { role: 'user' as const, content: `Create a public planning summary for ${destination} (${startDate} to ${endDate}), interests: ${interests || 'balanced'}. One bullet per line.` }

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [ { role: 'system', content: sys }, user ],
    temperature: 0.2,
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
