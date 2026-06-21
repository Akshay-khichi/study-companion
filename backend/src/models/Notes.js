import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  summary: { type: String, default: '' },
  keyConcepts: [{ type: String }],
  importantPoints: [{ type: String }],
  structuredSections: [{
    heading: { type: String },
    content: { type: String }
  }],
  revisionNotes: [{ type: String }],
  interviewQuestions: [{ type: String }],
  commonMistakes: [{ type: String }],
}, { timestamps: true });

notesSchema.index({ document: 1 });

export default mongoose.model('Notes', notesSchema);