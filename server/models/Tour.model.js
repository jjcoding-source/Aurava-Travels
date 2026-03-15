import mongoose from 'mongoose'

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [{ type: String }],
})

const departureDateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  seatsLeft: { type: Number, required: true },
})

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Tour overview is required'],
    },
    countries: [{ type: String, required: true }],
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 40,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['europe', 'asia', 'middleeast', 'honeymoon', 'adventure', 'budget'],
      required: true,
    },
    highlights: [{ type: String }],
    itinerary: [itineraryDaySchema],
    included: [
      {
        item: String,
        included: Boolean,
      },
    ],
    departureDates: [departureDateSchema],
    image: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Tour = mongoose.model('Tour', tourSchema)
export default Tour