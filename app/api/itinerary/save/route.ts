// app/api/itinerary/save/route.ts
import { NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db'
import Itinerary from '@/models/Itinerary'

// ✅ Force Node runtime (Edge doesn’t support Mongoose)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  await dbConnect()

  const body = await req.json()

  // ✅ Fix TypeScript overload issue with .create()
  const doc = await (Itinerary as any).create(body)

  return Response.json({ ok: true, id: doc._id })
}
