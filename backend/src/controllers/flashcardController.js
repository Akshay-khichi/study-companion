import Flashcard from '../models/Flashcard.js';

export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.findOne({ document: req.params.id });
    if (!flashcards) return res.status(404).json({ message: 'Flashcards not found or still processing' });
    res.status(200).json(flashcards);
  } catch (error) {
    next(error);
  }
};