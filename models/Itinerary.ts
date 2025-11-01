import mongoose, { Schema, models } from 'mongoose'

const ItinerarySchema = new Schema({
  destination: String,
  startDate: String,
  endDate: String,
  interests: String,
  travelers: Number,
  budget: String,
  planText: String,
  createdAt: { type: Date, default: Date.now }
})

export default models.Itinerary || mongoose.model('Itinerary', ItinerarySchema)
