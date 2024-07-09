import { Router } from 'express';
import { createDocument, getDocument, updateDocument, deleteDocument, shareDocument } from '../controllers/documentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createDocument);
router.get('/:id', authenticate, getDocument);
router.put('/:id', authenticate, updateDocument);
router.delete('/:id', authenticate, deleteDocument);
router.post('/:id/share', authenticate, shareDocument);

export default router;