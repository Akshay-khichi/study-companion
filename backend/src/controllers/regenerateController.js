import Document from '../models/Document.js';
import Notes from '../models/Notes.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { generateNotes, generateFlashcards, generateQuiz } from '../services/aiService.js';

export const regenerateNotes = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const notesData = await generateNotes(doc.title, doc.content);

    await Notes.findOneAndDelete({ document: documentId });
    const newNotes = new Notes({ document: documentId, ...notesData });
    await newNotes.save();

    res.status(200).json(newNotes);
  } catch (error) {
    next(error);
  }
};

export const regenerateFlashcards = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const flashcardsData = await generateFlashcards(doc.title, doc.content);

    await Flashcard.findOneAndDelete({ document: documentId });
    const newFlashcards = new Flashcard({ document: documentId, cards: flashcardsData.cards });
    await newFlashcards.save();

    res.status(200).json(newFlashcards);
  } catch (error) {
    next(error);
  }
};

export const regenerateQuiz = async (req, res, next) => {
  try {
    const { documentId, count } = req.body;
    if (!count || ![10, 20, 30, 50].includes(count)) {
      return res.status(400).json({ message: 'Valid question count (10, 20, 30, 50) is required' });
    }
    
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const quizData = await generateQuiz(doc.title, doc.content, count);

    await Quiz.findOneAndDelete({ document: documentId });
    const newQuiz = new Quiz({ document: documentId, questions: quizData.questions });
    await newQuiz.save();

    res.status(200).json(newQuiz);
  } catch (error) {
    next(error);
  }
};