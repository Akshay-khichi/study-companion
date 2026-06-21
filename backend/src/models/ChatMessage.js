import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

chatMessageSchema.index({ session: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);