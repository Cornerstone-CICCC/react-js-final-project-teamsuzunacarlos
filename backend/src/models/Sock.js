import mongoose from 'mongoose';

const sockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
    },
    pattern: {
      type: String,
      default: 'solid',
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    material: {
      type: String,
      default: 'cotton',
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['available', 'matched', 'traded'],
      default: 'available',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Sock', sockSchema);
