// app/api/itineraries/route.ts
import { dbConnect } from '@/lib/db'
import Itinerary from '@/models/Itinerary'

// ✅ Mongoose must use Node runtime (not Edge)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  await dbConnect()

  // ✅ Use this form to fix the "not callable" TS error
  const items = await (Itinerary as any)
    .find({}, undefined, { lean: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .exec()

  return Response.json(items)
}
