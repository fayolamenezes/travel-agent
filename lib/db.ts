import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Persistence will be disabled.')
}

let cached = (global as any).mongoose
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null }

export async function dbConnect() {
  if (!MONGODB_URI) return null
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'ai-travel-guide',
    }).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
