import express from 'express';
import documentRoutes from './documentRoutes.js';
import notesRoutes from './notesRoutes.js';
import flashcardRoutes from './flashcardRoutes.js';
import quizRoutes from './quizRoutes.js';
import tutorRoutes from './tutorRoutes.js';
import regenerateRoutes from './regenerateRoutes.js';
import progressRoutes from './progressRoutes.js';

const router = express.Router();

router.use('/documents', documentRoutes);
router.use('/notes', notesRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/quiz', quizRoutes);
router.use('/tutor', tutorRoutes);
router.use('/regenerate', regenerateRoutes);
router.use('/progress', progressRoutes);

export default router;