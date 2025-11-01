// lib/models/Itinerary.ts
import mongoose, { Schema, models, model } from 'mongoose'

// ✅ Define schema
const ItinerarySchema = new Schema(
  {
    destination: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    interests: { type: String },
    travelers: { type: Number },
    budget: { type: String },
    planText: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// ✅ Avoid Next.js hot-reload "OverwriteModelError"
export const ItineraryModel =
  models.Itinerary || model('Itinerary', ItinerarySchema)

export default ItineraryModel
