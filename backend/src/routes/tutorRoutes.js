import express from 'express';
import { chatWithTutor } from '../controllers/tutorController.js';

const router = express.Router();

router.post('/chat', chatWithTutor);

export default router;