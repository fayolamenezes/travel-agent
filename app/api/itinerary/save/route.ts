import { NextRequest } from 'next/server'
import { dbConnect } from '@/lib/db'
import Itinerary from '@/models/Itinerary'

export async function POST(req: NextRequest){
  await dbConnect()
  const body = await req.json()
  const doc = await Itinerary.create(body)
  return Response.json({ ok: true, id: doc._id })
}
