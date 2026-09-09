import { Router } from 'express';
import { FlashcardsController } from '../controllers/flashcards.controller';
import { authenticate, requireRole, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', FlashcardsController.getFlashcardById);
router.post('/:id/review', optionalAuthenticate, FlashcardsController.reviewFlashcard);
router.post('/', authenticate, requireRole('TEACHER', 'ADMIN'), FlashcardsController.createFlashcard);
router.put('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), FlashcardsController.updateFlashcard);
router.delete('/:id', authenticate, requireRole('TEACHER', 'ADMIN'), FlashcardsController.deleteFlashcard);

export default router;
