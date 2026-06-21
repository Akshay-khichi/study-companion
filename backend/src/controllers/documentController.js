import Document from '../models/Document.js';
import Notes from '../models/Notes.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import Progress from '../models/Progress.js';
import supabase from '../config/supabase.js';
import { generateNotes, generateFlashcards, generateQuiz } from '../services/aiService.js';
import pdfParse from 'pdf-parse';

const generateContent = async (docId, textContent, title) => {
  try {
    const [notesData, flashcardsData, quizData] = await Promise.all([
      generateNotes(title, textContent),
      generateFlashcards(title, textContent),
      generateQuiz(title, textContent, 10)
    ]);

    await Notes.findOneAndDelete({ document: docId });
    await Flashcard.findOneAndDelete({ document: docId });
    await Quiz.findOneAndDelete({ document: docId });

    const notes = new Notes({ document: docId, ...notesData });
    await notes.save();

    const flashcard = new Flashcard({ document: docId, cards: flashcardsData.cards });
    await flashcard.save();

    const quiz = new Quiz({ document: docId, questions: quizData.questions });
    await quiz.save();

    await Document.findByIdAndUpdate(docId, { status: 'ready' });
  } catch (error) {
    console.error('Generation Error:', error.message);
    await Document.findByIdAndUpdate(docId, { status: 'failed' });
  }
};

export const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(fileName, fileBuffer, { contentType: 'application/pdf' });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName);

  const pdfData = await pdfParse(fileBuffer);

// console.log("=================================");
// console.log("TEXT LENGTH:", pdfData.text.length);
// console.log("FIRST 1000 CHARS:");
// console.log(pdfData.text.substring(0, 1000));
// console.log("=================================");

const textContent = pdfData.text;

   const newDoc = new Document({
  title: req.file.originalname.replace('.pdf', ''),
  type: 'pdf',
  content: textContent,
  fileUrl: urlData.publicUrl,
  filePath: fileName,
  userId: req.headers['x-user-id']
});

    await newDoc.save();
    res.status(201).json(newDoc);

    generateContent(newDoc._id, textContent, newDoc.title);

  } catch (error) {
    next(error);
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const { topicName } = req.body;
    if (!topicName || typeof topicName !== 'string' || topicName.trim().length === 0) {
      return res.status(400).json({ message: 'Valid topic name is required' });
    }

   const newDoc = new Document({
  title: topicName.trim(),
  type: 'topic',
  content: `Detailed information about ${topicName.trim()}.`,
  status: 'processing',
  userId: req.headers['x-user-id']
});

    await newDoc.save();
    res.status(201).json(newDoc);

    generateContent(newDoc._id, newDoc.content, topicName.trim());

  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
  const docs = await Document.find({
  userId: req.headers['x-user-id']
}).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
  const doc = await Document.findOne({
  _id: req.params.id,
  userId: req.headers['x-user-id']
});
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    await Notes.deleteMany({ document: req.params.id });
    await Flashcard.deleteMany({ document: req.params.id });
    await Quiz.deleteMany({ document: req.params.id });
    await Progress.deleteMany({ documentId: req.params.id });
    
    const sessions = await ChatSession.find({ document: req.params.id });
    if (sessions.length > 0) {
      const sessionIds = sessions.map(s => s._id);
      await ChatMessage.deleteMany({ session: { $in: sessionIds } });
      await ChatSession.deleteMany({ _id: { $in: sessionIds } });
    }

    if (doc.filePath) {
      const { error } = await supabase.storage.from('pdfs').remove([doc.filePath]);
      if (error) console.error('Supabase deletion error:', error.message);
    }

    res.status(200).json({ message: 'Document and associated data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Valid title is required' });
    }
    const doc = await Document.findByIdAndUpdate(
      req.params.id, 
      { title }, 
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};