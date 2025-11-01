import { dbConnect } from '@/lib/db'
import Itinerary from '@/models/Itinerary'

export async function GET(){
  await dbConnect()
  const items = await Itinerary.find({}).sort({ createdAt: -1 }).limit(20).lean()
  return Response.json(items)
}
