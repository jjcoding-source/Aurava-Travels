import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: String },
  addedAt: { type: Date, default: Date.now },
})

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
    },
    month: {
      type: String,
    },
    budget: {
      type: String,
    },
    source: {
      type: String,
      enum: ['Website', 'WhatsApp', 'Phone', 'Facebook Ad', 'Instagram', 'Referral', 'Other'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'booked', 'lost'],
      default: 'new',
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    notes: [noteSchema],
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Lead = mongoose.model('Lead', leadSchema)
export default Lead