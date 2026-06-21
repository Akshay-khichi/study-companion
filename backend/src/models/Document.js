import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({

  title: { type: String, required: [true, 'Title is required'], trim: true },
    userId: {
  type: String,
  required: true,
},
  type: { type: String, enum: ['pdf', 'topic'], required: true },
  content: { type: String, default: '' },
  fileUrl: { type: String, default: null },
  filePath: { type: String, default: null },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
}, { timestamps: true });

documentSchema.index({ createdAt: -1 });

export default mongoose.model('Document', documentSchema);