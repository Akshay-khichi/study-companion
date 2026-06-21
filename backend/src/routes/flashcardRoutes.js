import express from 'express';
import { getFlashcards } from '../controllers/flashcardController.js';

const router = express.Router();

router.get('/:id', getFlashcards);

export default router;