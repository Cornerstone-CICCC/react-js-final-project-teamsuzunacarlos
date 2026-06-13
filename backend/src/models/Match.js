import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    sock1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sock',
      required: true,
    },
    sock2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sock',
      required: true,
    },
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    matchedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Match', matchSchema);
