import express from 'express';
import { regenerateNotes, regenerateFlashcards, regenerateQuiz } from '../controllers/regenerateController.js';

const router = express.Router();

router.post('/notes', regenerateNotes);
router.post('/flashcards', regenerateFlashcards);
router.post('/quiz', regenerateQuiz);

export default router;