import express from 'express';
import { getQuiz } from '../controllers/quizController.js';

const router = express.Router();

router.get('/:id', getQuiz);

export default router;