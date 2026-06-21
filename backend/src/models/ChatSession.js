import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
}, { timestamps: true });

chatSessionSchema.index({ document: 1 });

export default mongoose.model('ChatSession', chatSessionSchema);