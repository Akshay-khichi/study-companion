import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  cards: [{
    front: { type: String, required: true },
    back: { type: String, required: true },
    hint: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
  }],
}, { timestamps: true });

flashcardSchema.index({ document: 1 });

export default mongoose.model('Flashcard', flashcardSchema);