import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';

const router = express.Router();

router.get('/:documentId', getProgress);
router.put('/:documentId', updateProgress);

export default router;