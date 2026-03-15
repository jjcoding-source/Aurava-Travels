import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

reviewSchema.index({ user: 1, tour: 1 }, { unique: true })

reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tour)
})

const Review = mongoose.model('Review', reviewSchema)
export default Review