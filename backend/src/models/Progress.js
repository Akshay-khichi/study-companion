import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, unique: true },
  notesViewed: { type: Boolean, default: false },
  notesViewedAt: { type: Date, default: null },
  flashcardsCompleted: { type: Boolean, default: false },
  flashcardsCompletedAt: { type: Date, default: null },
  flashcardsMarkedHard: { type: Number, default: 0 },
  quizAttempts: { type: Number, default: 0 },
  bestQuizScore: { type: Number, default: 0 }, // 0-100
  quizCompleted: { type: Boolean, default: false },
  quizCompletedAt: { type: Date, default: null },
  tutorMessages: { type: Number, default: 0 },
  tutorUsed: { type: Boolean, default: false },
  tutorUsedAt: { type: Date, default: null },
  lastStudiedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// progressSchema.index({ documentId: 1 });

export default mongoose.model('Progress', progressSchema);