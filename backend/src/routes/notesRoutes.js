import express from 'express';
import { getNotes } from '../controllers/notesController.js';

const router = express.Router();

router.get('/:id', getNotes);

export default router;