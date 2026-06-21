import express from 'express';
import { 
  uploadPDF, 
  createTopic, 
  getDocuments, 
  getDocumentById, 
  deleteDocument, 
  updateDocument 
} from '../controllers/documentController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/upload', upload.single('pdf'), uploadPDF);
router.post('/topic', createTopic);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.patch('/:id', updateDocument);

export default router;